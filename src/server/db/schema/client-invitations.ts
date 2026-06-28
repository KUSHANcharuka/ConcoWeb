import { sql } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { clients } from "./clients";
import { users } from "./users";

export const clientOrgRoleEnum = pgEnum("client_org_role", ["admin", "member"]);

export const clientInvitationStatusEnum = pgEnum("client_invitation_status", [
  "pending",
  "accepted",
  "revoked",
  "expired",
]);

export const clientInvitations = pgTable("client_invitations", {
  id: uuid().primaryKey().defaultRandom(),
  clientId: uuid()
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  email: text().notNull(),
  name: text(),
  jobTitle: text(),
  phone: text(),
  role: clientOrgRoleEnum().notNull().default("member"),
  clerkInvitationId: text().notNull().unique(),
  status: clientInvitationStatusEnum().notNull().default("pending"),
  invitedByUserId: text().references(() => users.id, { onDelete: "set null" }),
  acceptedUserId: text().references(() => users.id, { onDelete: "set null" }),
  revokedByUserId: text().references(() => users.id, { onDelete: "set null" }),
  invitedAt: timestamp({ withTimezone: true }).notNull().default(sql`now()`),
  acceptedAt: timestamp({ withTimezone: true }),
  revokedAt: timestamp({ withTimezone: true }),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export type ClientInvitation = typeof clientInvitations.$inferSelect;
export type NewClientInvitation = typeof clientInvitations.$inferInsert;
