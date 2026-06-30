import { sql } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { assets } from "./assets";
import { clients } from "./clients";
import { projects } from "./projects";
import { users } from "./users";

export const projectFileVisibilityEnum = pgEnum("project_file_visibility", [
  "admin_only",
  "client_visible",
]);

export const projectFolders = pgTable("project_folders", {
  id: uuid().primaryKey().defaultRandom(),
  clientId: uuid()
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  projectId: uuid()
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  name: text().notNull(),
  parentFolderId: uuid(),
  visibility: projectFileVisibilityEnum().notNull().default("client_visible"),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export const projectFiles = pgTable("project_files", {
  id: uuid().primaryKey().defaultRandom(),
  clientId: uuid()
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  projectId: uuid()
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  folderId: uuid(),
  assetId: uuid()
    .notNull()
    .references(() => assets.id, { onDelete: "cascade" }),
  title: text().notNull(),
  description: text(),
  visibility: projectFileVisibilityEnum().notNull().default("client_visible"),
  uploadedByUserId: text().references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export type ProjectFolder = typeof projectFolders.$inferSelect;
export type NewProjectFolder = typeof projectFolders.$inferInsert;
export type ProjectFile = typeof projectFiles.$inferSelect;
export type NewProjectFile = typeof projectFiles.$inferInsert;
