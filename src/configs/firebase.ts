import { getAuth, GoogleAuthProvider } from "@firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

const db = getFirestore();

export { auth, provider, db };
