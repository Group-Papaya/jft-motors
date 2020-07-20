import { Client, Discount, LineItem, Quotation, Record, User } from "@/models";
import { PRODUCT } from "@/models/LineItem";
import { ADMIN_ROLE, BASE_ROLE } from "@/models/User";
import FireService from "@/services/firestore.service";
import { assertSucceeds, firestore } from "@firebase/testing";
import { initialize, setup } from "./firebase-testing";

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

const client: Client = {
  firstname: "test-client",
  lastname: "example",
  email: "test-client@gmail.com",
  phone: "081-234-5746",
};

const discount: Discount = {
  amount: 0.15,
  details: "VAT Discount",
  percentage: true,
};

const item: LineItem = {
  type: PRODUCT,
  cost: 1250,
  units: 1,
  details: "GoodYear 16in",
  quantity: 1,
};

const draft: Quotation = {
  user: "",
  client: "",
};

const setId = async (
  doc: firebase.firestore.DocumentReference,
  obj: Record
) => {
  await db.firestore.collection("added").add({ doc });
  obj.id = doc.id;
  return doc;
};

const addObj = async (obj: Record, path: string) => {
  const doc = await db.add(obj, path);
  return await setId(doc, obj);
};

const removeObj = async (obj: Record, path: string) => {
  await db.delete(path, obj.id);
  if (obj.id) await db.firestore.collection("deleted").add(obj);
};

initialize();

describe("Firebase Service", () => {
  beforeAll(async () => (db.firestore = await setup()));

  it("can add simple record object", async () => {
    await assertSucceeds(addObj(admin, "users"));
    await assertSucceeds(addObj(client, "clients"));
  });

  it("can delete simple record object", async () => {
    await assertSucceeds(
      Promise.all([removeObj(admin, "users"), addObj(user, "users")])
    );

    await assertSucceeds(
      db.delete(`users/${user.id}`).then(async () => {
        if (user.id) await db.firestore.collection("deleted").add(user);
      })
    );
  });

  it("can add complex/record object with ref objects", async () => {
    const addDiscount = addObj(discount, "discounts").then(async (ref) => {
      item.discount = ref;
    });

    await Promise.all([
      db.update(admin, `users/${admin.id}`),
      db.update(client, `clients/${client.id}`),
      addDiscount,
    ]);

    const items = Promise.all([
      addObj(item, "line-items"),
      addObj(item, "line-items"),
    ]).then(async (refs) => {
      if (admin.id && client.id) {
        draft.user = admin.id;
        draft.client = client.id;
      }
      draft.items = refs;
      draft.created_at = firestore.Timestamp.now();
      draft.updated_at = firestore.Timestamp.now();
      return await addObj(draft, "quotations");
    });

    await assertSucceeds(items);
  });
});
