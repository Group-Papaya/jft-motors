import { Client } from "@/models";
import { Collection } from "firebase-firestorm";

export default {
  saveClientAsync: async (client: Client) =>
    await Collection(Client).create(client),
  deleteClientAsync: async (id: string) => await Collection(Client).remove(id)
};
