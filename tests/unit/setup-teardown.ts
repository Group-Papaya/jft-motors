import { catchError, cnLog } from "@/utils";
import * as firestorm from "firebase-firestorm";
import firebase from "firebase/app";
import "firebase/firestore";

export const firestore = firebase
  .initializeApp({ projectId: "jft-motors-test" })
  .firestore();

firestorm.initialize(firestore);

export const firestoreSetup = () => catchError(firestore.enableNetwork());

export const firestoreTeardown = () =>
  setTimeout(
    () =>
      catchError(
        firestore.waitForPendingWrites().finally(async () => {
          await firestore.disableNetwork();
          await firestore.terminate();
          await firestore.clearPersistence();
        })
      ),
    100
  );

export const firestoreDelete = (
  collection: firebase.firestore.CollectionReference<
    firebase.firestore.DocumentData
  >
) =>
  catchError(
    collection.get().then(async (snap) => {
      for await (const doc of snap.docs) {
        doc.ref.delete().catch(cnLog);
      }
    })
  );
