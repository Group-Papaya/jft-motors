import { Discount } from "@/models";
import discountService from "@/services/discount.service";
import { firestore, firestoreSetup, firestoreTeardown } from "./setup-teardown";

const { saveDiscountAsync, deleteDiscountAsync } = discountService;

let discount: Discount;
let saved: Discount;

beforeAll(() => {
  firestoreSetup();
  discount = new Discount();
  discount.details = "Black Friday Sale";
  discount.amount = 0.15;
  discount.percentage = true;
});

afterAll(() => {
  firestoreTeardown();
});

describe("discount Service", () => {
  const batch = firestore.batch();
  const discounts = firestore.collection("discounts");

  afterEach(async () => {
    await discounts.get().then((snap) => {
      snap.docs.forEach(async (doc) => await doc.ref.delete());
    });
  }, 3000);

  it("can save discount async", async () => {
    await saveDiscountAsync(discount).then((_discount) => {
      expect(_discount).not.toBe(null);
      expect(_discount?.id).not.toBe(undefined);
    });
  });

  it("can delete discount async", async () => {
    await saveDiscountAsync(discount).then(async (_discount) => {
      expect(discount.details).toEqual(_discount?.details);
      if (_discount)
        await deleteDiscountAsync(_discount.id).then(async () => {
          const doc = await discounts.doc(_discount.id).get();
          expect(doc.exists).toBeFalsy();
        });
    });
  });
});
