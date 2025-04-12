// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-c72b8.firebaseapp.com",
  projectId: "mern-estate-c72b8",
  storageBucket: "mern-estate-c72b8.firebasestorage.app",
  messagingSenderId: "450801924977",
  appId: "1:450801924977:web:2b69475acefd5ea44414d0",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
