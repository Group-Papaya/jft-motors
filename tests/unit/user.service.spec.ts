import { User } from "@/models";
import userService from "@/services/user.service";
import { cnLog } from "@/utils";
import {
  firestore,
  firestoreDelete,
  firestoreSetup,
  firestoreTeardown
} from "./setup-teardown";

const { saveUserAsync, deleteUserAsync } = userService;

let user: User;
const users = firestore.collection("users");

beforeAll(() => {
  firestoreSetup();
  user = new User();
  user.email = "test@jft-motors.web.app";
  user.firstname = "test";
  user.lastname = "example";
  user.password = "password";
});

afterAll(() => firestoreTeardown());

describe("User Service", () => {
  afterEach(() => firestoreDelete(users));

  it("can save user async", () =>
    saveUserAsync(user)
      .then(result => {
        expect(result).not.toBe(null);
        expect(result?.id).not.toBe(undefined);
      })
      .catch(cnLog));

  it("can delete user async", () => {
    saveUserAsync(user)
      .then(value => {
        expect(user.email).toEqual(value?.email);

        deleteUserAsync(value.id).then(async () => {
          const doc = await users.doc(value.id).get();
          expect(doc.exists).toBeFalsy();
        });
      })
      .catch(cnLog);
  });
});
