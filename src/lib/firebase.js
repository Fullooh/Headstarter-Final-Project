import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDgX17H9xOE_0165mty96LRRiZZMuERgOU",
  authDomain: "reactchat-cd3be.firebaseapp.com",
  projectId: "reactchat-cd3be",
  storageBucket: "reactchat-cd3be.appspot.com",
  messagingSenderId: "93382141717",
  appId: "1:93382141717:web:067dfdb88c103d8faeeb1c"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()

export const firestore = getFirestore(app)