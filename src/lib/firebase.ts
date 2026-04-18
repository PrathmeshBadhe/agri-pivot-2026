import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'MISSING_API_KEY',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'missing-domain',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'missing-project',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'missing-bucket',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'missing-sender',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || 'missing-app-id',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
