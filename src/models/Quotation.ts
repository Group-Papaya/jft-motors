import Record, { DocumentRef, Timestamp } from "./Record";

export default class Quotation extends Record {
  user!: DocumentRef; // User doc ref
  client!: DocumentRef; // Client doc ref
  items?: any[]; // firebase.firestore.CollectionReference; // Array of LineItem doc ref
  total?: number = 0.0;
  created?: Timestamp | any;
  updated?: Timestamp | any;
  completed?: boolean = false;
}
