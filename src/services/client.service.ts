import { Client } from "@/models";
import { catchError } from "@/utils";
import { Collection } from "firebase-firestorm";

export default {
  saveClientAsync: (client: Client) =>
    catchError(Collection(Client).create(client)),
  deleteClientAsync: (id: string) => catchError(Collection(Client).remove(id))
};
