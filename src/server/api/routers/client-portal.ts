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
import { clientPortalNotificationsRouter } from "~/server/api/routers/client-portal-notifications";
import { protectedProcedure, createTRPCRouter } from "~/server/api/trpc";
import { getClerkAdminClient, toClerkClientRole } from "~/server/clients/clerk";
import { syncOrganizationInvitation } from "~/server/clients/sync";
import {
  buildBillingProofObjectKey,
  buildProjectFileObjectKey,
  createAssetReadUrl,
  createPresignedUploadUrl,
} from "~/server/r2";
import {
  assets,
  billingArtifactDocuments,
  billingArtifactPaymentMethods,
  billingTemplates,
  clientInvitations,
  clientMemberships,
  clients,
  paymentMethodConfigs,
  projectBillingAccessStates,
  projectBillingArtifacts,
  projectChangeRequestAttachments,
  projectChangeRequests,
  projectFileVisibilityEnum,
  projectFiles,
  projectFolders,
  projectRequestAttachments,
  projectRequests,
  projectRequestStatusEnum,
  projects,
  projectStatusEnum,
  projectTimelineItems,
  projectTypeEnum,
  proposalComments,
  proposals,
  users,
} from "~/server/db/schema";
import {
  ensureProjectFileScope,
  ensureProposalScope,
  getProjectWorkspaceContext,
  loadProjectFiles,
  loadProjectFolderTree,
} from "~/server/projects/workspace";
import { resolveDocusealSubmitterUrl } from "~/server/docuseal";
import { sendRequestNotificationEmail } from "~/server/emails/service";
import { recordNotificationEvent } from "~/server/notifications/service";

const projectStatusValues = projectStatusEnum.enumValues;
const projectTypeValues = projectTypeEnum.enumValues;
const projectRequestStatusValues = projectRequestStatusEnum.enumValues;
const clientRoleValues = ["admin", "member"] as const;

const listProjectsSchema = z.object({
  search: z.string().trim().max(120).default(""),
  statuses: z.array(z.enum(projectStatusValues)).default([]),
  projectTypes: z.array(z.enum(projectTypeValues)).default([]),
});

const billingHistoryListSchema = z.object({
  status: z.enum(billingHistoryFilterValues).default("all"),
});

const projectScopeSchema = z.object({
  projectId: z.string().uuid(),
});

const artifactScopeSchema = projectScopeSchema.extend({
  artifactId: z.string().uuid(),
});

const prepareProjectRequestAttachmentSchema = z.object({
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(120),
  sizeBytes: z.number().int().positive().max(20 * 1024 * 1024),
});

const prepareChangeRequestAttachmentSchema = projectScopeSchema.extend({
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(120),
  sizeBytes: z.number().int().positive().max(20 * 1024 * 1024),
});

const createProjectRequestSchema = z.object({
  label: z.string().trim().min(2).max(160),
  summary: z.string().trim().min(8).max(20_000),
  productId: z.string().uuid().nullable().optional(),
  attachmentAssetIds: z.array(z.string().uuid()).max(10).default([]),
});

const createChangeRequestSchema = projectScopeSchema.extend({
  label: z.string().trim().min(2).max(160),
  summary: z.string().trim().min(8).max(20_000),
  attachmentAssetIds: z.array(z.string().uuid()).max(10).default([]),
});

const inviteClientMemberSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  jobTitle: z.string().trim().max(120).nullable().optional(),
  phone: z.string().trim().max(32).nullable().optional(),
  role: z.enum(clientRoleValues),
});

const proposalDetailSchema = projectScopeSchema.extend({
  proposalId: z.string().uuid(),
});

const addProposalCommentSchema = proposalDetailSchema.extend({
  body: z.string().trim().min(1).max(4000),
  selectedText: z.string().trim().max(1000).nullable().optional(),
  pageNumber: z.number().int().positive().nullable().optional(),
  anchorJson: z.record(z.string(), z.unknown()).nullable().optional(),
});

const createBillingProofUploadSchema = artifactScopeSchema.extend({
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(120),
  sizeBytes: z.number().int().positive().max(15 * 1024 * 1024),
});

async function resolveClientPortalScope(ctx: {
  db: typeof import("~/server/db").db;
  session: { userId?: string | null; orgId?: string | null };
}) {
  if (!ctx.session.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (!ctx.session.orgId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "No client organization selected." });
  }

  const [client] = await ctx.db
    .select({
      id: clients.id,
      name: clients.name,
      baseCurrency: clients.baseCurrency,
      status: clients.status,
      primaryContactEmail: clients.primaryContactEmail,
      primaryContactPhone: clients.primaryContactPhone,
      coverAssetId: clients.coverAssetId,
      logoAssetId: clients.logoAssetId,
      clerkOrgId: clients.clerkOrgId,
      membershipId: clientMemberships.id,
      membershipRole: clientMemberships.role,
      membershipStatus: clientMemberships.status,
      userName: users.name,
      userEmail: users.email,
    })
    .from(clients)
    .leftJoin(
      clientMemberships,
      and(
        eq(clientMemberships.clientId, clients.id),
        eq(clientMemberships.userId, ctx.session.userId),
        eq(clientMemberships.status, "active"),
      ),
    )
    .leftJoin(users, eq(users.id, ctx.session.userId))
    .where(eq(clients.clerkOrgId, ctx.session.orgId))
    .limit(1);

  if (!client) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Client portal access is not configured." });
  }

  return {
    userId: ctx.session.userId,
    orgId: ctx.session.orgId,
    client: {
      id: client.id,
      name: client.name,
      baseCurrency: client.baseCurrency,
      status: client.status,
      primaryContactEmail: client.primaryContactEmail,
      primaryContactPhone: client.primaryContactPhone,
      coverAssetId: client.coverAssetId,
      logoAssetId: client.logoAssetId,
      clerkOrgId: client.clerkOrgId,
    },
    membership: client.membershipId
      ? {
          id: client.membershipId,
          role: client.membershipRole ?? "member",
          status: client.membershipStatus ?? "active",
        }
      : null,
    user: {
      id: ctx.session.userId,
      name: client.userName,
      email: client.userEmail,
    },
  };
}

async function ensureClientProjectScope(
  db: typeof import("~/server/db").db,
  clientId: string,
  projectId: string,
) {
  const [project] = await db
    .select({
      id: projects.id,
      clientId: projects.clientId,
      name: projects.name,
      description: projects.description,
      currency: projects.currency,
      status: projects.status,
      visibility: projects.visibility,
    })
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.clientId, clientId)))
    .limit(1);

  if (!project || project.visibility !== "visible") {
    throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });
  }

  return project;
}

async function ensureClientBillingArtifactScope(
  db: typeof import("~/server/db").db,
  input: {
    clientId: string;
    projectId: string;
    artifactId: string;
  },
) {
  const [artifact] = await db
    .select()
    .from(projectBillingArtifacts)
    .where(
      and(
        eq(projectBillingArtifacts.id, input.artifactId),
        eq(projectBillingArtifacts.projectId, input.projectId),
        eq(projectBillingArtifacts.clientId, input.clientId),
      ),
    )
    .limit(1);

  if (!artifact) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found." });
  }

  return artifact;
}

async function ensureClientAsset(
  db: typeof import("~/server/db").db,
  input: {
    assetId: string;
    clientId: string;
    projectId?: string;
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

  if (!asset || asset.clientId !== input.clientId || asset.deletedAt) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Attachment not found." });
  }

  if (input.projectId && asset.projectId && asset.projectId !== input.projectId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Attachment is scoped to another project." });
  }

  return asset;
}

async function assertClientInviteAllowed(input: {
  db: typeof import("~/server/db").db;
  clientId: string;
  email: string;
}) {
  const [existingMembership] = await input.db
    .select({ id: clientMemberships.id })
    .from(clientMemberships)
    .where(
      and(
        eq(clientMemberships.clientId, input.clientId),
        eq(clientMemberships.email, input.email),
        eq(clientMemberships.status, "active"),
      ),
    )
    .limit(1);

  if (existingMembership) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "That user is already an active member of this client.",
    });
  }

  const [existingInvite] = await input.db
    .select({ id: clientInvitations.id })
    .from(clientInvitations)
    .where(
      and(
        eq(clientInvitations.clientId, input.clientId),
        eq(clientInvitations.email, input.email),
        eq(clientInvitations.status, "pending"),
      ),
    )
    .limit(1);

  if (existingInvite) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "There is already a pending invite for that email.",
    });
  }
}

async function createClientPortalInvitation(input: {
  db: typeof import("~/server/db").db;
  clientId: string;
  clerkOrgId: string;
  invitedByUserId: string;
  invite: z.infer<typeof inviteClientMemberSchema>;
}) {
  await assertClientInviteAllowed({
    db: input.db,
    clientId: input.clientId,
    email: input.invite.email,
  });

  const clerk = await getClerkAdminClient();
  const invitation = await clerk.organizations.createOrganizationInvitation({
    organizationId: input.clerkOrgId,
    emailAddress: input.invite.email,
    role: toClerkClientRole(input.invite.role),
    inviterUserId: input.invitedByUserId,
    redirectUrl: `${env.APP_URL}/sign-in`,
  });

  await syncOrganizationInvitation(input.db, {
    clientId: input.clientId,
    clerkInvitationId: invitation.id,
    email: invitation.emailAddress,
    name: input.invite.name ?? null,
    jobTitle: input.invite.jobTitle ?? null,
    phone: input.invite.phone ?? null,
    role: input.invite.role,
    status: invitation.status ?? "pending",
    invitedByUserId: input.invitedByUserId,
    invitedAt: invitation.createdAt,
  });
}

function buildRequestAttachmentObjectKey(input: {
  assetId: string;
  clientId: string;
  projectId?: string | null;
  kind: "project-request" | "change-request";
  fileName: string;
}) {
  if (input.projectId) {
    return buildProjectFileObjectKey({
      assetId: input.assetId,
      clientId: input.clientId,
      projectId: input.projectId,
      fileName: `${input.kind}-${input.fileName}`,
    });
  }

  return `clients/${input.clientId}/requests/${input.kind}/${input.assetId}-${input.fileName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")}`;
}

async function safeAssetReadUrl(objectKey: string) {
  try {
    return await createAssetReadUrl({ objectKey, preferPublic: true });
  } catch {
    return null;
  }
}

export const clientPortalRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    return resolveClientPortalScope({ db: ctx.db, session: ctx.session });
  }),

  notifications: clientPortalNotificationsRouter,

  billing: createTRPCRouter({
    listAll: protectedProcedure
      .input(billingHistoryListSchema)
      .query(async ({ ctx, input }) => {
        const scope = await resolveClientPortalScope({ db: ctx.db, session: ctx.session });
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
          .where(
            and(
              eq(projectBillingArtifacts.clientId, scope.client.id),
              eq(projects.visibility, "visible"),
            ),
          )
          .orderBy(desc(projectBillingArtifacts.createdAt));

        const summary = summarizeBillingRows(artifactRows);
        const invoices = artifactRows.filter((artifact) =>
          matchesBillingHistoryFilter(artifact.status, input.status),
        );

        return {
          client: scope.client,
          summary,
          invoices,
        };
      }),
  }),

  settings: createTRPCRouter({
    inviteMember: protectedProcedure
      .input(inviteClientMemberSchema)
      .mutation(async ({ ctx, input }) => {
        const scope = await resolveClientPortalScope({ db: ctx.db, session: ctx.session });

        if (!scope.membership || scope.membership.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only client admins can invite members.",
          });
        }

        await createClientPortalInvitation({
          db: ctx.db,
          clientId: scope.client.id,
          clerkOrgId: scope.client.clerkOrgId,
          invitedByUserId: ctx.session.userId,
          invite: input,
        });

        return { success: true };
      }),
  }),

  projects: createTRPCRouter({
    list: protectedProcedure.input(listProjectsSchema).query(async ({ ctx, input }) => {
      const scope = await resolveClientPortalScope({ db: ctx.db, session: ctx.session });
      const filters = [
        eq(projects.clientId, scope.client.id),
        eq(projects.visibility, "visible"),
      ];

      if (input.search) {
        filters.push(
          or(
            ilike(projects.name, `%${input.search}%`),
            ilike(projects.description, `%${input.search}%`),
          )!,
        );
      }

      if (input.statuses.length > 0) {
        filters.push(inArray(projects.status, input.statuses));
      }

      if (input.projectTypes.length > 0) {
        filters.push(inArray(projects.projectType, input.projectTypes));
      }

      const [projectRows, requestRows] = await Promise.all([
        ctx.db
          .select({
            id: projects.id,
            name: projects.name,
            description: projects.description,
            projectType: projects.projectType,
            status: projects.status,
            currency: projects.currency,
            targetLaunchDate: projects.targetLaunchDate,
            coverAssetId: assets.id,
            coverObjectKey: assets.objectKey,
          })
          .from(projects)
          .leftJoin(assets, eq(projects.coverAssetId, assets.id))
          .where(and(...filters))
          .orderBy(desc(projects.createdAt)),
        ctx.db
          .select({
            id: projectRequests.id,
            label: projectRequests.label,
            status: projectRequests.status,
            createdAt: projectRequests.createdAt,
            projectId: projectRequests.projectId,
          })
          .from(projectRequests)
          .where(eq(projectRequests.clientId, scope.client.id))
          .orderBy(desc(projectRequests.createdAt))
          .limit(8),
      ]);

      const coverUrlByAssetId = new Map<string, string | null>();
      await Promise.all(
        projectRows.map(async (row) => {
          if (row.coverAssetId && row.coverObjectKey) {
            coverUrlByAssetId.set(
              row.coverAssetId,
              await safeAssetReadUrl(row.coverObjectKey),
            );
          }
        }),
      );

      return {
        client: scope.client,
        projects: projectRows.map((row) => ({
          id: row.id,
          name: row.name,
          description: row.description,
          projectType: row.projectType,
          status: row.status,
          currency: row.currency,
          targetLaunchDate: row.targetLaunchDate,
          coverUrl: row.coverAssetId ? coverUrlByAssetId.get(row.coverAssetId) ?? null : null,
          client: {
            id: scope.client.id,
            name: scope.client.name,
          },
        })),
        projectRequests: requestRows,
      };
    }),
  }),

  projectWorkspace: createTRPCRouter({
    context: protectedProcedure.input(projectScopeSchema).query(async ({ ctx, input }) => {
      const scope = await resolveClientPortalScope({ db: ctx.db, session: ctx.session });
      await ensureClientProjectScope(ctx.db, scope.client.id, input.projectId);
      return getProjectWorkspaceContext(ctx.db, input.projectId);
    }),

    overview: protectedProcedure.input(projectScopeSchema).query(async ({ ctx, input }) => {
      const scope = await resolveClientPortalScope({ db: ctx.db, session: ctx.session });
      await ensureClientProjectScope(ctx.db, scope.client.id, input.projectId);
      const workspace = await getProjectWorkspaceContext(ctx.db, input.projectId);

      const [timelineRows, proposalRows, fileRows] = await Promise.all([
        ctx.db
          .select({
            id: projectTimelineItems.id,
            title: projectTimelineItems.title,
            status: projectTimelineItems.status,
            dueAt: projectTimelineItems.dueAt,
          })
          .from(projectTimelineItems)
          .where(
            and(
              eq(projectTimelineItems.projectId, input.projectId),
              eq(projectTimelineItems.visibleToClient, true),
            ),
          )
          .orderBy(asc(projectTimelineItems.sortOrder), asc(projectTimelineItems.dueAt)),
        ctx.db
          .select({
            id: proposals.id,
            title: proposals.title,
            status: proposals.status,
            updatedAt: proposals.updatedAt,
          })
          .from(proposals)
          .where(
            and(
              eq(proposals.projectId, input.projectId),
              inArray(proposals.status, ["sent", "signed", "declined"]),
            ),
          )
          .orderBy(desc(proposals.updatedAt)),
        ctx.db
          .select({ id: projectFiles.id })
          .from(projectFiles)
          .where(
            and(
              eq(projectFiles.projectId, input.projectId),
              eq(projectFiles.visibility, "client_visible"),
            ),
          ),
      ]);

      return {
        project: workspace,
        metrics: {
          fileCount: fileRows.length,
          timelineCount: timelineRows.length,
          proposalCount: proposalRows.length,
        },
        currentTimelineItem: timelineRows[0] ?? null,
        latestProposal: proposalRows[0] ?? null,
      };
    }),
  }),

  timeline: createTRPCRouter({
    list: protectedProcedure.input(projectScopeSchema).query(async ({ ctx, input }) => {
      const scope = await resolveClientPortalScope({ db: ctx.db, session: ctx.session });
      await ensureClientProjectScope(ctx.db, scope.client.id, input.projectId);

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
        .where(
          and(
            eq(projectTimelineItems.projectId, input.projectId),
            eq(projectTimelineItems.visibleToClient, true),
          ),
        )
        .orderBy(
          asc(projectTimelineItems.sortOrder),
          asc(projectTimelineItems.dueAt),
          asc(projectTimelineItems.createdAt),
        );
    }),
  }),

  proposals: createTRPCRouter({
    list: protectedProcedure.input(projectScopeSchema).query(async ({ ctx, input }) => {
      const scope = await resolveClientPortalScope({ db: ctx.db, session: ctx.session });
      await ensureClientProjectScope(ctx.db, scope.client.id, input.projectId);

      const proposalRows = await ctx.db
        .select({
          id: proposals.id,
          title: proposals.title,
          version: proposals.version,
          status: proposals.status,
          commentCount: sql<number>`count(${proposalComments.id})`,
          sourceAssetId: proposals.sourceAssetId,
          docusealSubmissionId: proposals.docusealSubmissionId,
          docusealSubmitterSlug: proposals.docusealSubmitterSlug,
          docusealSubmitterEmbedUrl: proposals.docusealSubmitterEmbedUrl,
          sentAt: proposals.sentAt,
          signedAt: proposals.signedAt,
          declinedAt: proposals.declinedAt,
          createdAt: proposals.createdAt,
          updatedAt: proposals.updatedAt,
        })
        .from(proposals)
        .leftJoin(proposalComments, eq(proposalComments.proposalId, proposals.id))
        .where(
          and(
            eq(proposals.projectId, input.projectId),
            inArray(proposals.status, ["sent", "signed", "declined"]),
          ),
        )
        .groupBy(proposals.id)
        .orderBy(desc(proposals.updatedAt));

      return proposalRows.map((proposal) => ({
        ...proposal,
        docusealSubmitterEmbedUrl: resolveDocusealSubmitterUrl({
          embedUrl: proposal.docusealSubmitterEmbedUrl,
          slug: proposal.docusealSubmitterSlug,
        }),
      }));
    }),

    get: protectedProcedure.input(proposalDetailSchema).query(async ({ ctx, input }) => {
      const scope = await resolveClientPortalScope({ db: ctx.db, session: ctx.session });
      await ensureClientProjectScope(ctx.db, scope.client.id, input.projectId);
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
        comments,
      };
    }),

    getReadUrl: protectedProcedure
      .input(
        proposalDetailSchema.extend({
          assetType: z.enum(["source"]),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const scope = await resolveClientPortalScope({ db: ctx.db, session: ctx.session });
        await ensureClientProjectScope(ctx.db, scope.client.id, input.projectId);
        const proposal = await ensureProposalScope(ctx.db, input.proposalId, input.projectId);

        if (!proposal.sourceAssetId) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Proposal source document not found." });
        }

        const asset = await ensureClientAsset(ctx.db, {
          assetId: proposal.sourceAssetId,
          clientId: scope.client.id,
          projectId: input.projectId,
        });

        return { url: await createAssetReadUrl({ objectKey: asset.objectKey }) };
      }),

    addComment: protectedProcedure.input(addProposalCommentSchema).mutation(async ({ ctx, input }) => {
      const scope = await resolveClientPortalScope({ db: ctx.db, session: ctx.session });
      await ensureClientProjectScope(ctx.db, scope.client.id, input.projectId);
      const proposal = await ensureProposalScope(ctx.db, input.proposalId, input.projectId);

      if (proposal.status === "draft") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Draft proposals cannot receive client comments." });
      }

      const [comment] = await ctx.db
        .insert(proposalComments)
        .values({
          clientId: scope.client.id,
          projectId: input.projectId,
          proposalId: proposal.id,
          authorUserId: scope.userId,
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
        actorUserId: scope.userId,
        clientId: scope.client.id,
        projectId: input.projectId,
        entityType: "proposal",
        entityId: proposal.id,
        payload: {
          proposalTitle: proposal.title,
          projectName: proposal.title,
          commentBody: input.body,
        },
        audiences: [{ kind: "admin_all" }],
        href: `/admin/projects/${input.projectId}/proposals/${proposal.id}`,
      });

      return comment;
    }),
  }),

  projectBilling: createTRPCRouter({
    list: protectedProcedure.input(projectScopeSchema).query(async ({ ctx, input }) => {
      const scope = await resolveClientPortalScope({ db: ctx.db, session: ctx.session });
      const workspace = await ensureClientProjectScope(ctx.db, scope.client.id, input.projectId);
      const [[accessState], artifacts] = await Promise.all([
        ctx.db
          .select()
          .from(projectBillingAccessStates)
          .where(eq(projectBillingAccessStates.projectId, input.projectId))
          .limit(1),
        ctx.db
          .select()
          .from(projectBillingArtifacts)
          .where(
            and(
              eq(projectBillingArtifacts.projectId, input.projectId),
              eq(projectBillingArtifacts.clientId, scope.client.id),
            ),
          )
          .orderBy(desc(projectBillingArtifacts.createdAt)),
      ]);

      return {
        project: workspace,
        accessState: accessState ?? null,
        invoices: artifacts.map((artifact) => ({
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

    getArtifact: protectedProcedure.input(artifactScopeSchema).query(async ({ ctx, input }) => {
      const scope = await resolveClientPortalScope({ db: ctx.db, session: ctx.session });
      const workspace = await ensureClientProjectScope(ctx.db, scope.client.id, input.projectId);
      const artifact = await ensureClientBillingArtifactScope(ctx.db, {
        clientId: scope.client.id,
        projectId: input.projectId,
        artifactId: input.artifactId,
      });

      const [[accessState], paymentMethods, proofAssets, documents] =
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
                eq(assets.visibility, "client_visible"),
              ),
            )
            .orderBy(desc(assets.createdAt)),
          ctx.db
            .select()
            .from(billingArtifactDocuments)
            .where(eq(billingArtifactDocuments.artifactId, input.artifactId))
            .orderBy(asc(billingArtifactDocuments.sortOrder), asc(billingArtifactDocuments.createdAt)),
        ]);

      const methodConfigIds = paymentMethods
        .map((method) => method.configId)
        .filter((value): value is string => Boolean(value));
      const sourceAssetIds = documents
        .map((document) => document.sourceAssetId)
        .filter((value): value is string => Boolean(value));
      const templateIds = documents
        .map((document) => document.templateId)
        .filter((value): value is string => Boolean(value));

      const [methodConfigs, sourceAssets, templateRows] = await Promise.all([
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
          ? ctx.db.select().from(assets).where(inArray(assets.id, sourceAssetIds))
          : Promise.resolve([]),
        templateIds.length > 0
          ? ctx.db.select().from(billingTemplates).where(inArray(billingTemplates.id, templateIds))
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
        project: workspace,
        accessState: accessState ?? null,
        artifact: {
          ...artifact,
          paymentMethods: paymentMethods.map((method) => ({
            ...method,
            imageUrl: method.configId ? (methodImageMap.get(method.configId) ?? null) : null,
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

    createProofUpload: protectedProcedure
      .input(createBillingProofUploadSchema)
      .mutation(async ({ ctx, input }) => {
        const scope = await resolveClientPortalScope({ db: ctx.db, session: ctx.session });
        await ensureClientProjectScope(ctx.db, scope.client.id, input.projectId);
        await ensureClientBillingArtifactScope(ctx.db, {
          clientId: scope.client.id,
          projectId: input.projectId,
          artifactId: input.artifactId,
        });

        const assetId = randomUUID();
        const objectKey = buildBillingProofObjectKey(
          assetId,
          scope.client.id,
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
          clientId: scope.client.id,
          projectId: input.projectId,
          uploadedByUserId: scope.userId,
          bucket,
          objectKey,
          fileName: input.fileName,
          displayName: input.fileName,
          mimeType: input.mimeType,
          sizeBytes: input.sizeBytes,
          assetType: "payment_proof",
          visibility: "client_visible",
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
          actorUserId: scope.userId,
          clientId: scope.client.id,
          projectId: input.projectId,
          entityType: "invoice",
          entityId: input.artifactId,
          payload: {
            clientName: scope.client.name,
            invoiceTitle: input.fileName,
            projectName: input.projectId,
          },
          audiences: [{ kind: "admin_all" }],
          href: "/admin/requests",
        });

        return {
          assetId,
          uploadUrl,
          objectKey,
        };
      }),
  }),

  files: createTRPCRouter({
    list: protectedProcedure.input(projectScopeSchema).query(async ({ ctx, input }) => {
      const scope = await resolveClientPortalScope({ db: ctx.db, session: ctx.session });
      await ensureClientProjectScope(ctx.db, scope.client.id, input.projectId);

      const [folders, files] = await Promise.all([
        loadProjectFolderTree(ctx.db, input.projectId),
        loadProjectFiles(ctx.db, input.projectId),
      ]);

      return {
        folders: folders.filter((folder) => folder.visibility === "client_visible"),
        files: files.filter((file) => file.visibility === "client_visible"),
      };
    }),

    getReadUrl: protectedProcedure
      .input(
        projectScopeSchema.extend({
          fileId: z.string().uuid(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const scope = await resolveClientPortalScope({ db: ctx.db, session: ctx.session });
        await ensureClientProjectScope(ctx.db, scope.client.id, input.projectId);
        const file = await ensureProjectFileScope(ctx.db, input.fileId, input.projectId);
        const asset = await ensureClientAsset(ctx.db, {
          assetId: file.assetId,
          clientId: scope.client.id,
          projectId: input.projectId,
        });

        return { url: await createAssetReadUrl({ objectKey: asset.objectKey }) };
      }),
  }),

  requests: createTRPCRouter({
    listProjectRequests: protectedProcedure.query(async ({ ctx }) => {
      const scope = await resolveClientPortalScope({ db: ctx.db, session: ctx.session });
      return ctx.db
        .select({
          id: projectRequests.id,
          label: projectRequests.label,
          summary: projectRequests.summary,
          status: projectRequests.status,
          createdAt: projectRequests.createdAt,
          projectId: projectRequests.projectId,
        })
        .from(projectRequests)
        .where(eq(projectRequests.clientId, scope.client.id))
        .orderBy(desc(projectRequests.createdAt));
    }),

    listChangeRequests: protectedProcedure
      .input(projectScopeSchema)
      .query(async ({ ctx, input }) => {
        const scope = await resolveClientPortalScope({ db: ctx.db, session: ctx.session });
        await ensureClientProjectScope(ctx.db, scope.client.id, input.projectId);
        return ctx.db
          .select({
            id: projectChangeRequests.id,
            label: projectChangeRequests.label,
            summary: projectChangeRequests.summary,
            status: projectChangeRequests.status,
            createdAt: projectChangeRequests.createdAt,
            reviewedAt: projectChangeRequests.reviewedAt,
          })
          .from(projectChangeRequests)
          .where(
            and(
              eq(projectChangeRequests.clientId, scope.client.id),
              eq(projectChangeRequests.projectId, input.projectId),
            ),
          )
          .orderBy(desc(projectChangeRequests.createdAt));
      }),

    prepareProjectAttachmentUpload: protectedProcedure
      .input(prepareProjectRequestAttachmentSchema)
      .mutation(async ({ ctx, input }) => {
        const scope = await resolveClientPortalScope({ db: ctx.db, session: ctx.session });
        const assetId = randomUUID();
        const objectKey = buildRequestAttachmentObjectKey({
          assetId,
          clientId: scope.client.id,
          kind: "project-request",
          fileName: input.fileName,
        });
        const { bucket, uploadUrl } = await createPresignedUploadUrl({
          objectKey,
          contentType: input.mimeType,
        });

        await ctx.db.insert(assets).values({
          id: assetId,
          clientId: scope.client.id,
          uploadedByUserId: scope.userId,
          bucket,
          objectKey,
          fileName: input.fileName,
          displayName: input.fileName,
          mimeType: input.mimeType,
          sizeBytes: input.sizeBytes,
          assetType: "document",
          visibility: "admin_only",
          scopeType: "unscoped",
        });

        return { assetId, uploadUrl, objectKey };
      }),

    prepareChangeAttachmentUpload: protectedProcedure
      .input(prepareChangeRequestAttachmentSchema)
      .mutation(async ({ ctx, input }) => {
        const scope = await resolveClientPortalScope({ db: ctx.db, session: ctx.session });
        await ensureClientProjectScope(ctx.db, scope.client.id, input.projectId);

        const assetId = randomUUID();
        const objectKey = buildRequestAttachmentObjectKey({
          assetId,
          clientId: scope.client.id,
          projectId: input.projectId,
          kind: "change-request",
          fileName: input.fileName,
        });
        const { bucket, uploadUrl } = await createPresignedUploadUrl({
          objectKey,
          contentType: input.mimeType,
        });

        await ctx.db.insert(assets).values({
          id: assetId,
          clientId: scope.client.id,
          projectId: input.projectId,
          uploadedByUserId: scope.userId,
          bucket,
          objectKey,
          fileName: input.fileName,
          displayName: input.fileName,
          mimeType: input.mimeType,
          sizeBytes: input.sizeBytes,
          assetType: "document",
          visibility: "admin_only",
          scopeType: "unscoped",
        });

        return { assetId, uploadUrl, objectKey };
      }),

    createProjectRequest: protectedProcedure
      .input(createProjectRequestSchema)
      .mutation(async ({ ctx, input }) => {
        const scope = await resolveClientPortalScope({ db: ctx.db, session: ctx.session });
        for (const assetId of input.attachmentAssetIds) {
          await ensureClientAsset(ctx.db, { assetId, clientId: scope.client.id });
        }

        const [request] = await ctx.db
          .insert(projectRequests)
          .values({
            clientId: scope.client.id,
            requestedByUserId: scope.userId,
            label: input.label,
            productId: input.productId ?? null,
            summary: input.summary,
            status: "pending",
          })
          .returning();

        if (input.attachmentAssetIds.length > 0) {
          await ctx.db.insert(projectRequestAttachments).values(
            input.attachmentAssetIds.map((assetId) => ({
              requestId: request.id,
              assetId,
            })),
          );

          await ctx.db
            .update(assets)
            .set({
              scopeType: "project_request",
              scopeId: request.id,
              updatedAt: new Date(),
            })
            .where(inArray(assets.id, input.attachmentAssetIds));
        }

        try {
          await sendRequestNotificationEmail(ctx.db, {
            requestType: "project_request",
            clientId: scope.client.id,
            requestId: request.id,
            requestLabel: request.label,
            requestSummary: request.summary,
          });
        } catch {
          // Request creation must not fail because notification delivery failed.
        }

        await recordNotificationEvent(ctx.db, {
          eventType: "project_request.submitted",
          actorUserId: scope.userId,
          clientId: scope.client.id,
          entityType: "project_request",
          entityId: request.id,
          payload: {
            clientName: scope.client.name,
            requestLabel: request.label,
          },
          audiences: [{ kind: "admin_all" }],
          href: "/admin/requests",
        });

        return request;
      }),

    createChangeRequest: protectedProcedure
      .input(createChangeRequestSchema)
      .mutation(async ({ ctx, input }) => {
        const scope = await resolveClientPortalScope({ db: ctx.db, session: ctx.session });
        await ensureClientProjectScope(ctx.db, scope.client.id, input.projectId);

        for (const assetId of input.attachmentAssetIds) {
          await ensureClientAsset(ctx.db, {
            assetId,
            clientId: scope.client.id,
            projectId: input.projectId,
          });
        }

        const [request] = await ctx.db
          .insert(projectChangeRequests)
          .values({
            clientId: scope.client.id,
            projectId: input.projectId,
            requestedByUserId: scope.userId,
            label: input.label,
            summary: input.summary,
            status: "pending",
          })
          .returning();

        if (input.attachmentAssetIds.length > 0) {
          await ctx.db.insert(projectChangeRequestAttachments).values(
            input.attachmentAssetIds.map((assetId) => ({
              requestId: request.id,
              assetId,
            })),
          );

          await ctx.db
            .update(assets)
            .set({
              scopeType: "change_request",
              scopeId: request.id,
              updatedAt: new Date(),
            })
            .where(inArray(assets.id, input.attachmentAssetIds));
        }

        try {
          await sendRequestNotificationEmail(ctx.db, {
            requestType: "change_request",
            clientId: scope.client.id,
            projectId: input.projectId,
            requestId: request.id,
            requestLabel: request.label,
            requestSummary: request.summary,
          });
        } catch {
          // Request creation must not fail because notification delivery failed.
        }

        await recordNotificationEvent(ctx.db, {
          eventType: "change_request.submitted",
          actorUserId: scope.userId,
          clientId: scope.client.id,
          projectId: input.projectId,
          entityType: "change_request",
          entityId: request.id,
          payload: {
            clientName: scope.client.name,
            requestLabel: request.label,
          },
          audiences: [{ kind: "admin_all" }],
          href: "/admin/requests",
        });

        return request;
      }),
  }),
});
