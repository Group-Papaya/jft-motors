import * as firebase from "@firebase/testing";

const projectId = `jft-motors`;

// Should be called at the beginning of every test
export async function setup(): Promise<firebase.firestore.Firestore> {
  const app = firebase.initializeTestApp({ projectId });

  return app.firestore();
}

async function teardown(): Promise<void> {
  await Promise.all(firebase.apps().map(app => app.delete()));
}

export function initialize(): void {
  afterAll(async () => {
    await teardown();
  });

  beforeEach(async () => {
    await firebase.clearFirestoreData({ projectId });
  });
}
