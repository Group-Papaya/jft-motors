import Record from "./Record";

export default class LineItem extends Record {
  name!: string;
  type!: string;
  cost!: number;
  units!: number;
  details!: string;
  quantity!: number;
  discount!: string;
  discounted = false;
}

const JOB = "Job";
const WORKER = "Worker";
const PRODUCT = "Product";

export { JOB, WORKER, PRODUCT };
