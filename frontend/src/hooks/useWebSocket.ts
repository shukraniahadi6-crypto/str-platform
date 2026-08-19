'use client';

import { useEffect } from 'react';
import { io } from 'socket.io-client';

export function useWebSocket(namespace = '') {
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL ?? '', { path: `/socket${namespace}` });
    return () => {
      socket.disconnect();
    };
  }, [namespace]);
}
