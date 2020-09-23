import firebase from "firebase";

export default class Record {
  id?: string;
  meta?: any;
  path?: string;
  format?: string;
}

export type Timestamp = firebase.firestore.Timestamp;
