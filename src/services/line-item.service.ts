import { LineItem } from "@/models";
import { catchError } from "@/utils";
import { Collection } from "firebase-firestorm";

export default {
  saveLineItemAsync: (lineitem: LineItem) =>
    catchError(Collection(LineItem).create(lineitem)),
  deleteLineItemAsync: (id: string) =>
    catchError(Collection(LineItem).remove(id))
};
