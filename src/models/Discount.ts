import Record from "./Record";

export default class Discount extends Record {
  name!: string;
  amount!: number;
  details!: string;
  percentage!: boolean;
}
