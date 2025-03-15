// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDvl23Ic53JvVUi-Gcp66-t3qAGWRXvT0A",
  authDomain: "crossyroad-df3a6.firebaseapp.com",
  projectId: "crossyroad-df3a6",
  storageBucket: "crossyroad-df3a6.firebasestorage.app",
  messagingSenderId: "1079274889888",
  appId: "1:1079274889888:web:4fdfde32762bb453fa9fc5",
  measurementId: "G-PWEBTGJP09"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };