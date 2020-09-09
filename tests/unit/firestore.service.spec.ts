import { Client, Discount, LineItem, Quotation, Record, User } from "@/models";
import { PRODUCT } from "@/models/LineItem";
import { ADMIN_ROLE, BASE_ROLE } from "@/models/User";
import FirestoreService from "@/services/firestore.service";
import { assertSucceeds } from "@firebase/testing";
import { initialize, setup } from "./firebase-testing";

let testService: FirestoreService;

const admin: User = {
  role: ADMIN_ROLE,
  phone: "021-458-7131",
  email: "test-admin@jft-motors.web.app",
  password: "test-password",
  firstname: "test-admin",
  lastname: "example"
};

const user: User = {
  role: BASE_ROLE,
  phone: "083-218-2182",
  email: "test-user@jft-motors.web.app",
  password: "test-password",
  firstname: "test-user",
  lastname: "example"
};

const client: Client = {
  firstname: "test-client",
  lastname: "example",
  email: "test-client@gmail.com",
  phone: "081-234-5746"
};

const discount: Discount = {
  name: "VAT Discount",
  amount: 0.15,
  details: "To be applied, the inc. VAT of an Item",
  percentage: true
};

const item: LineItem = {
  name: "line item",
  type: PRODUCT,
  cost: 1250,
  units: 1,
  quantity: 1,
  discount: "",
  discounted: false,
  details: "GoodYear 16in"
};

const draft: Quotation = {
  user: "",
  client: "",
  items: []
};

const add = async (record: Record, to: string) => {
  return testService.add(record, to).then(doc => {
    record.id = doc.id;
    testService.getCollection("added").add({ document: doc.path });
    return doc;
  });
};

const remove = async (path: string, record?: Record) => {
  if (record === undefined) {
    testService.delete(path).then(() => {
      testService.getCollection("deleted").add({ document: path });
    });
  } else {
    testService.delete(path, record.id).then(() => {
      testService
        .getCollection("deleted")
        .add({ document: `${path}/${record.id}` });
    });
  }
};

initialize();

describe("Firebase Service", () => {
  beforeAll(
    async () =>
      await setup().then(
        firestore => (testService = new FirestoreService(firestore))
      )
  );

  it("can add simple record object", async () => {
    const adding = Promise.all([
      add(user, "users"),
      add(admin, "users"),
      add(client, "clients")
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
    const _discount = add(discount, "discounts").then(ref => {
      item.discount = ref.path;
    });

    await Promise.all([
      _discount,
      testService.update(admin, `users/${admin.id}`),
      testService.update(client, `clients/${client.id}`)
    ]);

    const items = Promise.all([
      add(item, "line-items"),
      add(item, "line-items")
    ]).then(() => {
      if (admin.id && client.id) {
        draft.user = testService.getDocument(`users/${admin.id}`).path;
        draft.client = testService.getDocument(`clients/${client.id}`).path;
      }

      draft.created = testService.currentTime();
      draft.updated = testService.currentTime();
    });

    await assertSucceeds(items);
    await assertSucceeds(
      add(draft, "quotations").then(ref => {
        const it = testService.getDocument(`${ref.path}/items/${item.id}`);
        testService.setDocument(item, it);
        draft.updated = testService.currentTime();
      })
    );
  });
});
