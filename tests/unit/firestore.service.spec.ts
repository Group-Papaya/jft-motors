import { User } from "@/models";
import { ADMIN_ROLE, BASE_ROLE } from "@/models/User";
import FireService from "@/services/firestore.service";
import { assertSucceeds } from "@firebase/testing";
import { setup } from "./firebase-testing";

const db = new FireService();

const admin: User = {
  role: ADMIN_ROLE,
  email: "test-admin@jft-motors.web.app",
  password: "test-password",
  firstname: "test-admin",
  phone: "021-458-7131",
  lastname: "example",
};

const user: User = {
  role: BASE_ROLE,
  email: "test-user@jft-motors.web.app",
  password: "test-password",
  firstname: "test-user",
  phone: "083-218-2182",
  lastname: "example",
};

const setId = async (doc: any, obj: any) => {
  obj.id = doc.id;
  await db.firestore.collection("added").add({ doc });
};

describe("Firebase Service", () => {
  beforeAll(async () => (db.firestore = await setup()));

  it("can add simple record object", async () => {
    await assertSucceeds(
      db.addAsync(admin, "users").then(async (doc) => await setId(doc, admin))
    );
  });

  it("can delete simple record object", async () => {
    let del = db.deleteAsync("users", admin.id).then(async () => {
      if (admin.id) await db.firestore.collection("deleted").add(admin);
    });

    let add = db
      .addAsync(user, "users")
      .then(async (doc) => await setId(doc, user));

    await assertSucceeds(Promise.all([del, add]));

    await assertSucceeds(
      db.deleteAsync(`users/${user.id}`).then(async () => {
        if (user.id) await db.firestore.collection("deleted").add(user);
      })
    );
  });
});
