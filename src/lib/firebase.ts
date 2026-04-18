import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBOcTQUGkEF50BiK9OMYUTSEeyO7htqQM8',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'agri-pivot-ai.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'agri-pivot-ai',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'agri-pivot-ai.firebasestorage.app',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '134655801905',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:134655801905:web:c866a99c251b7ba7f63310',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-152D7SDCCE'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
