import { db } from "@/firebase";
import { LineItem, Quotation, Record } from "@/models";
import { DocumentRef, Timestamp } from "@/models/Record";
import { Logger, tryCatch } from "@/utils";
import { firestore } from "firebase/app";

type Ref = DocumentRef;

export default class FirestoreService {
  private db!: firebase.firestore.Firestore;

  constructor(firestore: firebase.firestore.Firestore) {
    this.db = firestore;
  }

  getDb() {
    return this.db;
  }

  currentTime(): Timestamp {
    return firestore.Timestamp.now();
  }

  @tryCatch(Logger)
  async add<T = Record>(record: T, path: string, ref?: string) {
    if (ref !== undefined) {
      const doc = this.db.collection(path).doc(ref);
      doc.set(record);
      return doc;
    } else {
      return this.db.collection(path).add(record);
    }
  }

  @tryCatch(Logger)
  async addWithRef<T = Record>(doc: T, ref: Ref[] | string) {
    if (doc instanceof LineItem && typeof ref === "string") {
      doc.discount = ref;
    } else if (doc instanceof Quotation && Array.isArray(ref)) {
      console.log("not error");
    }
  }

  @tryCatch(Logger)
  async getSnapshot(path: string, ref?: Ref) {
    if (path.includes("/") || ref === undefined) {
      return this.db.doc(path).get();
    } else {
      return this.db
        .collection(path)
        .doc(ref.toString())
        .get();
    }
  }

  // Deletes path if the ref is not undefined
  @tryCatch(Logger)
  async delete(path: string, ref?: string) {
    if (ref) {
      return this.db
        .collection(path)
        .doc(ref)
        .delete();
    } else {
      return this.db.doc(path).delete();
    }
  }

  @tryCatch(Logger)
  async update<T = Record>(doc: T, path: string) {
    return this.db.doc(path).set(doc);
  }
}

export const dbService = new FirestoreService(db);
