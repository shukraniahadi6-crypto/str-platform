import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { ENV, missingRequiredEnvKeys } from '@/config/env';

const firebaseConfig = {
  apiKey: ENV.FIREBASE_API_KEY,
  authDomain: ENV.FIREBASE_AUTH_DOMAIN,
  projectId: ENV.FIREBASE_PROJECT_ID,
  storageBucket: ENV.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: ENV.FIREBASE_MESSAGING_SENDER_ID,
  appId: ENV.FIREBASE_APP_ID,
  measurementId: ENV.FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured = !missingRequiredEnvKeys.some((key) => key.startsWith('FIREBASE_'));

export const initializeFirebaseApp = (): FirebaseApp | null => {
  if (!isFirebaseConfigured) {
    return null;
  }

  if (getApps().length > 0) {
    return getApp();
  }

  return initializeApp(firebaseConfig);
};

export { firebaseConfig };
