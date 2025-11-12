// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Firebase configuration - with fallbacks for local development
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyArYw_5H4KEXyQKs789SJZjwkHSPnBGe2s",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "neeva-ai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "neeva-ai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "neeva-ai.appspot.com",  // Fixed storage bucket URL
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "164484584995",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:164484584995:web:a1b2c3d4e5f6g7h8",  // Fixed app ID format
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

console.log('Firebase config:', { ...firebaseConfig, apiKey: '***REDACTED***' }); // Log config for debugging

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Use emulators for local development if configured
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, 'localhost', 8080);
  console.log('Using Firebase emulators for development');
}

export default app;
