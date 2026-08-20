import { differenceInMinutes, format, intervalToDuration } from 'date-fns';
import { Coordinates } from '@/lib/types';

export const formatCurrency = (value: number, currency = 'USD'): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);

export const formatDistance = (miles: number): string => `${miles.toFixed(miles >= 10 ? 0 : 1)} mi`;

export const formatDate = (value: string | Date, pattern = 'MMM d, yyyy h:mm a'): string =>
  format(typeof value === 'string' ? new Date(value) : value, pattern);

export const formatDurationLabel = (minutes: number): string => {
  const duration = intervalToDuration({ start: 0, end: minutes * 60 * 1000 });
  const parts = [] as string[];
  if (duration.hours) parts.push(`${duration.hours}h`);
  if (duration.minutes || parts.length === 0) parts.push(`${duration.minutes ?? 0}m`);
  return parts.join(' ');
};

export const debounce = <T extends (...args: never[]) => void>(fn: T, wait = 250) => {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
};

export const throttle = <T extends (...args: never[]) => void>(fn: T, wait = 250) => {
  let waiting = false;
  return (...args: Parameters<T>) => {
    if (waiting) return;
    fn(...args);
    waiting = true;
    setTimeout(() => {
      waiting = false;
    }, wait);
  };
};

export const generateId = (prefix = 'id'): string => `${prefix}-${Math.random().toString(36).slice(2, 11)}`;

export const calculateETA = (distanceMiles: number, averageSpeedMph = 28): number =>
  Math.max(1, Math.round((distanceMiles / averageSpeedMph) * 60));

export const minutesBetween = (from: string, to: string): number =>
  Math.max(0, differenceInMinutes(new Date(to), new Date(from)));

export const getInitials = (firstName: string, lastName: string): string => `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();

export const haversineDistanceMiles = (from: Coordinates, to: Coordinates): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusMiles = 3958.8;
  const dLat = toRad(to.latitude - from.latitude);
  const dLng = toRad(to.longitude - from.longitude);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(from.latitude)) * Math.cos(toRad(to.latitude)) * Math.sin(dLng / 2) ** 2;
  return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const describeCoordinates = (coordinates?: Coordinates): string => {
  if (!coordinates) return 'Unavailable';
  return `${coordinates.latitude.toFixed(5)}, ${coordinates.longitude.toFixed(5)}`;
};
