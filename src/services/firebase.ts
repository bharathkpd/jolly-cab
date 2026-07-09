import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBSG2COHVM0O7kWcdE4HxcO8aLa4tbEhhs",
  authDomain: "jollycabs-788f9.firebaseapp.com",
  projectId: "jollycabs-788f9",
  storageBucket: "jollycabs-788f9.firebasestorage.app",
  messagingSenderId: "727698960770",
  appId: "1:727698960770:web:7b9e5fcc50a0e90d549f9b",
  measurementId: "G-FMR5TXQTH0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
