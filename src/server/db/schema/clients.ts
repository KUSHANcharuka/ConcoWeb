import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const clients = pgTable("clients", {
  id: uuid().primaryKey().defaultRandom(),
  clerkOrgId: text().notNull().unique(),
  name: text().notNull(),
  primaryContactEmail: text().notNull(),
  country: text(),
  baseCurrency: text().notNull().default("USD"),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
