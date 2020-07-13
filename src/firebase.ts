import * as firestorm from "firebase-firestorm";
import firebase from "firebase/app";
import "firebase/firestore";

// Get a Firestore instance
export const firestore = firebase
  .initializeApp({ projectId: "jft-motors" })
  .firestore();

firestorm.initialize(firestore, /* options */);

const { Timestamp, GeoPoint } = firebase.firestore;
export { Timestamp, GeoPoint };
