import Record, { DocumentRef, Timestamp } from "./Record";

export default class Quotation extends Record {
  items: any[] = []; // firebase.firestore.CollectionReference; // Array of LineItem doc ref
  user!: DocumentRef; // User doc ref
  client!: string; // Client doc ref
  total?: number = 0.0;
  created?: Timestamp | any;
  updated?: Timestamp | any;
  completed?: boolean = false;
}
