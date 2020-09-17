import firebase from "firebase";

export default class Record {
  id?: string;
  meta?: any;
  path?: string;
  format?: string;
}

export type DocumentRef =
  | firebase.firestore.DocumentReference
  | string
  | undefined;
export type CollectionRef =
  | firebase.firestore.DocumentReference[]
  | firebase.firestore.CollectionReference
  | string
  | undefined;
export type DocumentData = firebase.firestore.DocumentData | [] | undefined;

export type Timestamp = firebase.firestore.Timestamp;
