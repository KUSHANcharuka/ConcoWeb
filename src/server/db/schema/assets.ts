import { sql } from "drizzle-orm";
import {
  bigint,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { clients } from "./clients";
import { users } from "./users";

export const assetTypeEnum = pgEnum("asset_type", [
  "image",
  "document",
  "video",
  "payment_proof",
  "signature",
  "other",
]);

export const assetVisibilityEnum = pgEnum("asset_visibility", [
  "admin_only",
  "client_visible",
  "private_member",
]);

export const assetScopeTypeEnum = pgEnum("asset_scope_type", [
  "project",
  "project_request",
  "proposal",
  "billing_artifact",
  "payment_proof",
  "change_request",
  "message",
  "client",
  "unscoped",
]);

export const assets = pgTable("assets", {
  id: uuid().primaryKey().defaultRandom(),
  clientId: uuid()
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  projectId: uuid(),
  uploadedByUserId: text().references(() => users.id, { onDelete: "set null" }),
  bucket: text().notNull(),
  objectKey: text().notNull().unique(),
  fileName: text().notNull(),
  displayName: text().notNull(),
  mimeType: text().notNull(),
  sizeBytes: bigint({ mode: "number" }).notNull(),
  checksum: text(),
  assetType: assetTypeEnum().notNull().default("other"),
  visibility: assetVisibilityEnum().notNull().default("admin_only"),
  scopeType: assetScopeTypeEnum().notNull().default("unscoped"),
  scopeId: uuid(),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
  deletedAt: timestamp({ withTimezone: true }),
});

export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;
