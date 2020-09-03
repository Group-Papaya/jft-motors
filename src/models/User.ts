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
const MANAGER_ROLE = 1;
const ROLES = ["Admin", "Basic", "Manager"];

export { ADMIN_ROLE, BASE_ROLE, MANAGER_ROLE, ROLES };
