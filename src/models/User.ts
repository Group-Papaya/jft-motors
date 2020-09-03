import Record from "./Record";
export default class User extends Record {
  role!: number;
  email!: string;
  phone?: string;
  lastname!: string;
  firstname!: string;
  password!: string;
}
const BASE_ROLE = 0;
const ADMIN_ROLE = 1;
const ROLES = ["Admin", "Basic"];

export { ADMIN_ROLE, BASE_ROLE, ROLES };
