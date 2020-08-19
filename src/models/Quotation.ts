import Record, { DocumentRef, Timestamp } from "./Record";

export default class Quotation extends Record {
  user!: DocumentRef; // User doc ref
  client!: DocumentRef; // Client doc ref
  items?: firebase.firestore.CollectionReference; // Array of LineItem doc ref
  total?: number = 0.0;
  created?: Timestamp;
  updated?: Timestamp;
  completed?: boolean = false;
}
