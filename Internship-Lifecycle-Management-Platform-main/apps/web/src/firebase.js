import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYFnTFyz8y96CLQdD_zdabg7nTxMg8QO0",
  authDomain: "interniq-5a405.firebaseapp.com",
  projectId: "interniq-5a405",
  storageBucket: "interniq-5a405.firebasestorage.app",
  messagingSenderId: "805720697730",
  appId: "1:805720697730:web:96106b1d06a72bd207bd9b",
  measurementId: "G-99CV4YDS3W"
};

// Initialize Firebase app singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Safe browser-only analytics initialization
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) analytics = getAnalytics(app);
    })
    .catch(() => {});
}

export { app, auth, db, storage, firebaseConfig };
export default app;