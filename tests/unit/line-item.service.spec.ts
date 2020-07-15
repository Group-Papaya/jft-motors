import { LineItem } from "@/models";
import { PRODUCT } from "@/models/LineItem";
import lineitemService from "@/services/line-item.service";
import { firestore, firestoreSetup, firestoreTeardown } from "./setup-teardown";

const { saveLineItemAsync, deleteLineItemAsync } = lineitemService;

let item: LineItem;
let blank: LineItem;

beforeAll(() => {
  firestoreSetup();
  item = new LineItem();
  blank = new LineItem();
  item.cost = 950;
  item.details = "16in GoodYear Tyre";
  item.discounted = true;
  item.quantity = 4;
  item.units = 16;
  item.type = PRODUCT;
});

afterAll(() => {
  firestoreTeardown();
});

describe("Line Item Service", () => {
  const items = firestore.collection("lineitems");

  afterEach(async () => {
    await items.get().then(snap => {
      snap.docs.forEach(async doc => await doc.ref.delete());
    });
  }, 3000);

  it("can save line item async", async () => {
    await saveLineItemAsync(item).then(_item => {
      expect(_item).not.toBe(null);
      expect(_item?.id).not.toBe(undefined);
    });
  });

  it("can delete item async", async () => {
    await saveLineItemAsync(item).then(async _item => {
      const local = [item.cost, item.quantity, item.type];
      const { id, cost, quantity, type } = _item ? _item : blank;

      const saved = [cost, quantity, type];
      expect(local).toEqual(saved);
      await deleteLineItemAsync(id).then(async () => {
        const doc = await items.doc(id).get();
        expect(doc.exists).toBeFalsy();
      });
    });
  });
});
