// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration - using environment variables for security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyArYw_5H4KEXyQKs789SJZjwkHSPnBGe2s",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "neeva-ai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "neeva-ai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "neeva-ai.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "164484584995",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:164484584995:web:neeva-ai-web"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
