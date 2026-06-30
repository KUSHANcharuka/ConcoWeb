import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { clients } from "./clients";
import { projects } from "./projects";
import { users } from "./users";

export const projectTimelineItemTypeEnum = pgEnum("project_timeline_item_type", [
  "milestone",
  "payment_due",
  "proposal_sent",
  "delivery",
  "review",
  "change_request",
  "custom",
]);

export const projectTimelineItemStatusEnum = pgEnum("project_timeline_item_status", [
  "planned",
  "current",
  "completed",
  "delayed",
  "cancelled",
]);

export const projectTimelineLinkedEntityTypeEnum = pgEnum(
  "project_timeline_linked_entity_type",
  ["proposal", "invoice", "change_request", "asset", "other"],
);

export const projectTimelineItems = pgTable("project_timeline_items", {
  id: uuid().primaryKey().defaultRandom(),
  clientId: uuid()
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  projectId: uuid()
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: text().notNull(),
  description: text(),
  itemType: projectTimelineItemTypeEnum().notNull().default("milestone"),
  status: projectTimelineItemStatusEnum().notNull().default("planned"),
  startsAt: timestamp({ withTimezone: true }),
  dueAt: timestamp({ withTimezone: true }),
  completedAt: timestamp({ withTimezone: true }),
  sortOrder: integer().notNull().default(0),
  linkedEntityType: projectTimelineLinkedEntityTypeEnum(),
  linkedEntityId: uuid(),
  visibleToClient: boolean().notNull().default(true),
  layoutX: integer().notNull().default(0),
  layoutY: integer().notNull().default(0),
  createdByUserId: text().references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export type ProjectTimelineItem = typeof projectTimelineItems.$inferSelect;
export type NewProjectTimelineItem = typeof projectTimelineItems.$inferInsert;
