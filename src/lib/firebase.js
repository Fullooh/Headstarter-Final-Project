import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBgGGZDFQ047qfI87W3dWdIjJfESupnzn8",
  authDomain: "syncup-dc91d.firebaseapp.com",
  projectId: "syncup-dc91d",
  storageBucket: "syncup-dc91d.appspot.com",
  messagingSenderId: "825063025237",
  appId: "1:825063025237:web:632e205982ac7a4bb0c2dc"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()

export const firestore = getFirestore(app)