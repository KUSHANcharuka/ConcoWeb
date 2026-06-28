import { and, asc, desc, eq, ilike, inArray, isNull } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";
import type { Database } from "~/server/db";
import {
  clientMemberships,
  clients,
  emailDraftRecipients,
  emailDrafts,
  emailGenerationRuns,
  emailSettings,
  emailTemplateAssignments,
  emailTemplates,
  emailTemplateStatusEnum,
  emailTemplateTypeEnum,
  projects,
  sentEmailRecipients,
  sentEmails,
} from "~/server/db/schema";
import {
  createDraftSourceFromSettings,
  emailTemplateTypes,
  getOrCreateEmailSettings,
  renderAndNormalizeEmail,
  resolveTemplateForContext,
  sendDraftEmail,
} from "~/server/emails/service";
import { cloneBuilderSource } from "~/server/emails/starter-layout";

const templateTypeValues = emailTemplateTypeEnum.enumValues;
const templateStatusValues = emailTemplateStatusEnum.enumValues;

const jsonRecord = z.record(z.string(), z.unknown());

const templateUpsertSchema = z.object({
  id: z.string().uuid().optional(),
  templateType: z.enum(templateTypeValues),
  status: z.enum(templateStatusValues).default("draft"),
  name: z.string().trim().min(1).max(160),
  subject: z.string().trim().min(1).max(240),
  builderSourceJson: jsonRecord.optional(),
});

const templateListSchema = z.object({
  search: z.string().trim().max(120).default(""),
  templateType: z.enum(templateTypeValues).nullable().optional(),
  status: z.enum(templateStatusValues).nullable().optional(),
  includeArchived: z.boolean().default(false),
});

const draftListSchema = z.object({
  source: z.enum(["manual", "suggested"]).nullable().optional(),
});

const draftCreateSchema = z.object({
  templateId: z.string().uuid().nullable().optional(),
  templateType: z.enum(templateTypeValues).default("general_outreach"),
  clientId: z.string().uuid().nullable().optional(),
  projectId: z.string().uuid().nullable().optional(),
  subject: z.string().trim().min(1).max(240).optional(),
});

const draftUpdateSchema = z.object({
  draftId: z.string().uuid(),
  subject: z.string().trim().min(1).max(240).optional(),
  builderSourceJson: jsonRecord.optional(),
  status: z.enum(["draft", "suggested", "ready", "discarded"]).optional(),
});

const recipientUpdateSchema = z.object({
  draftId: z.string().uuid(),
  mode: z.enum(["selected_member", "client_default_contact"]),
  clientId: z.string().uuid().nullable().optional(),
  membershipIds: z.array(z.string().uuid()).default([]),
});

const templateAssignmentSchema = z.object({
  templateType: z.enum(templateTypeValues),
  templateId: z.string().uuid(),
  projectId: z.string().uuid().nullable().optional(),
});

const settingsUpdateSchema = z.object({
  fromName: z.string().trim().min(1).max(120),
  fromEmail: z.string().trim().email(),
  replyToEmail: z.string().trim().email(),
  starterLayoutJson: jsonRecord,
  footerCompanyName: z.string().trim().min(1).max(160),
  footerAddress: z.string().trim().max(300).nullable().optional(),
  footerContactEmail: z.string().trim().email(),
  logoUrl: z.string().trim().url().nullable().optional(),
  cronCadenceHours: z.number().int().min(12).max(24),
});

function assertTemplateType(value: string): asserts value is (typeof emailTemplateTypes)[number] {
  if (!emailTemplateTypes.includes(value as (typeof emailTemplateTypes)[number])) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Unsupported template type." });
  }
}

async function loadDraftOrThrow(db: Database, draftId: string) {
  const [draft] = await db.select().from(emailDrafts).where(eq(emailDrafts.id, draftId)).limit(1);
  if (!draft) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Email draft not found." });
  }
  return draft;
}

export const adminEmailsRouter = createTRPCRouter({
  settings: createTRPCRouter({
    get: adminProcedure.query(async ({ ctx }) => {
      const settings = await getOrCreateEmailSettings(ctx.db);
      const [lastRun] = await ctx.db
        .select()
        .from(emailGenerationRuns)
        .orderBy(desc(emailGenerationRuns.startedAt))
        .limit(1);

      const assignments = await ctx.db
        .select({
          id: emailTemplateAssignments.id,
          templateType: emailTemplateAssignments.templateType,
          templateId: emailTemplateAssignments.templateId,
          projectId: emailTemplateAssignments.projectId,
          templateName: emailTemplates.name,
          templateStatus: emailTemplates.status,
        })
        .from(emailTemplateAssignments)
        .innerJoin(emailTemplates, eq(emailTemplateAssignments.templateId, emailTemplates.id))
        .where(isNull(emailTemplateAssignments.projectId))
        .orderBy(asc(emailTemplateAssignments.templateType));

      return { settings, lastRun: lastRun ?? null, assignments };
    }),

    update: adminProcedure.input(settingsUpdateSchema).mutation(async ({ ctx, input }) => {
      const settings = await getOrCreateEmailSettings(ctx.db);
      const [updated] = await ctx.db
        .update(emailSettings)
        .set({
          fromName: input.fromName,
          fromEmail: input.fromEmail,
          replyToEmail: input.replyToEmail,
          starterLayoutJson: input.starterLayoutJson,
          footerCompanyName: input.footerCompanyName,
          footerAddress: input.footerAddress ?? null,
          footerContactEmail: input.footerContactEmail,
          logoUrl: input.logoUrl ?? null,
          cronCadenceHours: input.cronCadenceHours,
          updatedAt: new Date(),
        })
        .where(eq(emailSettings.id, settings.id))
        .returning();
      return updated;
    }),
  }),

  templates: createTRPCRouter({
    list: adminProcedure.input(templateListSchema).query(async ({ ctx, input }) => {
      const filters = [];
      if (input.search) filters.push(ilike(emailTemplates.name, `%${input.search}%`));
      if (input.templateType) filters.push(eq(emailTemplates.templateType, input.templateType));
      if (input.status) filters.push(eq(emailTemplates.status, input.status));
      if (!input.includeArchived) filters.push(inArray(emailTemplates.status, ["draft", "active"]));

      return ctx.db
        .select({
          id: emailTemplates.id,
          templateType: emailTemplates.templateType,
          status: emailTemplates.status,
          name: emailTemplates.name,
          subject: emailTemplates.subject,
          updatedAt: emailTemplates.updatedAt,
          updatedByAdminId: emailTemplates.updatedByAdminId,
        })
        .from(emailTemplates)
        .where(filters.length ? and(...filters) : undefined)
        .orderBy(desc(emailTemplates.updatedAt));
    }),

    get: adminProcedure.input(z.object({ templateId: z.string().uuid() })).query(async ({ ctx, input }) => {
      const [template] = await ctx.db
        .select()
        .from(emailTemplates)
        .where(eq(emailTemplates.id, input.templateId))
        .limit(1);
      if (!template) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Email template not found." });
      }
      return template;
    }),

    save: adminProcedure.input(templateUpsertSchema).mutation(async ({ ctx, input }) => {
      const source =
        input.builderSourceJson ??
        (await createDraftSourceFromSettings(ctx.db, {
          heading: input.name,
          body: "Write your email body here.",
        }));
      const rendered = await renderAndNormalizeEmail(source);

      if (input.id) {
        const [updated] = await ctx.db
          .update(emailTemplates)
          .set({
            templateType: input.templateType,
            status: input.status,
            name: input.name,
            subject: input.subject,
            builderSourceJson: source,
            renderedHtml: rendered.html,
            renderedText: rendered.text,
            updatedByAdminId: ctx.session.userId,
            updatedAt: new Date(),
          })
          .where(eq(emailTemplates.id, input.id))
          .returning();
        return updated;
      }

      const [created] = await ctx.db
        .insert(emailTemplates)
        .values({
          templateType: input.templateType,
          status: input.status,
          name: input.name,
          subject: input.subject,
          builderSourceJson: source,
          renderedHtml: rendered.html,
          renderedText: rendered.text,
          createdByAdminId: ctx.session.userId,
          updatedByAdminId: ctx.session.userId,
        })
        .returning();
      return created;
    }),

    setStatus: adminProcedure
      .input(z.object({ templateId: z.string().uuid(), status: z.enum(templateStatusValues) }))
      .mutation(async ({ ctx, input }) => {
        const [updated] = await ctx.db
          .update(emailTemplates)
          .set({
            status: input.status,
            updatedByAdminId: ctx.session.userId,
            updatedAt: new Date(),
          })
          .where(eq(emailTemplates.id, input.templateId))
          .returning();
        return updated;
      }),

    setAssignment: adminProcedure.input(templateAssignmentSchema).mutation(async ({ ctx, input }) => {
      const [template] = await ctx.db
        .select({ id: emailTemplates.id, status: emailTemplates.status })
        .from(emailTemplates)
        .where(and(eq(emailTemplates.id, input.templateId), eq(emailTemplates.templateType, input.templateType)))
        .limit(1);

      if (!template || template.status !== "active") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only active templates can be assigned as defaults.",
        });
      }

      await ctx.db
        .delete(emailTemplateAssignments)
        .where(
          and(
            eq(emailTemplateAssignments.templateType, input.templateType),
            input.projectId
              ? eq(emailTemplateAssignments.projectId, input.projectId)
              : isNull(emailTemplateAssignments.projectId),
          ),
        );

      const projectId = input.projectId ?? null;
      let clientId: string | null = null;
      if (projectId) {
        const [project] = await ctx.db
          .select({ clientId: projects.clientId })
          .from(projects)
          .where(eq(projects.id, projectId))
          .limit(1);
        clientId = project?.clientId ?? null;
      }

      const [assignment] = await ctx.db
        .insert(emailTemplateAssignments)
        .values({
          templateType: input.templateType,
          templateId: input.templateId,
          clientId,
          projectId,
          createdByAdminId: ctx.session.userId,
        })
        .returning();
      return assignment;
    }),
  }),

  drafts: createTRPCRouter({
    list: adminProcedure.input(draftListSchema).query(async ({ ctx, input }) => {
      const filters = input.source ? [eq(emailDrafts.source, input.source)] : [];
      return ctx.db
        .select({
          id: emailDrafts.id,
          source: emailDrafts.source,
          status: emailDrafts.status,
          templateType: emailDrafts.templateType,
          subject: emailDrafts.subject,
          clientId: emailDrafts.clientId,
          projectId: emailDrafts.projectId,
          triggerType: emailDrafts.triggerType,
          dedupeKey: emailDrafts.dedupeKey,
          updatedAt: emailDrafts.updatedAt,
          clientName: clients.name,
          projectName: projects.name,
        })
        .from(emailDrafts)
        .leftJoin(clients, eq(emailDrafts.clientId, clients.id))
        .leftJoin(projects, eq(emailDrafts.projectId, projects.id))
        .where(filters.length ? and(...filters) : undefined)
        .orderBy(desc(emailDrafts.updatedAt));
    }),

    get: adminProcedure.input(z.object({ draftId: z.string().uuid() })).query(async ({ ctx, input }) => {
      const draft = await loadDraftOrThrow(ctx.db, input.draftId);
      const recipients = await ctx.db
        .select()
        .from(emailDraftRecipients)
        .where(eq(emailDraftRecipients.draftId, input.draftId))
        .orderBy(asc(emailDraftRecipients.email));
      return { draft, recipients };
    }),

    create: adminProcedure.input(draftCreateSchema).mutation(async ({ ctx, input }) => {
      let template = null;
      if (input.templateId) {
        [template] = await ctx.db
          .select()
          .from(emailTemplates)
          .where(eq(emailTemplates.id, input.templateId))
          .limit(1);
      } else if (input.projectId) {
        assertTemplateType(input.templateType);
        template = await resolveTemplateForContext(ctx.db, {
          templateType: input.templateType,
          projectId: input.projectId,
        });
      }

      const source = template
        ? cloneBuilderSource(template.builderSourceJson)
        : await createDraftSourceFromSettings(ctx.db, {
            heading: input.subject ?? "New Concolabs email",
            body: "Write your email body here.",
          });
      const subject = input.subject ?? template?.subject ?? source.subject ?? "A note from Concolabs";
      source.subject = subject;
      const rendered = await renderAndNormalizeEmail(source);

      const [created] = await ctx.db
        .insert(emailDrafts)
        .values({
          source: "manual",
          status: "draft",
          templateType: input.templateType,
          templateId: template?.id,
          clientId: input.clientId ?? null,
          projectId: input.projectId ?? null,
          subject,
          builderSourceJson: source,
          renderedHtml: rendered.html,
          renderedText: rendered.text,
          createdByAdminId: ctx.session.userId,
          updatedByAdminId: ctx.session.userId,
        })
        .returning();
      return created;
    }),

    update: adminProcedure.input(draftUpdateSchema).mutation(async ({ ctx, input }) => {
      const draft = await loadDraftOrThrow(ctx.db, input.draftId);
      const source = input.builderSourceJson ?? draft.builderSourceJson;
      const rendered = await renderAndNormalizeEmail(source);
      const [updated] = await ctx.db
        .update(emailDrafts)
        .set({
          subject: input.subject ?? draft.subject,
          builderSourceJson: source,
          renderedHtml: rendered.html,
          renderedText: rendered.text,
          status: input.status ?? draft.status,
          updatedByAdminId: ctx.session.userId,
          updatedAt: new Date(),
        })
        .where(eq(emailDrafts.id, input.draftId))
        .returning();
      return updated;
    }),

    delete: adminProcedure.input(z.object({ draftId: z.string().uuid() })).mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(emailDrafts)
        .set({ status: "discarded", updatedAt: new Date(), updatedByAdminId: ctx.session.userId })
        .where(eq(emailDrafts.id, input.draftId));
      return { success: true };
    }),

    updateRecipients: adminProcedure.input(recipientUpdateSchema).mutation(async ({ ctx, input }) => {
      const draft = await loadDraftOrThrow(ctx.db, input.draftId);
      await ctx.db.delete(emailDraftRecipients).where(eq(emailDraftRecipients.draftId, input.draftId));

      if (input.mode === "client_default_contact") {
        const clientId = input.clientId ?? draft.clientId;
        if (!clientId) throw new TRPCError({ code: "BAD_REQUEST", message: "Client is required." });
        const [client] = await ctx.db
          .select({ email: clients.primaryContactEmail, name: clients.name })
          .from(clients)
          .where(eq(clients.id, clientId))
          .limit(1);
        if (!client) throw new TRPCError({ code: "NOT_FOUND", message: "Client not found." });
        await ctx.db.insert(emailDraftRecipients).values({
          draftId: input.draftId,
          recipientMode: "client_default_contact",
          email: client.email,
          name: client.name,
        });
      } else if (input.membershipIds.length > 0) {
        const members = await ctx.db
          .select({
            id: clientMemberships.id,
            email: clientMemberships.email,
            name: clientMemberships.email,
          })
          .from(clientMemberships)
          .where(inArray(clientMemberships.id, input.membershipIds));
        await ctx.db.insert(emailDraftRecipients).values(
          members.map((member) => ({
            draftId: input.draftId,
            recipientMode: "selected_member" as const,
            clientMembershipId: member.id,
            email: member.email,
            name: member.name,
          })),
        );
      }

      return { success: true };
    }),

    render: adminProcedure.input(z.object({ draftId: z.string().uuid() })).mutation(async ({ ctx, input }) => {
      const draft = await loadDraftOrThrow(ctx.db, input.draftId);
      const rendered = await renderAndNormalizeEmail(draft.builderSourceJson);
      const [updated] = await ctx.db
        .update(emailDrafts)
        .set({ renderedHtml: rendered.html, renderedText: rendered.text, updatedAt: new Date() })
        .where(eq(emailDrafts.id, draft.id))
        .returning();
      return updated;
    }),

    send: adminProcedure.input(z.object({ draftId: z.string().uuid() })).mutation(async ({ ctx, input }) => {
      return sendDraftEmail(ctx.db, { draftId: input.draftId, adminUserId: ctx.session.userId });
    }),
  }),

  recipients: createTRPCRouter({
    clients: adminProcedure.query(async ({ ctx }) => {
      return ctx.db
        .select({ id: clients.id, name: clients.name, email: clients.primaryContactEmail })
        .from(clients)
        .orderBy(asc(clients.name));
    }),

    members: adminProcedure.input(z.object({ clientId: z.string().uuid() })).query(async ({ ctx, input }) => {
      return ctx.db
        .select({
          id: clientMemberships.id,
          email: clientMemberships.email,
          role: clientMemberships.role,
          status: clientMemberships.status,
        })
        .from(clientMemberships)
        .where(and(eq(clientMemberships.clientId, input.clientId), eq(clientMemberships.status, "active")))
        .orderBy(asc(clientMemberships.email));
    }),
  }),

  sent: createTRPCRouter({
    list: adminProcedure.query(async ({ ctx }) => {
      return ctx.db
        .select({
          id: sentEmails.id,
          subject: sentEmails.subject,
          status: sentEmails.status,
          templateType: sentEmails.templateType,
          providerMessageId: sentEmails.providerMessageId,
          sentAt: sentEmails.sentAt,
          createdAt: sentEmails.createdAt,
          clientName: clients.name,
          projectName: projects.name,
        })
        .from(sentEmails)
        .leftJoin(clients, eq(sentEmails.clientId, clients.id))
        .leftJoin(projects, eq(sentEmails.projectId, projects.id))
        .orderBy(desc(sentEmails.createdAt));
    }),

    get: adminProcedure.input(z.object({ sentEmailId: z.string().uuid() })).query(async ({ ctx, input }) => {
      const [email] = await ctx.db
        .select()
        .from(sentEmails)
        .where(eq(sentEmails.id, input.sentEmailId))
        .limit(1);
      if (!email) throw new TRPCError({ code: "NOT_FOUND", message: "Sent email not found." });
      const recipients = await ctx.db
        .select()
        .from(sentEmailRecipients)
        .where(eq(sentEmailRecipients.sentEmailId, input.sentEmailId))
        .orderBy(asc(sentEmailRecipients.email));
      return { email, recipients };
    }),
  }),
});
