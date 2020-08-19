import { Client, Discount, LineItem, Quotation, Record, User } from "@/models";
import { PRODUCT } from "@/models/LineItem";
import { ADMIN_ROLE, BASE_ROLE } from "@/models/User";
import FirestoreService from "@/services/firestore.service";
import { assertSucceeds } from "@firebase/testing";
import { initialize, setup } from "./firebase-testing";

const db = new FirestoreService();

const admin: User = {
  role: ADMIN_ROLE,
  email: "test-admin@jft-motors.web.app",
  password: "test-password",
  firstname: "test-admin",
  phone: "021-458-7131",
  lastname: "example"
};

const user: User = {
  role: BASE_ROLE,
  email: "test-user@jft-motors.web.app",
  password: "test-password",
  firstname: "test-user",
  phone: "083-218-2182",
  lastname: "example"
};

const client: Client = {
  firstname: "test-client",
  lastname: "example",
  email: "test-client@gmail.com",
  phone: "081-234-5746"
};

const discount: Discount = {
  amount: 0.15,
  details: "VAT Discount",
  percentage: true
};

const item: LineItem = {
  name: "line item",
  type: PRODUCT,
  cost: 1250,
  units: 1,
  details: "GoodYear 16in",
  quantity: 1
};

const draft: Quotation = {
  user: "",
  client: ""
};

const add = async (path: string, obj: Record) => {
  return db.add(obj, path).then(doc => {
    obj.id = doc.id;
    db.firestore.collection("added").add({ document: doc.path });
    return doc;
  });
};

const remove = async (path: string, obj?: Record) => {
  if (obj === undefined) {
    db.delete(path).then(() => {
      db.firestore.collection("deleted").add({ document: path });
    });
  } else {
    db.delete(path, obj.id).then(() => {
      db.firestore.collection("deleted").add({ document: `${path}/${obj.id}` });
    });
  }
};

initialize();

describe("Firebase Service", () => {
  beforeAll(async () => (db.firestore = await setup()));

  it("can add simple record object", async () => {
    const adding = Promise.all([
      add("users", user),
      add("users", admin),
      add("clients", client)
    ]);
    await assertSucceeds(adding);
  });

  it("can delete simple record object", async () => {
    const removing = Promise.all([
      remove("users", admin),
      remove(`users/${user.id}`)
    ]);
    await assertSucceeds(removing);
  });

  it("can add complex/record object with ref objects", async () => {
    const _discount = add("discounts", discount).then(ref => {
      item.discount = ref;
    });

    await Promise.all([
      _discount,
      db.update(admin, `users/${admin.id}`),
      db.update(client, `clients/${client.id}`)
    ]);

    const items = Promise.all([
      add("line-items", item),
      add("line-items", item)
    ]).then(() => {
      if (admin.id && client.id) {
        draft.user = db.firestore.doc(`users/${admin.id}`);
        draft.client = db.firestore.doc(`clients/${client.id}`);
      }

      draft.created = db.currentTime();
      draft.updated = db.currentTime();
    });

    await assertSucceeds(items);
    await assertSucceeds(
      add("quotations", draft).then(ref => {
        db.firestore
          .collection(`${ref.path}/items`)
          .doc(item.id)
          .set(item);
        draft.updated = db.currentTime();
      })
    );
  });
});
