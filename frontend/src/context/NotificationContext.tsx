'use client';

import { createContext, useContext, useState } from 'react';

interface NotificationContextValue {
  unreadCount: number;
  clear: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(3);
  return (
    <NotificationContext.Provider value={{ unreadCount, clear: () => setUnreadCount(0) }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationsContext() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotificationsContext must be used within NotificationProvider');
  return context;
}
