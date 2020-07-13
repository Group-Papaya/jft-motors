import {
  Entity,
  rootCollection,
  field,
  documentRef,
  IDocumentRef,
  ITimestamp,
  timestamp
} from "firebase-firestorm";
import Client from "./Client";
import LineItem from "./LineItem";
import User from "./User";

@rootCollection({
  name: "quotations"
})
export default class Quotation extends Entity {
  @documentRef({ name: "user", entity: User })
  user!: IDocumentRef<User>;

  @documentRef({ name: "client", entity: Client })
  client!: IDocumentRef<Client>;

  @field({ name: "items" })
  items!: IDocumentRef<LineItem>[];

  @field({ name: "total" })
  total!: number;

  @field({ name: "completed" })
  completed!: boolean;

  @timestamp({
    name: "created_at",
    updateOnCreate: true
  })
  created_at!: ITimestamp;

  @timestamp({
    name: "updated_at",
    updateOnUpdate: true
  })
  updated_at!: ITimestamp;
}
