// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

// Firebase configuration (hardcoded)
const firebaseConfig = {
  apiKey: 'AIzaSyAp06OOmE1jMR-FZg0vDAiqN4at6mJPHfs',
  authDomain: 'expensetracker-c3539.firebaseapp.com',
  projectId: 'expensetracker-c3539',
  storageBucket: 'expensetracker-c3539.firebasestorage.app',
  messagingSenderId: '94745529421',
  appId: '1:94745529421:web:83592ca58f4c1e85b8e004',
  measurementId: 'G-2G9QBCPS9L'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Firebase authentication instance
export const auth = getAuth(app);
