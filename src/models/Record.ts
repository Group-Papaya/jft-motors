export default class IRecord {
  id?: string;
}

export type DocumentRef =
  | firebase.firestore.DocumentReference
  | string
  | undefined;
export type CollectionRef =
  | firebase.firestore.DocumentReference[]
  | firebase.firestore.CollectionReference
  | string
  | undefined;

export type Timestamp = firebase.firestore.Timestamp;
