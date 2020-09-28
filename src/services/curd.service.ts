import firebase from "firebase";
import { Record } from "@/models";
import { dbService } from "./firestore.service";
import QuerySnapshot = firebase.firestore.QuerySnapshot;
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

type Document = { path: string; ref?: string };

const snap = (snapshot: { data: () => any; ref: { path: any } }) => {
  return { ...snapshot.data(), path: snapshot.ref.path };
};

const unsnap = (object: any) => {
  delete object.path;
  return object;
};

export const getCollection = path => dbService.getCollection(path);
export const getDocument = (path, id?) => dbService.getDocument(path, id);

export function collectionSnapshot(
  path: string,
  fn: (data: QuerySnapshot) => any
) {
  return getCollection(path).onSnapshot(querySnapshot => fn(querySnapshot));
}

export function documentSnapshot(
  { path, ref }: Document,
  fn: (data: DocumentSnapshot) => any
) {
  return getDocument(path, ref).onSnapshot(snapshot => fn(snapshot));
}

function watchCollection(path: string, fn: (data: any) => any) {
  return collectionSnapshot(path, snapshot =>
    fn(snapshot.docs.map(snapshot => snap(snapshot)))
  );
}

function watchDocument(document: Document, fn: (data: any) => any) {
  return documentSnapshot(document, snapshot => fn(snap(snapshot)));
}

const curd = {
  async get(path: string, ref?: string) {
    return await dbService
      .getSnapshot(path, ref)
      .then(snapshot => snap(snapshot));
  },
  add<T = Record>(record: T, path: string, ref?: string) {
    return dbService.add(record, path, ref);
  },
  update<T = Record>(record: T, path: string, ref?: string) {
    return dbService.setDocument(unsnap(record), getDocument(path, ref));
  },
  delete(path: string, ref?: string) {
    return dbService.delete(path, ref);
  },
  deleteCollection(path: string) {
    return dbService.deleteCollection(path);
  }
};

export { watchCollection, watchDocument, curd };
