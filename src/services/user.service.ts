import { User } from "@/models";
import { Collection } from "firebase-firestorm";
import { catchError } from "./../utils";

export default {
  saveUserAsync: (user: User) => catchError(Collection(User).create(user)),
  deleteUserAsync: (id: string) => catchError(Collection(User).remove(id))
};
