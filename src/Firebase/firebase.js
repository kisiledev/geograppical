/* eslint-disable prefer-destructuring */
import firebase from "firebase/compat/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  EmailAuthProvider,
  TwitterAuthProvider,
} from "firebase/auth";

const { initializeApp } = firebase;
const firebaseApp = initializeApp({
  apiKey: "AIzaSyB3q_SxKc0U9aYcfFP_rXaorTsSS-8kkdA",
  authDomain: "react-geogr.firebaseapp.com",
  databaseURL: "https://react-geogr.firebaseio.com",
  projectId: "react-geogr",
  storageBucket: "react-geogr.appspot.com",
  messagingSenderId: "68621396656",
  appId: "1:68621396656:web:e534f2a9e3133c1e",
});

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const emailProvider = new EmailAuthProvider();
const twitterProvider = new TwitterAuthProvider();
const firestore = firebase.firestore;

export {
  db,
  auth,
  googleProvider,
  facebookProvider,
  emailProvider,
  twitterProvider,
  firestore,
  firebaseApp,
};

export default firebase;
