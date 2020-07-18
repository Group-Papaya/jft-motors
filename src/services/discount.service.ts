import { Discount } from "@/models";
import { catchError } from "@/utils";
import { Collection } from "firebase-firestorm";

export default {
  saveDiscountAsync: (discount: Discount) =>
    catchError(Collection(Discount).create(discount)),
  deleteDiscountAsync: (id: string) =>
    catchError(Collection(Discount).remove(id))
};
