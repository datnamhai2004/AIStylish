// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCfTb8gnu6dmhWNpfjDRG8HNv4EN40lfHE",
    authDomain: "aistylish.firebaseapp.com",
    databaseURL: "https://aistylish-default-rtdb.firebaseio.com",
    projectId: "aistylish",
    storageBucket: "aistylish.firebasestorage.app",
    messagingSenderId: "679942124767",
    appId: "1:679942124767:web:f9a54dd1b1f950e8a8256a",
    measurementId: "G-J6R7VNGSY8"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };
