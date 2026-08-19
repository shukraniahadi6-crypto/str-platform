import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getNotifications } from '../services/notifications'
import type { NotificationItem } from '../types'

interface NotificationContextValue {
  notifications: NotificationItem[]
}

const NotificationContext = createContext<NotificationContextValue>({ notifications: [] })

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  useEffect(() => {
    void getNotifications().then(setNotifications)
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications }}>{children}</NotificationContext.Provider>
  )
}

export const useNotificationContext = () => useContext(NotificationContext)
