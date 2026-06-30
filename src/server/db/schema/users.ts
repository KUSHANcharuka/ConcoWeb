import { sql } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["client", "admin"]);

export const users = pgTable("users", {
  id: text().primaryKey(), // Clerk user id
  email: text().notNull(),
  phone: text(),
  name: text(),
  imageUrl: text(),
  role: userRoleEnum().notNull().default("client"),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
