import * as firestorm from "firebase-firestorm";
import firebase from "firebase/app";
import "firebase/firestore";

export const firestore = firebase
  .initializeApp({ projectId: "jft-motors-test" })
  .firestore();

export const firestoreSetup = async () => {
  firestorm.initialize(firestore);

  await firestore.enableNetwork();
};

export const firestoreTeardown = async () => {
  await firestore.waitForPendingWrites().finally(async () => {
    await firestore.terminate();
    await firestore.clearPersistence();
  });
};
