import { sql } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { clients } from "./clients";
import { products } from "./products";

export const projectStatusEnum = pgEnum("project_status", [
  "active",
  "suspended",
  "pending",
  "archived",
]);

export const projectOriginEnum = pgEnum("project_origin", [
  "admin_created",
  "client_requested",
]);

export const projects = pgTable("projects", {
  id: uuid().primaryKey().defaultRandom(),
  clientId: uuid()
    .notNull()
    .references(() => clients.id, { onDelete: "restrict" }),
  productId: uuid().references(() => products.id, { onDelete: "set null" }),
  label: text().notNull(),
  status: projectStatusEnum().notNull().default("pending"),
  origin: projectOriginEnum().notNull().default("admin_created"),
  sourceRequestId: uuid(),
  // Reserved for tiers/seats/features — null in v1.
  planTier: text(),
  seatCount: integer(),
  featureFlags: jsonb(),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
