import { sql } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const productKindEnum = pgEnum("product_kind", ["saas", "custom", "service"]);
export const productStatusEnum = pgEnum("product_status", [
  "active",
  "inactive",
  "deprecated",
]);
export const productBillingModeEnum = pgEnum("product_billing_mode", [
  "subscription",
  "one_time",
  "milestone",
  "manual",
]);

export const products = pgTable("products", {
  id: uuid().primaryKey().defaultRandom(),
  slug: text().notNull().unique(),
  name: text().notNull(),
  kind: productKindEnum().notNull(),
  status: productStatusEnum().notNull().default("active"),
  description: text(),
  defaultCurrency: text(),
  billingMode: productBillingModeEnum().notNull().default("manual"),
  webhookUrl: text(),
  webhookSecret: text(),
  reconcileUrl: text(),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
