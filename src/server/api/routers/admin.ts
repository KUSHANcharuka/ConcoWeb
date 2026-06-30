import { and, asc, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { env } from "~/env";
import {
  billingHistoryFilterValues,
  matchesBillingHistoryFilter,
  summarizeBillingRows,
} from "~/lib/billing-history";
import { adminClientsRouter } from "~/server/api/routers/admin-clients";
import { adminEmailsRouter } from "~/server/api/routers/admin-emails";
import { adminNotificationsRouter } from "~/server/api/routers/admin-notifications";
import { adminNotificationSettingsRouter } from "~/server/api/routers/admin-notification-settings";
import { adminRequestsRouter } from "~/server/api/routers/admin-requests";
import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";
import {
  fromClerkClientRole,
  getClerkAdminClient,
  toClerkClientRole,
} from "~/server/clients/clerk";
import { assets } from "~/server/db/schema/assets";
import {
  billingArtifactDocumentRoleEnum,
  billingArtifactDocuments,
  billingAccessStatusEnum,
  billingArtifactPaymentMethods,
  billingArtifactStatusEnum,
  billingPaymentMethodTypeEnum,
  billingPlanKindEnum,
  billingTemplateTypeEnum,
  billingTemplates,
  paymentMethodConfigs,
  productWebhookConfigs,
  productWebhookDeliveryLogs,
  projectBillingAccessStates,
  projectBillingArtifacts,
  projectProductAccessStates,
  projectProductAccounts,
  webhookDeliveryStatusEnum,
  webhookReconcileModeEnum,
} from "~/server/db/schema/billing";
import { clients } from "~/server/db/schema/clients";
import { clientMemberships } from "~/server/db/schema/client-memberships";
import { emailSettings } from "~/server/db/schema/emails";
import {
  projectFiles,
  projectFileVisibilityEnum,
  projectFolders,
} from "~/server/db/schema/project-files";
import {
  proposalComments,
  proposalCommentStatusEnum,
  proposals,
  proposalStatusEnum,
} from "~/server/db/schema/project-proposals";
import {
  productBillingModeEnum,
  productKindEnum,
  products,
} from "~/server/db/schema/products";
import {
  projects,
  projectStatusEnum,
  projectTypeEnum,
} from "~/server/db/schema/projects";
import {
  projectTimelineItems,
  projectTimelineItemStatusEnum,
  projectTimelineItemTypeEnum,
} from "~/server/db/schema/project-timeline";
import {
  assertR2ObjectExists,
  buildBillingDocumentObjectKey,
  buildBillingProofObjectKey,
  buildBillingTemplateObjectKey,
  buildPaymentMethodImageObjectKey,
  buildProjectCoverObjectKey,
  buildProjectFileObjectKey,
  buildProposalSourceObjectKey,
  createAssetReadUrl,
  createPresignedUploadUrl,
} from "~/server/r2";
import {
  createDocusealTemplateSubmission,
  createDocusealBuilderToken,
  getDocusealSubmitters,
  getDocusealTemplate,
  getDocusealEmbedHost,
  isDocusealConfigured,
  resolveDocusealSubmitterUrl,
} from "~/server/docuseal";
import {
  assertValidFolderMove,
  ensureFolderScope,
  ensureProjectFileScope,
  ensureProjectScope,
  ensureProposalScope,
  ensureTimelineItemScope,
  getDescendantFolderIds,
  getProjectWorkspaceContext,
  loadProjectFiles,
  loadProjectFolderTree,
} from "~/server/projects/workspace";
import {
  sendInvoiceNotificationEmail,
  sendProposalNotificationEmail,
} from "~/server/emails/service";
import {
  attachSentEmailDelivery,
  recordNotificationEvent,
} from "~/server/notifications/service";
import {
  extendProjectProductAccess,
  getProductAccessContext,
  grantProjectProductAccess,
  revokeProjectProductAccess,
} from "~/server/product-access";

const projectStatusValues = projectStatusEnum.enumValues;
const projectTypeValues = projectTypeEnum.enumValues;
const timelineItemStatusValues = projectTimelineItemStatusEnum.enumValues;
const timelineItemTypeValues = projectTimelineItemTypeEnum.enumValues;
const proposalStatusValues = proposalStatusEnum.enumValues;
const proposalCommentStatusValues = proposalCommentStatusEnum.enumValues;
const projectFileVisibilityValues = projectFileVisibilityEnum.enumValues;
const billingPlanKindValues = billingPlanKindEnum.enumValues;
const billingArtifactStatusValues = billingArtifactStatusEnum.enumValues;
const billingAccessStatusValues = billingAccessStatusEnum.enumValues;
const billingTemplateTypeValues = billingTemplateTypeEnum.enumValues;
const billingPaymentMethodTypeValues = billingPaymentMethodTypeEnum.enumValues;
const billingArtifactDocumentRoleValues = billingArtifactDocumentRoleEnum.enumValues;
const webhookReconcileModeValues = webhookReconcileModeEnum.enumValues;
const webhookDeliveryStatusValues = webhookDeliveryStatusEnum.enumValues;
const productKindValues = productKindEnum.enumValues;
const productBillingModeValues = productBillingModeEnum.enumValues;

const createProjectSchema = z.object({
  clientId: z.string().uuid(),
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(8).max(600),
  projectType: z.enum(projectTypeValues),
  status: z.enum(projectStatusValues),
  currency: z.string().trim().min(3).max(8),
  productId: z.string().uuid().nullable().optional(),
  coverAssetId: z.string().uuid().nullable().optional(),
  startDate: z.string().date().nullable().optional(),
  targetLaunchDate: z.string().date().nullable().optional(),
});

const createProductSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  kind: z.enum(productKindValues),
  billingMode: z.enum(productBillingModeValues),
});

const listProjectsSchema = z.object({
  search: z.string().trim().max(120).default(""),
  clientIds: z.array(z.string().uuid()).default([]),
  statuses: z.array(z.enum(projectStatusValues)).default([]),
  projectTypes: z.array(z.enum(projectTypeValues)).default([]),
});

const billingHistoryListSchema = z.object({
  status: z.enum(billingHistoryFilterValues).default("all"),
});

const projectScopeSchema = z.object({
  projectId: z.string().uuid(),
});

const linkProjectProductSchema = projectScopeSchema.extend({
  productId: z.string().uuid(),
});

const createProjectCoverUploadSchema = z.object({
  clientId: z.string().uuid(),
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(120),
  sizeBytes: z.number().int().positive().max(10 * 1024 * 1024),
});

const billingArtifactDocumentInputSchema = z.object({
  role: z.enum(billingArtifactDocumentRoleValues),
  title: z.string().trim().min(1).max(160),
  templateId: z.string().uuid().nullable().optional(),
  sourceAssetId: z.string().uuid().nullable().optional(),
  isSignable: z.boolean().default(false),
});

const invoicePaymentMethodSelectionSchema = z.object({
  configId: z.string().uuid(),
  stripeCheckoutUrl: z.string().url().nullable().optional(),
});

const createInvoiceSchema = projectScopeSchema.extend({
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().max(400).nullable().optional(),
  planKind: z.enum(billingPlanKindValues),
  currency: z.string().trim().min(3).max(8),
  amount: z.number().int().positive().max(100_000_000),
  dueAt: z.string().datetime().nullable().optional(),
  nextDueAt: z.string().datetime().nullable().optional(),
  accessExpiresAt: z.string().datetime().nullable().optional(),
  terms: z.string().trim().max(8000).nullable().optional(),
  notes: z.string().trim().max(1000).nullable().optional(),
  paymentMethods: z.array(invoicePaymentMethodSelectionSchema).min(1).max(6),
  documents: z
    .array(billingArtifactDocumentInputSchema)
    .min(1)
    .max(2)
    .superRefine((documents, ctx) => {
      const roles = new Set(documents.map((document) => document.role));
      if (!roles.has("primary_invoice")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "A primary invoice document is required.",
        });
      }
    }),
});

const updateBillingArtifactStatusSchema = projectScopeSchema.extend({
  artifactId: z.string().uuid(),
  status: z.enum(billingArtifactStatusValues),
  accessStatus: z.enum(billingAccessStatusValues).nullable().optional(),
  nextDueAt: z.string().datetime().nullable().optional(),
  accessExpiresAt: z.string().datetime().nullable().optional(),
  overrideReason: z.string().trim().max(500).nullable().optional(),
});

const createBillingProofUploadSchema = projectScopeSchema.extend({
  artifactId: z.string().uuid(),
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(120),
  sizeBytes: z.number().int().positive().max(15 * 1024 * 1024),
});

const artifactScopeSchema = projectScopeSchema.extend({
  artifactId: z.string().uuid(),
});

const billingDocumentScopeSchema = artifactScopeSchema.extend({
  documentId: z.string().uuid(),
});

const createBillingDocumentUploadSchema = billingDocumentScopeSchema.extend({
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(120),
  sizeBytes: z.number().int().positive().max(20 * 1024 * 1024),
});

const updateBillingDocumentSchema = billingDocumentScopeSchema.extend({
  title: z.string().trim().min(1).max(160).optional(),
  templateId: z.string().uuid().nullable().optional(),
  docusealTemplateId: z.string().trim().max(120).nullable().optional(),
  docusealTemplateSlug: z.string().trim().max(160).nullable().optional(),
  sourceAssetId: z.string().uuid().nullable().optional(),
  isSignable: z.boolean().optional(),
});

const getBillingDocumentBuilderSchema = billingDocumentScopeSchema;

const createBillingDocumentSubmissionSchema = billingDocumentScopeSchema.extend({
  recipientMembershipIds: z.array(z.string().uuid()).min(1).max(10),
});

const createBillingTemplateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  templateType: z.enum(billingTemplateTypeValues),
  description: z.string().trim().max(300).nullable().optional(),
  sourceObjectKey: z.string().trim().max(500).nullable().optional(),
  sourceFileName: z.string().trim().max(255).nullable().optional(),
  sourceMimeType: z.string().trim().max(120).nullable().optional(),
  docusealTemplateId: z.string().trim().max(120).nullable().optional(),
  docusealTemplateSlug: z.string().trim().max(160).nullable().optional(),
  content: z.string().trim().min(1).max(20_000).default("Reusable billing PDF template."),
  isDefault: z.boolean().default(false),
});

const updateBillingTemplateSchema = createBillingTemplateSchema.extend({
  templateId: z.string().uuid(),
});

const createPaymentMethodConfigSchema = z.object({
  name: z.string().trim().min(2).max(120),
  methodType: z.enum(billingPaymentMethodTypeValues),
  imageObjectKey: z.string().trim().max(500).nullable().optional(),
  currency: z.string().trim().min(3).max(8).nullable().optional(),
  instructions: z.string().trim().max(2000).nullable().optional(),
  paymentUrl: z.string().url().nullable().optional(),
  accountName: z.string().trim().max(120).nullable().optional(),
  accountNumberMask: z.string().trim().max(32).nullable().optional(),
  routingNumberMask: z.string().trim().max(32).nullable().optional(),
  bankName: z.string().trim().max(120).nullable().optional(),
  isActive: z.boolean().default(true),
});

const updatePaymentMethodConfigSchema = createPaymentMethodConfigSchema.extend({
  paymentMethodId: z.string().uuid(),
});

const createPaymentMethodImageUploadSchema = z.object({
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(120),
  sizeBytes: z.number().int().positive().max(10 * 1024 * 1024),
});

const billingTemplateScopeSchema = z.object({
  templateId: z.string().uuid(),
});

const createBillingTemplateSourceUploadSchema = billingTemplateScopeSchema.extend({
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(120),
  sizeBytes: z.number().int().positive().max(20 * 1024 * 1024),
});

const upsertWebhookConfigSchema = z.object({
  productId: z.string().uuid(),
  webhookUrl: z.string().url().nullable().optional(),
  webhookSecret: z.string().trim().max(300).nullable().optional(),
  reconcileUrl: z.string().url().nullable().optional(),
  reconcileMode: z.enum(webhookReconcileModeValues),
  isActive: z.boolean().default(true),
  payloadTemplate: z.record(z.string(), z.any()).default({}),
});

const productScopeSchema = z.object({
  productId: z.string().uuid(),
});

const grantProductAccessSchema = projectScopeSchema.extend({
  accessExpiresAt: z.string().datetime(),
});

const extendProductAccessSchema = projectScopeSchema.extend({
  accessExpiresAt: z.string().datetime(),
});

const revokeProductAccessSchema = projectScopeSchema.extend({
  reason: z.string().trim().max(500).nullable().optional(),
});

const settingsProfileInviteSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  role: z.enum(["admin", "member"]),
});

const settingsProfileChangeRoleSchema = z.object({
  userId: z.string().trim().min(1),
  role: z.enum(["admin", "member"]),
});

const settingsProfileRemoveMemberSchema = z.object({
  userId: z.string().trim().min(1).nullable().optional(),
  invitationId: z.string().trim().min(1).nullable().optional(),
});

const settingsProfileResendInviteSchema = z.object({
  invitationId: z.string().trim().min(1),
  email: z.string().trim().email(),
  role: z.enum(["admin", "member"]),
  name: z.string().trim().max(120).nullable().optional(),
});

const timelineItemBaseSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2000).nullable().optional(),
  itemType: z.enum(timelineItemTypeValues),
  status: z.enum(timelineItemStatusValues),
  startsAt: z.string().trim().nullable().optional(),
  dueAt: z.string().trim().nullable().optional(),
  completedAt: z.string().trim().nullable().optional(),
  visibleToClient: z.boolean().default(true),
  layoutX: z.number().int(),
  layoutY: z.number().int(),
});

const createTimelineItemSchema = projectScopeSchema.extend(timelineItemBaseSchema.shape);

const updateTimelineItemSchema = projectScopeSchema.extend({
  itemId: z.string().uuid(),
  title: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(2000).nullable().optional(),
  itemType: z.enum(timelineItemTypeValues).optional(),
  status: z.enum(timelineItemStatusValues).optional(),
  startsAt: z.string().trim().nullable().optional(),
  dueAt: z.string().trim().nullable().optional(),
  completedAt: z.string().trim().nullable().optional(),
  visibleToClient: z.boolean().optional(),
});

const repositionTimelineItemSchema = projectScopeSchema.extend({
  itemId: z.string().uuid(),
  layoutX: z.number().int(),
  layoutY: z.number().int(),
});

const deleteTimelineItemSchema = projectScopeSchema.extend({
  itemId: z.string().uuid(),
});

const createProposalSchema = projectScopeSchema.extend({
  title: z.string().trim().min(1).max(160),
  version: z.string().trim().min(1).max(40).default("v1"),
  sourceAssetId: z.string().uuid().nullable().optional(),
});

const updateProposalSchema = projectScopeSchema.extend({
  proposalId: z.string().uuid(),
  title: z.string().trim().min(1).max(160).optional(),
  version: z.string().trim().min(1).max(40).optional(),
  sourceAssetId: z.string().uuid().nullable().optional(),
  docusealTemplateId: z.string().trim().nullable().optional(),
  docusealTemplateSlug: z.string().trim().nullable().optional(),
  docusealSubmissionId: z.string().trim().nullable().optional(),
  docusealSubmissionStatus: z.string().trim().nullable().optional(),
  docusealSubmitterId: z.string().trim().nullable().optional(),
  docusealSubmitterSlug: z.string().trim().nullable().optional(),
  docusealSubmitterEmbedUrl: z.string().trim().nullable().optional(),
  contentJson: z.record(z.string(), z.unknown()).nullable().optional(),
});

const addProposalCommentSchema = projectScopeSchema.extend({
  proposalId: z.string().uuid(),
  body: z.string().trim().min(1).max(2000),
  selectedText: z.string().trim().max(1000).nullable().optional(),
  pageNumber: z.number().int().positive().nullable().optional(),
  anchorJson: z.record(z.string(), z.unknown()).nullable().optional(),
});

const updateProposalCommentStatusSchema = projectScopeSchema.extend({
  proposalId: z.string().uuid(),
  commentId: z.string().uuid(),
  status: z.enum(proposalCommentStatusValues),
});

const createProposalSourceUploadSchema = projectScopeSchema.extend({
  proposalId: z.string().uuid(),
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(120),
  sizeBytes: z.number().int().positive().max(25 * 1024 * 1024),
});

const proposalReadAssetSchema = projectScopeSchema.extend({
  proposalId: z.string().uuid(),
  assetType: z.enum(["source"]),
});

const proposalBuilderTokenSchema = projectScopeSchema.extend({
  proposalId: z.string().uuid(),
});

const createProposalSubmissionSchema = projectScopeSchema.extend({
  proposalId: z.string().uuid(),
  recipientMembershipIds: z.array(z.string().uuid()).min(1),
});

const folderVisibilityDefault = "client_visible" as const;

const createFolderSchema = projectScopeSchema.extend({
  name: z.string().trim().min(1).max(120),
  parentFolderId: z.string().uuid().nullable().optional(),
  visibility: z.enum(projectFileVisibilityValues).default(folderVisibilityDefault),
});

const renameFolderSchema = projectScopeSchema.extend({
  folderId: z.string().uuid(),
  name: z.string().trim().min(1).max(120),
});

const deleteFolderSchema = projectScopeSchema.extend({
  folderId: z.string().uuid(),
});

const moveFolderSchema = projectScopeSchema.extend({
  folderId: z.string().uuid(),
  parentFolderId: z.string().uuid().nullable(),
});

const prepareProjectFileUploadSchema = projectScopeSchema.extend({
  folderId: z.string().uuid().nullable().optional(),
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(120),
  sizeBytes: z.number().int().positive().max(100 * 1024 * 1024),
});

const finalizeProjectFileUploadSchema = projectScopeSchema.extend({
  assetId: z.string().uuid(),
  folderId: z.string().uuid().nullable().optional(),
  fileName: z.string().trim().min(1).max(255),
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().max(2000).nullable().optional(),
  mimeType: z.string().trim().min(1).max(120),
  sizeBytes: z.number().int().positive().max(100 * 1024 * 1024),
  visibility: z.enum(projectFileVisibilityValues).default(folderVisibilityDefault),
});

const readProjectFileSchema = projectScopeSchema.extend({
  fileId: z.string().uuid(),
});

const renameProjectFileSchema = projectScopeSchema.extend({
  fileId: z.string().uuid(),
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().max(2000).nullable().optional(),
});

const deleteProjectFileSchema = projectScopeSchema.extend({
  fileId: z.string().uuid(),
});

const moveProjectFileSchema = projectScopeSchema.extend({
  fileId: z.string().uuid(),
  folderId: z.string().uuid().nullable(),
});

function parseOptionalTimestamp(value?: string | null) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid date or time value.",
    });
  }
  return parsed;
}

function assertProposalIsDraft(
  proposal: {
    status: string;
  },
  message = "Only draft proposals can be edited.",
) {
  if (proposal.status !== "draft") {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message,
    });
  }
}

function hasDocusealSigningPreviewMetadata(input: {
  docusealSubmissionId?: string | null;
  docusealSubmitterSlug?: string | null;
  docusealSubmitterEmbedUrl?: string | null;
}) {
  return Boolean(
    input.docusealSubmissionId &&
      (input.docusealSubmitterEmbedUrl || input.docusealSubmitterSlug),
  );
}

async function ensureClientExists(
  db: typeof import("~/server/db").db,
  clientId: string,
) {
  const [client] = await db
    .select({
      id: clients.id,
      baseCurrency: clients.baseCurrency,
    })
    .from(clients)
    .where(eq(clients.id, clientId))
    .limit(1);

  if (!client) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Client not found." });
  }

  return client;
}

async function ensureAssetBelongsToClient(
  db: typeof import("~/server/db").db,
  input: {
    assetId: string;
    clientId: string;
    projectId?: string | null;
  },
) {
  const [asset] = await db
    .select({
      id: assets.id,
      clientId: assets.clientId,
      projectId: assets.projectId,
      objectKey: assets.objectKey,
      deletedAt: assets.deletedAt,
    })
    .from(assets)
    .where(eq(assets.id, input.assetId))
    .limit(1);

  if (!asset || asset.deletedAt) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Selected asset is unavailable.",
    });
  }

  if (asset.clientId !== input.clientId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Selected asset does not belong to the project client.",
    });
  }

  if (input.projectId && asset.projectId && asset.projectId !== input.projectId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Selected asset belongs to another project.",
    });
  }

  return asset;
}

async function ensureProjectExists(
  db: typeof import("~/server/db").db,
  projectId: string,
) {
  const [project] = await db
    .select({
      id: projects.id,
      name: projects.name,
      clientId: projects.clientId,
      productId: projects.productId,
      currency: projects.currency,
      description: projects.description,
      projectType: projects.projectType,
      status: projects.status,
      targetLaunchDate: projects.targetLaunchDate,
      startDate: projects.startDate,
      clientName: clients.name,
      clientBaseCurrency: clients.baseCurrency,
      productName: products.name,
    })
    .from(projects)
    .innerJoin(clients, eq(projects.clientId, clients.id))
    .leftJoin(products, eq(projects.productId, products.id))
    .where(eq(projects.id, projectId))
    .limit(1);

  if (!project) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });
  }

  return project;
}

async function ensureBillingArtifactExists(
  db: typeof import("~/server/db").db,
  input: {
    artifactId: string;
    projectId: string;
  },
) {
  const [artifact] = await db
    .select()
    .from(projectBillingArtifacts)
    .where(
      and(
        eq(projectBillingArtifacts.id, input.artifactId),
        eq(projectBillingArtifacts.projectId, input.projectId),
      ),
    )
    .limit(1);

  if (!artifact) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Billing artifact not found for this project.",
    });
  }

  return artifact;
}

async function ensureBillingArtifactDocumentExists(
  db: typeof import("~/server/db").db,
  input: {
    documentId: string;
    artifactId: string;
  },
) {
  const [document] = await db
    .select()
    .from(billingArtifactDocuments)
    .where(
      and(
        eq(billingArtifactDocuments.id, input.documentId),
        eq(billingArtifactDocuments.artifactId, input.artifactId),
      ),
    )
    .limit(1);

  if (!document) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Billing document not found for this invoice.",
    });
  }

  return document;
}

function toDateOrNull(value: string | null | undefined) {
  return value ? new Date(value) : null;
}

function buildInvoiceNumber(projectId: string) {
  const today = new Date();
  const stamp = today.toISOString().slice(0, 10).replace(/-/g, "");
  return `INV-${stamp}-${projectId.slice(0, 6).toUpperCase()}-${randomUUID().slice(0, 4).toUpperCase()}`;
}

async function safeAssetReadUrl(objectKey: string) {
  try {
    return await createAssetReadUrl({ objectKey, preferPublic: true });
  } catch {
    return null;
  }
}

function normalizeBillingTemplateLabel(templateType: "invoice" | "agreement") {
  return templateType === "agreement" ? "Terms & Conditions" : "Invoice";
}

function formatClerkDisplayName(input: {
  firstName?: string | null;
  lastName?: string | null;
  identifier?: string | null;
}) {
  const fullName = [input.firstName, input.lastName].filter(Boolean).join(" ").trim();
  return fullName || input.identifier || "Unknown member";
}

function maskSecret(value: string | null | undefined) {
  if (!value) return null;
  return `${"*".repeat(Math.max(4, Math.min(12, value.length)))}${value.slice(-4)}`;
}

export const adminRouter = createTRPCRouter({
  me: adminProcedure.query(({ ctx }) => {
    return {
      userId: ctx.session.userId,
      role: "admin" as const,
    };
  }),

  clients: adminClientsRouter,

  emails: adminEmailsRouter,

  notifications: adminNotificationsRouter,

  notificationSettings: adminNotificationSettingsRouter,

  requests: adminRequestsRouter,

  billing: createTRPCRouter({
    listAll: adminProcedure
      .input(billingHistoryListSchema)
      .query(async ({ ctx, input }) => {
        const artifactRows = await ctx.db
          .select({
            id: projectBillingArtifacts.id,
            projectId: projectBillingArtifacts.projectId,
            clientId: projectBillingArtifacts.clientId,
            invoiceNumber: projectBillingArtifacts.invoiceNumber,
            title: projectBillingArtifacts.title,
            status: projectBillingArtifacts.status,
            currency: projectBillingArtifacts.currency,
            totalAmount: projectBillingArtifacts.totalAmount,
            dueAt: projectBillingArtifacts.dueAt,
            paidAt: projectBillingArtifacts.paidAt,
            createdAt: projectBillingArtifacts.createdAt,
            projectName: projects.name,
            clientName: clients.name,
          })
          .from(projectBillingArtifacts)
          .innerJoin(projects, eq(projectBillingArtifacts.projectId, projects.id))
          .innerJoin(clients, eq(projectBillingArtifacts.clientId, clients.id))
          .orderBy(desc(projectBillingArtifacts.createdAt));

        const summary = summarizeBillingRows(artifactRows);
        const invoices = artifactRows.filter((artifact) =>
          matchesBillingHistoryFilter(artifact.status, input.status),
        );

        return {
          summary,
          invoices,
        };
      }),
  }),

  products: createTRPCRouter({
    options: adminProcedure.query(async ({ ctx }) => {
      return ctx.db
        .select({
          id: products.id,
          name: products.name,
          kind: products.kind,
        })
        .from(products)
        .where(eq(products.status, "active"))
        .orderBy(asc(products.name));
    }),

    create: adminProcedure
      .input(createProductSchema)
      .mutation(async ({ ctx, input }) => {
        const [existing] = await ctx.db
          .select({ id: products.id })
          .from(products)
          .where(eq(products.slug, input.slug))
          .limit(1);

        if (existing) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A product with that slug already exists.",
          });
        }

        const [created] = await ctx.db
          .insert(products)
          .values({
            name: input.name,
            slug: input.slug,
            kind: input.kind,
            billingMode: input.billingMode,
            status: "active",
          })
          .returning();

        return created;
      }),
  }),

  assets: createTRPCRouter({
    createProjectCoverUpload: adminProcedure
      .input(createProjectCoverUploadSchema)
      .mutation(async ({ ctx, input }) => {
        const client = await ensureClientExists(ctx.db, input.clientId);

        if (!input.mimeType.startsWith("image/")) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Project covers must be images.",
          });
        }

        const assetId = randomUUID();
        const objectKey = buildProjectCoverObjectKey(
          assetId,
          input.clientId,
          input.fileName,
        );
        const { bucket, uploadUrl } = await createPresignedUploadUrl({
          objectKey,
          contentType: input.mimeType,
        });

        await ctx.db.insert(assets).values({
          id: assetId,
          clientId: input.clientId,
          uploadedByUserId: ctx.session.userId,
          bucket,
          objectKey,
          fileName: input.fileName,
          displayName: input.fileName,
          mimeType: input.mimeType,
          sizeBytes: input.sizeBytes,
          assetType: "image",
          visibility: "client_visible",
          scopeType: "unscoped",
        });

        return {
          assetId,
          uploadUrl,
          bucket,
          objectKey,
          defaultCurrency: client.baseCurrency,
        };
      }),
  }),

  projects: createTRPCRouter({
    list: adminProcedure
      .input(listProjectsSchema)
      .query(async ({ ctx, input }) => {
        const filters = [];

        const search = input.search.trim();
        if (search.length > 0) {
          filters.push(
            or(
              ilike(projects.name, `%${search}%`),
              ilike(projects.description, `%${search}%`),
              ilike(clients.name, `%${search}%`),
            ),
          );
        }

        if (input.clientIds.length > 0) {
          filters.push(inArray(projects.clientId, input.clientIds));
        }

        if (input.statuses.length > 0) {
          filters.push(inArray(projects.status, input.statuses));
        }

        if (input.projectTypes.length > 0) {
          filters.push(inArray(projects.projectType, input.projectTypes));
        }

        const rows = await ctx.db
          .select({
            id: projects.id,
            name: projects.name,
            description: projects.description,
            projectType: projects.projectType,
            status: projects.status,
            visibility: projects.visibility,
            currency: projects.currency,
            startDate: projects.startDate,
            targetLaunchDate: projects.targetLaunchDate,
            createdAt: projects.createdAt,
            clientId: clients.id,
            clientName: clients.name,
            clientBaseCurrency: clients.baseCurrency,
            coverAssetId: assets.id,
            coverObjectKey: assets.objectKey,
          })
          .from(projects)
          .innerJoin(clients, eq(projects.clientId, clients.id))
          .leftJoin(assets, eq(projects.coverAssetId, assets.id))
          .where(filters.length > 0 ? and(...filters) : undefined)
          .orderBy(desc(projects.createdAt));

        const coverUrlByAssetId = new Map<string, string>();
        const coverAssets = rows.filter((row) => row.coverAssetId && row.coverObjectKey);

        await Promise.all(
          coverAssets.map(async (row) => {
            if (!row.coverAssetId || !row.coverObjectKey) {
              return;
            }

            try {
              const coverUrl = await createAssetReadUrl({
                objectKey: row.coverObjectKey,
                preferPublic: true,
              });
              coverUrlByAssetId.set(row.coverAssetId, coverUrl);
            } catch {
              // Asset storage is optional in dev; leave coverUrl undefined.
            }
          }),
        );

        return rows.map((row) => ({
          id: row.id,
          name: row.name,
          description: row.description,
          projectType: row.projectType,
          status: row.status,
          visibility: row.visibility,
          currency: row.currency,
          startDate: row.startDate,
          targetLaunchDate: row.targetLaunchDate,
          createdAt: row.createdAt,
          client: {
            id: row.clientId,
            name: row.clientName,
            baseCurrency: row.clientBaseCurrency,
          },
          coverAssetId: row.coverAssetId,
          coverUrl: row.coverAssetId
            ? coverUrlByAssetId.get(row.coverAssetId) ?? null
            : null,
        }));
      }),

    byId: adminProcedure.input(projectScopeSchema).query(async ({ ctx, input }) => {
      const project = await ensureProjectExists(ctx.db, input.projectId);

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        projectType: project.projectType,
        status: project.status,
        currency: project.currency,
        startDate: project.startDate,
        targetLaunchDate: project.targetLaunchDate,
        client: {
          id: project.clientId,
          name: project.clientName,
          baseCurrency: project.clientBaseCurrency,
        },
        product: project.productId
          ? { id: project.productId, name: project.productName ?? "Linked product" }
          : null,
        coverUrl: null,
      };
    }),

    create: adminProcedure
      .input(createProjectSchema)
      .mutation(async ({ ctx, input }) => {
        await ensureClientExists(ctx.db, input.clientId);

        if (input.coverAssetId) {
          await ensureAssetBelongsToClient(ctx.db, {
            assetId: input.coverAssetId,
            clientId: input.clientId,
          });
        }

        const [createdProject] = await ctx.db
          .insert(projects)
          .values({
            clientId: input.clientId,
            productId: input.productId ?? null,
            name: input.name,
            description: input.description,
            projectType: input.projectType,
            status: input.status,
            visibility: "visible",
            currency: input.currency.toUpperCase(),
            coverAssetId: input.coverAssetId ?? null,
            startDate: input.startDate ?? null,
            targetLaunchDate: input.targetLaunchDate ?? null,
            createdByAdminId: ctx.session.userId,
          })
          .returning({
            id: projects.id,
            name: projects.name,
            clientId: projects.clientId,
            productId: projects.productId,
            currency: projects.currency,
          });

        if (!createdProject) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create project.",
          });
        }

        if (input.coverAssetId) {
          await ctx.db
            .update(assets)
            .set({
              projectId: createdProject.id,
              scopeType: "project",
              scopeId: createdProject.id,
              updatedAt: new Date(),
            })
            .where(eq(assets.id, input.coverAssetId));
        }

        await ctx.db.insert(projectBillingAccessStates).values({
          projectId: createdProject.id,
          clientId: createdProject.clientId,
          status: "inactive",
          nextDueAt: null,
          accessExpiresAt: null,
          updatedByAdminId: ctx.session.userId,
        });

        if (createdProject.productId) {
          await ctx.db.insert(projectProductAccounts).values({
            projectId: createdProject.id,
            clientId: createdProject.clientId,
            productId: createdProject.productId,
            status: "pending",
          });
          await ctx.db.insert(projectProductAccessStates).values({
            projectId: createdProject.id,
            clientId: createdProject.clientId,
            productId: createdProject.productId,
            accessState: "pending",
            syncStatus: "pending",
            lastSource: "admin_action",
          });
        }

        return createdProject;
      }),

    linkProduct: adminProcedure
      .input(linkProjectProductSchema)
      .mutation(async ({ ctx, input }) => {
        const project = await ensureProjectExists(ctx.db, input.projectId);

        const [product] = await ctx.db
          .select({
            id: products.id,
            name: products.name,
            status: products.status,
          })
          .from(products)
          .where(eq(products.id, input.productId))
          .limit(1);

        if (!product) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Product not found.",
          });
        }

        if (project.productId === input.productId) {
          return {
            id: project.id,
            product: {
              id: product.id,
              name: product.name,
            },
          };
        }

        if (project.productId) {
          throw new TRPCError({
            code: "CONFLICT",
            message:
              "This project already has a linked product. Re-linking is not supported in this flow yet.",
          });
        }

        await ctx.db
          .update(projects)
          .set({
            productId: input.productId,
            updatedAt: new Date(),
          })
          .where(eq(projects.id, input.projectId));

        const [existingAccount] = await ctx.db
          .select({ id: projectProductAccounts.id })
          .from(projectProductAccounts)
          .where(eq(projectProductAccounts.projectId, input.projectId))
          .limit(1);

        if (existingAccount) {
          await ctx.db
            .update(projectProductAccounts)
            .set({
              productId: input.productId,
              status: "pending",
              updatedAt: new Date(),
            })
            .where(eq(projectProductAccounts.id, existingAccount.id));
        } else {
          await ctx.db.insert(projectProductAccounts).values({
            projectId: input.projectId,
            clientId: project.clientId,
            productId: input.productId,
            status: "pending",
          });
        }

        const [existingAccessState] = await ctx.db
          .select({ id: projectProductAccessStates.id })
          .from(projectProductAccessStates)
          .where(eq(projectProductAccessStates.projectId, input.projectId))
          .limit(1);

        if (existingAccessState) {
          await ctx.db
            .update(projectProductAccessStates)
            .set({
              productId: input.productId,
              accessState: "pending",
              syncStatus: "pending",
              grantedAt: null,
              accessExpiresAt: null,
              revokedAt: null,
              revokedReason: null,
              lastSource: "admin_action",
              lastWebhookEventType: null,
              lastWebhookSentAt: null,
              lastWebhookDeliveredAt: null,
              lastWebhookError: null,
              updatedAt: new Date(),
            })
            .where(eq(projectProductAccessStates.id, existingAccessState.id));
        } else {
          await ctx.db.insert(projectProductAccessStates).values({
            projectId: input.projectId,
            clientId: project.clientId,
            productId: input.productId,
            accessState: "pending",
            syncStatus: "pending",
            lastSource: "admin_action",
          });
        }

        return {
          id: project.id,
          product: {
            id: product.id,
            name: product.name,
          },
        };
      }),
  }),

  projectWorkspace: createTRPCRouter({
    context: adminProcedure
      .input(projectScopeSchema)
      .query(async ({ ctx, input }) => {
        return getProjectWorkspaceContext(ctx.db, input.projectId);
      }),

    overview: adminProcedure
      .input(projectScopeSchema)
      .query(async ({ ctx, input }) => {
        const workspace = await getProjectWorkspaceContext(ctx.db, input.projectId);

        const [timelineRows, proposalRows, fileRows] = await Promise.all([
          ctx.db
            .select({
              id: projectTimelineItems.id,
              title: projectTimelineItems.title,
              status: projectTimelineItems.status,
              itemType: projectTimelineItems.itemType,
              startsAt: projectTimelineItems.startsAt,
              dueAt: projectTimelineItems.dueAt,
              completedAt: projectTimelineItems.completedAt,
              visibleToClient: projectTimelineItems.visibleToClient,
            })
            .from(projectTimelineItems)
            .where(eq(projectTimelineItems.projectId, input.projectId))
            .orderBy(asc(projectTimelineItems.sortOrder), asc(projectTimelineItems.dueAt)),
          ctx.db
            .select({
              id: proposals.id,
              title: proposals.title,
              status: proposals.status,
              sentAt: proposals.sentAt,
              signedAt: proposals.signedAt,
              updatedAt: proposals.updatedAt,
            })
            .from(proposals)
            .where(eq(proposals.projectId, input.projectId))
            .orderBy(desc(proposals.updatedAt)),
          ctx.db
            .select({
              id: projectFiles.id,
            })
            .from(projectFiles)
            .where(eq(projectFiles.projectId, input.projectId)),
        ]);

        const currentTimelineItem =
          timelineRows.find((item) => item.status === "current") ??
          timelineRows.find((item) => item.status === "planned") ??
          timelineRows[0] ??
          null;

        const latestProposal = proposalRows[0] ?? null;

        return {
          project: workspace,
          metrics: {
            fileCount: fileRows.length,
            timelineCount: timelineRows.length,
            proposalCount: proposalRows.length,
          },
          currentTimelineItem,
          latestProposal,
        };
      }),
  }),

  timeline: createTRPCRouter({
    list: adminProcedure
      .input(projectScopeSchema)
      .query(async ({ ctx, input }) => {
        await ensureProjectScope(ctx.db, input.projectId);

        return ctx.db
          .select({
            id: projectTimelineItems.id,
            title: projectTimelineItems.title,
            description: projectTimelineItems.description,
            itemType: projectTimelineItems.itemType,
            status: projectTimelineItems.status,
            startsAt: projectTimelineItems.startsAt,
            dueAt: projectTimelineItems.dueAt,
            completedAt: projectTimelineItems.completedAt,
            sortOrder: projectTimelineItems.sortOrder,
            visibleToClient: projectTimelineItems.visibleToClient,
            layoutX: projectTimelineItems.layoutX,
            layoutY: projectTimelineItems.layoutY,
            createdAt: projectTimelineItems.createdAt,
            updatedAt: projectTimelineItems.updatedAt,
          })
          .from(projectTimelineItems)
          .where(eq(projectTimelineItems.projectId, input.projectId))
          .orderBy(
            asc(projectTimelineItems.sortOrder),
            asc(projectTimelineItems.dueAt),
            asc(projectTimelineItems.createdAt),
          );
      }),

    create: adminProcedure
      .input(createTimelineItemSchema)
      .mutation(async ({ ctx, input }) => {
        const project = await ensureProjectScope(ctx.db, input.projectId);
        const existingItems = await ctx.db
          .select({
            id: projectTimelineItems.id,
          })
          .from(projectTimelineItems)
          .where(eq(projectTimelineItems.projectId, input.projectId));

        const [createdItem] = await ctx.db
          .insert(projectTimelineItems)
          .values({
            clientId: project.clientId,
            projectId: input.projectId,
            title: input.title,
            description: input.description ?? null,
            itemType: input.itemType,
            status: input.status,
            startsAt: parseOptionalTimestamp(input.startsAt),
            dueAt: parseOptionalTimestamp(input.dueAt),
            completedAt: parseOptionalTimestamp(input.completedAt),
            sortOrder: existingItems.length,
            visibleToClient: input.visibleToClient,
            layoutX: input.layoutX,
            layoutY: input.layoutY,
            createdByUserId: ctx.session.userId,
          })
          .returning();

        return createdItem;
      }),

    update: adminProcedure
      .input(updateTimelineItemSchema)
      .mutation(async ({ ctx, input }) => {
        await ensureTimelineItemScope(ctx.db, input.itemId, input.projectId);

        const [updatedItem] = await ctx.db
          .update(projectTimelineItems)
          .set({
            title: input.title,
            description: input.description,
            itemType: input.itemType,
            status: input.status,
            startsAt:
              input.startsAt === undefined
                ? undefined
                : parseOptionalTimestamp(input.startsAt),
            dueAt:
              input.dueAt === undefined
                ? undefined
                : parseOptionalTimestamp(input.dueAt),
            completedAt:
              input.completedAt === undefined
                ? undefined
                : parseOptionalTimestamp(input.completedAt),
            visibleToClient: input.visibleToClient,
            updatedAt: new Date(),
          })
          .where(eq(projectTimelineItems.id, input.itemId))
          .returning();

        return updatedItem;
      }),

    reposition: adminProcedure
      .input(repositionTimelineItemSchema)
      .mutation(async ({ ctx, input }) => {
        await ensureTimelineItemScope(ctx.db, input.itemId, input.projectId);

        const [updatedItem] = await ctx.db
          .update(projectTimelineItems)
          .set({
            layoutX: input.layoutX,
            layoutY: input.layoutY,
            updatedAt: new Date(),
          })
          .where(eq(projectTimelineItems.id, input.itemId))
          .returning();

        return updatedItem;
      }),

    delete: adminProcedure
      .input(deleteTimelineItemSchema)
      .mutation(async ({ ctx, input }) => {
        await ensureTimelineItemScope(ctx.db, input.itemId, input.projectId);
        await ctx.db.delete(projectTimelineItems).where(eq(projectTimelineItems.id, input.itemId));
        return { success: true };
      }),
  }),

  proposals: createTRPCRouter({
    list: adminProcedure
      .input(projectScopeSchema)
      .query(async ({ ctx, input }) => {
        await ensureProjectScope(ctx.db, input.projectId);

        const proposalRows = await ctx.db
          .select({
            id: proposals.id,
            title: proposals.title,
            version: proposals.version,
            status: proposals.status,
            sourceAssetId: proposals.sourceAssetId,
            docusealTemplateId: proposals.docusealTemplateId,
            docusealSubmissionId: proposals.docusealSubmissionId,
            docusealSubmitterSlug: proposals.docusealSubmitterSlug,
            docusealSubmitterEmbedUrl: proposals.docusealSubmitterEmbedUrl,
            sentAt: proposals.sentAt,
            signedAt: proposals.signedAt,
            declinedAt: proposals.declinedAt,
            createdAt: proposals.createdAt,
            updatedAt: proposals.updatedAt,
            commentCount: sql<number>`(
              select count(*)
              from ${proposalComments}
              where ${proposalComments.proposalId} = ${proposals.id}
            )`,
          })
          .from(proposals)
          .where(eq(proposals.projectId, input.projectId))
          .orderBy(desc(proposals.updatedAt));

        return proposalRows.map((proposal) => ({
          ...proposal,
          docusealSubmitterEmbedUrl: resolveDocusealSubmitterUrl({
            embedUrl: proposal.docusealSubmitterEmbedUrl,
            slug: proposal.docusealSubmitterSlug,
          }),
        }));
      }),

    get: adminProcedure
      .input(
        projectScopeSchema.extend({
          proposalId: z.string().uuid(),
        }),
      )
      .query(async ({ ctx, input }) => {
        const proposal = await ensureProposalScope(ctx.db, input.proposalId, input.projectId);

        const [detail] = await ctx.db
          .select()
          .from(proposals)
          .where(eq(proposals.id, proposal.id))
          .limit(1);

        const comments = await ctx.db
          .select({
            id: proposalComments.id,
            authorUserId: proposalComments.authorUserId,
            body: proposalComments.body,
            selectedText: proposalComments.selectedText,
            pageNumber: proposalComments.pageNumber,
            anchorJson: proposalComments.anchorJson,
            status: proposalComments.status,
            createdAt: proposalComments.createdAt,
            updatedAt: proposalComments.updatedAt,
          })
          .from(proposalComments)
          .where(eq(proposalComments.proposalId, proposal.id))
          .orderBy(desc(proposalComments.createdAt));

        return {
          proposal: detail
            ? {
                ...detail,
                docusealSubmitterEmbedUrl: resolveDocusealSubmitterUrl({
                  embedUrl: detail.docusealSubmitterEmbedUrl,
                  slug: detail.docusealSubmitterSlug,
                }),
              }
            : detail,
          comments: proposal.status === "draft" ? [] : comments,
        };
      }),

    listRecipients: adminProcedure
      .input(projectScopeSchema)
      .query(async ({ ctx, input }) => {
        const project = await ensureProjectScope(ctx.db, input.projectId);

        return ctx.db
          .select({
            id: clientMemberships.id,
            userId: clientMemberships.userId,
            email: clientMemberships.email,
            jobTitle: clientMemberships.jobTitle,
            role: clientMemberships.role,
            joinedAt: clientMemberships.joinedAt,
          })
          .from(clientMemberships)
          .where(
            and(
              eq(clientMemberships.clientId, project.clientId),
              eq(clientMemberships.status, "active"),
            ),
          )
          .orderBy(asc(clientMemberships.role), asc(clientMemberships.email));
      }),

    create: adminProcedure
      .input(createProposalSchema)
      .mutation(async ({ ctx, input }) => {
        const project = await ensureProjectScope(ctx.db, input.projectId);
        if (input.sourceAssetId) {
          await ensureAssetBelongsToClient(ctx.db, {
            assetId: input.sourceAssetId,
            clientId: project.clientId,
            projectId: input.projectId,
          });
        }

        const [createdProposal] = await ctx.db
          .insert(proposals)
          .values({
            clientId: project.clientId,
            projectId: input.projectId,
            title: input.title,
            version: input.version,
            status: "draft",
            sourceAssetId: input.sourceAssetId ?? null,
            createdByAdminId: ctx.session.userId,
          })
          .returning({
            id: proposals.id,
            title: proposals.title,
          });

        if (input.sourceAssetId) {
          await ctx.db
            .update(assets)
            .set({
              projectId: input.projectId,
              scopeType: "proposal",
              scopeId: createdProposal.id,
              updatedAt: new Date(),
            })
            .where(eq(assets.id, input.sourceAssetId));
        }

        return createdProposal;
      }),

    update: adminProcedure
      .input(updateProposalSchema)
      .mutation(async ({ ctx, input }) => {
        const proposal = await ensureProposalScope(ctx.db, input.proposalId, input.projectId);
        assertProposalIsDraft(
          proposal,
          "Sent proposals are immutable. Duplicate the proposal to create a new draft revision.",
        );
        if (input.sourceAssetId) {
          await ensureAssetBelongsToClient(ctx.db, {
            assetId: input.sourceAssetId,
            clientId: proposal.clientId,
            projectId: input.projectId,
          });
        }

        const [updatedProposal] = await ctx.db
          .update(proposals)
          .set({
            title: input.title,
            version: input.version,
            sourceAssetId:
              input.sourceAssetId === undefined ? undefined : input.sourceAssetId,
            docusealTemplateId:
              input.docusealTemplateId === undefined
                ? undefined
                : input.docusealTemplateId,
            docusealTemplateSlug:
              input.docusealTemplateSlug === undefined
                ? undefined
                : input.docusealTemplateSlug,
            docusealSubmissionId:
              input.docusealSubmissionId === undefined
                ? undefined
                : input.docusealSubmissionId,
            docusealSubmissionStatus:
              input.docusealSubmissionStatus === undefined
                ? undefined
                : input.docusealSubmissionStatus,
            docusealSubmitterId:
              input.docusealSubmitterId === undefined
                ? undefined
                : input.docusealSubmitterId,
            docusealSubmitterSlug:
              input.docusealSubmitterSlug === undefined
                ? undefined
                : input.docusealSubmitterSlug,
            docusealSubmitterEmbedUrl:
              input.docusealSubmitterEmbedUrl === undefined
                ? undefined
                : input.docusealSubmitterEmbedUrl,
            contentJson:
              input.contentJson === undefined ? undefined : input.contentJson,
            updatedAt: new Date(),
          })
          .where(eq(proposals.id, input.proposalId))
          .returning();

        if (input.sourceAssetId) {
          await ctx.db
            .update(assets)
            .set({
              projectId: input.projectId,
              scopeType: "proposal",
              scopeId: proposal.id,
              updatedAt: new Date(),
            })
            .where(eq(assets.id, input.sourceAssetId));
        }

        return updatedProposal;
      }),

    duplicate: adminProcedure
      .input(
        projectScopeSchema.extend({
          proposalId: z.string().uuid(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const proposal = await ensureProposalScope(ctx.db, input.proposalId, input.projectId);

        const [sourceProposal] = await ctx.db
          .select()
          .from(proposals)
          .where(eq(proposals.id, proposal.id))
          .limit(1);

        if (!sourceProposal) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Proposal not found.",
          });
        }

        const [duplicatedProposal] = await ctx.db
          .insert(proposals)
          .values({
            clientId: sourceProposal.clientId,
            projectId: sourceProposal.projectId,
            title: `${sourceProposal.title} copy`,
            version: sourceProposal.version,
            status: "draft",
            contentJson: sourceProposal.contentJson,
            sourceAssetId: sourceProposal.sourceAssetId,
            docusealTemplateId: sourceProposal.docusealTemplateId,
            docusealTemplateSlug: sourceProposal.docusealTemplateSlug,
            docusealSubmissionId: null,
            docusealSubmissionStatus: null,
            docusealSubmitterId: null,
            docusealSubmitterSlug: null,
            docusealSubmitterEmbedUrl: null,
            lastWebhookEventId: null,
            lastWebhookReceivedAt: null,
            sentAt: null,
            signedAt: null,
            declinedAt: null,
            createdByAdminId: ctx.session.userId,
            updatedAt: new Date(),
          })
          .returning({
            id: proposals.id,
          });

        if (!duplicatedProposal) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Unable to duplicate proposal.",
          });
        }

        return duplicatedProposal;
      }),

    addComment: adminProcedure
      .input(addProposalCommentSchema)
      .mutation(async ({ ctx, input }) => {
        const proposal = await ensureProposalScope(ctx.db, input.proposalId, input.projectId);
        if (proposal.status === "draft") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Comments become available after a proposal is sent.",
          });
        }

        const [createdComment] = await ctx.db
          .insert(proposalComments)
          .values({
            clientId: proposal.clientId,
            projectId: input.projectId,
            proposalId: proposal.id,
            authorUserId: ctx.session.userId,
            body: input.body,
            selectedText: input.selectedText ?? null,
            pageNumber: input.pageNumber ?? null,
            anchorJson: input.anchorJson ?? null,
            status: "open",
          })
          .returning();

        await ctx.db
          .update(proposals)
          .set({
            status:
              proposal.status === "signed" || proposal.status === "declined"
                ? proposal.status
                : "commented",
            updatedAt: new Date(),
          })
          .where(eq(proposals.id, proposal.id));

        await recordNotificationEvent(ctx.db, {
          eventType: "proposal.comment_added",
          actorUserId: ctx.session.userId,
          clientId: proposal.clientId,
          projectId: input.projectId,
          entityType: "proposal",
          entityId: proposal.id,
          payload: {
            projectName: proposal.title,
            proposalTitle: proposal.title,
            commentBody: input.body,
          },
          audiences: [{ kind: "client_members", clientId: proposal.clientId }],
          href: `/client-portal/projects/${input.projectId}/proposals/${proposal.id}`,
        });

        return createdComment;
      }),

    updateCommentStatus: adminProcedure
      .input(updateProposalCommentStatusSchema)
      .mutation(async ({ ctx, input }) => {
        const proposal = await ensureProposalScope(ctx.db, input.proposalId, input.projectId);
        if (proposal.status === "draft") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Comments become available after a proposal is sent.",
          });
        }

        const [updatedComment] = await ctx.db
          .update(proposalComments)
          .set({
            status: input.status,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(proposalComments.id, input.commentId),
              eq(proposalComments.proposalId, input.proposalId),
            ),
          )
          .returning();

        if (!updatedComment) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Proposal comment not found.",
          });
        }

        return updatedComment;
      }),

    createSourceUpload: adminProcedure
      .input(createProposalSourceUploadSchema)
      .mutation(async ({ ctx, input }) => {
        const project = await ensureProjectScope(ctx.db, input.projectId);
        const proposal = await ensureProposalScope(ctx.db, input.proposalId, input.projectId);
        assertProposalIsDraft(
          proposal,
          "Sent proposals are immutable. Duplicate the proposal to upload a new source document.",
        );
        const assetId = randomUUID();
        const objectKey = buildProposalSourceObjectKey({
          assetId,
          clientId: project.clientId,
          projectId: input.projectId,
          fileName: input.fileName,
        });

        const { bucket, uploadUrl } = await createPresignedUploadUrl({
          objectKey,
          contentType: input.mimeType,
        });

        await ctx.db.insert(assets).values({
          id: assetId,
          clientId: project.clientId,
          projectId: input.projectId,
          uploadedByUserId: ctx.session.userId,
          bucket,
          objectKey,
          fileName: input.fileName,
          displayName: input.fileName,
          mimeType: input.mimeType,
          sizeBytes: input.sizeBytes,
          assetType: "document",
          visibility: "client_visible",
          scopeType: "proposal",
        });

        return {
          assetId,
          uploadUrl,
          objectKey,
        };
      }),

    getReadUrl: adminProcedure
      .input(proposalReadAssetSchema)
      .mutation(async ({ ctx, input }) => {
        const proposal = await ensureProposalScope(ctx.db, input.proposalId, input.projectId);
        const assetId = proposal.sourceAssetId;

        if (!assetId) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Requested proposal asset is not available.",
          });
        }

        const asset = await ensureAssetBelongsToClient(ctx.db, {
          assetId,
          clientId: proposal.clientId,
          projectId: input.projectId,
        });

        const url = await createAssetReadUrl({ objectKey: asset.objectKey });
        return { url };
      }),

    getBuilderEmbed: adminProcedure
      .input(proposalBuilderTokenSchema)
      .query(async ({ ctx, input }) => {
        const proposal = await ensureProposalScope(ctx.db, input.proposalId, input.projectId);
        assertProposalIsDraft(
          proposal,
          "Sent proposals are immutable. Duplicate the proposal to continue editing in DocuSeal.",
        );
        if (!proposal.sourceAssetId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Upload a proposal source document first.",
          });
        }

        if (!isDocusealConfigured()) {
          return {
            configured: false as const,
            message:
              "DocuSeal is not configured. Add DOCUSEAL_API_BASE_URL, DOCUSEAL_APP_BASE_URL, and DOCUSEAL_API_KEY to enable proposal editing.",
          };
        }

        const sourceAsset = await ensureAssetBelongsToClient(ctx.db, {
          assetId: proposal.sourceAssetId,
          clientId: proposal.clientId,
          projectId: input.projectId,
        });
        const sourceUrl = await createAssetReadUrl({ objectKey: sourceAsset.objectKey });
        const clerk = await getClerkAdminClient();
        const user = await clerk.users.getUser(ctx.session.userId);
        const primaryEmailId = user.primaryEmailAddressId;
        const currentUserEmail =
          user.emailAddresses.find((email) => email.id === primaryEmailId)?.emailAddress ??
          user.emailAddresses[0]?.emailAddress ??
          null;
        const docusealAdminEmail = env.DOCUSEAL_TEST_USER_EMAIL ?? currentUserEmail;
        if (!docusealAdminEmail) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Admin email is required to open DocuSeal builder. Set DOCUSEAL_TEST_USER_EMAIL when using DocuSeal test mode.",
          });
        }

        const templateId =
          proposal.docusealTemplateId && /^\d+$/.test(proposal.docusealTemplateId)
            ? Number(proposal.docusealTemplateId)
            : null;

        const token = createDocusealBuilderToken({
          userEmail: docusealAdminEmail,
          integrationEmail: currentUserEmail ?? docusealAdminEmail,
          externalId: proposal.id,
          name: proposal.title,
          documentUrls: templateId ? undefined : [sourceUrl],
          templateId,
        });

        return {
          configured: true as const,
          token,
          embedHost: getDocusealEmbedHost(),
        };
      }),

    createSubmission: adminProcedure
      .input(createProposalSubmissionSchema)
      .mutation(async ({ ctx, input }) => {
        const proposal = await ensureProposalScope(ctx.db, input.proposalId, input.projectId);
        const project = await ensureProjectExists(ctx.db, input.projectId);
        assertProposalIsDraft(
          proposal,
          "Sent proposals are immutable. Duplicate the proposal to create a new revision before sending again.",
        );
        const recipients = await ctx.db
          .select({
            id: clientMemberships.id,
            email: clientMemberships.email,
            role: clientMemberships.role,
            jobTitle: clientMemberships.jobTitle,
          })
          .from(clientMemberships)
          .where(
            and(
              eq(clientMemberships.clientId, proposal.clientId),
              eq(clientMemberships.status, "active"),
              inArray(clientMemberships.id, input.recipientMembershipIds),
            ),
          );

        if (recipients.length !== input.recipientMembershipIds.length) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "One or more selected recipients are no longer active client members.",
          });
        }

        const [updatedProposal] = await ctx.db
          .update(proposals)
          .set({
            status: "sent",
            sentAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(proposals.id, proposal.id))
          .returning();

        const proposalNotifications = await recordNotificationEvent(ctx.db, {
          eventType: "proposal.sent",
          actorUserId: ctx.session.userId,
          clientId: proposal.clientId,
          projectId: input.projectId,
          entityType: "proposal",
          entityId: proposal.id,
          payload: {
            projectName: project.name,
            proposalTitle: proposal.title,
          },
          audiences: [
            {
              kind: "client_members",
              clientId: proposal.clientId,
              membershipIds: recipients.map((recipient) => recipient.id),
            },
          ],
          href: `/client-portal/projects/${input.projectId}/proposals/${proposal.id}`,
        });

        try {
          const emailResult = await sendProposalNotificationEmail(ctx.db, {
            adminUserId: ctx.session.userId,
            clientId: proposal.clientId,
            projectId: input.projectId,
            proposalId: proposal.id,
            proposalTitle: proposal.title,
            recipients: recipients.map((recipient) => ({
              clientMembershipId: recipient.id,
              email: recipient.email,
              name: recipient.email,
            })),
          });
          if (emailResult.sentEmailId) {
            await attachSentEmailDelivery(ctx.db, {
              notifications: proposalNotifications.notifications,
              sentEmailId: emailResult.sentEmailId,
            });
          }
        } catch (error) {
          console.error("Proposal notification email failed", error);
        }

        return updatedProposal;
      }),
  }),

  projectBilling: createTRPCRouter({
    workspace: adminProcedure
      .input(projectScopeSchema)
      .query(async ({ ctx, input }) => {
        const project = await ensureProjectExists(ctx.db, input.projectId);

        const [[accessState], artifactRows, templateRows, methodConfigRows] = await Promise.all([
          ctx.db
            .select()
            .from(projectBillingAccessStates)
            .where(eq(projectBillingAccessStates.projectId, input.projectId))
            .limit(1),
          ctx.db
            .select()
            .from(projectBillingArtifacts)
            .where(eq(projectBillingArtifacts.projectId, input.projectId))
            .orderBy(desc(projectBillingArtifacts.createdAt)),
          ctx.db
            .select()
            .from(billingTemplates)
            .orderBy(desc(billingTemplates.updatedAt)),
          ctx.db
            .select()
            .from(paymentMethodConfigs)
            .where(eq(paymentMethodConfigs.isActive, true))
            .orderBy(asc(paymentMethodConfigs.sortOrder), asc(paymentMethodConfigs.name)),
        ]);

        const paymentMethodsWithImages = await Promise.all(
          methodConfigRows.map(async (method) => ({
            ...method,
            imageUrl: method.imageObjectKey ? await safeAssetReadUrl(method.imageObjectKey) : null,
          })),
        );

        return {
          project: {
            id: project.id,
            name: project.name,
            description: project.description,
            currency: project.currency,
            client: {
              id: project.clientId,
              name: project.clientName,
            },
            product: project.productId
              ? { id: project.productId, name: project.productName ?? "Linked product" }
              : null,
          },
          accessState: accessState ?? null,
          availableTemplates: templateRows.map((template) => ({
            ...template,
            templateLabel: normalizeBillingTemplateLabel(template.templateType),
          })),
          availablePaymentMethods: paymentMethodsWithImages,
          invoices: artifactRows.map((artifact) => ({
            id: artifact.id,
            projectId: artifact.projectId,
            clientId: artifact.clientId,
            invoiceNumber: artifact.invoiceNumber,
            title: artifact.title,
            description: artifact.description,
            planKind: artifact.planKind,
            status: artifact.status,
            currency: artifact.currency,
            totalAmount: artifact.totalAmount,
            dueAt: artifact.dueAt,
            paidAt: artifact.paidAt,
            nextDueAt: artifact.nextDueAt,
            accessExpiresAt: artifact.accessExpiresAt,
            createdAt: artifact.createdAt,
            updatedAt: artifact.updatedAt,
          })),
        };
      }),

    getArtifact: adminProcedure
      .input(artifactScopeSchema)
      .query(async ({ ctx, input }) => {
        const project = await ensureProjectExists(ctx.db, input.projectId);
        const artifact = await ensureBillingArtifactExists(ctx.db, input);

        const [[accessState], paymentMethods, proofAssets, documents, templateRows] =
          await Promise.all([
            ctx.db
              .select()
              .from(projectBillingAccessStates)
              .where(eq(projectBillingAccessStates.projectId, input.projectId))
              .limit(1),
            ctx.db
              .select()
              .from(billingArtifactPaymentMethods)
              .where(eq(billingArtifactPaymentMethods.artifactId, input.artifactId))
              .orderBy(
                asc(billingArtifactPaymentMethods.sortOrder),
                asc(billingArtifactPaymentMethods.createdAt),
              ),
            ctx.db
              .select()
              .from(assets)
              .where(
                and(
                  eq(assets.scopeType, "billing_artifact"),
                  eq(assets.scopeId, input.artifactId),
                  eq(assets.assetType, "payment_proof"),
                ),
              )
              .orderBy(desc(assets.createdAt)),
            ctx.db
              .select()
              .from(billingArtifactDocuments)
              .where(eq(billingArtifactDocuments.artifactId, input.artifactId))
              .orderBy(asc(billingArtifactDocuments.sortOrder), asc(billingArtifactDocuments.createdAt)),
            ctx.db
              .select()
              .from(billingTemplates)
              .orderBy(desc(billingTemplates.updatedAt)),
          ]);

        const methodConfigIds = paymentMethods
          .map((method) => method.configId)
          .filter((value): value is string => Boolean(value));
        const sourceAssetIds = documents
          .map((document) => document.sourceAssetId)
          .filter((value): value is string => Boolean(value));

        const [methodConfigs, sourceAssets] = await Promise.all([
          methodConfigIds.length > 0
            ? ctx.db
                .select({
                  id: paymentMethodConfigs.id,
                  imageObjectKey: paymentMethodConfigs.imageObjectKey,
                })
                .from(paymentMethodConfigs)
                .where(inArray(paymentMethodConfigs.id, methodConfigIds))
            : Promise.resolve([]),
          sourceAssetIds.length > 0
            ? ctx.db
                .select()
                .from(assets)
                .where(inArray(assets.id, sourceAssetIds))
            : Promise.resolve([]),
        ]);

        const methodImageMap = new Map<string, string | null>();
        await Promise.all(
          methodConfigs.map(async (config) => {
            methodImageMap.set(
              config.id,
              config.imageObjectKey ? await safeAssetReadUrl(config.imageObjectKey) : null,
            );
          }),
        );

        const proofUrlMap = new Map<string, string | null>();
        await Promise.all(
          proofAssets.map(async (asset) => {
            proofUrlMap.set(asset.id, await safeAssetReadUrl(asset.objectKey));
          }),
        );

        const sourceAssetMap = new Map<
          string,
          { fileName: string; mimeType: string; url: string | null }
        >();
        await Promise.all(
          sourceAssets.map(async (asset) => {
            sourceAssetMap.set(asset.id, {
              fileName: asset.displayName,
              mimeType: asset.mimeType,
              url: await safeAssetReadUrl(asset.objectKey),
            });
          }),
        );

        const templateSourceUrlMap = new Map<
          string,
          { fileName: string; mimeType: string; url: string | null }
        >();
        await Promise.all(
          templateRows.map(async (template) => {
            if (!template.sourceObjectKey || !template.sourceFileName || !template.sourceMimeType) {
              return;
            }

            templateSourceUrlMap.set(template.id, {
              fileName: template.sourceFileName,
              mimeType: template.sourceMimeType,
              url: await safeAssetReadUrl(template.sourceObjectKey),
            });
          }),
        );

        return {
          project: {
            id: project.id,
            name: project.name,
            description: project.description,
            currency: project.currency,
            client: {
              id: project.clientId,
              name: project.clientName,
            },
          },
          accessState: accessState ?? null,
          availableTemplates: templateRows.map((template) => ({
            ...template,
            templateLabel: normalizeBillingTemplateLabel(template.templateType),
          })),
          artifact: {
            ...artifact,
            paymentMethods: paymentMethods.map((method) => ({
              ...method,
              imageUrl:
                method.configId ? (methodImageMap.get(method.configId) ?? null) : null,
            })),
            proofAssets: proofAssets.map((asset) => ({
              id: asset.id,
              fileName: asset.fileName,
              displayName: asset.displayName,
              uploadedAt: asset.createdAt,
              visibility: asset.visibility,
              url: proofUrlMap.get(asset.id) ?? null,
            })),
            documents: documents.map((document) => ({
              ...document,
              docusealSubmitterEmbedUrl: resolveDocusealSubmitterUrl({
                embedUrl: document.docusealSubmitterEmbedUrl,
                slug: document.docusealSubmitterSlug,
              }),
              sourceAsset: document.sourceAssetId && sourceAssetMap.has(document.sourceAssetId)
                ? {
                    id: document.sourceAssetId,
                    isTemplateSource: false,
                    ...sourceAssetMap.get(document.sourceAssetId)!,
                  }
                : document.templateId && templateSourceUrlMap.has(document.templateId)
                  ? {
                      id: document.templateId,
                      isTemplateSource: true,
                      ...templateSourceUrlMap.get(document.templateId)!,
                    }
                  : null,
            })),
          },
        };
      }),

    createInvoice: adminProcedure
      .input(createInvoiceSchema)
      .mutation(async ({ ctx, input }) => {
        const project = await ensureProjectExists(ctx.db, input.projectId);
        const methodConfigs = await ctx.db
          .select()
          .from(paymentMethodConfigs)
          .where(inArray(paymentMethodConfigs.id, input.paymentMethods.map((method) => method.configId)));
        const templateIds = input.documents
          .map((document) => document.templateId)
          .filter((value): value is string => Boolean(value));
        const templateRows = templateIds.length
          ? await ctx.db
              .select()
              .from(billingTemplates)
              .where(inArray(billingTemplates.id, templateIds))
          : [];

        if (methodConfigs.length !== input.paymentMethods.length) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "One or more selected payment methods are unavailable.",
          });
        }

        if (templateRows.length !== templateIds.length) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "One or more selected billing templates are unavailable.",
          });
        }

        const seenRoles = new Set<string>();
        for (const document of input.documents) {
          if (seenRoles.has(document.role)) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Each invoice document role can only be configured once.",
            });
          }
          seenRoles.add(document.role);
        }

        const artifactId = randomUUID();
        const invoiceNumber = buildInvoiceNumber(input.projectId);
        const dueAt = toDateOrNull(input.dueAt);
        const nextDueAt = toDateOrNull(input.nextDueAt);
        const accessExpiresAt = toDateOrNull(input.accessExpiresAt);
        const templateMap = new Map(templateRows.map((template) => [template.id, template]));

        await ctx.db.insert(projectBillingArtifacts).values({
          id: artifactId,
          projectId: input.projectId,
          clientId: project.clientId,
          productId: project.productId ?? null,
          artifactType: "invoice",
          planKind: input.planKind,
          status: "draft",
          invoiceNumber,
          title: input.title,
          description: input.description ?? null,
          currency: input.currency.toUpperCase(),
          subtotalAmount: input.amount,
          totalAmount: input.amount,
          dueAt,
          nextDueAt,
          accessExpiresAt,
          terms: input.terms ?? null,
          notes: input.notes ?? null,
          createdByAdminId: ctx.session.userId,
          issuedAt: new Date(),
        });

        await ctx.db.insert(billingArtifactPaymentMethods).values(
          input.paymentMethods.map((selection, index) => {
            const config = methodConfigs.find((method) => method.id === selection.configId);
            if (!config) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "One or more selected payment methods are unavailable.",
              });
            }

            if (
              config.methodType === "stripe_payment_link" &&
              !selection.stripeCheckoutUrl?.trim()
            ) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Stripe payment methods require a checkout URL for this invoice.",
              });
            }

            return {
              artifactId,
              configId: config.id,
              methodType: config.methodType,
              label: config.name,
              instructions: config.instructions,
              paymentUrl:
                config.methodType === "stripe_payment_link"
                  ? selection.stripeCheckoutUrl?.trim() ?? null
                  : config.paymentUrl,
              accountName: config.accountName,
              accountNumberMask: config.accountNumberMask,
              routingNumberMask: config.routingNumberMask,
              bankName: config.bankName,
              sortOrder: index,
            };
          }),
        );

        const createdDocuments = input.documents.map((document, index) => {
          const template = document.templateId
            ? templateMap.get(document.templateId) ?? null
            : null;
          const documentId = randomUUID();

          return {
            id: documentId,
            artifactId,
            role: document.role,
            title: document.title,
            sourceAssetId: document.sourceAssetId ?? null,
            templateId: document.templateId ?? null,
            docusealTemplateId: template?.docusealTemplateId ?? null,
            docusealTemplateSlug: template?.docusealTemplateSlug ?? null,
            isSignable: document.role === "primary_invoice" ? document.isSignable : false,
            sortOrder: index,
          };
        });

        await ctx.db.insert(billingArtifactDocuments).values(createdDocuments);

        const [existingAccessState] = await ctx.db
          .select()
          .from(projectBillingAccessStates)
          .where(eq(projectBillingAccessStates.projectId, input.projectId))
          .limit(1);

        if (existingAccessState) {
          await ctx.db
            .update(projectBillingAccessStates)
            .set({
              nextDueAt,
              accessExpiresAt,
              sourceArtifactId: artifactId,
              updatedByAdminId: ctx.session.userId,
              updatedAt: new Date(),
            })
            .where(eq(projectBillingAccessStates.projectId, input.projectId));
        } else {
          await ctx.db.insert(projectBillingAccessStates).values({
            projectId: input.projectId,
            clientId: project.clientId,
            sourceArtifactId: artifactId,
            nextDueAt,
            accessExpiresAt,
            status: "inactive",
            updatedByAdminId: ctx.session.userId,
          });
        }

        return {
          id: artifactId,
          invoiceNumber,
          documents: createdDocuments.map((document) => ({
            id: document.id,
            role: document.role,
          })),
        };
      }),

    createArtifactDocumentUpload: adminProcedure
      .input(createBillingDocumentUploadSchema)
      .mutation(async ({ ctx, input }) => {
        const project = await ensureProjectExists(ctx.db, input.projectId);
        await ensureBillingArtifactExists(ctx.db, input);
        const document = await ensureBillingArtifactDocumentExists(ctx.db, input);

        const assetId = randomUUID();
        const objectKey = buildBillingDocumentObjectKey({
          assetId,
          clientId: project.clientId,
          projectId: input.projectId,
          artifactId: input.artifactId,
          role: document.role,
          fileName: input.fileName,
        });
        const { bucket, uploadUrl } = await createPresignedUploadUrl({
          objectKey,
          contentType: input.mimeType,
        });

        await ctx.db.insert(assets).values({
          id: assetId,
          clientId: project.clientId,
          projectId: input.projectId,
          uploadedByUserId: ctx.session.userId,
          bucket,
          objectKey,
          fileName: input.fileName,
          displayName: input.fileName,
          mimeType: input.mimeType,
          sizeBytes: input.sizeBytes,
          assetType: "document",
          visibility: "client_visible",
          scopeType: "billing_artifact",
          scopeId: input.artifactId,
        });

        await ctx.db
          .update(billingArtifactDocuments)
          .set({
            sourceAssetId: assetId,
            updatedAt: new Date(),
          })
          .where(eq(billingArtifactDocuments.id, input.documentId));

        return {
          assetId,
          uploadUrl,
          bucket,
          objectKey,
        };
      }),

    updateArtifactDocument: adminProcedure
      .input(updateBillingDocumentSchema)
      .mutation(async ({ ctx, input }) => {
        await ensureProjectExists(ctx.db, input.projectId);
        await ensureBillingArtifactExists(ctx.db, input);
        const document = await ensureBillingArtifactDocumentExists(ctx.db, input);
        let template:
          | {
              docusealTemplateId: string | null;
              docusealTemplateSlug: string | null;
            }
          | null
          | undefined = undefined;

        if (input.templateId) {
          const [selectedTemplate] = await ctx.db
            .select()
            .from(billingTemplates)
            .where(eq(billingTemplates.id, input.templateId))
            .limit(1);
          if (!selectedTemplate) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Selected billing template was not found.",
            });
          }
          template = selectedTemplate;
        }

        const [updated] = await ctx.db
          .update(billingArtifactDocuments)
          .set({
            title: input.title ?? undefined,
            templateId: input.templateId === undefined ? undefined : input.templateId,
            docusealTemplateId:
              input.docusealTemplateId !== undefined
                ? input.docusealTemplateId
                : template
                  ? template.docusealTemplateId
                  : input.templateId === null
                    ? null
                  : undefined,
            docusealTemplateSlug:
              input.docusealTemplateSlug !== undefined
                ? input.docusealTemplateSlug
                : template
                  ? template.docusealTemplateSlug
                  : input.templateId === null
                    ? null
                  : undefined,
            sourceAssetId:
              input.sourceAssetId === undefined ? undefined : input.sourceAssetId,
            isSignable:
              input.isSignable !== undefined
                ? document.role === "primary_invoice"
                  ? input.isSignable
                  : false
                : undefined,
            updatedAt: new Date(),
          })
          .where(eq(billingArtifactDocuments.id, input.documentId))
          .returning();

        return updated;
      }),

    getArtifactDocumentBuilder: adminProcedure
      .input(getBillingDocumentBuilderSchema)
      .query(async ({ ctx, input }) => {
        const artifact = await ensureBillingArtifactExists(ctx.db, input);
        const document = await ensureBillingArtifactDocumentExists(ctx.db, input);

        if (!isDocusealConfigured()) {
          return {
            configured: false as const,
            message:
              "DocuSeal is not configured. Add DOCUSEAL_API_BASE_URL, DOCUSEAL_APP_BASE_URL, and DOCUSEAL_API_KEY to enable invoice document editing.",
          };
        }

        const templateId =
          document.docusealTemplateId && /^\d+$/.test(document.docusealTemplateId)
            ? Number(document.docusealTemplateId)
            : null;

        if (!templateId && !document.sourceAssetId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Upload a source document or link a DocuSeal template first.",
          });
        }

        let sourceUrl: string | null = null;
        if (document.sourceAssetId) {
          const sourceAsset = await ensureAssetBelongsToClient(ctx.db, {
            assetId: document.sourceAssetId,
            clientId: artifact.clientId,
            projectId: input.projectId,
          });
          sourceUrl = await createAssetReadUrl({ objectKey: sourceAsset.objectKey });
        }

        const clerk = await getClerkAdminClient();
        const user = await clerk.users.getUser(ctx.session.userId);
        const primaryEmailId = user.primaryEmailAddressId;
        const currentUserEmail =
          user.emailAddresses.find((email) => email.id === primaryEmailId)?.emailAddress ??
          user.emailAddresses[0]?.emailAddress ??
          null;
        const docusealAdminEmail = env.DOCUSEAL_TEST_USER_EMAIL ?? currentUserEmail;

        if (!docusealAdminEmail) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Admin email is required to open DocuSeal builder. Set DOCUSEAL_TEST_USER_EMAIL when using DocuSeal test mode.",
          });
        }

        const token = createDocusealBuilderToken({
          userEmail: docusealAdminEmail,
          integrationEmail: currentUserEmail ?? docusealAdminEmail,
          externalId: document.id,
          name: document.title,
          documentUrls: templateId ? undefined : sourceUrl ? [sourceUrl] : undefined,
          templateId,
        });

        return {
          configured: true as const,
          token,
          embedHost: getDocusealEmbedHost(),
        };
      }),

    createArtifactDocumentSubmission: adminProcedure
      .input(createBillingDocumentSubmissionSchema)
      .mutation(async ({ ctx, input }) => {
        const project = await ensureProjectExists(ctx.db, input.projectId);
        const artifact = await ensureBillingArtifactExists(ctx.db, input);
        const document = await ensureBillingArtifactDocumentExists(ctx.db, input);

        if (document.role !== "primary_invoice" || !document.isSignable) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Only the primary invoice document can be sent for signature.",
          });
        }

        if (!document.docusealTemplateId || !/^\d+$/.test(document.docusealTemplateId)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Save the DocuSeal template before sending this invoice for signature.",
          });
        }

        const templateId = Number(document.docusealTemplateId);
        const template = await getDocusealTemplate(templateId);
        const templateRoles = template.submitters
          .map((submitter) => submitter.name.trim())
          .filter((name) => name.length > 0);

        if (templateRoles.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "The DocuSeal template does not have any signer roles configured yet. Add recipients in the builder before sending this invoice.",
          });
        }

        const recipients = await ctx.db
          .select({
            id: clientMemberships.id,
            email: clientMemberships.email,
          })
          .from(clientMemberships)
          .where(
            and(
              eq(clientMemberships.clientId, artifact.clientId),
              eq(clientMemberships.status, "active"),
              inArray(clientMemberships.id, input.recipientMembershipIds),
            ),
          );

        if (recipients.length !== input.recipientMembershipIds.length) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "One or more selected recipients are no longer active client members.",
          });
        }

        if (recipients.length !== templateRoles.length) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `This DocuSeal template expects ${templateRoles.length} signer role(s): ${templateRoles.join(", ")}. Select exactly ${templateRoles.length} recipient(s) before sending.`,
          });
        }

        const submission = await createDocusealTemplateSubmission({
          templateId,
          sendEmail: false,
          completedRedirectUrl: `${env.APP_URL}/client-portal/projects/${input.projectId}/payments/${artifact.id}`,
          submitters: recipients.map((recipient, index) => ({
            name: recipient.email,
            email: recipient.email,
            role: templateRoles[index]!,
            external_id: document.id,
          })),
        });

        const nextSubmissionId = submission.submissionId;
        let nextSubmitterId = submission.primarySubmitterId;
        let nextSubmitterSlug = submission.primarySubmitterSlug;
        let submitterEmbedUrl = submission.primarySubmitterEmbedUrl;

        if (nextSubmissionId && (!submitterEmbedUrl || !nextSubmitterSlug)) {
          const submitters = await getDocusealSubmitters(Number(nextSubmissionId));
          const fallbackSubmitter =
            submitters.find((submitter) => submitter.email === recipients[0]?.email) ??
            submitters[0];

          if (fallbackSubmitter) {
            nextSubmitterId = String(fallbackSubmitter.id);
            nextSubmitterSlug = fallbackSubmitter.slug;
            submitterEmbedUrl = resolveDocusealSubmitterUrl({
              slug: fallbackSubmitter.slug,
            });
          }
        }

        if (
          !hasDocusealSigningPreviewMetadata({
            docusealSubmissionId: nextSubmissionId,
            docusealSubmitterSlug: nextSubmitterSlug,
            docusealSubmitterEmbedUrl: submitterEmbedUrl,
          })
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "DocuSeal created the submission but did not return a usable signer preview link. The invoice remains editable so the signing flow can be retried safely.",
          });
        }

        const [updatedDocument] = await ctx.db
          .update(billingArtifactDocuments)
          .set({
            docusealSubmissionId: nextSubmissionId,
            docusealSubmissionStatus: submission.submissionStatus,
            docusealSubmitterId: nextSubmitterId,
            docusealSubmitterSlug: nextSubmitterSlug,
            docusealSubmitterEmbedUrl: submitterEmbedUrl,
            updatedAt: new Date(),
          })
          .where(eq(billingArtifactDocuments.id, document.id))
          .returning();

        await ctx.db
          .update(projectBillingArtifacts)
          .set({
            status: artifact.status === "draft" ? "sent" : artifact.status,
            sentAt: artifact.sentAt ?? new Date(),
            updatedAt: new Date(),
          })
          .where(eq(projectBillingArtifacts.id, artifact.id));

        const invoiceNotifications = await recordNotificationEvent(ctx.db, {
          eventType: "invoice.sent",
          actorUserId: ctx.session.userId,
          clientId: artifact.clientId,
          projectId: input.projectId,
          entityType: "invoice",
          entityId: artifact.id,
          payload: {
            projectName: project.name,
            invoiceTitle: artifact.title,
          },
          audiences: [
            {
              kind: "client_members",
              clientId: artifact.clientId,
              membershipIds: recipients.map((recipient) => recipient.id),
            },
          ],
          href: `/client-portal/projects/${input.projectId}/payments/${artifact.id}`,
        });

        try {
          const emailResult = await sendInvoiceNotificationEmail(ctx.db, {
            adminUserId: ctx.session.userId,
            clientId: artifact.clientId,
            projectId: input.projectId,
            artifactId: artifact.id,
            invoiceTitle: artifact.title,
            recipients: recipients.map((recipient) => ({
              clientMembershipId: recipient.id,
              email: recipient.email,
              name: recipient.email,
            })),
          });

          if (emailResult.sentEmailId) {
            await attachSentEmailDelivery(ctx.db, {
              notifications: invoiceNotifications.notifications,
              sentEmailId: emailResult.sentEmailId,
            });
          }
        } catch (error) {
          console.error("Invoice notification email failed", error);
        }

        return updatedDocument;
      }),

    updateStatus: adminProcedure
      .input(updateBillingArtifactStatusSchema)
      .mutation(async ({ ctx, input }) => {
        const project = await ensureProjectExists(ctx.db, input.projectId);
        const artifact = await ensureBillingArtifactExists(ctx.db, input);

        await ctx.db
          .update(projectBillingArtifacts)
          .set({
            status: input.status,
            paidAt: input.status === "paid" ? new Date() : artifact.paidAt,
            sentAt:
              input.status === "sent" && !artifact.sentAt ? new Date() : artifact.sentAt,
            updatedAt: new Date(),
          })
          .where(eq(projectBillingArtifacts.id, input.artifactId));

        await ctx.db
          .update(projectBillingAccessStates)
          .set({
            status:
              input.accessStatus ??
              (input.status === "paid" ? "active" : undefined),
            nextDueAt:
              input.nextDueAt !== undefined ? toDateOrNull(input.nextDueAt) : undefined,
            accessExpiresAt:
              input.accessExpiresAt !== undefined
                ? toDateOrNull(input.accessExpiresAt)
                : undefined,
            lastPaidAt: input.status === "paid" ? new Date() : undefined,
            overrideReason: input.overrideReason ?? undefined,
            sourceArtifactId: input.artifactId,
            updatedByAdminId: ctx.session.userId,
            updatedAt: new Date(),
          })
          .where(eq(projectBillingAccessStates.projectId, project.id));

        return { ok: true };
      }),

    createProofUpload: adminProcedure
      .input(createBillingProofUploadSchema)
      .mutation(async ({ ctx, input }) => {
        const project = await ensureProjectExists(ctx.db, input.projectId);
        const artifact = await ensureBillingArtifactExists(ctx.db, input);

        const assetId = randomUUID();
        const objectKey = buildBillingProofObjectKey(
          assetId,
          project.clientId,
          input.projectId,
          input.artifactId,
          input.fileName,
        );
        const { bucket, uploadUrl } = await createPresignedUploadUrl({
          objectKey,
          contentType: input.mimeType,
        });

        await ctx.db.insert(assets).values({
          id: assetId,
          clientId: project.clientId,
          projectId: input.projectId,
          uploadedByUserId: ctx.session.userId,
          bucket,
          objectKey,
          fileName: input.fileName,
          displayName: input.fileName,
          mimeType: input.mimeType,
          sizeBytes: input.sizeBytes,
          assetType: "payment_proof",
          visibility: "admin_only",
          scopeType: "billing_artifact",
          scopeId: input.artifactId,
        });

        await ctx.db
          .update(projectBillingArtifacts)
          .set({
            status: "proof_submitted",
            updatedAt: new Date(),
          })
          .where(eq(projectBillingArtifacts.id, input.artifactId));

        await recordNotificationEvent(ctx.db, {
          eventType: "payment.proof_submitted",
          actorUserId: ctx.session.userId,
          clientId: project.clientId,
          projectId: input.projectId,
          entityType: "invoice",
          entityId: input.artifactId,
          payload: {
            projectName: project.name,
            invoiceTitle: artifact.title,
          },
          audiences: [{ kind: "client_members", clientId: project.clientId }],
          href: `/client-portal/projects/${input.projectId}/payments/${input.artifactId}`,
        });

        return {
          assetId,
          uploadUrl,
          bucket,
          objectKey,
        };
      }),
  }),

  productAccounts: createTRPCRouter({
    byProject: adminProcedure.input(projectScopeSchema).query(async ({ ctx, input }) => {
      const project = await ensureProjectExists(ctx.db, input.projectId);
      const [account] = await ctx.db
        .select()
        .from(projectProductAccounts)
        .where(eq(projectProductAccounts.projectId, input.projectId))
        .limit(1);

      return {
        project: {
          id: project.id,
          name: project.name,
          clientName: project.clientName,
          productId: project.productId,
          productName: project.productName,
        },
        account:
          account ??
          (project.productId
            ? {
                id: null,
                projectId: project.id,
                clientId: project.clientId,
                productId: project.productId,
                status: "pending" as const,
                externalAccountId: null,
                externalWorkspaceId: null,
                accountUrl: null,
                statsSummary: {},
                lastSyncedAt: null,
              }
            : null),
      };
    }),
  }),

  productAccess: createTRPCRouter({
    byProject: adminProcedure.input(projectScopeSchema).query(async ({ ctx, input }) => {
      return getProductAccessContext(ctx.db, input.projectId);
    }),

    grant: adminProcedure
      .input(grantProductAccessSchema)
      .mutation(async ({ ctx, input }) => {
        return grantProjectProductAccess(ctx.db, {
          projectId: input.projectId,
          actorUserId: ctx.session.userId,
          accessExpiresAt: new Date(input.accessExpiresAt),
        });
      }),

    extend: adminProcedure
      .input(extendProductAccessSchema)
      .mutation(async ({ ctx, input }) => {
        return extendProjectProductAccess(ctx.db, {
          projectId: input.projectId,
          actorUserId: ctx.session.userId,
          accessExpiresAt: new Date(input.accessExpiresAt),
        });
      }),

    revoke: adminProcedure
      .input(revokeProductAccessSchema)
      .mutation(async ({ ctx, input }) => {
        return revokeProjectProductAccess(ctx.db, {
          projectId: input.projectId,
          actorUserId: ctx.session.userId,
          reason: input.reason ?? null,
        });
      }),
  }),

  settingsProfile: createTRPCRouter({
    page: adminProcedure.query(async ({ ctx }) => {
      const clerk = await getClerkAdminClient();
      const [organization, memberships, invitations, currentEmailSettings] = await Promise.all([
        clerk.organizations.getOrganization({
          organizationId: env.CLERK_CONCOLABS_ORG_ID,
        }),
        clerk.organizations.getOrganizationMembershipList({
          organizationId: env.CLERK_CONCOLABS_ORG_ID,
          limit: 100,
        }),
        clerk.organizations.getOrganizationInvitationList({
          organizationId: env.CLERK_CONCOLABS_ORG_ID,
          limit: 100,
        }),
        ctx.db
          .select({
            fromEmail: emailSettings.fromEmail,
            footerContactEmail: emailSettings.footerContactEmail,
          })
          .from(emailSettings)
          .orderBy(desc(emailSettings.updatedAt))
          .limit(1)
          .then((rows) => rows[0] ?? null),
      ]);

      return {
        company: {
          id: organization.id,
          name: organization.name,
          imageUrl: organization.imageUrl ?? null,
          email:
            currentEmailSettings?.fromEmail ??
            currentEmailSettings?.footerContactEmail ??
            "hello@concolabs.com",
        },
        members: memberships.data.map((membership) => ({
          id: membership.id,
          userId: membership.publicUserData?.userId ?? "",
          name: formatClerkDisplayName({
            firstName: membership.publicUserData?.firstName,
            lastName: membership.publicUserData?.lastName,
            identifier: membership.publicUserData?.identifier,
          }),
          email: membership.publicUserData?.identifier ?? "Unknown email",
          imageUrl: membership.publicUserData?.imageUrl ?? null,
          role: fromClerkClientRole(membership.role),
          joinedAt: membership.createdAt,
        })),
        invitations: invitations.data.map((invitation) => ({
          id: invitation.id,
          email: invitation.emailAddress,
          role: fromClerkClientRole(invitation.role),
          status: invitation.status ?? "pending",
          createdAt: invitation.createdAt,
        })),
      };
    }),

    inviteMember: adminProcedure
      .input(settingsProfileInviteSchema)
      .mutation(async ({ ctx, input }) => {
        const clerk = await getClerkAdminClient();
        const invitation = await clerk.organizations.createOrganizationInvitation({
          organizationId: env.CLERK_CONCOLABS_ORG_ID,
          emailAddress: input.email,
          role: toClerkClientRole(input.role),
          inviterUserId: ctx.session.userId,
          redirectUrl: `${env.APP_URL}/sign-in`,
        });

        return {
          id: invitation.id,
          email: invitation.emailAddress,
        };
      }),

    changeRole: adminProcedure
      .input(settingsProfileChangeRoleSchema)
      .mutation(async ({ input }) => {
        const clerk = await getClerkAdminClient();
        await clerk.organizations.updateOrganizationMembership({
          organizationId: env.CLERK_CONCOLABS_ORG_ID,
          userId: input.userId,
          role: toClerkClientRole(input.role),
        });

        return { success: true };
      }),

    removeMember: adminProcedure
      .input(settingsProfileRemoveMemberSchema)
      .mutation(async ({ ctx, input }) => {
        const clerk = await getClerkAdminClient();

        if (input.userId) {
          await clerk.organizations.deleteOrganizationMembership({
            organizationId: env.CLERK_CONCOLABS_ORG_ID,
            userId: input.userId,
          });
          return { success: true };
        }

        if (input.invitationId) {
          await clerk.organizations.revokeOrganizationInvitation({
            organizationId: env.CLERK_CONCOLABS_ORG_ID,
            invitationId: input.invitationId,
            requestingUserId: ctx.session.userId,
          });
          return { success: true };
        }

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Choose a member or invitation to remove.",
        });
      }),

    resendInvite: adminProcedure
      .input(settingsProfileResendInviteSchema)
      .mutation(async ({ ctx, input }) => {
        const clerk = await getClerkAdminClient();
        await clerk.organizations.revokeOrganizationInvitation({
          organizationId: env.CLERK_CONCOLABS_ORG_ID,
          invitationId: input.invitationId,
          requestingUserId: ctx.session.userId,
        });

        const invitation = await clerk.organizations.createOrganizationInvitation({
          organizationId: env.CLERK_CONCOLABS_ORG_ID,
          emailAddress: input.email,
          role: toClerkClientRole(input.role),
          inviterUserId: ctx.session.userId,
          redirectUrl: `${env.APP_URL}/sign-in`,
        });

        return {
          id: invitation.id,
          email: invitation.emailAddress,
        };
      }),
  }),

  settingsBilling: createTRPCRouter({
    page: adminProcedure.query(async ({ ctx }) => {
      const [templates, paymentMethods, webhookRows, webhookLogs] = await Promise.all([
        ctx.db.select().from(billingTemplates).orderBy(desc(billingTemplates.updatedAt)),
        ctx.db
          .select()
          .from(paymentMethodConfigs)
          .orderBy(asc(paymentMethodConfigs.sortOrder), asc(paymentMethodConfigs.name)),
        ctx.db
          .select({
            productId: products.id,
            productName: products.name,
            productSlug: products.slug,
            configId: productWebhookConfigs.id,
            webhookUrl: productWebhookConfigs.webhookUrl,
            webhookSecret: productWebhookConfigs.webhookSecret,
            reconcileUrl: productWebhookConfigs.reconcileUrl,
            reconcileMode: productWebhookConfigs.reconcileMode,
            isActive: productWebhookConfigs.isActive,
          })
          .from(products)
          .leftJoin(productWebhookConfigs, eq(productWebhookConfigs.productId, products.id))
          .orderBy(asc(products.name)),
        ctx.db
          .select({
            id: productWebhookDeliveryLogs.id,
            productId: productWebhookDeliveryLogs.productId,
            deliveryStatus: productWebhookDeliveryLogs.deliveryStatus,
            occurredAt: productWebhookDeliveryLogs.occurredAt,
          })
          .from(productWebhookDeliveryLogs)
          .orderBy(desc(productWebhookDeliveryLogs.occurredAt)),
      ]);

      const paymentMethodsWithImages = await Promise.all(
        paymentMethods.map(async (method) => ({
          ...method,
          imageUrl: method.imageObjectKey ? await safeAssetReadUrl(method.imageObjectKey) : null,
        })),
      );

      const logSummaryByProduct = new Map<
        string,
        {
          totalDeliveries: number;
          lastSuccessAt: Date | null;
          lastFailureAt: Date | null;
        }
      >();

      for (const log of webhookLogs) {
        const current = logSummaryByProduct.get(log.productId) ?? {
          totalDeliveries: 0,
          lastSuccessAt: null,
          lastFailureAt: null,
        };
        current.totalDeliveries += 1;
        if (log.deliveryStatus === "success" && !current.lastSuccessAt) {
          current.lastSuccessAt = log.occurredAt;
        }
        if (log.deliveryStatus === "failed" && !current.lastFailureAt) {
          current.lastFailureAt = log.occurredAt;
        }
        logSummaryByProduct.set(log.productId, current);
      }

      return {
        templates,
        paymentMethods: paymentMethodsWithImages,
        webhooks: webhookRows.map((row) => ({
          ...row,
          lastSuccessAt: logSummaryByProduct.get(row.productId)?.lastSuccessAt ?? null,
          lastFailureAt: logSummaryByProduct.get(row.productId)?.lastFailureAt ?? null,
          totalDeliveries: logSummaryByProduct.get(row.productId)?.totalDeliveries ?? 0,
        })),
      };
    }),

    templates: adminProcedure.query(async ({ ctx }) => {
      const templates = await ctx.db
        .select()
        .from(billingTemplates)
        .orderBy(desc(billingTemplates.updatedAt), asc(billingTemplates.name));

      return Promise.all(
        templates.map(async (template) => ({
          ...template,
          isDocusealLinked: Boolean(
            template.docusealTemplateId && template.docusealTemplateSlug,
          ),
          sourceFileUrl: template.sourceObjectKey
            ? await safeAssetReadUrl(template.sourceObjectKey)
            : null,
        })),
      );
    }),

    createTemplateSourceUpload: adminProcedure
      .input(createBillingTemplateSourceUploadSchema)
      .mutation(async ({ input }) => {
        const objectKey = buildBillingTemplateObjectKey(input.templateId, input.fileName);
        const { bucket, uploadUrl } = await createPresignedUploadUrl({
          objectKey,
          contentType: input.mimeType,
        });

        return {
          bucket,
          objectKey,
          uploadUrl,
        };
      }),

    createTemplate: adminProcedure
      .input(createBillingTemplateSchema)
      .mutation(async ({ ctx, input }) => {
        if (input.isDefault) {
          await ctx.db
            .update(billingTemplates)
            .set({
              isDefault: false,
              updatedAt: new Date(),
            })
            .where(eq(billingTemplates.templateType, input.templateType));
        }

        const [created] = await ctx.db
          .insert(billingTemplates)
          .values({
            name: input.name,
            templateType: input.templateType,
            description: input.description ?? null,
            sourceObjectKey: input.sourceObjectKey ?? null,
            sourceFileName: input.sourceFileName ?? null,
            sourceMimeType: input.sourceMimeType ?? null,
            docusealTemplateId: input.docusealTemplateId ?? null,
            docusealTemplateSlug: input.docusealTemplateSlug ?? null,
            content: input.content,
            isDefault: input.isDefault,
            createdByAdminId: ctx.session.userId,
          })
          .returning();

        return created;
      }),

    updateTemplate: adminProcedure
      .input(updateBillingTemplateSchema)
      .mutation(async ({ ctx, input }) => {
        if (input.isDefault) {
          await ctx.db
            .update(billingTemplates)
            .set({
              isDefault: false,
              updatedAt: new Date(),
            })
            .where(
              and(
                eq(billingTemplates.templateType, input.templateType),
                sql`${billingTemplates.id} <> ${input.templateId}`,
              ),
            );
        }

        const [updated] = await ctx.db
          .update(billingTemplates)
          .set({
            name: input.name,
            templateType: input.templateType,
            description: input.description ?? null,
            sourceObjectKey: input.sourceObjectKey ?? null,
            sourceFileName: input.sourceFileName ?? null,
            sourceMimeType: input.sourceMimeType ?? null,
            docusealTemplateId: input.docusealTemplateId ?? null,
            docusealTemplateSlug: input.docusealTemplateSlug ?? null,
            content: input.content,
            isDefault: input.isDefault,
            updatedAt: new Date(),
          })
          .where(eq(billingTemplates.id, input.templateId))
          .returning();

        return updated;
      }),
    getTemplateBuilder: adminProcedure
      .input(billingTemplateScopeSchema)
      .query(async ({ ctx, input }) => {
        const [template] = await ctx.db
          .select()
          .from(billingTemplates)
          .where(eq(billingTemplates.id, input.templateId))
          .limit(1);

        if (!template) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Billing template was not found.",
          });
        }

        return {
          template: {
            id: template.id,
            name: template.name,
            templateType: template.templateType,
            description: template.description,
            content: template.content,
            isDefault: template.isDefault,
            docusealTemplateId: template.docusealTemplateId,
            docusealTemplateSlug: template.docusealTemplateSlug,
            sourceFileName: template.sourceFileName,
            sourceMimeType: template.sourceMimeType,
            sourceFileUrl: template.sourceObjectKey
              ? await safeAssetReadUrl(template.sourceObjectKey)
              : null,
            sourceObjectKey: template.sourceObjectKey,
          },
        };
      }),

    paymentMethods: adminProcedure.query(async ({ ctx }) => {
      const methods = await ctx.db
        .select()
        .from(paymentMethodConfigs)
        .orderBy(asc(paymentMethodConfigs.sortOrder), asc(paymentMethodConfigs.name));

      return Promise.all(
        methods.map(async (method) => ({
          ...method,
          imageUrl: method.imageObjectKey ? await safeAssetReadUrl(method.imageObjectKey) : null,
        })),
      );
    }),

    createPaymentMethodImageUpload: adminProcedure
      .input(createPaymentMethodImageUploadSchema)
      .mutation(async ({ input }) => {
        const assetId = randomUUID();
        const objectKey = buildPaymentMethodImageObjectKey(assetId, input.fileName);
        const { bucket, uploadUrl } = await createPresignedUploadUrl({
          objectKey,
          contentType: input.mimeType,
        });

        return {
          assetId,
          bucket,
          objectKey,
          uploadUrl,
        };
      }),

    createPaymentMethod: adminProcedure
      .input(createPaymentMethodConfigSchema)
      .mutation(async ({ ctx, input }) => {
        const [created] = await ctx.db
          .insert(paymentMethodConfigs)
          .values({
            name: input.name,
            methodType: input.methodType,
            imageObjectKey: input.imageObjectKey ?? null,
            currency: input.currency?.toUpperCase() ?? null,
            instructions: input.instructions ?? null,
            paymentUrl: input.paymentUrl ?? null,
            accountName: input.accountName ?? null,
            accountNumberMask: input.accountNumberMask ?? null,
            routingNumberMask: input.routingNumberMask ?? null,
            bankName: input.bankName ?? null,
            isActive: input.isActive,
          })
          .returning();

        return created;
      }),

    updatePaymentMethod: adminProcedure
      .input(updatePaymentMethodConfigSchema)
      .mutation(async ({ ctx, input }) => {
        const [updated] = await ctx.db
          .update(paymentMethodConfigs)
          .set({
            name: input.name,
            methodType: input.methodType,
            imageObjectKey: input.imageObjectKey ?? null,
            currency: input.currency?.toUpperCase() ?? null,
            instructions: input.instructions ?? null,
            paymentUrl: input.paymentUrl ?? null,
            accountName: input.accountName ?? null,
            accountNumberMask: input.accountNumberMask ?? null,
            routingNumberMask: input.routingNumberMask ?? null,
            bankName: input.bankName ?? null,
            isActive: input.isActive,
            updatedAt: new Date(),
          })
          .where(eq(paymentMethodConfigs.id, input.paymentMethodId))
          .returning();

        return updated;
      }),

    webhooks: adminProcedure.query(async ({ ctx }) => {
      const [rows, logs] = await Promise.all([
        ctx.db
          .select({
            productId: products.id,
            productName: products.name,
            productSlug: products.slug,
            productKind: products.kind,
            productStatus: products.status,
            billingMode: products.billingMode,
            configId: productWebhookConfigs.id,
            webhookUrl: productWebhookConfigs.webhookUrl,
            webhookSecret: productWebhookConfigs.webhookSecret,
            reconcileUrl: productWebhookConfigs.reconcileUrl,
            reconcileMode: productWebhookConfigs.reconcileMode,
            isActive: productWebhookConfigs.isActive,
          })
          .from(products)
          .leftJoin(productWebhookConfigs, eq(productWebhookConfigs.productId, products.id))
          .orderBy(asc(products.name)),
        ctx.db
          .select({
            productId: productWebhookDeliveryLogs.productId,
            deliveryStatus: productWebhookDeliveryLogs.deliveryStatus,
            occurredAt: productWebhookDeliveryLogs.occurredAt,
          })
          .from(productWebhookDeliveryLogs)
          .orderBy(desc(productWebhookDeliveryLogs.occurredAt)),
      ]);

      return rows.map((row) => {
        const productLogs = logs.filter((log) => log.productId === row.productId);
        const lastSuccess = productLogs.find((log) => log.deliveryStatus === "success");
        const lastFailure = productLogs.find((log) => log.deliveryStatus === "failed");

        return {
          ...row,
          webhookSecretMasked: maskSecret(row.webhookSecret),
          isConfigured: Boolean(row.configId),
          lastSuccessAt: lastSuccess?.occurredAt ?? null,
          lastFailureAt: lastFailure?.occurredAt ?? null,
          totalDeliveries: productLogs.length,
        };
      });
    }),

    webhookByProduct: adminProcedure
      .input(productScopeSchema)
      .query(async ({ ctx, input }) => {
        const [product] = await ctx.db
          .select({
            productId: products.id,
            productName: products.name,
            productSlug: products.slug,
            productKind: products.kind,
            productStatus: products.status,
            billingMode: products.billingMode,
            configId: productWebhookConfigs.id,
            webhookUrl: productWebhookConfigs.webhookUrl,
            webhookSecret: productWebhookConfigs.webhookSecret,
            reconcileUrl: productWebhookConfigs.reconcileUrl,
            reconcileMode: productWebhookConfigs.reconcileMode,
            isActive: productWebhookConfigs.isActive,
            payloadTemplate: productWebhookConfigs.payloadTemplate,
          })
          .from(products)
          .leftJoin(productWebhookConfigs, eq(productWebhookConfigs.productId, products.id))
          .where(eq(products.id, input.productId))
          .limit(1);

        if (!product) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Product not found.",
          });
        }

        const logs = await ctx.db
          .select()
          .from(productWebhookDeliveryLogs)
          .where(eq(productWebhookDeliveryLogs.productId, input.productId))
          .orderBy(desc(productWebhookDeliveryLogs.occurredAt))
          .limit(20);

        const lastSuccess = logs.find((log) => log.deliveryStatus === "success") ?? null;
        const lastFailure = logs.find((log) => log.deliveryStatus === "failed") ?? null;

        return {
          product: {
            ...product,
            webhookSecretMasked: maskSecret(product.webhookSecret),
            isConfigured: Boolean(product.configId),
          },
          summary: {
            totalDeliveries: logs.length,
            lastSuccessAt: lastSuccess?.occurredAt ?? null,
            lastFailureAt: lastFailure?.occurredAt ?? null,
          },
          logs,
        };
      }),

    upsertWebhookConfig: adminProcedure
      .input(upsertWebhookConfigSchema)
      .mutation(async ({ ctx, input }) => {
        const [existing] = await ctx.db
          .select({ id: productWebhookConfigs.id })
          .from(productWebhookConfigs)
          .where(eq(productWebhookConfigs.productId, input.productId))
          .limit(1);

        if (existing) {
          const [updated] = await ctx.db
            .update(productWebhookConfigs)
            .set({
              webhookUrl: input.webhookUrl ?? null,
              webhookSecret: input.webhookSecret ?? null,
              reconcileUrl: input.reconcileUrl ?? null,
              reconcileMode: input.reconcileMode,
              isActive: input.isActive,
              payloadTemplate: input.payloadTemplate,
              updatedAt: new Date(),
            })
            .where(eq(productWebhookConfigs.id, existing.id))
            .returning();

          return updated;
        }

        const [created] = await ctx.db
          .insert(productWebhookConfigs)
          .values({
            productId: input.productId,
            webhookUrl: input.webhookUrl ?? null,
            webhookSecret: input.webhookSecret ?? null,
            reconcileUrl: input.reconcileUrl ?? null,
            reconcileMode: input.reconcileMode,
            isActive: input.isActive,
            payloadTemplate: input.payloadTemplate,
          })
          .returning();

        return created;
      }),
  }),

  files: createTRPCRouter({
    list: adminProcedure
      .input(projectScopeSchema)
      .query(async ({ ctx, input }) => {
        await ensureProjectScope(ctx.db, input.projectId);

        const [folders, files] = await Promise.all([
          loadProjectFolderTree(ctx.db, input.projectId),
          loadProjectFiles(ctx.db, input.projectId),
        ]);

        return { folders, files };
      }),

    createFolder: adminProcedure
      .input(createFolderSchema)
      .mutation(async ({ ctx, input }) => {
        const project = await ensureProjectScope(ctx.db, input.projectId);
        if (input.parentFolderId) {
          await ensureFolderScope(ctx.db, input.parentFolderId, input.projectId);
        }

        const [folder] = await ctx.db
          .insert(projectFolders)
          .values({
            clientId: project.clientId,
            projectId: input.projectId,
            name: input.name,
            parentFolderId: input.parentFolderId ?? null,
            visibility: input.visibility,
          })
          .returning();

        return folder;
      }),

    renameFolder: adminProcedure
      .input(renameFolderSchema)
      .mutation(async ({ ctx, input }) => {
        await ensureFolderScope(ctx.db, input.folderId, input.projectId);

        const [folder] = await ctx.db
          .update(projectFolders)
          .set({
            name: input.name,
            updatedAt: new Date(),
          })
          .where(eq(projectFolders.id, input.folderId))
          .returning();

        return folder;
      }),

    moveFolder: adminProcedure
      .input(moveFolderSchema)
      .mutation(async ({ ctx, input }) => {
        await ensureFolderScope(ctx.db, input.folderId, input.projectId);
        if (input.parentFolderId) {
          await ensureFolderScope(ctx.db, input.parentFolderId, input.projectId);
        }

        const descendantIds = await getDescendantFolderIds(
          ctx.db,
          input.projectId,
          input.folderId,
        );
        assertValidFolderMove(input.folderId, input.parentFolderId, descendantIds);

        const [folder] = await ctx.db
          .update(projectFolders)
          .set({
            parentFolderId: input.parentFolderId,
            updatedAt: new Date(),
          })
          .where(eq(projectFolders.id, input.folderId))
          .returning();

        return folder;
      }),

    deleteFolder: adminProcedure
      .input(deleteFolderSchema)
      .mutation(async ({ ctx, input }) => {
        await ensureFolderScope(ctx.db, input.folderId, input.projectId);

        const folderIds = await getDescendantFolderIds(ctx.db, input.projectId, input.folderId);

        const filesInFolders = await ctx.db
          .select({
            id: projectFiles.id,
            assetId: projectFiles.assetId,
          })
          .from(projectFiles)
          .where(
            and(
              eq(projectFiles.projectId, input.projectId),
              inArray(projectFiles.folderId, folderIds),
            ),
          );

        if (filesInFolders.length > 0) {
          await ctx.db
            .update(assets)
            .set({
              deletedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(inArray(assets.id, filesInFolders.map((file) => file.assetId)));

          await ctx.db
            .delete(projectFiles)
            .where(inArray(projectFiles.id, filesInFolders.map((file) => file.id)));
        }

        await ctx.db.delete(projectFolders).where(inArray(projectFolders.id, folderIds));
        return { success: true };
      }),

    prepareUpload: adminProcedure
      .input(prepareProjectFileUploadSchema)
      .mutation(async ({ ctx, input }) => {
        const project = await ensureProjectScope(ctx.db, input.projectId);
        if (input.folderId) {
          await ensureFolderScope(ctx.db, input.folderId, input.projectId);
        }

        const assetId = randomUUID();
        const objectKey = buildProjectFileObjectKey({
          assetId,
          clientId: project.clientId,
          projectId: input.projectId,
          fileName: input.fileName,
        });

        const { bucket, uploadUrl } = await createPresignedUploadUrl({
          objectKey,
          contentType: input.mimeType,
        });

        return {
          assetId,
          uploadUrl,
          objectKey,
        };
      }),

    finalizeUpload: adminProcedure
      .input(finalizeProjectFileUploadSchema)
      .mutation(async ({ ctx, input }) => {
        const project = await ensureProjectScope(ctx.db, input.projectId);
        if (input.folderId) {
          await ensureFolderScope(ctx.db, input.folderId, input.projectId);
        }

        const objectKey = buildProjectFileObjectKey({
          assetId: input.assetId,
          clientId: project.clientId,
          projectId: input.projectId,
          fileName: input.fileName,
        });

        let bucket: string;
        try {
          ({ bucket } = await assertR2ObjectExists({ objectKey }));
        } catch {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Upload was not completed in storage.",
          });
        }

        const [existingFile] = await ctx.db
          .select({
            id: projectFiles.id,
            assetId: projectFiles.assetId,
          })
          .from(projectFiles)
          .where(
            and(
              eq(projectFiles.projectId, input.projectId),
              eq(projectFiles.assetId, input.assetId),
            ),
          )
          .limit(1);

        if (existingFile) {
          return {
            fileId: existingFile.id,
            assetId: existingFile.assetId,
            objectKey,
          };
        }

        const [existingAsset] = await ctx.db
          .select({
            id: assets.id,
          })
          .from(assets)
          .where(eq(assets.id, input.assetId))
          .limit(1);

        if (!existingAsset) {
          await ctx.db.insert(assets).values({
            id: input.assetId,
            clientId: project.clientId,
            projectId: input.projectId,
            uploadedByUserId: ctx.session.userId,
            bucket,
            objectKey,
            fileName: input.fileName,
            displayName: input.title,
            mimeType: input.mimeType,
            sizeBytes: input.sizeBytes,
            assetType: "document",
            visibility:
              input.visibility === "admin_only" ? "admin_only" : "client_visible",
            scopeType: "project",
            scopeId: input.projectId,
          });
        }

        const [file] = await ctx.db
          .insert(projectFiles)
          .values({
            clientId: project.clientId,
            projectId: input.projectId,
            folderId: input.folderId ?? null,
            assetId: input.assetId,
            title: input.title,
            description: input.description ?? null,
            visibility: input.visibility,
            uploadedByUserId: ctx.session.userId,
          })
          .returning({
            id: projectFiles.id,
          });

        return {
          fileId: file.id,
          assetId: input.assetId,
          objectKey,
        };
      }),

    getReadUrl: adminProcedure
      .input(readProjectFileSchema)
      .mutation(async ({ ctx, input }) => {
        const file = await ensureProjectFileScope(ctx.db, input.fileId, input.projectId);
        const asset = await ensureAssetBelongsToClient(ctx.db, {
          assetId: file.assetId,
          clientId: file.clientId,
          projectId: input.projectId,
        });

        const url = await createAssetReadUrl({ objectKey: asset.objectKey });
        return { url };
      }),

    renameFile: adminProcedure
      .input(renameProjectFileSchema)
      .mutation(async ({ ctx, input }) => {
        const file = await ensureProjectFileScope(ctx.db, input.fileId, input.projectId);

        const [updatedFile] = await ctx.db
          .update(projectFiles)
          .set({
            title: input.title,
            description:
              input.description === undefined ? undefined : input.description,
            updatedAt: new Date(),
          })
          .where(eq(projectFiles.id, file.id))
          .returning();

        await ctx.db
          .update(assets)
          .set({
            displayName: input.title,
            updatedAt: new Date(),
          })
          .where(eq(assets.id, file.assetId));

        return updatedFile;
      }),

    moveFile: adminProcedure
      .input(moveProjectFileSchema)
      .mutation(async ({ ctx, input }) => {
        await ensureProjectFileScope(ctx.db, input.fileId, input.projectId);
        if (input.folderId) {
          await ensureFolderScope(ctx.db, input.folderId, input.projectId);
        }

        const [file] = await ctx.db
          .update(projectFiles)
          .set({
            folderId: input.folderId,
            updatedAt: new Date(),
          })
          .where(eq(projectFiles.id, input.fileId))
          .returning();

        return file;
      }),

    deleteFile: adminProcedure
      .input(deleteProjectFileSchema)
      .mutation(async ({ ctx, input }) => {
        const file = await ensureProjectFileScope(ctx.db, input.fileId, input.projectId);

        await ctx.db
          .update(assets)
          .set({
            deletedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(assets.id, file.assetId));

        await ctx.db.delete(projectFiles).where(eq(projectFiles.id, input.fileId));
        return { success: true };
      }),
  }),
});
