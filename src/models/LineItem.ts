import firebase from "firebase/app";
import Record from "./Record";

export default class LineItem extends Record {
  type!: string;
  cost!: number;
  units!: number;
  details!: string;
  quantity!: number;
  discount?: firebase.firestore.DocumentReference | string;
  discounted!: boolean;
}

const JOB = "JOB";
const WORKER = "WORKER";
const PRODUCT = "PRODUCT";

export { JOB, WORKER, PRODUCT };

