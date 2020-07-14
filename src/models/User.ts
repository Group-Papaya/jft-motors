import { Entity, rootCollection, field } from "firebase-firestorm";

@rootCollection({
  name: "users"
})
export default class User extends Entity {
  @field({ name: "first-name" })
  firstname!: string;

  @field({ name: "last-name" })
  lastname!: string;

  @field({ name: "email" })
  email!: string;

  @field({ name: "phone" })
  phone!: string;

  @field({ name: "pssword" })
  password!: string;

  @field({ name: "role" })
  role!: number;
}

const BASE_ROLE = 0;
const ADMIN_ROLE = 1;

export { ADMIN_ROLE, BASE_ROLE };
