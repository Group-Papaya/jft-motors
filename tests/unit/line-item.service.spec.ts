import { LineItem } from "@/models";
import { PRODUCT } from "@/models/LineItem";
import lineitemService from "@/services/line-item.service";
import { cnLog } from "@/utils";
import {
  firestore,
  firestoreDelete,
  firestoreSetup,
  firestoreTeardown
} from "./setup-teardown";

const { saveLineItemAsync, deleteLineItemAsync } = lineitemService;

let item: LineItem;
let blank: LineItem;
const items = firestore.collection("lineitems");

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

afterAll(() => firestoreTeardown());

describe("Line Item Service", () => {
  afterEach(() => firestoreDelete(items));

  it("can save line item async", () =>
    saveLineItemAsync(item)
      .then(result => {
        expect(result).not.toBe(null);
        expect(result?.id).not.toBe(undefined);
      })
      .catch(cnLog));

  it("can delete item async", () => {
    saveLineItemAsync(item)
      .then(value => {
        const local = [item.cost, item.quantity, item.type];
        const { id, cost, quantity, type } = value ? value : blank;

        const saved = [cost, quantity, type];

        expect(local).toEqual(saved);
        deleteLineItemAsync(id).then(async () => {
          const doc = await items.doc(id).get();
          expect(doc.exists).toBeFalsy();
        });
      })
      .catch(cnLog);
  });
});
