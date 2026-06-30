import { eq } from "drizzle-orm";
import { z } from "zod";

import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";
import { notificationSettings } from "~/server/db/schema";
import {
  buildReminderTemplateKey,
  defaultReminderEmailTemplates,
  defaultReminderInAppTemplates,
  defaultReminderWindows,
  reminderWindowKeys,
} from "~/server/notifications/catalog";
import { getNotificationSettingsSnapshot, getOrCreateNotificationSettings } from "~/server/notifications/service";

const reminderTemplateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(4000),
});

const reminderEmailTemplateSchema = z.object({
  subject: z.string().trim().min(1).max(240),
  body: z.string().trim().min(1).max(4000),
});

const reminderWindowSchema = z.enum(reminderWindowKeys);

const settingsUpdateSchema = z.object({
  timezone: z.string().trim().min(1).default("Asia/Colombo"),
  cadenceMinutes: z.number().int().min(15).max(1440),
  paymentRemindersEnabled: z.boolean(),
  accessRemindersEnabled: z.boolean(),
  paymentReminderWindows: z.array(reminderWindowSchema),
  accessReminderWindows: z.array(reminderWindowSchema),
  inAppTemplates: z.record(z.string(), reminderTemplateSchema),
  emailDraftTemplates: z.record(z.string(), reminderEmailTemplateSchema),
});

export const adminNotificationSettingsRouter = createTRPCRouter({
  get: adminProcedure.query(async ({ ctx }) => {
    return getNotificationSettingsSnapshot(ctx.db);
  }),

  getDefaults: adminProcedure.query(() => {
    return {
      defaultWindows: defaultReminderWindows,
      defaultInAppTemplates: defaultReminderInAppTemplates,
      defaultEmailDraftTemplates: defaultReminderEmailTemplates,
      windowOptions: [
        { value: "t_minus_7d", label: "7 days before" },
        { value: "t_minus_1d", label: "1 day before" },
        { value: "day_of", label: "Day of at 8:00 AM" },
        { value: "plus_1d", label: "1 day after" },
        { value: "plus_3d", label: "3 days after" },
        { value: "plus_7d", label: "7 days after" },
      ],
      reminderKeys: [
        buildReminderTemplateKey("payment", "t_minus_7d"),
        buildReminderTemplateKey("payment", "t_minus_1d"),
        buildReminderTemplateKey("payment", "day_of"),
        buildReminderTemplateKey("payment", "plus_1d"),
        buildReminderTemplateKey("payment", "plus_3d"),
        buildReminderTemplateKey("payment", "plus_7d"),
        buildReminderTemplateKey("access", "t_minus_7d"),
        buildReminderTemplateKey("access", "t_minus_1d"),
        buildReminderTemplateKey("access", "day_of"),
        buildReminderTemplateKey("access", "plus_1d"),
        buildReminderTemplateKey("access", "plus_3d"),
        buildReminderTemplateKey("access", "plus_7d"),
      ],
    };
  }),

  update: adminProcedure.input(settingsUpdateSchema).mutation(async ({ ctx, input }) => {
    const settings = await getOrCreateNotificationSettings(ctx.db);
    const [updated] = await ctx.db
      .update(notificationSettings)
      .set({
        timezone: input.timezone,
        cadenceMinutes: input.cadenceMinutes,
        paymentRemindersEnabled: input.paymentRemindersEnabled,
        accessRemindersEnabled: input.accessRemindersEnabled,
        paymentReminderWindows: input.paymentReminderWindows,
        accessReminderWindows: input.accessReminderWindows,
        inAppTemplates: input.inAppTemplates,
        emailDraftTemplates: input.emailDraftTemplates,
        updatedAt: new Date(),
      })
      .where(eq(notificationSettings.id, settings.id))
      .returning();

    return updated;
  }),
});
