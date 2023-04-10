import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAOpN43FXPxed37nEQZTBUZyi_SSLAciNI",
  authDomain: "project-a63c4.firebaseapp.com",
  projectId: "project-a63c4",
  storageBucket: "project-a63c4.appspot.com",
  messagingSenderId: "734056280756",
  appId: "1:734056280756:web:36380b746d8fb411135de1",
  measurementId: "G-2ZQPYK6TN5",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
