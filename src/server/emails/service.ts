import "server-only";

import { and, desc, eq, inArray, isNull, or } from "drizzle-orm";
import { Resend } from "resend";

import { env } from "~/env";
import type { Database } from "~/server/db";
import {
  clientMemberships,
  clients,
  emailDeliveryEvents,
  emailDraftRecipients,
  emailDrafts,
  emailGenerationRuns,
  emailSettings,
  emailTemplateAssignments,
  emailTemplates,
  projectTimelineItems,
  projects,
  proposals,
  sentEmailRecipients,
  sentEmails,
} from "~/server/db/schema";
import { renderEmailSource } from "./render";
import {
  cloneBuilderSource,
  createStarterEmailSource,
  type EmailBuilderSource,
} from "./starter-layout";

export const emailTemplateTypes = [
  "welcome",
  "proposal",
  "payment_reminder",
  "invoice",
  "general_outreach",
] as const;

export async function getOrCreateEmailSettings(db: Database) {
  const [settings] = await db
    .select()
    .from(emailSettings)
    .orderBy(desc(emailSettings.createdAt))
    .limit(1);

  if (settings) return settings;

  const [created] = await db
    .insert(emailSettings)
    .values({
      starterLayoutJson: createStarterEmailSource(),
    })
    .returning();

  if (!created) {
    throw new Error("Unable to create email settings.");
  }

  return created;
}

export async function createDraftSourceFromSettings(db: Database, input?: {
  heading?: string;
  body?: string;
}) {
  const settings = await getOrCreateEmailSettings(db);
  const source = cloneBuilderSource(settings.starterLayoutJson);
  source.brand = {
    logoUrl: settings.logoUrl,
    footerCompanyName: settings.footerCompanyName,
    footerAddress: settings.footerAddress,
    footerContactEmail: settings.footerContactEmail,
  };
  if (input?.heading) {
    source.subject = input.heading;
    const firstHeading = source.blocks?.find((block) => block.type === "heading");
    if (firstHeading) firstHeading.value = input.heading;
  }
  if (input?.body) {
    const firstText = source.blocks?.find((block) => block.type === "text");
    if (firstText) firstText.value = input.body;
  }
  return source;
}

export async function renderAndNormalizeEmail(source: unknown) {
  return renderEmailSource(source);
}

export async function resolveTemplateForContext(
  db: Database,
  input: {
    templateType: (typeof emailTemplateTypes)[number];
    projectId?: string | null;
  },
) {
  if (input.projectId) {
    const [projectAssignment] = await db
      .select({ template: emailTemplates })
      .from(emailTemplateAssignments)
      .innerJoin(emailTemplates, eq(emailTemplateAssignments.templateId, emailTemplates.id))
      .where(
        and(
          eq(emailTemplateAssignments.templateType, input.templateType),
          eq(emailTemplateAssignments.projectId, input.projectId),
          eq(emailTemplates.status, "active"),
        ),
      )
      .limit(1);

    if (projectAssignment?.template) return projectAssignment.template;
  }

  const [globalAssignment] = await db
    .select({ template: emailTemplates })
    .from(emailTemplateAssignments)
    .innerJoin(emailTemplates, eq(emailTemplateAssignments.templateId, emailTemplates.id))
    .where(
      and(
        eq(emailTemplateAssignments.templateType, input.templateType),
        isNull(emailTemplateAssignments.clientId),
        isNull(emailTemplateAssignments.projectId),
        eq(emailTemplates.status, "active"),
      ),
    )
    .limit(1);

  return globalAssignment?.template ?? null;
}

export function buildSuggestionDedupeKey(input: {
  templateType: string;
  clientId?: string | null;
  projectId?: string | null;
  entityType: string;
  entityId: string;
  window?: string;
}) {
  return [
    input.templateType,
    input.clientId ?? "global",
    input.projectId ?? "none",
    input.entityType,
    input.entityId,
    input.window ?? "v1",
  ].join(":");
}

async function createSuggestedDraftIfMissing(
  db: Database,
  input: {
    templateType: (typeof emailTemplateTypes)[number];
    clientId: string;
    projectId?: string | null;
    subject: string;
    heading: string;
    body: string;
    triggerType: string;
    relatedEntityType: string;
    relatedEntityId: string;
  },
) {
  const dedupeKey = buildSuggestionDedupeKey({
    templateType: input.templateType,
    clientId: input.clientId,
    projectId: input.projectId,
    entityType: input.relatedEntityType,
    entityId: input.relatedEntityId,
  });

  const [existing] = await db
    .select({ id: emailDrafts.id })
    .from(emailDrafts)
    .where(
      and(
        eq(emailDrafts.dedupeKey, dedupeKey),
        inArray(emailDrafts.status, ["draft", "suggested", "ready", "failed"]),
      ),
    )
    .limit(1);

  if (existing) return { created: false };

  const template = await resolveTemplateForContext(db, {
    templateType: input.templateType,
    projectId: input.projectId,
  });
  const builderSourceJson: EmailBuilderSource = template
    ? cloneBuilderSource(template.builderSourceJson)
    : await createDraftSourceFromSettings(db, {
        heading: input.heading,
        body: input.body,
      });
  builderSourceJson.subject = input.subject;
  const rendered = await renderEmailSource(builderSourceJson);

  await db.insert(emailDrafts).values({
    source: "suggested",
    status: "suggested",
    templateType: input.templateType,
    templateId: template?.id,
    clientId: input.clientId,
    projectId: input.projectId ?? null,
    subject: input.subject,
    builderSourceJson,
    renderedHtml: rendered.html,
    renderedText: rendered.text,
    triggerType: input.triggerType,
    relatedEntityType: input.relatedEntityType,
    relatedEntityId: input.relatedEntityId,
    dedupeKey,
  });

  return { created: true };
}

export async function generateSuggestedEmailDrafts(db: Database) {
  const settings = await getOrCreateEmailSettings(db);
  const [run] = await db
    .insert(emailGenerationRuns)
    .values({
      status: "running",
      cadenceHours: settings.cronCadenceHours,
    })
    .returning();

  let createdDraftCount = 0;
  let skippedDuplicateCount = 0;

  try {
    const activeClients = await db
      .select({
        id: clients.id,
        name: clients.name,
        primaryContactEmail: clients.primaryContactEmail,
      })
      .from(clients)
      .where(eq(clients.status, "active"))
      .limit(25);

    for (const client of activeClients) {
      const result = await createSuggestedDraftIfMissing(db, {
        templateType: "welcome",
        clientId: client.id,
        subject: `Welcome to your Concolabs workspace, ${client.name}`,
        heading: `Welcome, ${client.name}`,
        body: "We are excited to partner with you. Your Concolabs workspace will keep project updates, proposal documents, files, and billing communication organized in one place.",
        triggerType: "client_onboarding",
        relatedEntityType: "client",
        relatedEntityId: client.id,
      });
      result.created ? createdDraftCount++ : skippedDuplicateCount++;
    }

    const proposalRows = await db
      .select({
        id: proposals.id,
        title: proposals.title,
        status: proposals.status,
        clientId: proposals.clientId,
        projectId: proposals.projectId,
      })
      .from(proposals)
      .where(or(eq(proposals.status, "sent"), eq(proposals.status, "commented")))
      .limit(25);

    for (const proposal of proposalRows) {
      const result = await createSuggestedDraftIfMissing(db, {
        templateType: "proposal",
        clientId: proposal.clientId,
        projectId: proposal.projectId,
        subject: `Proposal follow-up: ${proposal.title}`,
        heading: "Proposal follow-up",
        body: `We wanted to follow up on ${proposal.title}. Please review it when you have a moment, and share any notes directly in the workspace.`,
        triggerType: "proposal_followup",
        relatedEntityType: "proposal",
        relatedEntityId: proposal.id,
      });
      result.created ? createdDraftCount++ : skippedDuplicateCount++;
    }

    const activeProjects = await db
      .select({
        id: projects.id,
        name: projects.name,
        clientId: projects.clientId,
        targetLaunchDate: projects.targetLaunchDate,
      })
      .from(projects)
      .where(eq(projects.status, "active"))
      .limit(25);

    for (const project of activeProjects) {
      const result = await createSuggestedDraftIfMissing(db, {
        templateType: "general_outreach",
        clientId: project.clientId,
        projectId: project.id,
        subject: `Project update: ${project.name}`,
        heading: `Project update: ${project.name}`,
        body: "Here is the latest project update from the Concolabs team. You can review the project workspace for current files, milestones, and next actions.",
        triggerType: "project_check_in",
        relatedEntityType: "project",
        relatedEntityId: project.id,
      });
      result.created ? createdDraftCount++ : skippedDuplicateCount++;
    }

    const paymentTimelineItems = await db
      .select({
        id: projectTimelineItems.id,
        title: projectTimelineItems.title,
        clientId: projectTimelineItems.clientId,
        projectId: projectTimelineItems.projectId,
        dueAt: projectTimelineItems.dueAt,
      })
      .from(projectTimelineItems)
      .where(eq(projectTimelineItems.itemType, "payment_due"))
      .limit(25);

    for (const item of paymentTimelineItems) {
      const reminderResult = await createSuggestedDraftIfMissing(db, {
        templateType: "payment_reminder",
        clientId: item.clientId,
        projectId: item.projectId,
        subject: `Payment reminder: ${item.title}`,
        heading: "Payment reminder",
        body: `This is a reminder for ${item.title}${item.dueAt ? ` due on ${item.dueAt}` : ""}. You can review the project workspace for payment details and next steps.`,
        triggerType: "payment_due",
        relatedEntityType: "timeline_item",
        relatedEntityId: item.id,
      });
      reminderResult.created ? createdDraftCount++ : skippedDuplicateCount++;

      const invoiceResult = await createSuggestedDraftIfMissing(db, {
        templateType: "invoice",
        clientId: item.clientId,
        projectId: item.projectId,
        subject: `Invoice/payment request: ${item.title}`,
        heading: "Invoice/payment request",
        body: `A payment request is ready for ${item.title}. Please review the project workspace for payment options and confirmation instructions.`,
        triggerType: "invoice_request",
        relatedEntityType: "timeline_item",
        relatedEntityId: item.id,
      });
      invoiceResult.created ? createdDraftCount++ : skippedDuplicateCount++;
    }

    await db
      .update(emailGenerationRuns)
      .set({
        status: "completed",
        createdDraftCount,
        skippedDuplicateCount,
        completedAt: new Date(),
      })
      .where(eq(emailGenerationRuns.id, run.id));

    return { runId: run.id, createdDraftCount, skippedDuplicateCount };
  } catch (error) {
    await db
      .update(emailGenerationRuns)
      .set({
        status: "failed",
        createdDraftCount,
        skippedDuplicateCount,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        completedAt: new Date(),
      })
      .where(eq(emailGenerationRuns.id, run.id));
    throw error;
  }
}

export async function sendDraftEmail(
  db: Database,
  input: {
    draftId: string;
    adminUserId: string;
  },
) {
  const [draft] = await db
    .select()
    .from(emailDrafts)
    .where(eq(emailDrafts.id, input.draftId))
    .limit(1);

  if (!draft) throw new Error("Draft not found.");

  const recipients = await db
    .select()
    .from(emailDraftRecipients)
    .where(eq(emailDraftRecipients.draftId, draft.id));

  if (recipients.length === 0) {
    throw new Error("Add at least one recipient before sending.");
  }

  const settings = await getOrCreateEmailSettings(db);
  const rendered = await renderEmailSource(draft.builderSourceJson);
  const [sent] = await db
    .insert(sentEmails)
    .values({
      draftId: draft.id,
      templateId: draft.templateId,
      templateType: draft.templateType,
      clientId: draft.clientId,
      projectId: draft.projectId,
      subject: draft.subject,
      renderedHtml: rendered.html,
      renderedText: rendered.text,
      fromName: settings.fromName,
      fromEmail: settings.fromEmail,
      replyToEmail: settings.replyToEmail,
      status: "pending",
      sentByAdminId: input.adminUserId,
    })
    .returning();

  if (!sent) throw new Error("Unable to create sent email snapshot.");

  await db.insert(sentEmailRecipients).values(
    recipients.map((recipient) => ({
      sentEmailId: sent.id,
      recipientMode: recipient.recipientMode,
      clientMembershipId: recipient.clientMembershipId,
      email: recipient.email,
      name: recipient.name,
      status: "pending" as const,
    })),
  );

  try {
    if (!env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured.");
    }

    const resend = new Resend(env.RESEND_API_KEY);
    const response = await resend.emails.send({
      from: `${settings.fromName} <${settings.fromEmail}>`,
      to: recipients.map((recipient) => recipient.email),
      replyTo: settings.replyToEmail,
      subject: draft.subject,
      html: rendered.html,
      text: rendered.text,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    await db
      .update(sentEmails)
      .set({
        status: "sent",
        providerMessageId: response.data?.id,
        sentAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(sentEmails.id, sent.id));

    await db
      .update(emailDrafts)
      .set({
        status: "sent",
        renderedHtml: rendered.html,
        renderedText: rendered.text,
        updatedAt: new Date(),
      })
      .where(eq(emailDrafts.id, draft.id));

    await db.insert(emailDeliveryEvents).values({
      sentEmailId: sent.id,
      eventType: "sent",
      provider: "resend",
      providerEventId: response.data?.id,
    });

    return { sentEmailId: sent.id, status: "sent" as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send email.";
    await db
      .update(sentEmails)
      .set({
        status: "failed",
        errorMessage: message,
        updatedAt: new Date(),
      })
      .where(eq(sentEmails.id, sent.id));
    await db
      .update(emailDrafts)
      .set({
        status: "failed",
        errorMessage: message,
        updatedAt: new Date(),
      })
      .where(eq(emailDrafts.id, draft.id));
    await db.insert(emailDeliveryEvents).values({
      sentEmailId: sent.id,
      eventType: "failed",
      provider: "resend",
      errorMessage: message,
    });
    return { sentEmailId: sent.id, status: "failed" as const, errorMessage: message };
  }
}
