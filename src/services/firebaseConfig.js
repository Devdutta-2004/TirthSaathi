import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// Default Firebase Configuration (reads from Vite Environment Variables or custom config)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

let app = null;
let db = null;

// Initialize Firebase only if projectId or apiKey is present
if (firebaseConfig.projectId || firebaseConfig.apiKey) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    console.log('⚡ Firebase Cloud Firestore Initialized for TirthSaathi');
  } catch (err) {
    console.warn('[Firebase] Initialization notice:', err.message);
  }
}

export { app, db, firebaseConfig };
