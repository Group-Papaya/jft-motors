import { User } from "@/models";
import { Collection } from "firebase-firestorm";

export default {
  saveUserAsync: async (user: User) => await Collection(User).create(user),
  deleteUserAsync: async (id: string) => await Collection(User).remove(id),
};
