import { Card } from '../components/common/Card'
import { useNotificationContext } from '../context/NotificationContext'

export const NotificationsPage = () => {
  const { notifications } = useNotificationContext()

  return (
    <Card>
      <h1 className='text-xl font-bold'>Notifications</h1>
      <ul className='mt-3 space-y-2 text-sm text-slate-600'>
        {notifications.map((item) => (
          <li key={item.id}>
            <span className='font-medium text-slate-800'>{item.type.toUpperCase()}:</span> {item.message}
          </li>
        ))}
      </ul>
    </Card>
  )
}
