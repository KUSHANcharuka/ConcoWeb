import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { assets } from "./assets";
import { clients } from "./clients";
import { projectRequestStatusEnum } from "./project-requests";
import { projects } from "./projects";
import { users } from "./users";

export const projectChangeRequests = pgTable("project_change_requests", {
  id: uuid().primaryKey().defaultRandom(),
  clientId: uuid()
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  projectId: uuid()
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  requestedByUserId: text()
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  label: text().notNull(),
  summary: text(),
  status: projectRequestStatusEnum().notNull().default("pending"),
  reviewedByAdminId: text().references(() => users.id, {
    onDelete: "set null",
  }),
  reviewedAt: timestamp({ withTimezone: true }),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export const projectChangeRequestAttachments = pgTable(
  "project_change_request_attachments",
  {
    id: uuid().primaryKey().defaultRandom(),
    requestId: uuid()
      .notNull()
      .references(() => projectChangeRequests.id, { onDelete: "cascade" }),
    assetId: uuid()
      .notNull()
      .references(() => assets.id, { onDelete: "cascade" }),
    createdAt: timestamp({ withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (table) => ({
    requestAssetIdx: uniqueIndex("project_change_request_attachment_request_asset_idx").on(
      table.requestId,
      table.assetId,
    ),
  }),
);

export type ProjectChangeRequest = typeof projectChangeRequests.$inferSelect;
export type NewProjectChangeRequest = typeof projectChangeRequests.$inferInsert;
export type ProjectChangeRequestAttachment =
  typeof projectChangeRequestAttachments.$inferSelect;
export type NewProjectChangeRequestAttachment =
  typeof projectChangeRequestAttachments.$inferInsert;
