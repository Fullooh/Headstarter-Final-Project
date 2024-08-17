// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJdyBO6hnIHkkiz1VrSD5b2XoT6LrPc8E",
  authDomain: "syncup-waitlist.firebaseapp.com",
  projectId: "syncup-waitlist",
  storageBucket: "syncup-waitlist.appspot.com",
  messagingSenderId: "333719600223",
  appId: "1:333719600223:web:7ad5423a33870474d7efea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
const auth = getAuth(app);
const storage = getStorage(app);

export { firestore, auth, storage };
