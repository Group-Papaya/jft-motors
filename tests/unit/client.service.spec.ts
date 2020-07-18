import { Client } from "@/models";
import clientService from "@/services/client.service";
import { cnLog } from "@/utils";
import {
  firestore,
  firestoreDelete,
  firestoreSetup,
  firestoreTeardown
} from "./setup-teardown";

const { saveClientAsync, deleteClientAsync } = clientService;

let client: Client;
const clients = firestore.collection("clients");

beforeAll(() => {
  firestoreSetup();
  client = new Client();
  client.email = "test-client@jft-motors.web.app";
  client.firstname = "test-client";
  client.lastname = "example";
});

afterAll(() => firestoreTeardown());

describe("Client Service", () => {
  afterEach(() => firestoreDelete(clients));

  it("can save client async", () =>
    saveClientAsync(client)
      .then(result => {
        expect(result).not.toBe(null);
        expect(result?.id).not.toBe(undefined);
      })
      .catch(cnLog));

  it("can delete client async", () => {
    saveClientAsync(client)
      .then(result => {
        expect(client.email).toEqual(result?.email);

        deleteClientAsync(result.id).then(async () => {
          const doc = await clients.doc(result.id).get();
          expect(doc.exists).toBeFalsy();
        });
      })
      .catch(cnLog);
  });
});
