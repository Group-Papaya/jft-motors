import Record, { Timestamp } from "./Record";

export default class Quotation extends Record {
  items: any[] = [];
  user!: string;
  client!: string;
  total?: number = 0.0;
  created?: Timestamp | any;
  updated?: Timestamp | any;
  completed?: boolean = false;
}
