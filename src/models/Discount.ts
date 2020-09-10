import Record from "./Record";

export default class Discount extends Record {
  name!: string;
  format!: string;
  amount!: number;
  details!: string;
  percentage!: boolean;
}
