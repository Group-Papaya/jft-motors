import { LineItem, Quotation, Record } from "@/models";
import { DocumentRef } from "@/models/Record";
import { Logger, tryCatch } from "@/utils";
import { firestore } from "firebase/app";
import { Timestamp } from "./../models/Record";

type Ref = DocumentRef;

export default class FirestoreService {
  firestore!: firebase.firestore.Firestore;

  currentTime(): Timestamp {
    return firestore.Timestamp.now();
  }

  @tryCatch(Logger)
  async add<T = Record>(doc: T, path: string) {
    return this.firestore.collection(path).add(doc);
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
      return this.firestore.doc(path).get();
    } else {
      return this.firestore
        .collection(path)
        .doc(ref.toString())
        .get();
    }
  }

  // Deletes path if the ref is not undefined
  @tryCatch(Logger)
  async delete(path: string, ref?: string) {
    if (ref) {
      return this.firestore
        .collection(path)
        .doc(ref)
        .delete();
    } else {
      return this.firestore.doc(path).delete();
    }
  }

  @tryCatch(Logger)
  async update<T = Record>(doc: T, path: string) {
    return this.firestore.doc(path).set(doc);
  }
}
