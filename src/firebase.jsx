import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCkkNvxV8Ln02_xHvyplCqzb8msM4VVXk8",
  authDomain: "fan-control-92202.firebaseapp.com",
  projectId: "fan-control-92202",
  storageBucket: "fan-control-92202.appspot.com",
  messagingSenderId: "134885552481",
  appId: "1:134885552481:web:dc9c52c96debf6b3f4d520",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
