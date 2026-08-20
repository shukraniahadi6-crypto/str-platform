import { io, Socket } from 'socket.io-client';
import { ENV } from '@/config/env';
import { ChatMessage, Job, Offer, TrackingPoint } from '@/lib/types';

class WebSocketService {
  private socket: Socket | null = null;

  connect(token?: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(ENV.SOCKET_URL, {
      transports: ['websocket'],
      auth: token ? { token } : undefined,
      autoConnect: true,
    });

    return this.socket;
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  subscribeToOffers(callback: (offer: Offer) => void): (() => void) {
    this.socket?.on('offer:new', callback);
    return () => this.socket?.off('offer:new', callback);
  }

  subscribeToJobUpdates(callback: (job: Job) => void): (() => void) {
    this.socket?.on('job:update', callback);
    return () => this.socket?.off('job:update', callback);
  }

  subscribeToChat(jobId: string, callback: (message: ChatMessage) => void): (() => void) {
    this.socket?.emit('chat:join', { jobId });
    this.socket?.on('chat:message', callback);
    return () => {
      this.socket?.emit('chat:leave', { jobId });
      this.socket?.off('chat:message', callback);
    };
  }

  emitLocation(point: TrackingPoint): void {
    this.socket?.emit('tracking:update', point);
  }

  setOnlineStatus(isOnline: boolean): void {
    this.socket?.emit('courier:status', { isOnline });
  }
}

export const websocketService = new WebSocketService();
