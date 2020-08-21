import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const configOptions = {
  apiKey: "AIzaSyB1MvKFeYVIqnRBAmWIOrAbiiNFVl5kU1s",
  authDomain: "jft-motors.firebaseapp.com",
  databaseURL: "https://jft-motors.firebaseio.com",
  projectId: "jft-motors",
  storageBucket: "jft-motors.appspot.com",
  messagingSenderId: "831362152534",
  appId: "1:831362152534:web:1c8eff64629aefae07e3f7",
  measurementId: "G-MQPC5KC6LV"
};

// Get a App instance
export const app = firebase.initializeApp(configOptions);
export const db = app.firestore();
