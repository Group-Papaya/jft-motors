import { Entity, rootCollection, field } from "firebase-firestorm";

@rootCollection({
  name: "clients"
})
export default class Client extends Entity {
  @field({ name: "first-name" })
  firstname!: string;

  @field({ name: "last-name" })
  lastname!: string;

  @field({ name: "email" })
  email!: string;

  @field({ name: "phone" })
  phone!: string;
}
