import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAahLtzz0JF7vM6apuFLLlYPXmGKVjDJqM",
  authDomain: "scannsend-amitosai.firebaseapp.com",
  projectId: "scannsend-amitosai",
  storageBucket: "scannsend-amitosai.appspot.com",
  messagingSenderId: "867434139780",
  appId: "1:867434139780:web:666a8589a100634d26b2d1"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

export { db , auth }