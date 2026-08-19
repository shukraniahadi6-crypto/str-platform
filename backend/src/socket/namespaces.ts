import { Server as SocketIOServer, Namespace } from 'socket.io';
import { AppDataSource } from '../core/database';
import { CourierLocation } from '../models/Job';
import { logger } from '../utils/logger';

export function setupNamespaces(io: SocketIOServer): void {
  setupOffersNamespace(io.of('/offers'));
  setupTrackingNamespace(io.of('/tracking'));
  setupBatchAlertsNamespace(io.of('/batch-alerts'));
  setupChatNamespace(io.of('/chat'));
}

function setupOffersNamespace(ns: Namespace): void {
  ns.on('connection', (socket) => {
    const user = (socket as any).user;
    logger.info('Courier connected to /offers', { courierId: user?.id });

    // Join personal room
    socket.join(`courier:${user?.id}`);

    socket.on('offer:accept', async (data: { offerId: string }) => {
      logger.info('Offer accepted via socket', { offerId: data.offerId, courierId: user?.id });
      socket.emit('offer:accept:ack', { offerId: data.offerId, status: 'processing' });
    });

    socket.on('offer:decline', async (data: { offerId: string }) => {
      logger.info('Offer declined via socket', { offerId: data.offerId, courierId: user?.id });
      socket.emit('offer:decline:ack', { offerId: data.offerId });
    });

    socket.on('disconnect', () => {
      logger.info('Courier disconnected from /offers', { courierId: user?.id });
    });
  });
}

function setupTrackingNamespace(ns: Namespace): void {
  ns.on('connection', (socket) => {
    const user = (socket as any).user;

    socket.on('location:update', async (data: { lat: number; lng: number; heading?: number; speed?: number }) => {
      try {
        const repo = AppDataSource.getRepository(CourierLocation);
        const existing = await repo.findOne({ where: { courier_id: user.id } });
        if (existing) {
          existing.latitude = data.lat;
          existing.longitude = data.lng;
          existing.heading = data.heading;
          existing.speed = data.speed;
          await repo.save(existing);
        } else {
          await repo.save(repo.create({
            courier_id: user.id,
            latitude: data.lat,
            longitude: data.lng,
            heading: data.heading,
            speed: data.speed,
          }));
        }

        // Broadcast to vendor tracking channel
        ns.to(`job:${data}`).emit('courier:location', {
          courierId: user.id,
          lat: data.lat,
          lng: data.lng,
          heading: data.heading,
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        logger.error('Location update failed', { courierId: user.id, error: err });
      }
    });

    socket.on('tracking:watch', (data: { jobId: string }) => {
      socket.join(`job:${data.jobId}`);
    });

    socket.on('tracking:unwatch', (data: { jobId: string }) => {
      socket.leave(`job:${data.jobId}`);
    });
  });
}

function setupBatchAlertsNamespace(ns: Namespace): void {
  ns.on('connection', (socket) => {
    const user = (socket as any).user;

    socket.on('batch:join-area', (data: { neighborhoodId: string }) => {
      socket.join(`neighborhood:${data.neighborhoodId}`);
    });

    socket.on('disconnect', () => {
      logger.debug('User disconnected from /batch-alerts', { userId: user?.id });
    });
  });
}

function setupChatNamespace(ns: Namespace): void {
  ns.on('connection', (socket) => {
    const user = (socket as any).user;

    socket.on('chat:join', (data: { jobId: string }) => {
      socket.join(`chat:${data.jobId}`);
    });

    socket.on('chat:message', (data: { jobId: string; message: string }) => {
      ns.to(`chat:${data.jobId}`).emit('chat:message', {
        senderId: user.id,
        message: data.message,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('chat:typing', (data: { jobId: string }) => {
      socket.to(`chat:${data.jobId}`).emit('chat:typing', { userId: user.id });
    });
  });
}
