// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFJshOtbUIhn_uN8D6wbUJy8xTvuouoYQ",
  authDomain: "pixelpost-c49ea.firebaseapp.com",
  projectId: "pixelpost-c49ea",
  storageBucket: "pixelpost-c49ea.firebasestorage.app",
  messagingSenderId: "219976139270",
  appId: "1:219976139270:web:30e5002d4c9fe75f4df987",
  measurementId: "G-57DJEVQHZZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);    
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()