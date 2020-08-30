import { Record } from "@/models";
import { dbService } from "./firestore.service";

const snap = (snapshot: { data: () => any; ref: { path: any } }) => {
  return { ...snapshot.data(), snapPath: snapshot.ref.path };
};

const unsnap = (object: any) => {
  delete object.snapPath;
  return object;
};

export default {
  watchCollection(fn: (data: any) => any, path: string) {
    return dbService.getCollection(path).onSnapshot(querySnapshot => {
      fn(querySnapshot.docs.map(snapshot => snap(snapshot)));
    });
  },
  watchDocument(fn: (data: any) => any, path: string, ref?: string) {
    return dbService.getDocument(path, ref).onSnapshot(snapshot => {
      fn(snap(snapshot));
    });
  }
};

export const curd = {
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
  delete(path: string) {
    return dbService.delete(path);
  }
};
