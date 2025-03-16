// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth"

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHOrPLFUHOc4qKKOakSaWPsbbPGkJUSd0",
  authDomain: "smartclinic-20a6f.firebaseapp.com",
  projectId: "smartclinic-20a6f",
  storageBucket: "smartclinic-20a6f.firebasestorage.app",
  messagingSenderId: "474388987087",
  appId: "1:474388987087:web:82f32c1bb88a3a27328bba",
  measurementId: "G-G8YRHV59X9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;