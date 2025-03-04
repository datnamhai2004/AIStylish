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
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

console.log("🔥 Firebase API Key:", process.env.REACT_APP_FIREBASE_API_KEY);


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
