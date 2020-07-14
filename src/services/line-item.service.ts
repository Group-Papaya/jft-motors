import { LineItem } from "@/models";
import { Collection } from "firebase-firestorm";

export default {
  saveLineItemAsync: async (item: LineItem) =>
    await Collection(LineItem).create(item),
  deleteLineItemAsync: async (id: string) =>
    await Collection(LineItem).remove(id),
};
