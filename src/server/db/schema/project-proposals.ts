import { sql } from "drizzle-orm";
import {
  bigint,
  integer,
  jsonb,
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

export const proposalStatusEnum = pgEnum("proposal_status", [
  "draft",
  "sent",
  "commented",
  "accepted",
  "signed",
  "declined",
  "archived",
]);

export const proposalCommentStatusEnum = pgEnum("proposal_comment_status", [
  "open",
  "resolved",
]);

export const proposals = pgTable("proposals", {
  id: uuid().primaryKey().defaultRandom(),
  clientId: uuid()
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  projectId: uuid()
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: text().notNull(),
  version: text().notNull().default("v1"),
  status: proposalStatusEnum().notNull().default("draft"),
  currency: text().notNull().default("USD"),
  totalAmountCents: bigint({ mode: "number" }),
  contentJson: jsonb(),
  sourceAssetId: uuid().references(() => assets.id, { onDelete: "set null" }),
  renderedAssetId: uuid().references(() => assets.id, { onDelete: "set null" }),
  docusealTemplateId: text(),
  docusealTemplateSlug: text(),
  docusealSubmissionId: text(),
  docusealSubmissionStatus: text(),
  docusealSubmitterId: text(),
  docusealSubmitterSlug: text(),
  docusealSubmitterEmbedUrl: text(),
  lastWebhookEventId: text(),
  lastWebhookEventType: text(),
  lastWebhookPayload: jsonb(),
  lastWebhookReceivedAt: timestamp({ withTimezone: true }),
  sentAt: timestamp({ withTimezone: true }),
  signedAt: timestamp({ withTimezone: true }),
  declinedAt: timestamp({ withTimezone: true }),
  createdByAdminId: text().notNull(),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export const proposalComments = pgTable("proposal_comments", {
  id: uuid().primaryKey().defaultRandom(),
  clientId: uuid()
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  projectId: uuid()
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  proposalId: uuid()
    .notNull()
    .references(() => proposals.id, { onDelete: "cascade" }),
  authorUserId: text()
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  selectedText: text(),
  pageNumber: integer(),
  anchorJson: jsonb(),
  body: text().notNull(),
  status: proposalCommentStatusEnum().notNull().default("open"),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export type Proposal = typeof proposals.$inferSelect;
export type NewProposal = typeof proposals.$inferInsert;
export type ProposalComment = typeof proposalComments.$inferSelect;
export type NewProposalComment = typeof proposalComments.$inferInsert;
