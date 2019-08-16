import firebase from 'firebase';


 firebase.initializeApp({ 
    apiKey: "AIzaSyB3q_SxKc0U9aYcfFP_rXaorTsSS-8kkdA",
    authDomain: "react-geogr.firebaseapp.com",
    databaseURL: "https://react-geogr.firebaseio.com",
    projectId: "react-geogr",
    storageBucket: "react-geogr.appspot.com",
    messagingSenderId: "68621396656",
    appId: "1:68621396656:web:e534f2a9e3133c1e"
 });

  const db = firebase.firestore();
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();
  const firestore = firebase.firestore;


  
  export { 
    db, 
    auth,
    provider,
    firestore
  };