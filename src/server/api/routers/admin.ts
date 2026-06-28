import { and, asc, desc, eq, ilike, inArray, or } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";
import { assets } from "~/server/db/schema/assets";
import {
  billingAccessStatusEnum,
  billingArtifactPaymentMethods,
  billingArtifactStatusEnum,
  billingLineItems,
  billingPaymentMethodTypeEnum,
  billingPlanKindEnum,
  billingTemplateTypeEnum,
  billingTemplates,
  paymentMethodConfigs,
} from "~/server/db/schema/billing";
import {
  productWebhookConfigs,
  projectBillingAccessStates,
  projectBillingArtifacts,
  projectProductAccounts,
  productAccountStatusEnum,
  webhookReconcileModeEnum,
} from "~/server/db/schema/billing";
import { clients } from "~/server/db/schema/clients";
import { products } from "~/server/db/schema/products";
import {
  projects,
  projectStatusEnum,
  projectTypeEnum,
} from "~/server/db/schema/projects";
import {
  buildBillingProofObjectKey,
  buildProjectCoverObjectKey,
  createAssetReadUrl,
  createPresignedUploadUrl,
} from "~/server/r2";

const projectStatusValues = projectStatusEnum.enumValues;
const projectTypeValues = projectTypeEnum.enumValues;
const billingPlanKindValues = billingPlanKindEnum.enumValues;
const billingArtifactStatusValues = billingArtifactStatusEnum.enumValues;
const billingAccessStatusValues = billingAccessStatusEnum.enumValues;
const billingTemplateTypeValues = billingTemplateTypeEnum.enumValues;
const billingPaymentMethodTypeValues = billingPaymentMethodTypeEnum.enumValues;
const productAccountStatusValues = productAccountStatusEnum.enumValues;
const webhookReconcileModeValues = webhookReconcileModeEnum.enumValues;

const projectIdSchema = z.object({
  projectId: z.string().uuid(),
});

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

const listProjectsSchema = z.object({
  search: z.string().trim().max(120).default(""),
  clientIds: z.array(z.string().uuid()).default([]),
  statuses: z.array(z.enum(projectStatusValues)).default([]),
  projectTypes: z.array(z.enum(projectTypeValues)).default([]),
});

const createProjectCoverUploadSchema = z.object({
  clientId: z.string().uuid(),
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(120),
  sizeBytes: z.number().int().positive().max(10 * 1024 * 1024),
});

const invoiceLineItemSchema = z.object({
  label: z.string().trim().min(1).max(140),
  description: z.string().trim().max(300).nullable().optional(),
  quantity: z.number().int().positive().max(999).default(1),
  unitAmount: z.number().int().nonnegative().max(100_000_000),
});

const createInvoiceSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().max(400).nullable().optional(),
  planKind: z.enum(billingPlanKindValues),
  currency: z.string().trim().min(3).max(8),
  dueAt: z.string().datetime().nullable().optional(),
  nextDueAt: z.string().datetime().nullable().optional(),
  accessExpiresAt: z.string().datetime().nullable().optional(),
  terms: z.string().trim().max(8000).nullable().optional(),
  notes: z.string().trim().max(1000).nullable().optional(),
  lineItems: z.array(invoiceLineItemSchema).min(1).max(12),
  paymentMethodConfigIds: z.array(z.string().uuid()).min(1).max(6),
});

const updateBillingArtifactStatusSchema = z.object({
  projectId: z.string().uuid(),
  artifactId: z.string().uuid(),
  status: z.enum(billingArtifactStatusValues),
  accessStatus: z.enum(billingAccessStatusValues).nullable().optional(),
  nextDueAt: z.string().datetime().nullable().optional(),
  accessExpiresAt: z.string().datetime().nullable().optional(),
  overrideReason: z.string().trim().max(500).nullable().optional(),
});

const createBillingProofUploadSchema = z.object({
  projectId: z.string().uuid(),
  artifactId: z.string().uuid(),
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(120),
  sizeBytes: z.number().int().positive().max(15 * 1024 * 1024),
});

const createBillingTemplateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  templateType: z.enum(billingTemplateTypeValues),
  description: z.string().trim().max(300).nullable().optional(),
  content: z.string().trim().min(8).max(20_000),
  isDefault: z.boolean().default(false),
});

const createPaymentMethodConfigSchema = z.object({
  name: z.string().trim().min(2).max(120),
  methodType: z.enum(billingPaymentMethodTypeValues),
  currency: z.string().trim().min(3).max(8).nullable().optional(),
  instructions: z.string().trim().max(2000).nullable().optional(),
  paymentUrl: z.string().url().nullable().optional(),
  accountName: z.string().trim().max(120).nullable().optional(),
  accountNumberMask: z.string().trim().max(32).nullable().optional(),
  routingNumberMask: z.string().trim().max(32).nullable().optional(),
  bankName: z.string().trim().max(120).nullable().optional(),
  isActive: z.boolean().default(true),
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

async function ensureClientExists(db: typeof import("~/server/db").db, clientId: string) {
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
    return await createAssetReadUrl({ objectKey });
  } catch {
    return null;
  }
}

export const adminRouter = createTRPCRouter({
  me: adminProcedure.query(({ ctx }) => {
    return {
      userId: ctx.session.userId,
      role: "admin" as const,
    };
  }),

  clients: createTRPCRouter({
    options: adminProcedure.query(async ({ ctx }) => {
      return ctx.db
        .select({
          id: clients.id,
          name: clients.name,
          baseCurrency: clients.baseCurrency,
          primaryContactEmail: clients.primaryContactEmail,
        })
        .from(clients)
        .orderBy(asc(clients.name));
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

        const coverUrlByAssetId = new Map<string, string | null>();
        await Promise.all(
          rows.map(async (row) => {
            if (!row.coverAssetId || !row.coverObjectKey) return;
            coverUrlByAssetId.set(
              row.coverAssetId,
              await safeAssetReadUrl(row.coverObjectKey),
            );
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

    byId: adminProcedure.input(projectIdSchema).query(async ({ ctx, input }) => {
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
      };
    }),

    create: adminProcedure
      .input(createProjectSchema)
      .mutation(async ({ ctx, input }) => {
        await ensureClientExists(ctx.db, input.clientId);

        if (input.coverAssetId) {
          const [coverAsset] = await ctx.db
            .select({
              id: assets.id,
              clientId: assets.clientId,
              deletedAt: assets.deletedAt,
            })
            .from(assets)
            .where(eq(assets.id, input.coverAssetId))
            .limit(1);

          if (!coverAsset || coverAsset.deletedAt) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Selected project cover is unavailable.",
            });
          }

          if (coverAsset.clientId !== input.clientId) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Project cover does not belong to the selected client.",
            });
          }
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
        }

        return createdProject;
      }),
  }),

  projectBilling: createTRPCRouter({
    workspace: adminProcedure
      .input(projectIdSchema)
      .query(async ({ ctx, input }) => {
        const project = await ensureProjectExists(ctx.db, input.projectId);

        const [accessState] = await ctx.db
          .select()
          .from(projectBillingAccessStates)
          .where(eq(projectBillingAccessStates.projectId, input.projectId))
          .limit(1);

        const artifactRows = await ctx.db
          .select()
          .from(projectBillingArtifacts)
          .where(eq(projectBillingArtifacts.projectId, input.projectId))
          .orderBy(desc(projectBillingArtifacts.createdAt));

        const artifactIds = artifactRows.map((row) => row.id);

        const [lineItems, paymentMethods, proofAssets, templateRows, methodConfigRows] =
          artifactIds.length > 0
            ? await Promise.all([
                ctx.db
                  .select()
                  .from(billingLineItems)
                  .where(inArray(billingLineItems.artifactId, artifactIds))
                  .orderBy(asc(billingLineItems.sortOrder), asc(billingLineItems.createdAt)),
                ctx.db
                  .select()
                  .from(billingArtifactPaymentMethods)
                  .where(inArray(billingArtifactPaymentMethods.artifactId, artifactIds))
                  .orderBy(
                    asc(billingArtifactPaymentMethods.sortOrder),
                    asc(billingArtifactPaymentMethods.createdAt),
                  ),
                ctx.db
                  .select()
                  .from(assets)
                  .where(
                    and(
                      inArray(assets.scopeId, artifactIds),
                      eq(assets.scopeType, "billing_artifact"),
                    ),
                  ),
                ctx.db
                  .select()
                  .from(billingTemplates)
                  .orderBy(desc(billingTemplates.updatedAt)),
                ctx.db
                  .select()
                  .from(paymentMethodConfigs)
                  .where(eq(paymentMethodConfigs.isActive, true))
                  .orderBy(asc(paymentMethodConfigs.sortOrder), asc(paymentMethodConfigs.name)),
              ])
            : await Promise.all([
                Promise.resolve([]),
                Promise.resolve([]),
                Promise.resolve([]),
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

        const proofUrlMap = new Map<string, string | null>();
        await Promise.all(
          proofAssets.map(async (asset) => {
            proofUrlMap.set(asset.id, await safeAssetReadUrl(asset.objectKey));
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
            product: project.productId
              ? { id: project.productId, name: project.productName ?? "Linked product" }
              : null,
          },
          accessState: accessState ?? null,
          availableTemplates: templateRows,
          availablePaymentMethods: methodConfigRows,
          invoices: artifactRows.map((artifact) => ({
            ...artifact,
            lineItems: lineItems.filter((item) => item.artifactId === artifact.id),
            paymentMethods: paymentMethods.filter((method) => method.artifactId === artifact.id),
            proofAssets: proofAssets
              .filter((asset) => asset.scopeId === artifact.id)
              .map((asset) => ({
                id: asset.id,
                fileName: asset.fileName,
                displayName: asset.displayName,
                uploadedAt: asset.createdAt,
                url: proofUrlMap.get(asset.id) ?? null,
              })),
          })),
        };
      }),

    createInvoice: adminProcedure
      .input(createInvoiceSchema)
      .mutation(async ({ ctx, input }) => {
        const project = await ensureProjectExists(ctx.db, input.projectId);
        const methodConfigs = await ctx.db
          .select()
          .from(paymentMethodConfigs)
          .where(inArray(paymentMethodConfigs.id, input.paymentMethodConfigIds));

        if (methodConfigs.length !== input.paymentMethodConfigIds.length) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "One or more selected payment methods are unavailable.",
          });
        }

        const subtotal = input.lineItems.reduce(
          (sum, item) => sum + item.quantity * item.unitAmount,
          0,
        );

        const artifactId = randomUUID();
        const invoiceNumber = buildInvoiceNumber(input.projectId);
        const dueAt = toDateOrNull(input.dueAt);
        const nextDueAt = toDateOrNull(input.nextDueAt);
        const accessExpiresAt = toDateOrNull(input.accessExpiresAt);

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
          subtotalAmount: subtotal,
          totalAmount: subtotal,
          dueAt,
          nextDueAt,
          accessExpiresAt,
          terms: input.terms ?? null,
          notes: input.notes ?? null,
          createdByAdminId: ctx.session.userId,
          issuedAt: new Date(),
        });

        await ctx.db.insert(billingLineItems).values(
          input.lineItems.map((item, index) => ({
            artifactId,
            label: item.label,
            description: item.description ?? null,
            quantity: item.quantity,
            unitAmount: item.unitAmount,
            totalAmount: item.quantity * item.unitAmount,
            sortOrder: index,
          })),
        );

        await ctx.db.insert(billingArtifactPaymentMethods).values(
          methodConfigs.map((config, index) => ({
            artifactId,
            configId: config.id,
            methodType: config.methodType,
            label: config.name,
            instructions: config.instructions,
            paymentUrl: config.paymentUrl,
            accountName: config.accountName,
            accountNumberMask: config.accountNumberMask,
            routingNumberMask: config.routingNumberMask,
            bankName: config.bankName,
            sortOrder: index,
          })),
        );

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
        };
      }),

    updateStatus: adminProcedure
      .input(updateBillingArtifactStatusSchema)
      .mutation(async ({ ctx, input }) => {
        const project = await ensureProjectExists(ctx.db, input.projectId);

        const [artifact] = await ctx.db
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
            message: "Billing artifact not found.",
          });
        }

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
        const [artifact] = await ctx.db
          .select({
            id: projectBillingArtifacts.id,
          })
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

        return {
          assetId,
          uploadUrl,
          bucket,
          objectKey,
        };
      }),
  }),

  productAccounts: createTRPCRouter({
    byProject: adminProcedure.input(projectIdSchema).query(async ({ ctx, input }) => {
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

  settingsBilling: createTRPCRouter({
    page: adminProcedure.query(async ({ ctx }) => {
      const [templates, paymentMethods, webhookRows] = await Promise.all([
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
      ]);

      return {
        templates,
        paymentMethods,
        webhooks: webhookRows,
      };
    }),

    createTemplate: adminProcedure
      .input(createBillingTemplateSchema)
      .mutation(async ({ ctx, input }) => {
        const [created] = await ctx.db
          .insert(billingTemplates)
          .values({
            name: input.name,
            templateType: input.templateType,
            description: input.description ?? null,
            content: input.content,
            isDefault: input.isDefault,
            createdByAdminId: ctx.session.userId,
          })
          .returning();

        return created;
      }),

    createPaymentMethod: adminProcedure
      .input(createPaymentMethodConfigSchema)
      .mutation(async ({ ctx, input }) => {
        const [created] = await ctx.db
          .insert(paymentMethodConfigs)
          .values({
            name: input.name,
            methodType: input.methodType,
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
});
