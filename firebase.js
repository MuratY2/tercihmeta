// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBvRFZsfBryxSGF52wqVyAYr00XHTx64WE",
  authDomain: "tercihmeta.firebaseapp.com",
  projectId: "tercihmeta",
  storageBucket: "tercihmeta.appspot.com",
  messagingSenderId: "842644609182",
  appId: "1:842644609182:web:c1f0c59f751af7dc1bc38f",
  measurementId: "G-98GH16JY7K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };