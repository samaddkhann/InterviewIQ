import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-38de3.firebaseapp.com",
  projectId: "interviewiq-38de3",
  storageBucket: "interviewiq-38de3.firebasestorage.app",
  messagingSenderId: "661925436759",
  appId: "1:661925436759:web:683a6bf96ce0135b77b212"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export { auth, provider }
//import.meta.env.VITE_FIREBASE_APIKEY