import { z } from "zod";

import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";
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

export const adminNotificationsRouter = createTRPCRouter({
  unreadCount: adminProcedure.query(async ({ ctx }) => {
    return {
      count: await countUnreadNotifications(ctx.db, {
        userId: ctx.session.userId,
        portal: "admin",
      }),
    };
  }),

  list: adminProcedure.input(listSchema).query(async ({ ctx, input }) => {
    return listNotifications(ctx.db, {
      userId: ctx.session.userId,
      portal: "admin",
      limit: input.limit,
      onlyUnread: input.onlyUnread,
    });
  }),

  archive: adminProcedure.input(listSchema).query(async ({ ctx, input }) => {
    return listNotifications(ctx.db, {
      userId: ctx.session.userId,
      portal: "admin",
      limit: input.limit,
      onlyUnread: input.onlyUnread,
    });
  }),

  markRead: adminProcedure
    .input(z.object({ notificationId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return markNotificationRead(ctx.db, {
        userId: ctx.session.userId,
        portal: "admin",
        notificationId: input.notificationId,
      });
    }),

  markAllRead: adminProcedure.mutation(async ({ ctx }) => {
    await markAllNotificationsRead(ctx.db, {
      userId: ctx.session.userId,
      portal: "admin",
    });
    return { success: true };
  }),
});
