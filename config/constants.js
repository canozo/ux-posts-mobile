import firebase from 'firebase';

// Required for side-effects
require('firebase/firestore');

const config = {
  apiKey: "AIzaSyD5KzKq42iF6LijoEwqj3B5Euo0lUPxQp0",
  authDomain: "examen-2-jc.firebaseapp.com",
  databaseURL: "https://examen-2-jc.firebaseio.com",
  projectId: "examen-2-jc",
  storageBucket: "examen-2-jc.appspot.com",
  messagingSenderId: "375670805657"
};

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
    // firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
};

export default firebase.initializeApp(config);
firebase.firestore().settings({timestampsInSnapshots: true});
export const db = firebase.firestore();
export const firebaseAuth = firebase.auth;
export const firebaseUI = uiConfig;