import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '@/config/env';
import { LOCATION_UPDATE_DISTANCE_METERS, LOCATION_UPDATE_INTERVAL_MS, STORAGE_KEYS } from '@/lib/constants';
import { Coordinates, TrackingPoint } from '@/lib/types';
import { generateId } from '@/lib/utils';
import * as trackingService from '@/services/tracking';

TaskManager.defineTask(ENV.LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error || !data) {
    return;
  }

  const locations = (data as { locations: Location.LocationObject[] }).locations;
  const latest = locations.at(-1);
  if (!latest) return;

  const trackingPoint: TrackingPoint = {
    id: generateId('track'),
    latitude: latest.coords.latitude,
    longitude: latest.coords.longitude,
    timestamp: new Date(latest.timestamp).toISOString(),
    accuracy: latest.coords.accuracy ?? undefined,
    heading: latest.coords.heading ?? undefined,
    speed: latest.coords.speed ?? undefined,
  };

  await AsyncStorage.setItem(STORAGE_KEYS.lastKnownLocation, JSON.stringify(trackingPoint));
  await trackingService.updateLocation(trackingPoint);
});

export const requestPermissions = async (): Promise<boolean> => {
  const foreground = await Location.requestForegroundPermissionsAsync();
  if (!foreground.granted) return false;
  const background = await Location.requestBackgroundPermissionsAsync();
  return background.granted;
};

export const getCurrentLocation = async (): Promise<Coordinates | null> => {
  const permission = await Location.getForegroundPermissionsAsync();
  if (!permission.granted) return null;
  const result = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
  return { latitude: result.coords.latitude, longitude: result.coords.longitude };
};

export const startBackgroundTracking = async (): Promise<void> => {
  const started = await Location.hasStartedLocationUpdatesAsync(ENV.LOCATION_TASK_NAME);
  if (started) return;

  await Location.startLocationUpdatesAsync(ENV.LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.Highest,
    distanceInterval: LOCATION_UPDATE_DISTANCE_METERS,
    timeInterval: LOCATION_UPDATE_INTERVAL_MS,
    foregroundService: {
      notificationTitle: 'STR tracking active',
      notificationBody: 'Your location is being shared for active jobs.',
    },
    pausesUpdatesAutomatically: false,
    showsBackgroundLocationIndicator: true,
  });
};

export const stopTracking = async (): Promise<void> => {
  const started = await Location.hasStartedLocationUpdatesAsync(ENV.LOCATION_TASK_NAME);
  if (started) {
    await Location.stopLocationUpdatesAsync(ENV.LOCATION_TASK_NAME);
  }
};

export const geocode = async (address: string): Promise<Coordinates | null> => {
  const result = await Location.geocodeAsync(address);
  const first = result[0];
  return first ? { latitude: first.latitude, longitude: first.longitude } : null;
};
