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
