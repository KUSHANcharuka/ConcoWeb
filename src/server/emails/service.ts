import "server-only";

import { randomUUID } from "node:crypto";
import { and, desc, eq, inArray, isNull, or } from "drizzle-orm";
import { Resend } from "resend";
import { z } from "zod";

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
  projectBillingArtifacts,
  projectTimelineItems,
  projects,
  proposals,
  sentEmailRecipients,
  sentEmails,
} from "~/server/db/schema";
import { renderEmailSource } from "./render";
import { normalizeEmailSource } from "./source-codec";
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

const emailAddressSchema = z.string().trim().email();

const recipientStatusRank: Record<
  | "queued"
  | "accepted"
  | "delivered"
  | "opened"
  | "clicked"
  | "bounced"
  | "complained"
  | "suppressed"
  | "failed",
  number
> = {
  queued: 10,
  accepted: 20,
  delivered: 30,
  opened: 40,
  clicked: 50,
  bounced: 60,
  suppressed: 70,
  failed: 80,
  complained: 90,
};

type ResolvedEmailConfiguration = {
  provider: "resend";
  providerEnabled: boolean;
  providerSecretPresent: boolean;
  webhookSecretPresent: boolean;
  webhookEndpointUrl: string;
  senderPolicyConfigured: boolean;
  senderPolicyValid: boolean;
  allowedFromDomains: string[];
  allowedFromEmails: string[];
  fromName: string;
  fromEmail: string;
  replyToEmail: string | null;
  footerCompanyName: string;
  footerAddress: string | null;
  footerContactEmail: string;
  logoUrl: string | null;
  canSend: boolean;
  errors: string[];
};

type DeliveryRecipientInput = {
  recipientMode: "selected_member" | "client_default_contact" | "external";
  email: string;
  name?: string | null;
  clientMembershipId?: string | null;
};

type DeliverEmailInput = {
  draftId?: string | null;
  templateId?: string | null;
  templateType: (typeof emailTemplateTypes)[number];
  clientId?: string | null;
  projectId?: string | null;
  subject: string;
  renderedHtml: string;
  renderedText: string;
  recipients: DeliveryRecipientInput[];
  sentByAdminId?: string | null;
};

type ResendWebhookPayload = {
  type: string;
  created_at?: string;
  data?: {
    email_id?: string;
    to?: string[];
    bounce?: { message?: string; type?: string; subType?: string };
    suppressed?: { message?: string; type?: string };
  };
};

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

function parseCsvLowercase(value: string | undefined) {
  return value
    ?.split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean) ?? [];
}

function extractEmailDomain(email: string) {
  return email.split("@")[1]?.trim().toLowerCase() ?? "";
}

function isValidEmailAddress(value: string | null | undefined) {
  if (!value) return false;
  return emailAddressSchema.safeParse(value).success;
}

function resolveSenderPolicy(settings: Awaited<ReturnType<typeof getOrCreateEmailSettings>>) {
  const allowedFromDomains = parseCsvLowercase(env.RESEND_ALLOWED_FROM_DOMAINS);
  const allowedFromEmails = parseCsvLowercase(env.RESEND_ALLOWED_FROM_EMAILS);
  const fromEmail = settings.fromEmail.trim();
  const replyToEmail = settings.replyToEmail?.trim() || null;
  const senderPolicyConfigured =
    allowedFromDomains.length > 0 || allowedFromEmails.length > 0;
  const normalizedFromEmail = fromEmail.toLowerCase();
  const domain = extractEmailDomain(normalizedFromEmail);
  const senderPolicyValid =
    senderPolicyConfigured &&
    isValidEmailAddress(fromEmail) &&
    (allowedFromEmails.includes(normalizedFromEmail) ||
      (domain.length > 0 && allowedFromDomains.includes(domain)));
  const errors: string[] = [];

  if (!env.RESEND_API_KEY) {
    errors.push("RESEND_API_KEY is not configured.");
  }
  if (!senderPolicyConfigured) {
    errors.push(
      "Configure RESEND_ALLOWED_FROM_DOMAINS or RESEND_ALLOWED_FROM_EMAILS before sending email.",
    );
  }
  if (!senderPolicyValid) {
    errors.push(
      `The configured sender address ${fromEmail} is outside the approved Resend sender policy.`,
    );
  }
  if (replyToEmail && !isValidEmailAddress(replyToEmail)) {
    errors.push("The configured reply-to address is invalid.");
  }

  return {
    provider: "resend" as const,
    providerEnabled: Boolean(env.RESEND_API_KEY),
    providerSecretPresent: Boolean(env.RESEND_API_KEY),
    webhookSecretPresent: Boolean(env.RESEND_WEBHOOK_SECRET),
    webhookEndpointUrl: `${env.APP_URL.replace(/\/$/, "")}/api/webhooks/resend`,
    senderPolicyConfigured,
    senderPolicyValid,
    allowedFromDomains,
    allowedFromEmails,
    fromName: settings.fromName.trim(),
    fromEmail,
    replyToEmail,
    footerCompanyName: settings.footerCompanyName,
    footerAddress: settings.footerAddress,
    footerContactEmail: settings.footerContactEmail,
    logoUrl: settings.logoUrl,
    canSend:
      Boolean(env.RESEND_API_KEY) &&
      senderPolicyConfigured &&
      senderPolicyValid &&
      (!replyToEmail || isValidEmailAddress(replyToEmail)),
    errors,
  } satisfies ResolvedEmailConfiguration;
}

export async function resolveEmailConfiguration(db: Database) {
  const settings = await getOrCreateEmailSettings(db);
  return {
    settings,
    resolved: resolveSenderPolicy(settings),
  };
}

export function validateEmailSettingsForProviderPolicy(input: {
  fromName: string;
  fromEmail: string;
  replyToEmail: string;
  footerCompanyName: string;
  footerAddress?: string | null;
  footerContactEmail: string;
  logoUrl?: string | null;
}) {
  const resolved = resolveSenderPolicy({
    createdAt: new Date(),
    footerAddress: input.footerAddress ?? null,
    footerCompanyName: input.footerCompanyName,
    footerContactEmail: input.footerContactEmail,
    fromEmail: input.fromEmail,
    fromName: input.fromName,
    id: "validation",
    logoUrl: input.logoUrl ?? null,
    replyToEmail: input.replyToEmail,
    requestNotificationEmails: [],
    starterLayoutJson: {},
    updatedAt: new Date(),
    cronCadenceHours: 24,
  });

  return {
    senderPolicyValid: resolved.senderPolicyValid,
    replyToValid: !resolved.replyToEmail || isValidEmailAddress(resolved.replyToEmail),
    errors: resolved.errors.filter(
      (message) => message !== "RESEND_API_KEY is not configured.",
    ),
  };
}

export async function getEmailSettingsReadiness(db: Database) {
  const { settings, resolved } = await resolveEmailConfiguration(db);
  const [lastSuccessfulSend] = await db
    .select({ sentAt: sentEmails.sentAt, updatedAt: sentEmails.updatedAt })
    .from(sentEmails)
    .where(inArray(sentEmails.status, ["accepted", "delivered", "opened", "clicked"]))
    .orderBy(desc(sentEmails.sentAt), desc(sentEmails.updatedAt))
    .limit(1);
  const [lastWebhookEvent] = await db
    .select({ createdAt: emailDeliveryEvents.createdAt })
    .from(emailDeliveryEvents)
    .where(and(eq(emailDeliveryEvents.provider, "resend"), inArray(emailDeliveryEvents.eventType, [
      "delivered",
      "opened",
      "clicked",
      "bounced",
      "complained",
      "suppressed",
    ])))
    .orderBy(desc(emailDeliveryEvents.createdAt))
    .limit(1);

  return {
    settings,
    readiness: {
      provider: resolved.provider,
      providerSecretPresent: resolved.providerSecretPresent,
      webhookSecretPresent: resolved.webhookSecretPresent,
      senderPolicyConfigured: resolved.senderPolicyConfigured,
      senderPolicyValid: resolved.senderPolicyValid,
      canSend: resolved.canSend,
      webhookEndpointConfigured: resolved.webhookSecretPresent,
      webhookEndpointUrl: resolved.webhookEndpointUrl,
      lastSuccessfulSendAt:
        lastSuccessfulSend?.sentAt ?? lastSuccessfulSend?.updatedAt ?? null,
      lastWebhookReceivedAt: lastWebhookEvent?.createdAt ?? null,
      errors: resolved.errors,
      allowedFromDomains: resolved.allowedFromDomains,
      allowedFromEmails: resolved.allowedFromEmails,
    },
  };
}

export function assertEmailConfigurationCanSend(config: ResolvedEmailConfiguration) {
  if (!config.canSend) {
    throw new Error(config.errors[0] ?? "Resend configuration is not ready.");
  }
}

function buildProviderIdempotencyKey(sentEmailId: string) {
  return `sent-email/${sentEmailId}`;
}

function determineRecipientStatus(
  currentStatus:
    | "queued"
    | "accepted"
    | "delivered"
    | "opened"
    | "clicked"
    | "bounced"
    | "complained"
    | "suppressed"
    | "failed",
  nextStatus:
    | "queued"
    | "accepted"
    | "delivered"
    | "opened"
    | "clicked"
    | "bounced"
    | "complained"
    | "suppressed"
    | "failed",
) {
  return recipientStatusRank[nextStatus] >= recipientStatusRank[currentStatus]
    ? nextStatus
    : currentStatus;
}

function deriveAggregateSentStatus(
  statuses: Array<
    | "queued"
    | "accepted"
    | "delivered"
    | "opened"
    | "clicked"
    | "bounced"
    | "complained"
    | "suppressed"
    | "failed"
  >,
) {
  return statuses.reduce(
    (current, next) =>
      recipientStatusRank[next] > recipientStatusRank[current] ? next : current,
    "queued" as const,
  );
}

async function recordDeliveryEvent(
  db: Database,
  input: {
    sentEmailId: string;
    sentEmailRecipientId?: string | null;
    eventType:
      | "queued"
      | "accepted"
      | "delivered"
      | "opened"
      | "clicked"
      | "bounced"
      | "complained"
      | "suppressed"
      | "failed";
    providerEventId?: string | null;
    payloadJson?: unknown;
    errorMessage?: string | null;
    occurredAt?: Date;
  },
) {
  if (input.providerEventId) {
    const [existing] = await db
      .select({ id: emailDeliveryEvents.id })
      .from(emailDeliveryEvents)
      .where(
        and(
          eq(emailDeliveryEvents.sentEmailId, input.sentEmailId),
          eq(emailDeliveryEvents.eventType, input.eventType),
          eq(emailDeliveryEvents.providerEventId, input.providerEventId),
          input.sentEmailRecipientId
            ? eq(emailDeliveryEvents.sentEmailRecipientId, input.sentEmailRecipientId)
            : isNull(emailDeliveryEvents.sentEmailRecipientId),
        ),
      )
      .limit(1);

    if (existing) return existing;
  }

  const [created] = await db
    .insert(emailDeliveryEvents)
    .values({
      sentEmailId: input.sentEmailId,
      sentEmailRecipientId: input.sentEmailRecipientId ?? null,
      eventType: input.eventType,
      provider: "resend",
      providerEventId: input.providerEventId ?? null,
      payloadJson: input.payloadJson,
      errorMessage: input.errorMessage ?? null,
      occurredAt: input.occurredAt ?? new Date(),
    })
    .returning({ id: emailDeliveryEvents.id });

  return created;
}

async function syncAggregateSentStatus(db: Database, sentEmailId: string) {
  const recipients = await db
    .select({ status: sentEmailRecipients.status })
    .from(sentEmailRecipients)
    .where(eq(sentEmailRecipients.sentEmailId, sentEmailId));
  const nextStatus = deriveAggregateSentStatus(recipients.map((recipient) => recipient.status));
  await db
    .update(sentEmails)
    .set({
      status: nextStatus,
      updatedAt: new Date(),
    })
    .where(eq(sentEmails.id, sentEmailId));
}

async function createOutboundSentEmail(db: Database, input: DeliverEmailInput) {
  const { settings } = await resolveEmailConfiguration(db);
  const [sent] = await db
    .insert(sentEmails)
    .values({
      draftId: input.draftId ?? null,
      templateId: input.templateId ?? null,
      templateType: input.templateType,
      clientId: input.clientId ?? null,
      projectId: input.projectId ?? null,
      subject: input.subject,
      renderedHtml: input.renderedHtml,
      renderedText: input.renderedText,
      fromName: settings.fromName,
      fromEmail: settings.fromEmail,
      replyToEmail: settings.replyToEmail,
      status: "queued",
      providerIdempotencyKey: randomUUID(),
      sentByAdminId: input.sentByAdminId ?? null,
    })
    .returning();

  if (!sent) {
    throw new Error("Unable to create sent email snapshot.");
  }

  const providerIdempotencyKey = buildProviderIdempotencyKey(sent.id);
  const [persistedSent] = await db
    .update(sentEmails)
    .set({
      providerIdempotencyKey,
      updatedAt: new Date(),
    })
    .where(eq(sentEmails.id, sent.id))
    .returning();

  const recipientRows = await db
    .insert(sentEmailRecipients)
    .values(
      input.recipients.map((recipient) => ({
        sentEmailId: sent.id,
        recipientMode: recipient.recipientMode,
        clientMembershipId: recipient.clientMembershipId ?? null,
        email: recipient.email,
        name: recipient.name ?? recipient.email,
        status: "queued" as const,
      })),
    )
    .returning();

  await recordDeliveryEvent(db, {
    sentEmailId: sent.id,
    eventType: "queued",
  });

  return {
    sent: persistedSent ?? { ...sent, providerIdempotencyKey },
    recipients: recipientRows,
  };
}

async function markSentEmailFailed(
  db: Database,
  input: {
    sentEmailId: string;
    draftId?: string | null;
    errorMessage: string;
  },
) {
  await db
    .update(sentEmails)
    .set({
      status: "failed",
      errorMessage: input.errorMessage,
      updatedAt: new Date(),
    })
    .where(eq(sentEmails.id, input.sentEmailId));
  await db
    .update(sentEmailRecipients)
    .set({
      status: "failed",
      errorMessage: input.errorMessage,
      updatedAt: new Date(),
    })
    .where(eq(sentEmailRecipients.sentEmailId, input.sentEmailId));
  if (input.draftId) {
    await db
      .update(emailDrafts)
      .set({
        status: "failed",
        errorMessage: input.errorMessage,
        updatedAt: new Date(),
      })
      .where(eq(emailDrafts.id, input.draftId));
  }
  await recordDeliveryEvent(db, {
    sentEmailId: input.sentEmailId,
    eventType: "failed",
    errorMessage: input.errorMessage,
  });
}

async function dispatchPersistedSentEmail(
  db: Database,
  input: {
    sentEmailId: string;
    draftId?: string | null;
  },
) {
  const [sent] = await db
    .select()
    .from(sentEmails)
    .where(eq(sentEmails.id, input.sentEmailId))
    .limit(1);
  if (!sent) {
    throw new Error("Sent email snapshot not found.");
  }

  const recipients = await db
    .select()
    .from(sentEmailRecipients)
    .where(eq(sentEmailRecipients.sentEmailId, input.sentEmailId));
  if (recipients.length === 0) {
    throw new Error("Cannot send an email without recipients.");
  }

  const { resolved } = await resolveEmailConfiguration(db);
  assertEmailConfigurationCanSend(resolved);

  const resend = new Resend(env.RESEND_API_KEY!);
  const response = await resend.emails.send(
    {
      from: `${resolved.fromName} <${resolved.fromEmail}>`,
      to: recipients.map((recipient) => recipient.email),
      replyTo: resolved.replyToEmail ?? undefined,
      subject: sent.subject,
      html: sent.renderedHtml,
      text: sent.renderedText,
    },
    {
      idempotencyKey: sent.providerIdempotencyKey,
    },
  );

  if (response.error) {
    throw new Error(response.error.message);
  }

  await db
    .update(sentEmails)
    .set({
      status: "accepted",
      providerMessageId: response.data?.id ?? null,
      errorMessage: null,
      sentAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(sentEmails.id, sent.id));
  await db
    .update(sentEmailRecipients)
    .set({
      status: "accepted",
      errorMessage: null,
      updatedAt: new Date(),
    })
    .where(eq(sentEmailRecipients.sentEmailId, sent.id));
  if (input.draftId) {
    await db
      .update(emailDrafts)
      .set({
        status: "sent",
        renderedHtml: sent.renderedHtml,
        renderedText: sent.renderedText,
        errorMessage: null,
        updatedAt: new Date(),
      })
      .where(eq(emailDrafts.id, input.draftId));
  }
  await recordDeliveryEvent(db, {
    sentEmailId: sent.id,
    eventType: "accepted",
    providerEventId: response.data?.id ?? null,
  });

  return { sentEmailId: sent.id, status: "accepted" as const };
}

async function deliverEmail(db: Database, input: DeliverEmailInput) {
  const { sent } = await createOutboundSentEmail(db, input);

  try {
    return await dispatchPersistedSentEmail(db, {
      sentEmailId: sent.id,
      draftId: input.draftId ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send email.";
    await markSentEmailFailed(db, {
      sentEmailId: sent.id,
      draftId: input.draftId ?? null,
      errorMessage: message,
    });
    return {
      sentEmailId: sent.id,
      status: "failed" as const,
      errorMessage: message,
    };
  }
}

function mapWebhookEventType(type: string) {
  switch (type) {
    case "email.delivered":
      return "delivered" as const;
    case "email.opened":
      return "opened" as const;
    case "email.clicked":
      return "clicked" as const;
    case "email.bounced":
      return "bounced" as const;
    case "email.complained":
      return "complained" as const;
    case "email.suppressed":
      return "suppressed" as const;
    default:
      return null;
  }
}

export async function ingestResendWebhook(
  db: Database,
  input: {
    providerEventId: string;
    payload: ResendWebhookPayload;
  },
) {
  const eventType = mapWebhookEventType(input.payload.type);
  if (!eventType || !input.payload.data?.email_id) {
    return { processed: false as const, reason: "ignored" as const };
  }

  const [sent] = await db
    .select()
    .from(sentEmails)
    .where(eq(sentEmails.providerMessageId, input.payload.data.email_id))
    .limit(1);
  if (!sent) {
    return { processed: false as const, reason: "unknown_message" as const };
  }

  const recipientEmailSet = new Set(
    (input.payload.data.to ?? []).map((value) => value.trim().toLowerCase()),
  );
  const recipients = await db
    .select()
    .from(sentEmailRecipients)
    .where(eq(sentEmailRecipients.sentEmailId, sent.id));

  const impactedRecipients = recipients.filter((recipient) =>
    recipientEmailSet.has(recipient.email.trim().toLowerCase()),
  );
  const occurredAt = input.payload.created_at ? new Date(input.payload.created_at) : new Date();
  const errorMessage =
    input.payload.data.bounce?.message ??
    input.payload.data.suppressed?.message ??
    null;

  for (const recipient of impactedRecipients) {
    const nextStatus = determineRecipientStatus(recipient.status, eventType);
    await db
      .update(sentEmailRecipients)
      .set({
        status: nextStatus,
        errorMessage:
          eventType === "bounced" || eventType === "complained" || eventType === "suppressed"
            ? errorMessage
            : recipient.errorMessage,
        updatedAt: new Date(),
      })
      .where(eq(sentEmailRecipients.id, recipient.id));

    await recordDeliveryEvent(db, {
      sentEmailId: sent.id,
      sentEmailRecipientId: recipient.id,
      eventType,
      providerEventId: input.providerEventId,
      payloadJson: input.payload,
      errorMessage,
      occurredAt,
    });
  }

  if (impactedRecipients.length === 0) {
    await recordDeliveryEvent(db, {
      sentEmailId: sent.id,
      eventType,
      providerEventId: input.providerEventId,
      payloadJson: input.payload,
      errorMessage,
      occurredAt,
    });
  }

  await syncAggregateSentStatus(db, sent.id);

  return {
    processed: true as const,
    sentEmailId: sent.id,
    impactedRecipientCount: impactedRecipients.length,
    eventType,
  };
}

export async function createDraftSourceFromSettings(db: Database, input?: {
  heading?: string;
  body?: string;
}) {
  const settings = await getOrCreateEmailSettings(db);
  const normalized = normalizeEmailSource(cloneBuilderSource(settings.starterLayoutJson));
  normalized.brand = {
    ...normalized.brand,
    logoUrl: normalized.brand?.logoUrl ?? settings.logoUrl,
    brandLabel: normalized.brand?.brandLabel ?? settings.fromName,
    footerCompanyName: normalized.brand?.footerCompanyName ?? settings.footerCompanyName,
    footerAddress: normalized.brand?.footerAddress ?? settings.footerAddress,
    footerContactEmail:
      normalized.brand?.footerContactEmail ?? settings.footerContactEmail,
  };
  if (input?.heading) {
    normalized.subject = input.heading;
    normalized.previewText = input.heading;
    const firstHero = normalized.blocks?.find((block) => block.type === "hero");
    if (firstHero) firstHero.title = input.heading;
    const firstHeading = normalized.blocks?.find((block) => block.type === "heading");
    if (firstHeading) firstHeading.value = input.heading;
  }
  if (input?.body) {
    const firstHero = normalized.blocks?.find((block) => block.type === "hero");
    if (firstHero) firstHero.body = input.body;
    const firstText = normalized.blocks?.find((block) => block.type === "text");
    if (firstText) firstText.value = input.body;
  }
  return normalized;
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

  const rendered = await renderEmailSource(draft.builderSourceJson);
  return deliverEmail(db, {
    draftId: draft.id,
    templateId: draft.templateId,
    templateType: draft.templateType,
    clientId: draft.clientId,
    projectId: draft.projectId,
    subject: draft.subject,
    renderedHtml: rendered.html,
    renderedText: rendered.text,
    recipients: recipients.map((recipient) => ({
      recipientMode: recipient.recipientMode,
      clientMembershipId: recipient.clientMembershipId,
      email: recipient.email,
      name: recipient.name,
    })),
    sentByAdminId: input.adminUserId,
  });
}

export async function sendProposalNotificationEmail(
  db: Database,
  input: {
    adminUserId: string;
    clientId: string;
    projectId: string;
    proposalId: string;
    proposalTitle: string;
    recipients: Array<{
      clientMembershipId: string;
      email: string;
      name?: string | null;
    }>;
  },
) {
  if (input.recipients.length === 0) {
    throw new Error("At least one proposal recipient is required.");
  }

  const [project] = await db
    .select({
      name: projects.name,
      clientName: clients.name,
    })
    .from(projects)
    .innerJoin(clients, eq(projects.clientId, clients.id))
    .where(eq(projects.id, input.projectId))
    .limit(1);

  if (!project) {
    throw new Error("Project not found for proposal notification.");
  }

  const template = await resolveTemplateForContext(db, {
    templateType: "proposal",
    projectId: input.projectId,
  });
  const builderSourceJson: EmailBuilderSource = template
    ? cloneBuilderSource(template.builderSourceJson)
    : await createDraftSourceFromSettings(db, {
        heading: `Proposal ready: ${input.proposalTitle}`,
        body: `Your proposal for ${project.name} is ready to review in the Concolabs workspace. Open the proposal, review the document, and complete the requested signature steps there.`,
      });

  builderSourceJson.subject = `Proposal ready: ${input.proposalTitle}`;
  const rendered = await renderEmailSource(builderSourceJson);

  return deliverEmail(db, {
    templateId: template?.id,
    templateType: "proposal",
    clientId: input.clientId,
    projectId: input.projectId,
    subject: builderSourceJson.subject,
    renderedHtml: rendered.html,
    renderedText: rendered.text,
    recipients: input.recipients.map((recipient) => ({
      recipientMode: "selected_member",
      clientMembershipId: recipient.clientMembershipId,
      email: recipient.email,
      name: recipient.name ?? recipient.email,
    })),
    sentByAdminId: input.adminUserId,
  });
}

export async function sendInvoiceNotificationEmail(
  db: Database,
  input: {
    adminUserId: string;
    clientId: string;
    projectId: string;
    artifactId: string;
    invoiceTitle: string;
    recipients: Array<{
      clientMembershipId: string;
      email: string;
      name?: string | null;
    }>;
  },
) {
  if (input.recipients.length === 0) {
    throw new Error("At least one invoice recipient is required.");
  }

  const [artifact] = await db
    .select({
      title: projectBillingArtifacts.title,
      invoiceNumber: projectBillingArtifacts.invoiceNumber,
      dueAt: projectBillingArtifacts.dueAt,
      projectName: projects.name,
    })
    .from(projectBillingArtifacts)
    .innerJoin(projects, eq(projectBillingArtifacts.projectId, projects.id))
    .where(eq(projectBillingArtifacts.id, input.artifactId))
    .limit(1);

  if (!artifact) {
    throw new Error("Invoice not found for notification.");
  }

  const template = await resolveTemplateForContext(db, {
    templateType: "invoice",
    projectId: input.projectId,
  });
  const builderSourceJson: EmailBuilderSource = template
    ? cloneBuilderSource(template.builderSourceJson)
    : await createDraftSourceFromSettings(db, {
        heading: `Invoice ready: ${input.invoiceTitle}`,
        body: `Your invoice ${artifact.invoiceNumber} for ${artifact.projectName} is now ready in the Concolabs workspace.${artifact.dueAt ? ` It is due on ${artifact.dueAt.toLocaleDateString()}.` : ""} Review the invoice and payment options in the portal.`,
      });

  builderSourceJson.subject = `Invoice ready: ${input.invoiceTitle}`;
  const rendered = await renderEmailSource(builderSourceJson);

  return deliverEmail(db, {
    templateId: template?.id,
    templateType: "invoice",
    clientId: input.clientId,
    projectId: input.projectId,
    subject: builderSourceJson.subject,
    renderedHtml: rendered.html,
    renderedText: rendered.text,
    recipients: input.recipients.map((recipient) => ({
      recipientMode: "selected_member",
      clientMembershipId: recipient.clientMembershipId,
      email: recipient.email,
      name: recipient.name ?? recipient.email,
    })),
    sentByAdminId: input.adminUserId,
  });
}

export async function sendRequestNotificationEmail(
  db: Database,
  input: {
    requestType: "project_request" | "change_request";
    clientId: string;
    projectId?: string | null;
    requestId: string;
    requestLabel: string;
    requestSummary: string | null;
  },
) {
  const { settings } = await resolveEmailConfiguration(db);
  const recipients = Array.isArray(settings.requestNotificationEmails)
    ? settings.requestNotificationEmails.filter(
        (value): value is string => typeof value === "string" && value.trim().length > 0,
      )
    : [];

  if (recipients.length === 0) {
    return { skipped: true as const, reason: "no_recipients" as const };
  }

  const [project] = input.projectId
    ? await db
        .select({
          name: projects.name,
          clientName: clients.name,
        })
        .from(projects)
        .innerJoin(clients, eq(projects.clientId, clients.id))
        .where(eq(projects.id, input.projectId))
        .limit(1)
    : await db
        .select({
          name: clients.name,
          clientName: clients.name,
        })
        .from(clients)
        .where(eq(clients.id, input.clientId))
        .limit(1);

  const entityLabel = input.requestType === "project_request" ? "New project request" : "Project change request";
  const subject = `${entityLabel}: ${input.requestLabel}`;
  const heading = subject;
  const body = input.projectId
    ? `${project?.clientName ?? "A client"} submitted a change request for ${project?.name ?? "a project"}. Review it in the admin requests workspace.\n\n${input.requestSummary ?? ""}`.trim()
    : `${project?.clientName ?? "A client"} submitted a new project request. Review it in the admin requests workspace.\n\n${input.requestSummary ?? ""}`.trim();

  const source = await createDraftSourceFromSettings(db, { heading, body });
  source.subject = subject;
  const rendered = await renderEmailSource(source);

  const result = await deliverEmail(db, {
    templateType: "general_outreach",
    clientId: input.clientId,
    projectId: input.projectId ?? null,
    subject,
    renderedHtml: rendered.html,
    renderedText: rendered.text,
    recipients: recipients.map((email) => ({
      recipientMode: "external",
      email,
      name: email,
    })),
  });

  return {
    skipped: false as const,
    recipientCount: recipients.length,
    sentEmailId: result.sentEmailId,
    status: result.status,
    errorMessage: "errorMessage" in result ? result.errorMessage : undefined,
  };
}
