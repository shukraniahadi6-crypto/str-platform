import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const register = async (): Promise<string | null> => {
  if (!Device.isDevice) return null;
  const permissions = await Notifications.getPermissionsAsync();
  let status = permissions.status;
  if (status !== 'granted') {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }
  if (status !== 'granted') return null;
  const token = await Notifications.getExpoPushTokenAsync();
  return token.data;
};

export const handleNotification = (listener: (response: Notifications.NotificationResponse) => void) =>
  Notifications.addNotificationResponseReceivedListener(listener);

export const scheduleLocal = async (title: string, body: string): Promise<string> =>
  Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null,
  });

export const clearAll = async (): Promise<void> => {
  await Notifications.dismissAllNotificationsAsync();
  await Notifications.cancelAllScheduledNotificationsAsync();
};
