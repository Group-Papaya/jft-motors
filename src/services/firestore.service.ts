import { Record } from "@/models";
import { tryCatch } from "@/utils";

export default class {
  firestore!: firebase.firestore.Firestore;

  @tryCatch((error) => {
    console.log(error);
  })
  async addAsync<T = Record>(doc: T, path: string) {
    return await this.firestore.collection(path).add(doc);
  }

  // Deletes path if the ref is not undefined
  @tryCatch((error) => {
    console.log(error);
  })
  async deleteAsync(path: string, ref?: string) {
    if (ref) {
      return await this.firestore.collection(path).doc(ref).delete();
    } else {
      return await this.firestore.doc(path).delete();
    }
  }
}
