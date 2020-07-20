import Record from "./Record";

export default class Discount extends Record {
  amount!: number;
  details!: string;
  percentage!: boolean;
}
