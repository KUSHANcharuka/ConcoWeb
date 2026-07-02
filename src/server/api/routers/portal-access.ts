import { randomUUID } from "node:crypto";
import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  guestPortalIntakes,
  guestPortalIntakeAttachments,
} from "~/server/db/schema";
import {
  buildGuestPortalIntakeAttachmentObjectKey,
  createPresignedUploadUrl,
} from "~/server/r2";
import { sendGuestPortalIntakeNotificationEmail } from "~/server/emails/service";
import { recordNotificationEvent } from "~/server/notifications/service";

const prepareGuestPortalAttachmentUploadSchema = z.object({
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(120),
  sizeBytes: z.number().int().positive().max(20 * 1024 * 1024),
});

const createGuestPortalIntakeSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  company: z.string().trim().min(2).max(160),
  summary: z.string().trim().min(8).max(20_000),
  attachmentIds: z.array(z.string().uuid()).max(10).default([]),
});

export const portalAccessRouter = createTRPCRouter({
  prepareGuestAttachmentUpload: publicProcedure
    .input(prepareGuestPortalAttachmentUploadSchema)
    .mutation(async ({ ctx, input }) => {
      const attachmentId = randomUUID();
      const objectKey = buildGuestPortalIntakeAttachmentObjectKey({
        attachmentId,
        fileName: input.fileName,
      });
      const { bucket, uploadUrl } = await createPresignedUploadUrl({
        objectKey,
        contentType: input.mimeType,
      });

      await ctx.db.insert(guestPortalIntakeAttachments).values({
        id: attachmentId,
        bucket,
        objectKey,
        fileName: input.fileName,
        displayName: input.fileName,
        mimeType: input.mimeType,
        sizeBytes: String(input.sizeBytes),
      });

      return { attachmentId, uploadUrl };
    }),

  createGuestIntake: publicProcedure
    .input(createGuestPortalIntakeSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.attachmentIds.length > 0) {
        const uploadedAttachments = await ctx.db
          .select({ id: guestPortalIntakeAttachments.id, intakeId: guestPortalIntakeAttachments.intakeId })
          .from(guestPortalIntakeAttachments)
          .where(inArray(guestPortalIntakeAttachments.id, input.attachmentIds));

        if (uploadedAttachments.length !== input.attachmentIds.length) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Some uploaded attachments were not found." });
        }

        const alreadyAttached = uploadedAttachments.find((attachment) => attachment.intakeId !== null);
        if (alreadyAttached) {
          throw new TRPCError({ code: "CONFLICT", message: "An uploaded attachment has already been used." });
        }
      }

      const [intake] = await ctx.db
        .insert(guestPortalIntakes)
        .values({
          name: input.name,
          email: input.email,
          company: input.company,
          summary: input.summary,
        })
        .returning();

      if (!intake) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create guest portal intake.",
        });
      }

      if (input.attachmentIds.length > 0) {
        await ctx.db
          .update(guestPortalIntakeAttachments)
          .set({ intakeId: intake.id })
          .where(
            and(
              inArray(guestPortalIntakeAttachments.id, input.attachmentIds),
              isNull(guestPortalIntakeAttachments.intakeId),
            ),
          );
      }

      try {
        await sendGuestPortalIntakeNotificationEmail(ctx.db, {
          intakeId: intake.id,
          name: intake.name,
          email: intake.email,
          company: intake.company,
          summary: intake.summary,
        });
      } catch {
        // Intake submission must not fail because email delivery failed.
      }

      await recordNotificationEvent(ctx.db, {
        eventType: "guest_portal_intake.submitted",
        actorUserId: ctx.session.userId ?? undefined,
        entityType: "guest_portal_intake",
        entityId: intake.id,
        payload: {
          company: intake.company,
          email: intake.email,
          name: intake.name,
        },
        audiences: [{ kind: "admin_all" }],
        href: "/admin/requests",
      });

      return { intakeId: intake.id };
    }),

  listRecentGuestIntakes: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        id: guestPortalIntakes.id,
        name: guestPortalIntakes.name,
        company: guestPortalIntakes.company,
        status: guestPortalIntakes.status,
        createdAt: guestPortalIntakes.createdAt,
      })
      .from(guestPortalIntakes)
      .orderBy(desc(guestPortalIntakes.createdAt))
      .limit(3);
  }),
});
