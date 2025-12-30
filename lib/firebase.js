import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBfJ9WB6EdRR-58hg8pOgInVJBKb2R2dXo",
  authDomain: "quailiotapp.firebaseapp.com",
  projectId: "quailiotapp",
  storageBucket: "quailiotapp.firebasestorage.app",
  messagingSenderId: "107546727116",
  appId: "1:107546727116:web:1ea5a6d9ee0ac4d824a869",
  measurementId: "G-CMQE79E4V9"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
