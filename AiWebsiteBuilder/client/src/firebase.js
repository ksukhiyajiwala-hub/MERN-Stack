// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "webbuildai-e14af.firebaseapp.com",
  projectId: "webbuildai-e14af",
  storageBucket: "webbuildai-e14af.firebasestorage.app",
  messagingSenderId: "1014517212564",
  appId: "1:1014517212564:web:58eaefa6387c277e2adb81",
  measurementId: "G-9ER2RQ3L5M",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };
