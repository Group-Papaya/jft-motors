import * as firebase from "@firebase/testing";

const projectId = `jft-motors`;

// Should be called at the beginning of every test
export async function setup(): Promise<firebase.firestore.Firestore> {
  const app = firebase.initializeTestApp({ projectId });

  return app.firestore();
}

async function teardown() {
  await Promise.all(firebase.apps().map((app) => app.delete()));
}

export function initialize() {
  afterAll(async () => {
    await teardown();
  });

  beforeEach(async () => {
    await firebase.clearFirestoreData({ projectId });
  });
}
