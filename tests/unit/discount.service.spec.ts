import { Discount } from "@/models";
import discountService from "@/services/discount.service";
import { cnLog } from "@/utils";
import {
  firestore,
  firestoreDelete,
  firestoreSetup,
  firestoreTeardown
} from "./setup-teardown";

const { saveDiscountAsync, deleteDiscountAsync } = discountService;

let discount: Discount;
const discounts = firestore.collection("discounts");

beforeAll(() => {
  firestoreSetup();
  discount = new Discount();
  discount.details = "Black Friday Sale";
  discount.amount = 0.15;
  discount.percentage = true;
});

afterAll(() => firestoreTeardown());

describe("discount Service", () => {
  afterEach(() => firestoreDelete(discounts));

  it("can save discount async", () =>
    saveDiscountAsync(discount)
      .then(result => {
        expect(result).not.toBe(null);
        expect(result?.id).not.toBe(undefined);
      })
      .catch(cnLog));

  it("can delete discount async", () => {
    saveDiscountAsync(discount)
      .then(result => {
        expect(discount.details).toEqual(result?.details);

        deleteDiscountAsync(result.id).then(async () => {
          const doc = await discounts.doc(result.id).get();
          expect(doc.exists).toBeFalsy();
        });
      })
      .catch(cnLog);
  });
});
