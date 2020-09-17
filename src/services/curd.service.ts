import { Record } from "@/models";
import { dbService } from "./firestore.service";

const snap = (snapshot: { data: () => any; ref: { path: any } }) => {
  return { ...snapshot.data(), path: snapshot.ref.path };
};

const unsnap = (object: any) => {
  delete object.path;
  return object;
};

function watchCollection(path: string, fn: (data: any) => any) {
  return dbService.getCollection(path).onSnapshot(querySnapshot => {
    fn(querySnapshot.docs.map(snapshot => snap(snapshot)));
  });
}

function watchDocument(
  { path, ref }: { path: string; ref?: string },
  fn: (data: any) => any
) {
  return dbService.getDocument(path, ref).onSnapshot(snapshot => {
    fn(snap(snapshot));
  });
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
    return dbService.setDocument(
      unsnap(record),
      dbService.getDocument(path, ref)
    );
  },
  delete(path: string, ref?: string) {
    return dbService.delete(path, ref);
  },
  deleteCollection(path: string) {
    return dbService.deleteCollection(path);
  }
};

export { watchCollection, watchDocument, curd };
