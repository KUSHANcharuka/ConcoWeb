import { sql } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { assets } from "./assets";
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

export const projectRequestAttachments = pgTable(
  "project_request_attachments",
  {
    id: uuid().primaryKey().defaultRandom(),
    requestId: uuid()
      .notNull()
      .references(() => projectRequests.id, { onDelete: "cascade" }),
    assetId: uuid()
      .notNull()
      .references(() => assets.id, { onDelete: "cascade" }),
    createdAt: timestamp({ withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (table) => ({
    requestAssetIdx: uniqueIndex("project_request_attachment_request_asset_idx").on(
      table.requestId,
      table.assetId,
    ),
  }),
);

export type ProjectRequest = typeof projectRequests.$inferSelect;
export type NewProjectRequest = typeof projectRequests.$inferInsert;
export type ProjectRequestAttachment = typeof projectRequestAttachments.$inferSelect;
export type NewProjectRequestAttachment = typeof projectRequestAttachments.$inferInsert;
