import Record, { DocumentRef } from "./Record";

export default class LineItem extends Record {
  type!: string;
  cost!: number;
  units!: number;
  details!: string;
  quantity?: number;
  discount?: DocumentRef;
  discounted?: boolean = false;
}

const JOB = "JOB";
const WORKER = "WORKER";
const PRODUCT = "PRODUCT";

export { JOB, WORKER, PRODUCT };
