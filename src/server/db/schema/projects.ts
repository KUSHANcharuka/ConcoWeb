import { sql } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
  date,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { assets } from "./assets";
import { clients } from "./clients";
import { products } from "./products";

export const projectStatusEnum = pgEnum("project_status", [
  "pending",
  "active",
  "paused",
  "completed",
  "archived",
]);

export const projectTypeEnum = pgEnum("project_type", [
  "custom_build",
  "saas_setup",
  "website",
  "mobile_app",
  "internal_tool",
  "other",
]);

export const projectVisibilityEnum = pgEnum("project_visibility", [
  "visible",
  "hidden",
]);

export const projects = pgTable("projects", {
  id: uuid().primaryKey().defaultRandom(),
  clientId: uuid()
    .notNull()
    .references(() => clients.id, { onDelete: "restrict" }),
  productId: uuid().references(() => products.id, { onDelete: "set null" }),
  name: text().notNull(),
  description: text().notNull(),
  projectType: projectTypeEnum().notNull().default("custom_build"),
  status: projectStatusEnum().notNull().default("pending"),
  visibility: projectVisibilityEnum().notNull().default("visible"),
  currency: text().notNull().default("USD"),
  coverAssetId: uuid().references(() => assets.id, { onDelete: "set null" }),
  startDate: date(),
  targetLaunchDate: date(),
  createdByAdminId: text().notNull(),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
