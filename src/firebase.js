import "firebase/auth";
import firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDkZ6HvOZdXHeHYCsVKoqmppdC_ZZsZRsY",
  authDomain: "swapi-738d0.firebaseapp.com",
  projectId: "swapi-738d0",
  storageBucket: "swapi-738d0.appspot.com",
  messagingSenderId: "802420798474",
  appId: "1:802420798474:web:49495b473a121705dbdbf3",
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

export { auth, storage, db };
