// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { Firestore, getFirestore } from 'firebase/firestore'
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnsZ8MWAqNt9V1yKyBQZb5b4Hqkjx013A",
  authDomain: "note-e63b8.firebaseapp.com",
  projectId: "note-e63b8",
  storageBucket: "note-e63b8.appspot.com",
  messagingSenderId: "1021654381821",
  appId: "1:1021654381821:web:975ed0c12ad6a9e9fb7a94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app)
const storage = getStorage(app)
export {app, database, storage}
