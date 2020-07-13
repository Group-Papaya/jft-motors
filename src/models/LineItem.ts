import {
  Entity,
  rootCollection,
  field,
  IDocumentRef,
  documentRef
} from "firebase-firestorm";
import Discount from "./Discount";

@rootCollection({
  name: "line-items"
})
export default class LineItem extends Entity {
  @field({ name: "type" })
  type!: string;

  @field({ name: "cost" })
  cost!: number;

  @field({ name: "units" })
  units!: number;

  @field({ name: "details" })
  details!: string;

  @field({ name: "quantity" })
  quantity!: number;

  @documentRef({ name: "discount", entity: Discount })
  discount!: IDocumentRef<Discount>;

  @field({ name: "discounted" })
  discounted!: boolean;
}

const WORKER = "WORKER";
const PRODUCT = "PRODUCT";

export { WORKER, PRODUCT };
