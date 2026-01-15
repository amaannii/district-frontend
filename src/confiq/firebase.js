// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbPEHDiU1dtbOj-vQqfDtX1ihsFqnEbtE",
  authDomain: "distrix-5f2de.firebaseapp.com",
  projectId: "distrix-5f2de",
  storageBucket: "distrix-5f2de.firebasestorage.app",
  messagingSenderId: "106602278526",
  appId: "1:106602278526:web:f4fb48614d00d7c000f22f",
  measurementId: "G-CM9HW0LY13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth(app)
export const googleprovider=new GoogleAuthProvider()