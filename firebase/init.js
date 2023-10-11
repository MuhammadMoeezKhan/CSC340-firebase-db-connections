import { getFirestore } from "firebase/firestore"
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCM8a6Ca5QyUYdoW2ZNIX22FCk-kjAY_C8",
  authDomain: "moeez-connecting-collections.firebaseapp.com",
  projectId: "moeez-connecting-collections",
  storageBucket: "moeez-connecting-collections.appspot.com",
  messagingSenderId: "567842844707",
  appId: "1:567842844707:web:85feaa6c907f89b2894196"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore()
export default db 