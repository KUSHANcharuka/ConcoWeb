import { sql } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { clientMemberships } from "./client-memberships";
import { clients } from "./clients";
import { projects } from "./projects";
import { users } from "./users";

export const emailTemplateTypeEnum = pgEnum("email_template_type", [
  "welcome",
  "proposal",
  "payment_reminder",
  "invoice",
  "general_outreach",
]);

export const emailTemplateStatusEnum = pgEnum("email_template_status", [
  "draft",
  "active",
  "archived",
]);

export const emailDraftSourceEnum = pgEnum("email_draft_source", [
  "manual",
  "suggested",
]);

export const emailDraftStatusEnum = pgEnum("email_draft_status", [
  "draft",
  "suggested",
  "ready",
  "sending",
  "sent",
  "failed",
  "discarded",
]);

export const emailRecipientModeEnum = pgEnum("email_recipient_mode", [
  "selected_member",
  "client_default_contact",
  "external",
]);

export const sentEmailStatusEnum = pgEnum("sent_email_status", [
  "queued",
  "accepted",
  "delivered",
  "opened",
  "clicked",
  "bounced",
  "complained",
  "suppressed",
  "failed",
]);

export const emailDeliveryEventTypeEnum = pgEnum("email_delivery_event_type", [
  "queued",
  "accepted",
  "delivered",
  "opened",
  "clicked",
  "bounced",
  "complained",
  "suppressed",
  "failed",
]);

export const emailGenerationRunStatusEnum = pgEnum("email_generation_run_status", [
  "running",
  "completed",
  "failed",
  "partial",
]);

export const emailSettings = pgTable("email_settings", {
  id: uuid().primaryKey().defaultRandom(),
  fromName: text().notNull().default("Concolabs"),
  fromEmail: text().notNull().default("hello@concolabs.com"),
  replyToEmail: text().notNull().default("hello@concolabs.com"),
  requestNotificationEmails: jsonb().$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  starterLayoutJson: jsonb().notNull(),
  footerCompanyName: text().notNull().default("Concolabs"),
  footerAddress: text(),
  footerContactEmail: text().notNull().default("hello@concolabs.com"),
  logoUrl: text(),
  cronCadenceHours: integer().notNull().default(24),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export const emailTemplates = pgTable("email_templates", {
  id: uuid().primaryKey().defaultRandom(),
  templateType: emailTemplateTypeEnum().notNull(),
  status: emailTemplateStatusEnum().notNull().default("draft"),
  name: text().notNull(),
  subject: text().notNull(),
  builderSourceJson: jsonb().notNull(),
  renderedHtml: text(),
  renderedText: text(),
  createdByAdminId: text()
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  updatedByAdminId: text().references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export const emailTemplateAssignments = pgTable(
  "email_template_assignments",
  {
    id: uuid().primaryKey().defaultRandom(),
    templateType: emailTemplateTypeEnum().notNull(),
    templateId: uuid()
      .notNull()
      .references(() => emailTemplates.id, { onDelete: "cascade" }),
    clientId: uuid().references(() => clients.id, { onDelete: "cascade" }),
    projectId: uuid().references(() => projects.id, { onDelete: "cascade" }),
    createdByAdminId: text()
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp({ withTimezone: true })
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (table) => ({
    scopeIdx: uniqueIndex("email_template_assignment_scope_idx").on(
      table.templateType,
      table.clientId,
      table.projectId,
    ),
  }),
);

export const emailDrafts = pgTable(
  "email_drafts",
  {
    id: uuid().primaryKey().defaultRandom(),
    source: emailDraftSourceEnum().notNull().default("manual"),
    status: emailDraftStatusEnum().notNull().default("draft"),
    templateType: emailTemplateTypeEnum().notNull(),
    templateId: uuid().references(() => emailTemplates.id, { onDelete: "set null" }),
    clientId: uuid().references(() => clients.id, { onDelete: "set null" }),
    projectId: uuid().references(() => projects.id, { onDelete: "set null" }),
    subject: text().notNull(),
    builderSourceJson: jsonb().notNull(),
    renderedHtml: text(),
    renderedText: text(),
    triggerType: text(),
    relatedEntityType: text(),
    relatedEntityId: text(),
    dedupeKey: text(),
    errorMessage: text(),
    createdByAdminId: text().references(() => users.id, { onDelete: "set null" }),
    updatedByAdminId: text().references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp({ withTimezone: true })
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (table) => ({
    dedupeIdx: uniqueIndex("email_draft_dedupe_idx").on(table.dedupeKey),
  }),
);

export const emailDraftRecipients = pgTable("email_draft_recipients", {
  id: uuid().primaryKey().defaultRandom(),
  draftId: uuid()
    .notNull()
    .references(() => emailDrafts.id, { onDelete: "cascade" }),
  recipientMode: emailRecipientModeEnum().notNull(),
  clientMembershipId: uuid().references(() => clientMemberships.id, {
    onDelete: "set null",
  }),
  email: text().notNull(),
  name: text(),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export const sentEmails = pgTable(
  "sent_emails",
  {
    id: uuid().primaryKey().defaultRandom(),
    draftId: uuid().references(() => emailDrafts.id, { onDelete: "set null" }),
    templateId: uuid().references(() => emailTemplates.id, { onDelete: "set null" }),
    templateType: emailTemplateTypeEnum().notNull(),
    clientId: uuid().references(() => clients.id, { onDelete: "set null" }),
    projectId: uuid().references(() => projects.id, { onDelete: "set null" }),
    subject: text().notNull(),
    renderedHtml: text().notNull(),
    renderedText: text().notNull(),
    fromName: text().notNull(),
    fromEmail: text().notNull(),
    replyToEmail: text(),
    status: sentEmailStatusEnum().notNull().default("queued"),
    provider: text().notNull().default("resend"),
    providerMessageId: text(),
    providerIdempotencyKey: text().notNull(),
    errorMessage: text(),
    sentByAdminId: text().references(() => users.id, { onDelete: "set null" }),
    sentAt: timestamp({ withTimezone: true }),
    createdAt: timestamp({ withTimezone: true })
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (table) => ({
    providerIdempotencyIdx: uniqueIndex("sent_emails_provider_idempotency_key_idx").on(
      table.providerIdempotencyKey,
    ),
  }),
);

export const sentEmailRecipients = pgTable("sent_email_recipients", {
  id: uuid().primaryKey().defaultRandom(),
  sentEmailId: uuid()
    .notNull()
    .references(() => sentEmails.id, { onDelete: "cascade" }),
  recipientMode: emailRecipientModeEnum().notNull(),
  clientMembershipId: uuid().references(() => clientMemberships.id, {
    onDelete: "set null",
  }),
  email: text().notNull(),
  name: text(),
  status: sentEmailStatusEnum().notNull().default("queued"),
  providerRecipientId: text(),
  errorMessage: text(),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export const emailDeliveryEvents = pgTable("email_delivery_events", {
  id: uuid().primaryKey().defaultRandom(),
  sentEmailId: uuid()
    .notNull()
    .references(() => sentEmails.id, { onDelete: "cascade" }),
  sentEmailRecipientId: uuid().references(() => sentEmailRecipients.id, {
    onDelete: "cascade",
  }),
  eventType: emailDeliveryEventTypeEnum().notNull(),
  provider: text().notNull().default("resend"),
  providerEventId: text(),
  payloadJson: jsonb(),
  errorMessage: text(),
  occurredAt: timestamp({ withTimezone: true }).notNull().default(sql`now()`),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export const emailGenerationRuns = pgTable("email_generation_runs", {
  id: uuid().primaryKey().defaultRandom(),
  status: emailGenerationRunStatusEnum().notNull().default("running"),
  cadenceHours: integer().notNull().default(24),
  createdDraftCount: integer().notNull().default(0),
  skippedDuplicateCount: integer().notNull().default(0),
  errorMessage: text(),
  startedAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
  completedAt: timestamp({ withTimezone: true }),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export type EmailSettings = typeof emailSettings.$inferSelect;
export type NewEmailSettings = typeof emailSettings.$inferInsert;
export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type NewEmailTemplate = typeof emailTemplates.$inferInsert;
export type EmailTemplateAssignment = typeof emailTemplateAssignments.$inferSelect;
export type NewEmailTemplateAssignment = typeof emailTemplateAssignments.$inferInsert;
export type EmailDraft = typeof emailDrafts.$inferSelect;
export type NewEmailDraft = typeof emailDrafts.$inferInsert;
export type EmailDraftRecipient = typeof emailDraftRecipients.$inferSelect;
export type NewEmailDraftRecipient = typeof emailDraftRecipients.$inferInsert;
export type SentEmail = typeof sentEmails.$inferSelect;
export type NewSentEmail = typeof sentEmails.$inferInsert;
export type SentEmailRecipient = typeof sentEmailRecipients.$inferSelect;
export type NewSentEmailRecipient = typeof sentEmailRecipients.$inferInsert;
export type EmailDeliveryEvent = typeof emailDeliveryEvents.$inferSelect;
export type NewEmailDeliveryEvent = typeof emailDeliveryEvents.$inferInsert;
export type EmailGenerationRun = typeof emailGenerationRuns.$inferSelect;
export type NewEmailGenerationRun = typeof emailGenerationRuns.$inferInsert;
