import { Entity, rootCollection, field } from "firebase-firestorm";

@rootCollection({
  name: "discounts"
})
export default class Discount extends Entity {
  @field({ name: "details" })
  details!: string;

  @field({ name: "amount" })
  amount!: number;

  @field({ name: "percentage" })
  percentage!: boolean;
}
