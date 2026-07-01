import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, createTRPCRouter } from "~/server/api/trpc";
import { clients } from "~/server/db/schema";
import {
  countUnreadNotifications,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "~/server/notifications/service";

const listSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  onlyUnread: z.boolean().default(false),
});

async function resolveActiveClientId(ctx: {
  db: typeof import("~/server/db").db;
  session: { orgId?: string | null };
}) {
  if (!ctx.session.orgId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "No active client organization." });
  }

  const [client] = await ctx.db
    .select({ id: clients.id })
    .from(clients)
    .where(eq(clients.clerkOrgId, ctx.session.orgId))
    .limit(1);

  if (!client) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Client organization not found." });
  }

  return client.id;
}

export const clientPortalNotificationsRouter = createTRPCRouter({
  unreadCount: protectedProcedure.query(async ({ ctx }) => {
    const clientId = await resolveActiveClientId(ctx);
    return {
      count: await countUnreadNotifications(ctx.db, {
        userId: ctx.session.userId,
        portal: "client",
        clientId,
      }),
    };
  }),

  list: protectedProcedure.input(listSchema).query(async ({ ctx, input }) => {
    const clientId = await resolveActiveClientId(ctx);
    return listNotifications(ctx.db, {
      userId: ctx.session.userId,
      portal: "client",
      clientId,
      limit: input.limit,
      onlyUnread: input.onlyUnread,
    });
  }),

  archive: protectedProcedure.input(listSchema).query(async ({ ctx, input }) => {
    const clientId = await resolveActiveClientId(ctx);
    return listNotifications(ctx.db, {
      userId: ctx.session.userId,
      portal: "client",
      clientId,
      limit: input.limit,
      onlyUnread: input.onlyUnread,
    });
  }),

  markRead: protectedProcedure
    .input(z.object({ notificationId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const clientId = await resolveActiveClientId(ctx);
      return markNotificationRead(ctx.db, {
        userId: ctx.session.userId,
        portal: "client",
        clientId,
        notificationId: input.notificationId,
      });
    }),

  markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
    const clientId = await resolveActiveClientId(ctx);
    await markAllNotificationsRead(ctx.db, {
      userId: ctx.session.userId,
      portal: "client",
      clientId,
    });
    return { success: true };
  }),
});
