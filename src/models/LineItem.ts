import Discount from "@/models/Discount";
import Record from "./Record";

export default class LineItem extends Record {
  name!: string;
  type!: string;
  cost!: number;
  units!: number;
  format!: string;
  details!: string;
  quantity!: number;
  discount!: string | Discount;
  discounted = false;
}

const JOB = "Job";
const WORKER = "Worker";
const PRODUCT = "Product";
const ITEMISES = [JOB, WORKER, PRODUCT];

export { JOB, WORKER, PRODUCT, ITEMISES };
