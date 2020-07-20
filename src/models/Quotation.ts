import Record, { CollectionRef, DocumentRef, Timestamp } from "./Record";

export default class Quotation extends Record {
  user!: DocumentRef; // User doc ref
  client!: DocumentRef; // Client doc ref
  items?: CollectionRef; // Array of LineItem doc ref
  total?: number = 0.0;
  completed?: boolean = false;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}
