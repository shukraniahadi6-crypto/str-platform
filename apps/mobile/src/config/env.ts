export type EnvConfig = {
  API_URL: string;
  SOCKET_URL: string;
  GOOGLE_MAPS_API_KEY: string;
  STRIPE_PUBLISHABLE_KEY: string;
  FIREBASE_API_KEY: string;
  FIREBASE_AUTH_DOMAIN: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_STORAGE_BUCKET: string;
  FIREBASE_MESSAGING_SENDER_ID: string;
  FIREBASE_APP_ID: string;
  FIREBASE_MEASUREMENT_ID?: string;
  LOCATION_TASK_NAME: string;
};

const getEnvValue = (publicKey: string, key: string, fallback = ''): string => {
  const value = process.env[publicKey] ?? process.env[key] ?? fallback;
  return typeof value === 'string' ? value.trim() : fallback;
};

export const ENV: EnvConfig = {
  API_URL: getEnvValue('EXPO_PUBLIC_API_URL', 'API_URL', 'https://api.example.com'),
  SOCKET_URL: getEnvValue('EXPO_PUBLIC_SOCKET_URL', 'SOCKET_URL', 'https://socket.example.com'),
  GOOGLE_MAPS_API_KEY: getEnvValue('EXPO_PUBLIC_GOOGLE_MAPS_API_KEY', 'GOOGLE_MAPS_API_KEY', 'GOOGLE_MAPS_API_KEY'),
  STRIPE_PUBLISHABLE_KEY: getEnvValue('EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'STRIPE_PUBLISHABLE_KEY', 'pk_test_replace_me'),
  FIREBASE_API_KEY: getEnvValue('EXPO_PUBLIC_FIREBASE_API_KEY', 'FIREBASE_API_KEY', 'firebase-api-key'),
  FIREBASE_AUTH_DOMAIN: getEnvValue('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN', 'FIREBASE_AUTH_DOMAIN', 'str-platform.firebaseapp.com'),
  FIREBASE_PROJECT_ID: getEnvValue('EXPO_PUBLIC_FIREBASE_PROJECT_ID', 'FIREBASE_PROJECT_ID', 'str-platform'),
  FIREBASE_STORAGE_BUCKET: getEnvValue('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET', 'FIREBASE_STORAGE_BUCKET', 'str-platform.appspot.com'),
  FIREBASE_MESSAGING_SENDER_ID: getEnvValue('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', 'FIREBASE_MESSAGING_SENDER_ID', '1234567890'),
  FIREBASE_APP_ID: getEnvValue('EXPO_PUBLIC_FIREBASE_APP_ID', 'FIREBASE_APP_ID', '1:1234567890:web:abcdef'),
  FIREBASE_MEASUREMENT_ID: getEnvValue('EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID', 'FIREBASE_MEASUREMENT_ID', ''),
  LOCATION_TASK_NAME: 'str-background-location-task',
};

export const missingRequiredEnvKeys = Object.entries(ENV)
  .filter(([key, value]) => !value && key !== 'FIREBASE_MEASUREMENT_ID')
  .map(([key]) => key);

export const assertEnv = (): void => {
  if (missingRequiredEnvKeys.length > 0) {
    throw new Error(`Missing required environment variables: ${missingRequiredEnvKeys.join(', ')}`);
  }
};
