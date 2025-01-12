import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCsETZlqvTGZcFGLu9_2-cgnkMELljQEIQ",
  authDomain: "temple-of-fortune-d4970.firebaseapp.com",
  projectId: "temple-of-fortune-d4970",
  storageBucket: "temple-of-fortune-d4970.firebasestorage.app",
  messagingSenderId: "172395930106",
  appId: "1:172395930106:web:7ff46791b95b62ec4c0443"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

if (process.env.NODE_ENV === 'development') {
	console.log('Firebase initialized with config:', firebaseConfig);
  }