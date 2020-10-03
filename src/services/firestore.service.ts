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
  /** The path is to a root collection or sub-collection
   * e.g `/users | /products/:id/line-items`
   */
  getCollection(path: string) {
    return this.db.collection(`/${path}`);
  }

  @tryCatch(Logger)
  /**
   * Gets a given firebase document reference based on the
   * path or ref id passed in, it will use the ref and path
   * together id they both defined - otherwise just the path
   *
   * @param path Can be the path to a root collection
   * or sub-collection e.g `/users | /products/:id/line-items`
   * if the ref is undefined then the path is to a
   * document e.g `/users/:id | /products/:id`
   * @param ref The id for a given document
   * @return DocumentReference
   */
  getDocument(path: string, ref?: string) {
    return ref === undefined
      ? this.db.doc(path)
      : this.db.doc(`/${path}/${ref}`);
  }

  /**
   * This function sets a given document with the passed in
   * record, it will update ot set an object that is already
   * there or make one if it's not found then returns it's new
   * document reference
   *
   * @param record The type or object you want to
   * save or update into firebase
   * @param document Is the firebase reference to a given document
   * @return DocumentReference
   */
  async setDocument<T = Record>(
    record: T,
    document: firebase.firestore.DocumentReference
  ) {
    return document.set(record).then(() => document);
  }

  @tryCatch(Logger)
  /** Making user of the path or ref passed, it gets a reference document,
   * and set it's contains to the record passed in
   *
   * #### Note a collection will be accessed/created if only the path is provided
   * */
  async add<T = Record>(record: T, path: string, ref?: string) {
    return ref !== undefined
      ? this.setDocument(record, this.getDocument(path, ref))
      : this.getCollection(path).add(record);
  }

  @tryCatch(Logger)
  async getSnapshot(path: string, ref?: string) {
    return this.getDocument(path, ref).get();
  }

  @tryCatch(Logger)
  /** Deletes path if the ref is not undefined */
  async delete(path: string, ref?: string) {
    return this.getDocument(path, ref)
      .delete()
      .catch(error => console.log(error));
  }

  @tryCatch(Logger)
  /** Loops over the a given collection using th path provided,
   * and deletes each child document with the collection
   *
   * #### Note this doesn't handle nested collections in documents
   * */
  async deleteCollection(path: string) {
    return this.getCollection(path)
      .get()
      .then(collectionSnapshot =>
        collectionSnapshot.forEach(snapshot => this.delete(snapshot.ref.path))
      );
  }

  @tryCatch(Logger)
  /** Making user of the path or ref passed, it gets a reference document,
   * and set it's contains to the record passed in */
  async update<T = Record>(record: T, path: string, ref?: string) {
    return this.setDocument(record, this.getDocument(path, ref));
  }
}

export const dbService = new FirestoreService(db);
