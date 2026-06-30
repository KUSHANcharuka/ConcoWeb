import { sql } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const clientStatusEnum = pgEnum("client_status", [
  "lead",
  "active",
  "suspended",
  "archived",
]);

export const clients = pgTable("clients", {
  id: uuid().primaryKey().defaultRandom(),
  clerkOrgId: text().notNull().unique(),
  name: text().notNull(),
  primaryContactEmail: text().notNull(),
  primaryContactPhone: text(),
  coverAssetId: uuid(),
  logoAssetId: uuid(),
  country: text(),
  baseCurrency: text().notNull().default("USD"),
  status: clientStatusEnum().notNull().default("active"),
  internalNotes: text(),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
