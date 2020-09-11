import Record from "./Record";
export default class User extends Record {
  role!: string;
  email!: string;
  phone?: string;
  lastname!: string;
  firstname!: string;
  password!: string;
}
const BASE_ROLE = "Basic";
const ADMIN_ROLE = "Admin";
const MANAGER_ROLE = "Manager";
const ROLES = [BASE_ROLE, ADMIN_ROLE, MANAGER_ROLE];

export { ADMIN_ROLE, BASE_ROLE, MANAGER_ROLE, ROLES };
