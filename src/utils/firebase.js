import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const env = import.meta.env;
const config = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
};

/** True when .env has Firebase keys. Without them the site runs on seed data (read-only). */
export const firebaseReady = Boolean(config.apiKey && config.projectId);

export const app = firebaseReady ? (getApps()[0] || initializeApp(config)) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
