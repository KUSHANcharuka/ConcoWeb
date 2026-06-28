import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { clients } from "./clients";
import { products } from "./products";
import { projects } from "./projects";

export const billingArtifactTypeEnum = pgEnum("billing_artifact_type", [
  "invoice",
  "payment_request",
]);

export const billingArtifactStatusEnum = pgEnum("billing_artifact_status", [
  "draft",
  "sent",
  "pending_payment",
  "proof_submitted",
  "paid",
  "overdue",
  "void",
]);

export const billingPlanKindEnum = pgEnum("billing_plan_kind", [
  "subscription",
  "prepaid_term",
  "milestone",
  "manual",
]);

export const billingPaymentMethodTypeEnum = pgEnum("billing_payment_method_type", [
  "stripe_payment_link",
  "us_wire_transfer",
  "lk_bank_transfer",
  "manual",
]);

export const billingAccessStatusEnum = pgEnum("billing_access_status", [
  "inactive",
  "active",
  "grace",
  "manual_override",
  "suspended",
]);

export const productAccountStatusEnum = pgEnum("product_account_status", [
  "pending",
  "active",
  "suspended",
  "disconnected",
]);

export const billingTemplateTypeEnum = pgEnum("billing_template_type", [
  "invoice",
  "agreement",
]);

export const webhookReconcileModeEnum = pgEnum("webhook_reconcile_mode", [
  "none",
  "manual",
  "periodic_pull",
  "push",
]);

export const projectBillingArtifacts = pgTable("project_billing_artifacts", {
  id: uuid().primaryKey().defaultRandom(),
  projectId: uuid()
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  clientId: uuid()
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  productId: uuid().references(() => products.id, { onDelete: "set null" }),
  artifactType: billingArtifactTypeEnum().notNull().default("invoice"),
  planKind: billingPlanKindEnum().notNull().default("manual"),
  status: billingArtifactStatusEnum().notNull().default("draft"),
  invoiceNumber: text().notNull().unique(),
  title: text().notNull(),
  description: text(),
  currency: text().notNull().default("USD"),
  subtotalAmount: integer().notNull().default(0),
  taxAmount: integer().notNull().default(0),
  discountAmount: integer().notNull().default(0),
  totalAmount: integer().notNull().default(0),
  issuedAt: timestamp({ withTimezone: true }),
  dueAt: timestamp({ withTimezone: true }),
  nextDueAt: timestamp({ withTimezone: true }),
  accessStartsAt: timestamp({ withTimezone: true }),
  accessExpiresAt: timestamp({ withTimezone: true }),
  terms: text(),
  notes: text(),
  sentAt: timestamp({ withTimezone: true }),
  paidAt: timestamp({ withTimezone: true }),
  createdByAdminId: text().notNull(),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export const billingLineItems = pgTable("billing_line_items", {
  id: uuid().primaryKey().defaultRandom(),
  artifactId: uuid()
    .notNull()
    .references(() => projectBillingArtifacts.id, { onDelete: "cascade" }),
  label: text().notNull(),
  description: text(),
  quantity: integer().notNull().default(1),
  unitAmount: integer().notNull().default(0),
  totalAmount: integer().notNull().default(0),
  sortOrder: integer().notNull().default(0),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export const paymentMethodConfigs = pgTable("payment_method_configs", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  methodType: billingPaymentMethodTypeEnum().notNull(),
  isActive: boolean().notNull().default(true),
  currency: text(),
  instructions: text(),
  paymentUrl: text(),
  accountName: text(),
  accountNumberMask: text(),
  routingNumberMask: text(),
  bankName: text(),
  metadata: jsonb().$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
  sortOrder: integer().notNull().default(0),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export const billingArtifactPaymentMethods = pgTable(
  "billing_artifact_payment_methods",
  {
    id: uuid().primaryKey().defaultRandom(),
    artifactId: uuid()
      .notNull()
      .references(() => projectBillingArtifacts.id, { onDelete: "cascade" }),
    configId: uuid().references(() => paymentMethodConfigs.id, {
      onDelete: "set null",
    }),
    methodType: billingPaymentMethodTypeEnum().notNull(),
    label: text().notNull(),
    instructions: text(),
    paymentUrl: text(),
    accountName: text(),
    accountNumberMask: text(),
    routingNumberMask: text(),
    bankName: text(),
    sortOrder: integer().notNull().default(0),
    createdAt: timestamp({ withTimezone: true })
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
);

export const projectBillingAccessStates = pgTable("project_billing_access_states", {
  id: uuid().primaryKey().defaultRandom(),
  projectId: uuid()
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" })
    .unique(),
  clientId: uuid()
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  sourceArtifactId: uuid().references(() => projectBillingArtifacts.id, {
    onDelete: "set null",
  }),
  status: billingAccessStatusEnum().notNull().default("inactive"),
  nextDueAt: timestamp({ withTimezone: true }),
  accessExpiresAt: timestamp({ withTimezone: true }),
  lastPaidAt: timestamp({ withTimezone: true }),
  overrideReason: text(),
  updatedByAdminId: text().notNull(),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export const projectProductAccounts = pgTable("project_product_accounts", {
  id: uuid().primaryKey().defaultRandom(),
  projectId: uuid()
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" })
    .unique(),
  clientId: uuid()
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  productId: uuid()
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  status: productAccountStatusEnum().notNull().default("pending"),
  externalAccountId: text(),
  externalWorkspaceId: text(),
  accountUrl: text(),
  statsSummary: jsonb().$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
  lastSyncedAt: timestamp({ withTimezone: true }),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export const billingTemplates = pgTable("billing_templates", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  templateType: billingTemplateTypeEnum().notNull(),
  description: text(),
  content: text().notNull(),
  isDefault: boolean().notNull().default(false),
  createdByAdminId: text().notNull(),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export const productWebhookConfigs = pgTable("product_webhook_configs", {
  id: uuid().primaryKey().defaultRandom(),
  productId: uuid()
    .notNull()
    .references(() => products.id, { onDelete: "cascade" })
    .unique(),
  webhookUrl: text(),
  webhookSecret: text(),
  payloadTemplate: jsonb().$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
  reconcileUrl: text(),
  reconcileMode: webhookReconcileModeEnum().notNull().default("manual"),
  isActive: boolean().notNull().default(true),
  createdAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

export type ProjectBillingArtifact = typeof projectBillingArtifacts.$inferSelect;
export type NewProjectBillingArtifact = typeof projectBillingArtifacts.$inferInsert;
