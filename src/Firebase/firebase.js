/* eslint-disable prefer-destructuring */
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';


firebase.initializeApp({
  apiKey: 'AIzaSyB3q_SxKc0U9aYcfFP_rXaorTsSS-8kkdA',
  authDomain: 'react-geogr.firebaseapp.com',
  databaseURL: 'https://react-geogr.firebaseio.com',
  projectId: 'react-geogr',
  storageBucket: 'react-geogr.appspot.com',
  messagingSenderId: '68621396656',
  appId: '1:68621396656:web:e534f2a9e3133c1e',
});

const db = firebase.firestore();
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();
const facebookProvider = new firebase.auth.FacebookAuthProvider();
const emailProvider = new firebase.auth.EmailAuthProvider();
const twitterProvider = new firebase.auth.TwitterAuthProvider();
const firestore = firebase.firestore;


export {
  db,
  auth,
  googleProvider,
  facebookProvider,
  emailProvider,
  twitterProvider,
  firestore,
};

export default firebase;
