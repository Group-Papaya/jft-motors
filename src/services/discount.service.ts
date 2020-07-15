import { Discount } from "@/models";
import { Collection } from "firebase-firestorm";

export default {
  saveDiscountAsync: async (discount: Discount) =>
    await Collection(Discount).create(discount),
  deleteDiscountAsync: async (id: string) =>
    await Collection(Discount).remove(id)
};
