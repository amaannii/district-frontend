// Import Firebase SDK
import { initializeApp } from "firebase/app";

// Auth imports
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// ✅ Messaging import (Push Notification)
import { getMessaging } from "firebase/messaging";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbPEHDiU1dtbOj-vQqfDtX1ihsFqnEbtE",
  authDomain: "distrix-5f2de.firebaseapp.com",
  projectId: "distrix-5f2de",
  storageBucket: "distrix-5f2de.firebasestorage.app",
  messagingSenderId: "106602278526",
  appId: "1:106602278526:web:f4fb48614d00d7c000f22f",
  measurementId: "G-CM9HW0LY13",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Auth exports
export const auth = getAuth(app);
export const googleprovider = new GoogleAuthProvider();

// ✅ Messaging export (FCM)
export const messaging = getMessaging(app);
