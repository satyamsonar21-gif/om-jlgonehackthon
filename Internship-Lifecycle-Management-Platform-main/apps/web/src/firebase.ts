import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

/**
 * Centralized Firebase Configuration for Internship Lifecycle Management Platform (ILMP)
 * Target Project: interniq-5a405
 * 
 * Supports environment variables (VITE_FIREBASE_*) with safe client-side fallback
 * values for development resilience.
 */
export const firebaseConfig: FirebaseOptions = {
  apiKey:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_API_KEY) ||
    'AIzaSyBYFnTFyz8y96CLQdD_zdabg7nTxMg8QO0',
  authDomain:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN) ||
    'interniq-5a405.firebaseapp.com',
  projectId:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_PROJECT_ID) ||
    'interniq-5a405',
  storageBucket:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET) ||
    'interniq-5a405.firebasestorage.app',
  messagingSenderId:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID) ||
    '805720697730',
  appId:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_APP_ID) ||
    '1:805720697730:web:96106b1d06a72bd207bd9b',
  measurementId:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID) ||
    'G-99CV4YDS3W',
};

// ─── STRICT SINGLETON INITIALIZATION ──────────────────────────────────────────
// Guarantees Firebase is initialized exactly once across hot module reloads & routing
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Shared SDK service instances bound to the singleton app instance
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

// Safe browser-only analytics initialization
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Graceful fallback if analytics is blocked or unsupported in environment
    });
}

export { app, auth, db, storage, analytics };
export default app;
