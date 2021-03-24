import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import credentials from '../credentials'; 

const firebaseConfig = {
  ...credentials
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

export { db , auth }