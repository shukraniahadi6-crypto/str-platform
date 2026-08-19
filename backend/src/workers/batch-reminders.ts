import Bull from 'bull';
import { config } from '../core/config';
import { logger } from '../utils/logger';

let batchRemindersQueue: Bull.Queue | null = null;

export function getBatchRemindersQueue(): Bull.Queue {
  if (!batchRemindersQueue) {
    batchRemindersQueue = new Bull('batch-reminders', config.redis.url);
    batchRemindersQueue.process(async (job) => {
      const { batchId, message, nearbyJobIds } = job.data;
      logger.info('Sending batch reminder', { batchId, nearbyJobIds, message });
      // In production: send SMS/push via FCM/SendGrid
    });
  }
  return batchRemindersQueue;
}
