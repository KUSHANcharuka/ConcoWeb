import { sql } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { clients } from "./clients";
import { products } from "./products";
import { users } from "./users";

export const projectRequestStatusEnum = pgEnum("project_request_status", [
  "pending",
  "approved",
  "rejected",
]);

export const projectRequests = pgTable("project_requests", {
  id: uuid().primaryKey().defaultRandom(),
  clientId: uuid()
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  requestedByUserId: text()
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  label: text().notNull(),
  productId: uuid().references(() => products.id, { onDelete: "set null" }),
  summary: text(),
  status: projectRequestStatusEnum().notNull().default("pending"),
  reviewedByAdminId: text().references(() => users.id, {
    onDelete: "set null",
  }),
  reviewedAt: timestamp({ withTimezone: true }),
  projectId: uuid(),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export type ProjectRequest = typeof projectRequests.$inferSelect;
export type NewProjectRequest = typeof projectRequests.$inferInsert;
