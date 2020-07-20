import Record from "./Record";

export default class Client extends Record {
  firstname!: string;
  lastname!: string;
  email!: string;
  phone!: string;
}
