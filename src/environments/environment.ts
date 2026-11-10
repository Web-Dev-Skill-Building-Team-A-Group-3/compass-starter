// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.NG_APP_FIREBASE_DEV_API_KEY,
  authDomain: "web-dev-skill-building-team-b2.firebaseapp.com",
  projectId: "web-dev-skill-building-team-b2",
  storageBucket: "web-dev-skill-building-team-b2.firebasestorage.app",
  messagingSenderId: "756442824480",
  appId: "1:756442824480:web:956bbe277041565739a145",
  measurementId: "G-9L13PZK4ZX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);