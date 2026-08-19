import Bull from 'bull';
import { config } from '../core/config';
import { AppDataSource } from '../core/database';
import { OfferPing, OfferPingStatus } from '../models/OfferPing';
import { getIO } from '../core/socketio';
import { logger } from '../utils/logger';

let offerExpiryQueue: Bull.Queue | null = null;

export function getOfferExpiryQueue(): Bull.Queue {
  if (!offerExpiryQueue) {
    offerExpiryQueue = new Bull('offer-expiry', config.redis.url);
    offerExpiryQueue.process(async (job) => {
      const { offerId, courierId } = job.data;
      try {
        const repo = AppDataSource.getRepository(OfferPing);
        const ping = await repo.findOne({ where: { id: offerId } });
        if (!ping || ping.status !== OfferPingStatus.PENDING) return;

        ping.status = OfferPingStatus.EXPIRED;
        await repo.save(ping);

        // Notify courier
        try {
          getIO().of('/offers').to(`courier:${courierId}`).emit('offer:expired', { offerId });
        } catch {
          // Socket.io not available
        }

        logger.info('Offer expired', { offerId, courierId });
      } catch (err) {
        logger.error('Offer expiry job failed', { offerId, error: err });
        throw err;
      }
    });
  }
  return offerExpiryQueue;
}
