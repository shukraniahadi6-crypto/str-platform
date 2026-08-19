import Bull from 'bull';
import { config } from '../core/config';
import { AppDataSource } from '../core/database';
import { PushNotificationQueue, NotificationLog } from '../models/Notification';
import { logger } from '../utils/logger';

let notificationQueue: Bull.Queue | null = null;

export function getNotificationQueue(): Bull.Queue {
  if (!notificationQueue) {
    notificationQueue = new Bull('notification-delivery', config.redis.url);

    notificationQueue.process(async (job) => {
      const { userId, eventType, message, payload } = job.data;
      try {
        // In production: send via FCM / SendGrid
        logger.info('Sending notification', { userId, eventType });

        // Log notification
        const logRepo = AppDataSource.getRepository(NotificationLog);
        await logRepo.save(logRepo.create({ user_id: userId, event_type: eventType, message }));

        // Update push queue status
        if (job.data.pushQueueId) {
          const pushRepo = AppDataSource.getRepository(PushNotificationQueue);
          await pushRepo.update(job.data.pushQueueId, { sent_at: new Date(), status: 'SENT' });
        }
      } catch (err) {
        logger.error('Notification delivery failed', { userId, error: err });
        throw err;
      }
    });
  }
  return notificationQueue;
}
