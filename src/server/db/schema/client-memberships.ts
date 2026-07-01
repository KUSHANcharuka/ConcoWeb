import { sql } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { clientInvitations, clientOrgRoleEnum } from "./client-invitations";
import { clients } from "./clients";
import { users } from "./users";

export const clientMembershipStatusEnum = pgEnum("client_membership_status", [
  "active",
  "removed",
]);

export const clientMemberships = pgTable(
  "client_memberships",
  {
    id: uuid().primaryKey().defaultRandom(),
    clientId: uuid()
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    email: text().notNull(),
    jobTitle: text(),
    role: clientOrgRoleEnum().notNull().default("member"),
    clerkMembershipId: text().notNull().unique(),
    sourceInvitationId: uuid().references(() => clientInvitations.id, {
      onDelete: "set null",
    }),
    status: clientMembershipStatusEnum().notNull().default("active"),
    joinedAt: timestamp({ withTimezone: true }).notNull().default(sql`now()`),
    removedAt: timestamp({ withTimezone: true }),
    removedByUserId: text().references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp({ withTimezone: true })
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (table) => ({
    clientUserIdx: uniqueIndex("client_membership_client_user_idx").on(
      table.clientId,
      table.userId,
    ),
  }),
);

export type ClientMembership = typeof clientMemberships.$inferSelect;
export type NewClientMembership = typeof clientMemberships.$inferInsert;
