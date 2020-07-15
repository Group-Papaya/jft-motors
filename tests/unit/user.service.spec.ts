import { User } from "@/models";
import userService from "@/services/user.service";
import { firestore, firestoreSetup, firestoreTeardown } from "./setup-teardown";

const { saveUserAsync, deleteUserAsync } = userService;

let user: User;

beforeAll(() => {
  firestoreSetup();
  user = new User();
  user.email = "test@jft-motors.web.app";
  user.firstname = "test";
  user.lastname = "example";
  user.password = "password";
});

afterAll(() => {
  firestoreTeardown();
});

describe("User Service", () => {
  const users = firestore.collection("users");

  afterEach(async () => {
    await users.get().then(snap => {
      snap.docs.forEach(async doc => await doc.ref.delete());
    });
  }, 3000);

  it("can save user async", async () => {
    await saveUserAsync(user).then(_user => {
      expect(_user).not.toBe(null);
      expect(_user?.id).not.toBe(undefined);
    });
  });

  it("can delete user async", async () => {
    await saveUserAsync(user).then(async _user => {
      expect(user.email).toEqual(_user?.email);
      if (_user)
        await deleteUserAsync(_user.id).then(async () => {
          const doc = await users.doc(_user.id).get();
          expect(doc.exists).toBeFalsy();
        });
    });
  });
});
