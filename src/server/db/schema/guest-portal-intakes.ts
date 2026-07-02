import { sql } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { users } from "./users";

export const guestPortalIntakeStatusEnum = pgEnum("guest_portal_intake_status", [
  "pending",
  "approved",
  "rejected",
]);

export const guestPortalIntakes = pgTable("guest_portal_intakes", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull(),
  company: text().notNull(),
  summary: text().notNull(),
  status: guestPortalIntakeStatusEnum().notNull().default("pending"),
  reviewedByAdminId: text().references(() => users.id, { onDelete: "set null" }),
  reviewedAt: timestamp({ withTimezone: true }),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export const guestPortalIntakeAttachments = pgTable("guest_portal_intake_attachments", {
  id: uuid().primaryKey().defaultRandom(),
  intakeId: uuid().references(() => guestPortalIntakes.id, { onDelete: "cascade" }),
  bucket: text().notNull(),
  objectKey: text().notNull().unique(),
  fileName: text().notNull(),
  displayName: text().notNull(),
  mimeType: text().notNull(),
  sizeBytes: text().notNull(),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export type GuestPortalIntake = typeof guestPortalIntakes.$inferSelect;
export type NewGuestPortalIntake = typeof guestPortalIntakes.$inferInsert;
export type GuestPortalIntakeAttachment = typeof guestPortalIntakeAttachments.$inferSelect;
export type NewGuestPortalIntakeAttachment = typeof guestPortalIntakeAttachments.$inferInsert;
