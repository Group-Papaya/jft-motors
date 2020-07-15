import { Client } from "@/models";
import clientService from "@/services/client.service";
import { firestore, firestoreSetup, firestoreTeardown } from "./setup-teardown";

const { saveClientAsync, deleteClientAsync } = clientService;

let client: Client;

beforeAll(() => {
  firestoreSetup();
  client = new Client();
  client.email = "test-client@jft-motors.web.app";
  client.firstname = "test-client";
  client.lastname = "example";
});

afterAll(() => {
  firestoreTeardown();
});

describe("Client Service", () => {
  const clients = firestore.collection("clients");

  afterEach(async () => {
    await clients.get().then(snap => {
      snap.docs.forEach(async doc => await doc.ref.delete());
    });
  }, 3000);

  it("can save client async", async () => {
    await saveClientAsync(client).then(_client => {
      expect(_client).not.toBe(null);
      expect(_client?.id).not.toBe(undefined);
    });
  });

  it("can delete client async", async () => {
    await saveClientAsync(client).then(async _client => {
      expect(client.email).toEqual(_client?.email);
      if (_client)
        await deleteClientAsync(_client.id).then(async () => {
          const doc = await clients.doc(_client.id).get();
          expect(doc.exists).toBeFalsy();
        });
    });
  });
});
