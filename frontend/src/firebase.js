import { 
  initializeApp 
} from "firebase/app";

import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  signInWithPopup, 
  fetchSignInMethodsForEmail, // Thêm dòng này
  linkWithCredential          // Thêm dòng này
} from "firebase/auth";

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
const facebookProvider = new FacebookAuthProvider();

// Xuất các hàm cần thiết
export {
  auth,
  googleProvider,
  facebookProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,  // Thêm dòng này
  linkWithCredential           // Thêm dòng này
};
