import Bull from 'bull';
import { config } from '../core/config';
import { AppDataSource } from '../core/database';
import { Payout } from '../models/Ledger';
import { processInstantCashout } from '../services/payout';
import { logger } from '../utils/logger';

let payoutQueue: Bull.Queue | null = null;

export function getPayoutProcessingQueue(): Bull.Queue {
  if (!payoutQueue) {
    payoutQueue = new Bull('payout-processing', config.redis.url);

    payoutQueue.process(async () => {
      const repo = AppDataSource.getRepository(Payout);
      const pendingPayouts = await repo.find({ where: { status: 'PENDING' } });
      logger.info(`Processing ${pendingPayouts.length} pending payouts`);

      for (const payout of pendingPayouts) {
        try {
          await processInstantCashout(payout.id);
          logger.info('Payout processed', { payoutId: payout.id });
        } catch (err) {
          logger.error('Payout processing failed', { payoutId: payout.id, error: err });
        }
      }
    });

    // Schedule daily processing
    payoutQueue.add({}, { repeat: { cron: '0 2 * * *' } });
  }
  return payoutQueue;
}
