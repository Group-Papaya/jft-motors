import { LineItem, Quotation, Record } from "@/models";
import { DocumentRef } from "@/models/Record";
import { orLog, tryCatch } from "@/utils";

type Ref = DocumentRef;

export default class {
  firestore!: firebase.firestore.Firestore;

  @tryCatch(orLog)
  async add<T = Record>(doc: T, path: string) {
    return await this.firestore.collection(path).add(doc);
  }

  async addWithRef<T = Record>(doc: T, ref: Ref[] | string) {
    if (doc instanceof LineItem && typeof ref === "string") {
      doc.discount = ref;
    } else if (doc instanceof Quotation && Array.isArray(ref)) {
    }
  }

  // Deletes path if the ref is not undefined
  @tryCatch(orLog)
  async delete(path: string, ref?: string) {
    if (ref) {
      return await this.firestore.collection(path).doc(ref).delete();
    } else {
      return await this.firestore.doc(path).delete();
    }
  }

  @tryCatch(orLog)
  async update<T = Record>(doc: T, path: string) {
    return await this.firestore.doc(path).set(doc);
  }
}
