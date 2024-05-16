import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDSZjzuKe1KO1Gw8442JKVeH_FyAniPZM0",
  authDomain: "chat-6bb7f.firebaseapp.com",
  projectId: "chat-6bb7f",
  storageBucket: "chat-6bb7f.appspot.com",
  messagingSenderId: "123398170150",
  appId: "1:123398170150:web:b1a498071ca548ef7da8e7"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const storage = getStorage();
export const db = getFirestore();