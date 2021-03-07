import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBMO6LYoJtD1UrXQMI-zYznYFILkUGx4iA",
  authDomain: "scannsend-707df.firebaseapp.com",
  databaseURL: "https://scannsend-707df.firebaseio.com",
  projectId: "scannsend-707df",
  storageBucket: "scannsend-707df.appspot.com",
  messagingSenderId: "300233406733",
  appId: "1:300233406733:web:b3b909fdc60891ccc6d844"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

export { db , auth }