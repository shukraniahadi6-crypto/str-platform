import 'reflect-metadata';
import http from 'http';
import app from './app';
import { connectDatabase } from './core/database';
import { connectRedis } from './core/redis';
import { initSocketIO } from './core/socketio';
import { getOfferExpiryQueue } from './workers/offer-expiry';
import { getPayoutProcessingQueue } from './workers/payout-processing';
import { getNotificationQueue } from './workers/notification-queue';
import { config } from './core/config';
import { logger } from './utils/logger';

async function bootstrap(): Promise<void> {
  // Connect to database and Redis
  await connectDatabase();
  await connectRedis();

  // Create HTTP server
  const httpServer = http.createServer(app);

  // Initialize Socket.io
  initSocketIO(httpServer);

  // Initialize Bull workers
  getOfferExpiryQueue();
  getPayoutProcessingQueue();
  getNotificationQueue();

  // Start server
  httpServer.listen(config.port, () => {
    logger.info(`🚀 STR Platform API running on port ${config.port}`);
    logger.info(`📡 Socket.io ready on port ${config.port}`);
    logger.info(`🌿 Environment: ${config.env}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully...');
    httpServer.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  });
}

bootstrap().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
