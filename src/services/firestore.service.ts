import { db } from "@/firebase";
import { Record } from "@/models";
import { Timestamp } from "@/models/Record";
import { Logger, tryCatch } from "@/utils";
import firebase, { firestore } from "firebase/app";

export default class FirestoreService {
  public readonly db!: firebase.firestore.Firestore;

  constructor(firestore: firebase.firestore.Firestore) {
    this.db = firestore;
  }

  currentTime(): Timestamp {
    return firestore.Timestamp.now();
  }

  @tryCatch(Logger)
  // The path is to a root collection or sub-collection
  // e.g `users | products/:id/line-items`
  getCollection(path: string) {
    return this.db.collection(path);
  }

  @tryCatch(Logger)
  /**
   *
   * @param path Can be the path to a root collection
   * or sub-collection e.g `users | products/:id/line-items`
   * if the ref is undefined then the path is to a
   * document e.g `users/:id | products/:id`
   * @param ref The id for a given document
   * @return DocumentReference
   */
  getDocument(path: string, ref?: string) {
    return ref === undefined
      ? this.db.doc(path)
      : this.db.doc(`${path}/${ref}`);
  }

  async setDocument<T = Record>(
    record: T,
    document: firebase.firestore.DocumentReference
  ) {
    return document.set(record).then(() => document);
  }

  @tryCatch(Logger)
  async add<T = Record>(record: T, path: string, ref?: string) {
    return ref !== undefined
      ? this.setDocument(record, this.getDocument(path, ref))
      : this.getCollection(path).add(record);
  }

  @tryCatch(Logger)
  async getSnapshot(path: string, ref?: string) {
    return this.getDocument(path, ref).get();
  }

  // Deletes path if the ref is not undefined
  @tryCatch(Logger)
  async delete(path: string, ref?: string) {
    return this.getDocument(path, ref).delete();
  }

  @tryCatch(Logger)
  async update<T = Record>(record: T, path: string, ref?: string) {
    return this.setDocument(record, this.getDocument(path, ref));
  }
}

export const dbService = new FirestoreService(db);
