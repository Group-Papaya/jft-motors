import firebase from "firebase/app";
import "firebase/firestore";

// Get a Firestore instance
export const firestore = firebase
  .initializeApp({ projectId: "jft-motors" })
  .firestore();
