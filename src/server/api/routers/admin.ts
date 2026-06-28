import { and, asc, desc, eq, ilike, inArray, or } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminClientsRouter } from "~/server/api/routers/admin-clients";
import { adminEmailsRouter } from "~/server/api/routers/admin-emails";
import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";
import { assets } from "~/server/db/schema/assets";
import { clients } from "~/server/db/schema/clients";
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
import { products } from "~/server/db/schema/products";
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
  buildProjectCoverObjectKey,
  buildProjectFileObjectKey,
  buildProposalSourceObjectKey,
  createAssetReadUrl,
  createPresignedUploadUrl,
} from "~/server/r2";
import {
  buildDocusealBuilderScriptUrl,
  buildDocusealFormScriptUrl,
  buildDocusealSubmissionUrl,
  createDocusealBuilderToken,
  docusealRequest,
  isDocusealConfigured,
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

const projectStatusValues = projectStatusEnum.enumValues;
const projectTypeValues = projectTypeEnum.enumValues;
const timelineItemStatusValues = projectTimelineItemStatusEnum.enumValues;
const timelineItemTypeValues = projectTimelineItemTypeEnum.enumValues;
const proposalStatusValues = proposalStatusEnum.enumValues;
const proposalCommentStatusValues = proposalCommentStatusEnum.enumValues;
const projectFileVisibilityValues = projectFileVisibilityEnum.enumValues;

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

const projectScopeSchema = z.object({
  projectId: z.string().uuid(),
});

const createProjectCoverUploadSchema = z.object({
  clientId: z.string().uuid(),
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(120),
  sizeBytes: z.number().int().positive().max(10 * 1024 * 1024),
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
  status: z.enum(proposalStatusValues).default("draft"),
  currency: z.string().trim().min(3).max(8),
  totalAmountCents: z.number().int().nonnegative().nullable().optional(),
  sourceAssetId: z.string().uuid().nullable().optional(),
});

const updateProposalSchema = projectScopeSchema.extend({
  proposalId: z.string().uuid(),
  title: z.string().trim().min(1).max(160).optional(),
  version: z.string().trim().min(1).max(40).optional(),
  status: z.enum(proposalStatusValues).optional(),
  currency: z.string().trim().min(3).max(8).optional(),
  totalAmountCents: z.number().int().nonnegative().nullable().optional(),
  sourceAssetId: z.string().uuid().nullable().optional(),
  docusealTemplateId: z.string().trim().nullable().optional(),
  docusealTemplateSlug: z.string().trim().nullable().optional(),
  docusealSubmissionId: z.string().trim().nullable().optional(),
  docusealSubmissionStatus: z.string().trim().nullable().optional(),
  docusealSubmitterId: z.string().trim().nullable().optional(),
  docusealSubmitterSlug: z.string().trim().nullable().optional(),
  docusealSubmitterEmbedUrl: z.string().trim().nullable().optional(),
  sentAt: z.string().trim().nullable().optional(),
  signedAt: z.string().trim().nullable().optional(),
  declinedAt: z.string().trim().nullable().optional(),
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
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(120),
  sizeBytes: z.number().int().positive().max(25 * 1024 * 1024),
});

const proposalReadAssetSchema = projectScopeSchema.extend({
  proposalId: z.string().uuid(),
  assetType: z.enum(["source", "rendered"]),
});

const proposalBuilderTokenSchema = projectScopeSchema.extend({
  proposalId: z.string().uuid(),
});

const createProposalSubmissionSchema = projectScopeSchema.extend({
  proposalId: z.string().uuid(),
  submitters: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(120).optional(),
        email: z.string().email(),
        role: z.string().trim().min(1).max(120).optional(),
        phone: z.string().trim().min(1).max(32).optional(),
      }),
    )
    .min(1),
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

const createProjectFileUploadSchema = projectScopeSchema.extend({
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

export const adminRouter = createTRPCRouter({
  me: adminProcedure.query(({ ctx }) => {
    return {
      userId: ctx.session.userId,
      role: "admin" as const,
    };
  }),

  clients: adminClientsRouter,

  emails: adminEmailsRouter,

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

        return createdProject;
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
            currency: proposals.currency,
            totalAmountCents: proposals.totalAmountCents,
            sourceAssetId: proposals.sourceAssetId,
            renderedAssetId: proposals.renderedAssetId,
            docusealTemplateId: proposals.docusealTemplateId,
            docusealSubmissionId: proposals.docusealSubmissionId,
            docusealSubmitterEmbedUrl: proposals.docusealSubmitterEmbedUrl,
            sentAt: proposals.sentAt,
            signedAt: proposals.signedAt,
            declinedAt: proposals.declinedAt,
            createdAt: proposals.createdAt,
            updatedAt: proposals.updatedAt,
          })
          .from(proposals)
          .where(eq(proposals.projectId, input.projectId))
          .orderBy(desc(proposals.updatedAt));

        return proposalRows;
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
          proposal: detail,
          comments,
        };
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
            status: input.status,
            currency: input.currency.toUpperCase(),
            totalAmountCents: input.totalAmountCents ?? null,
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
            status: input.status,
            currency: input.currency?.toUpperCase(),
            totalAmountCents:
              input.totalAmountCents === undefined ? undefined : input.totalAmountCents,
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
            sentAt:
              input.sentAt === undefined ? undefined : parseOptionalTimestamp(input.sentAt),
            signedAt:
              input.signedAt === undefined ? undefined : parseOptionalTimestamp(input.signedAt),
            declinedAt:
              input.declinedAt === undefined
                ? undefined
                : parseOptionalTimestamp(input.declinedAt),
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

    addComment: adminProcedure
      .input(addProposalCommentSchema)
      .mutation(async ({ ctx, input }) => {
        const proposal = await ensureProposalScope(ctx.db, input.proposalId, input.projectId);

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

        return createdComment;
      }),

    updateCommentStatus: adminProcedure
      .input(updateProposalCommentStatusSchema)
      .mutation(async ({ ctx, input }) => {
        await ensureProposalScope(ctx.db, input.proposalId, input.projectId);

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
        const assetId =
          input.assetType === "source" ? proposal.sourceAssetId : proposal.renderedAssetId;

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
              "DocuSeal is not configured. Add DOCUSEAL_BASE_URL and DOCUSEAL_API_KEY to enable proposal editing.",
          };
        }

        const sourceAsset = await ensureAssetBelongsToClient(ctx.db, {
          assetId: proposal.sourceAssetId,
          clientId: proposal.clientId,
          projectId: input.projectId,
        });
        const sourceUrl = await createAssetReadUrl({ objectKey: sourceAsset.objectKey });
        const adminEmail =
          ctx.session.sessionClaims?.email as string | undefined | null;
        if (!adminEmail) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Admin email is required to open DocuSeal builder.",
          });
        }

        const templateId =
          proposal.docusealTemplateId && /^\d+$/.test(proposal.docusealTemplateId)
            ? Number(proposal.docusealTemplateId)
            : null;

        const token = createDocusealBuilderToken({
          userEmail: adminEmail,
          externalId: proposal.id,
          name: proposal.id,
          documentUrls: [sourceUrl],
          templateId,
        });

        return {
          configured: true as const,
          token,
          scriptUrl: buildDocusealBuilderScriptUrl(),
          formScriptUrl: buildDocusealFormScriptUrl(),
        };
      }),

    createSubmission: adminProcedure
      .input(createProposalSubmissionSchema)
      .mutation(async ({ ctx, input }) => {
        const proposal = await ensureProposalScope(ctx.db, input.proposalId, input.projectId);
        if (!proposal.docusealTemplateId || !/^\d+$/.test(proposal.docusealTemplateId)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Save the DocuSeal template before sending it for signature.",
          });
        }

        const response = await docusealRequest<{
          id: number;
          status: string;
          submitters?: Array<{
            id: number;
            slug?: string | null;
            email?: string | null;
            role?: string | null;
          }>;
        }>("/v1/submissions", {
          method: "POST",
          body: JSON.stringify({
            template_id: Number(proposal.docusealTemplateId),
            send_email: false,
            submitters: input.submitters.map((submitter) => ({
              name: submitter.name,
              email: submitter.email,
              role: submitter.role,
              phone: submitter.phone,
              external_id: proposal.id,
            })),
          }),
        });

        const primarySubmitter = response.submitters?.[0];
        const submitterEmbedUrl = primarySubmitter?.slug
          ? buildDocusealSubmissionUrl(primarySubmitter.slug)
          : null;

        const [updatedProposal] = await ctx.db
          .update(proposals)
          .set({
            status: "sent",
            docusealSubmissionId: String(response.id),
            docusealSubmissionStatus: response.status,
            docusealSubmitterId:
              primarySubmitter?.id !== undefined ? String(primarySubmitter.id) : null,
            docusealSubmitterSlug: primarySubmitter?.slug ?? null,
            docusealSubmitterEmbedUrl: submitterEmbedUrl,
            sentAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(proposals.id, proposal.id))
          .returning();

        return updatedProposal;
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

    createUpload: adminProcedure
      .input(createProjectFileUploadSchema)
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

        await ctx.db.insert(assets).values({
          id: assetId,
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
          visibility: input.visibility === "admin_only" ? "admin_only" : "client_visible",
          scopeType: "project",
          scopeId: input.projectId,
        });

        const [file] = await ctx.db
          .insert(projectFiles)
          .values({
            clientId: project.clientId,
            projectId: input.projectId,
            folderId: input.folderId ?? null,
            assetId,
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
          assetId,
          uploadUrl,
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
