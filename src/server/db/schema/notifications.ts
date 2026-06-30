import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { clients } from "./clients";
import { emailDrafts, sentEmails } from "./emails";
import { projects } from "./projects";
import { users } from "./users";

export const notificationPortalEnum = pgEnum("notification_portal", ["admin", "client"]);

export const notificationSeverityEnum = pgEnum("notification_severity", [
  "info",
  "success",
  "warning",
  "error",
]);

export const notificationDeliveryChannelEnum = pgEnum("notification_delivery_channel", [
  "in_app",
  "email",
]);

export const notificationDeliveryStatusEnum = pgEnum("notification_delivery_status", [
  "draft",
  "queued",
  "sent",
  "failed",
  "skipped",
]);

export const notificationRunStatusEnum = pgEnum("notification_run_status", [
  "running",
  "completed",
  "failed",
  "partial",
]);

export const notificationEvents = pgTable(
  "notification_events",
  {
    id: uuid().primaryKey().defaultRandom(),
    eventType: text().notNull(),
    dedupeKey: text(),
    actorUserId: text().references(() => users.id, { onDelete: "set null" }),
    clientId: uuid().references(() => clients.id, { onDelete: "cascade" }),
    projectId: uuid().references(() => projects.id, { onDelete: "cascade" }),
    entityType: text(),
    entityId: text(),
    severity: notificationSeverityEnum().notNull().default("info"),
    payloadJson: jsonb().$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp({ withTimezone: true }).notNull().default(sql`now()`),
  },
  (table) => ({
    dedupeIdx: uniqueIndex("notification_events_dedupe_idx").on(table.dedupeKey),
  }),
);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid().primaryKey().defaultRandom(),
    eventId: uuid()
      .notNull()
      .references(() => notificationEvents.id, { onDelete: "cascade" }),
    portal: notificationPortalEnum().notNull(),
    recipientUserId: text().notNull(),
    clientId: uuid().references(() => clients.id, { onDelete: "cascade" }),
    projectId: uuid().references(() => projects.id, { onDelete: "cascade" }),
    title: text().notNull(),
    body: text().notNull(),
    href: text(),
    severity: notificationSeverityEnum().notNull().default("info"),
    readAt: timestamp({ withTimezone: true }),
    seenAt: timestamp({ withTimezone: true }),
    createdAt: timestamp({ withTimezone: true }).notNull().default(sql`now()`),
    updatedAt: timestamp({ withTimezone: true }).notNull().default(sql`now()`),
  },
  (table) => ({
    eventRecipientIdx: uniqueIndex("notifications_event_portal_recipient_idx").on(
      table.eventId,
      table.portal,
      table.recipientUserId,
    ),
  }),
);

export const notificationDeliveries = pgTable("notification_deliveries", {
  id: uuid().primaryKey().defaultRandom(),
  notificationId: uuid()
    .notNull()
    .references(() => notifications.id, { onDelete: "cascade" }),
  channel: notificationDeliveryChannelEnum().notNull(),
  status: notificationDeliveryStatusEnum().notNull().default("queued"),
  emailDraftId: uuid().references(() => emailDrafts.id, { onDelete: "set null" }),
  sentEmailId: uuid().references(() => sentEmails.id, { onDelete: "set null" }),
  metadataJson: jsonb().$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
  errorMessage: text(),
  createdAt: timestamp({ withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp({ withTimezone: true }).notNull().default(sql`now()`),
});

export const notificationSettings = pgTable("notification_settings", {
  id: uuid().primaryKey().defaultRandom(),
  timezone: text().notNull().default("Asia/Colombo"),
  cadenceMinutes: integer().notNull().default(60),
  paymentRemindersEnabled: boolean().notNull().default(true),
  accessRemindersEnabled: boolean().notNull().default(true),
  paymentReminderWindows: jsonb().$type<string[]>().notNull().default(
    sql`'["t_minus_7d","t_minus_1d","day_of","plus_1d","plus_3d","plus_7d"]'::jsonb`,
  ),
  accessReminderWindows: jsonb().$type<string[]>().notNull().default(
    sql`'["t_minus_7d","t_minus_1d","day_of","plus_1d","plus_3d","plus_7d"]'::jsonb`,
  ),
  inAppTemplates: jsonb().$type<Record<string, { title: string; body: string }>>().notNull().default(sql`'{}'::jsonb`),
  emailDraftTemplates: jsonb().$type<Record<string, { subject: string; body: string }>>().notNull().default(sql`'{}'::jsonb`),
  createdAt: timestamp({ withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp({ withTimezone: true }).notNull().default(sql`now()`),
});

export const notificationRuns = pgTable("notification_runs", {
  id: uuid().primaryKey().defaultRandom(),
  status: notificationRunStatusEnum().notNull().default("running"),
  createdNotificationCount: integer().notNull().default(0),
  createdDeliveryCount: integer().notNull().default(0),
  skippedDuplicateCount: integer().notNull().default(0),
  errorMessage: text(),
  startedAt: timestamp({ withTimezone: true }).notNull().default(sql`now()`),
  completedAt: timestamp({ withTimezone: true }),
});

export type NotificationEvent = typeof notificationEvents.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type NotificationDelivery = typeof notificationDeliveries.$inferSelect;
export type NotificationSettings = typeof notificationSettings.$inferSelect;
export type NotificationRun = typeof notificationRuns.$inferSelect;
