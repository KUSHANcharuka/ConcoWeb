import { and, desc, eq, ilike, inArray, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";
import {
  assets,
  clients,
  projectChangeRequestAttachments,
  projectChangeRequests,
  projectRequestAttachments,
  projectRequests,
  projectRequestStatusEnum,
  projects,
  users,
} from "~/server/db/schema";
import { recordNotificationEvent } from "~/server/notifications/service";
import { createAssetReadUrl } from "~/server/r2";

const requestStatusValues = projectRequestStatusEnum.enumValues;

const listRequestsSchema = z.object({
  search: z.string().trim().max(120).default(""),
  statuses: z.array(z.enum(requestStatusValues)).default([]),
  projectId: z.string().uuid().nullable().optional(),
});

const requestReviewStatusSchema = z.enum(["approved", "rejected"]);

const requestAttachmentReadUrlSchema = z.object({
  requestKind: z.enum(["project", "change"]),
  requestId: z.string().uuid(),
  assetId: z.string().uuid(),
});

async function ensureProjectRequest(requestId: string, db: typeof import("~/server/db").db) {
  const [request] = await db
    .select()
    .from(projectRequests)
    .where(eq(projectRequests.id, requestId))
    .limit(1);

  if (!request) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Project request not found." });
  }

  return request;
}

async function ensureChangeRequest(requestId: string, db: typeof import("~/server/db").db) {
  const [request] = await db
    .select()
    .from(projectChangeRequests)
    .where(eq(projectChangeRequests.id, requestId))
    .limit(1);

  if (!request) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Change request not found." });
  }

  return request;
}

export const adminRequestsRouter = createTRPCRouter({
  listProjectRequests: adminProcedure
    .input(listRequestsSchema)
    .query(async ({ ctx, input }) => {
      const filters = [];
      if (input.search) {
        filters.push(
          or(
            ilike(projectRequests.label, `%${input.search}%`),
            ilike(projectRequests.summary, `%${input.search}%`),
            ilike(clients.name, `%${input.search}%`),
          )!,
        );
      }
      if (input.statuses.length > 0) {
        filters.push(inArray(projectRequests.status, input.statuses));
      }

      return ctx.db
        .select({
          id: projectRequests.id,
          clientId: projectRequests.clientId,
          clientName: clients.name,
          projectId: projectRequests.projectId,
          projectName: projects.name,
          label: projectRequests.label,
          summary: projectRequests.summary,
          status: projectRequests.status,
          requestedByUserId: projectRequests.requestedByUserId,
          requestedByName: users.name,
          requestedByEmail: users.email,
          reviewedAt: projectRequests.reviewedAt,
          createdAt: projectRequests.createdAt,
        })
        .from(projectRequests)
        .innerJoin(clients, eq(projectRequests.clientId, clients.id))
        .leftJoin(projects, eq(projectRequests.projectId, projects.id))
        .leftJoin(users, eq(projectRequests.requestedByUserId, users.id))
        .where(filters.length > 0 ? and(...filters) : undefined)
        .orderBy(desc(projectRequests.createdAt));
    }),

  getProjectRequest: adminProcedure
    .input(z.object({ requestId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      await ensureProjectRequest(input.requestId, ctx.db);

      const [detail] = await ctx.db
        .select({
          id: projectRequests.id,
          clientId: projectRequests.clientId,
          clientName: clients.name,
          projectId: projectRequests.projectId,
          projectName: projects.name,
          label: projectRequests.label,
          summary: projectRequests.summary,
          status: projectRequests.status,
          requestedByUserId: projectRequests.requestedByUserId,
          requestedByName: users.name,
          requestedByEmail: users.email,
          reviewedByAdminId: projectRequests.reviewedByAdminId,
          reviewedAt: projectRequests.reviewedAt,
          createdAt: projectRequests.createdAt,
        })
        .from(projectRequests)
        .innerJoin(clients, eq(projectRequests.clientId, clients.id))
        .leftJoin(projects, eq(projectRequests.projectId, projects.id))
        .leftJoin(users, eq(projectRequests.requestedByUserId, users.id))
        .where(eq(projectRequests.id, input.requestId))
        .limit(1);

      const attachments = await ctx.db
        .select({
          id: projectRequestAttachments.id,
          assetId: assets.id,
          fileName: assets.fileName,
          displayName: assets.displayName,
          mimeType: assets.mimeType,
          sizeBytes: assets.sizeBytes,
          createdAt: projectRequestAttachments.createdAt,
        })
        .from(projectRequestAttachments)
        .innerJoin(assets, eq(projectRequestAttachments.assetId, assets.id))
        .where(eq(projectRequestAttachments.requestId, input.requestId))
        .orderBy(desc(projectRequestAttachments.createdAt));

      return { request: detail, attachments };
    }),

  reviewProjectRequest: adminProcedure
    .input(
      z.object({
        requestId: z.string().uuid(),
        status: requestReviewStatusSchema,
        projectId: z.string().uuid().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const request = await ensureProjectRequest(input.requestId, ctx.db);
      const [updated] = await ctx.db
        .update(projectRequests)
        .set({
          status: input.status,
          projectId: input.projectId ?? null,
          reviewedByAdminId: ctx.session.userId,
          reviewedAt: new Date(),
        })
        .where(eq(projectRequests.id, input.requestId))
        .returning();

      if (updated) {
        await recordNotificationEvent(ctx.db, {
          eventType: "project_request.reviewed",
          actorUserId: ctx.session.userId,
          clientId: updated.clientId,
          projectId: updated.projectId,
          entityType: "project_request",
          entityId: updated.id,
          payload: {
            requestLabel: updated.label,
            status: input.status,
          },
          audiences: [{ kind: "client_members", clientId: updated.clientId }],
          href: updated.projectId
            ? `/client-portal/projects/${updated.projectId}`
            : "/client-portal/requests",
        });
      }

      return updated;
    }),

  listChangeRequests: adminProcedure
    .input(listRequestsSchema)
    .query(async ({ ctx, input }) => {
      const filters = [];
      if (input.search) {
        filters.push(
          or(
            ilike(projectChangeRequests.label, `%${input.search}%`),
            ilike(projectChangeRequests.summary, `%${input.search}%`),
            ilike(clients.name, `%${input.search}%`),
            ilike(projects.name, `%${input.search}%`),
          )!,
        );
      }
      if (input.statuses.length > 0) {
        filters.push(inArray(projectChangeRequests.status, input.statuses));
      }
      if (input.projectId) {
        filters.push(eq(projectChangeRequests.projectId, input.projectId));
      }

      return ctx.db
        .select({
          id: projectChangeRequests.id,
          clientId: projectChangeRequests.clientId,
          clientName: clients.name,
          projectId: projectChangeRequests.projectId,
          projectName: projects.name,
          label: projectChangeRequests.label,
          summary: projectChangeRequests.summary,
          status: projectChangeRequests.status,
          requestedByUserId: projectChangeRequests.requestedByUserId,
          requestedByName: users.name,
          requestedByEmail: users.email,
          reviewedAt: projectChangeRequests.reviewedAt,
          createdAt: projectChangeRequests.createdAt,
        })
        .from(projectChangeRequests)
        .innerJoin(clients, eq(projectChangeRequests.clientId, clients.id))
        .innerJoin(projects, eq(projectChangeRequests.projectId, projects.id))
        .leftJoin(users, eq(projectChangeRequests.requestedByUserId, users.id))
        .where(filters.length > 0 ? and(...filters) : undefined)
        .orderBy(desc(projectChangeRequests.createdAt));
    }),

  getChangeRequest: adminProcedure
    .input(z.object({ requestId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      await ensureChangeRequest(input.requestId, ctx.db);

      const [detail] = await ctx.db
        .select({
          id: projectChangeRequests.id,
          clientId: projectChangeRequests.clientId,
          clientName: clients.name,
          projectId: projectChangeRequests.projectId,
          projectName: projects.name,
          label: projectChangeRequests.label,
          summary: projectChangeRequests.summary,
          status: projectChangeRequests.status,
          requestedByUserId: projectChangeRequests.requestedByUserId,
          requestedByName: users.name,
          requestedByEmail: users.email,
          reviewedByAdminId: projectChangeRequests.reviewedByAdminId,
          reviewedAt: projectChangeRequests.reviewedAt,
          createdAt: projectChangeRequests.createdAt,
        })
        .from(projectChangeRequests)
        .innerJoin(clients, eq(projectChangeRequests.clientId, clients.id))
        .innerJoin(projects, eq(projectChangeRequests.projectId, projects.id))
        .leftJoin(users, eq(projectChangeRequests.requestedByUserId, users.id))
        .where(eq(projectChangeRequests.id, input.requestId))
        .limit(1);

      const attachments = await ctx.db
        .select({
          id: projectChangeRequestAttachments.id,
          assetId: assets.id,
          fileName: assets.fileName,
          displayName: assets.displayName,
          mimeType: assets.mimeType,
          sizeBytes: assets.sizeBytes,
          createdAt: projectChangeRequestAttachments.createdAt,
        })
        .from(projectChangeRequestAttachments)
        .innerJoin(assets, eq(projectChangeRequestAttachments.assetId, assets.id))
        .where(eq(projectChangeRequestAttachments.requestId, input.requestId))
        .orderBy(desc(projectChangeRequestAttachments.createdAt));

      return { request: detail, attachments };
    }),

  reviewChangeRequest: adminProcedure
    .input(
      z.object({
        requestId: z.string().uuid(),
        status: requestReviewStatusSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const request = await ensureChangeRequest(input.requestId, ctx.db);
      const [updated] = await ctx.db
        .update(projectChangeRequests)
        .set({
          status: input.status,
          reviewedByAdminId: ctx.session.userId,
          reviewedAt: new Date(),
        })
        .where(eq(projectChangeRequests.id, input.requestId))
        .returning();

      if (updated) {
        await recordNotificationEvent(ctx.db, {
          eventType: "change_request.reviewed",
          actorUserId: ctx.session.userId,
          clientId: updated.clientId,
          projectId: updated.projectId,
          entityType: "change_request",
          entityId: updated.id,
          payload: {
            requestLabel: updated.label,
            status: input.status,
          },
          audiences: [{ kind: "client_members", clientId: updated.clientId }],
          href: `/client-portal/projects/${updated.projectId}/request-change`,
        });
      }

      return updated;
    }),

  getAttachmentReadUrl: adminProcedure
    .input(requestAttachmentReadUrlSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.requestKind === "project") {
        await ensureProjectRequest(input.requestId, ctx.db);
        const [attachment] = await ctx.db
          .select({
            objectKey: assets.objectKey,
          })
          .from(projectRequestAttachments)
          .innerJoin(assets, eq(projectRequestAttachments.assetId, assets.id))
          .where(
            and(
              eq(projectRequestAttachments.requestId, input.requestId),
              eq(projectRequestAttachments.assetId, input.assetId),
            ),
          )
          .limit(1);

        if (!attachment) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Attachment not found." });
        }

        return { url: await createAssetReadUrl({ objectKey: attachment.objectKey }) };
      }

      await ensureChangeRequest(input.requestId, ctx.db);
      const [attachment] = await ctx.db
        .select({
          objectKey: assets.objectKey,
        })
        .from(projectChangeRequestAttachments)
        .innerJoin(assets, eq(projectChangeRequestAttachments.assetId, assets.id))
        .where(
          and(
            eq(projectChangeRequestAttachments.requestId, input.requestId),
            eq(projectChangeRequestAttachments.assetId, input.assetId),
          ),
        )
        .limit(1);

      if (!attachment) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Attachment not found." });
      }

      return { url: await createAssetReadUrl({ objectKey: attachment.objectKey }) };
    }),
});
