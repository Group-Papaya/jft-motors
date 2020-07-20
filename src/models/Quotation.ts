import firebase from "firebase/app";
import Record from "./Record";
export default class Quotation extends Record {
  user!: firebase.firestore.DocumentReference | string; // User doc ref
  client!: firebase.firestore.DocumentReference | string; // Client doc ref
  items?: firebase.firestore.CollectionReference | string[]; // Array of LineItem doc ref
  total!: number;
  completed!: boolean;
  created_at!: firebase.firestore.Timestamp;
  updated_at!: firebase.firestore.Timestamp;
}
