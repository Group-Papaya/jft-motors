import { Record } from "@/models";
import { dbService } from "./firestore.service";
export default {
  watchCollection(fn: (data: any) => any, path: string) {
    return dbService.getCollection(path).onSnapshot(querySnapshot => {
      fn(querySnapshot.docs.map(snapshot => snapshot.data()));
    });
  },
  watchDocument(fn: (data: any) => any, path: string, ref?: string) {
    return dbService.getDocument(path, ref).onSnapshot(snapshot => {
      fn(snapshot.data());
    });
  }
};

export const curd = {
  async get(path: string, ref?: string) {
    return await dbService
      .getSnapshot(path, ref)
      .then(snapshot => snapshot.data());
  },
  add<T = Record>(record: T, path: string, ref?: string) {
    return dbService.add(record, path, ref);
  },
  update<T = Record>(record: T, path: string, ref?: string) {
    return dbService.setDocument(record, dbService.getDocument(path, ref));
  },
  delete(path: string) {
    return dbService.delete(path);
  }
};
