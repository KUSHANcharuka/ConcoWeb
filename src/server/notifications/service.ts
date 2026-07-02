import { and, asc, desc, eq, inArray, isNotNull, isNull, lte, or } from "drizzle-orm";

import { env } from "~/env";
import { getClerkAdminClient } from "~/server/clients/clerk";
import type { Database } from "~/server/db";
import {
  clientMemberships,
  emailDraftRecipients,
  emailDrafts,
  notifications as notificationRows,
  notificationDeliveries,
  notificationEvents,
  notificationRuns,
  notificationSettings,
  projectBillingAccessStates,
  projectBillingArtifacts,
  projects,
} from "~/server/db/schema";
import { createDraftSourceFromSettings } from "~/server/emails/service";
import { renderEmailSource } from "~/server/emails/render";
import { publishRealtimeNotification } from "./realtime";
import {
  buildReminderTemplateKey,
  defaultReminderEmailTemplates,
  defaultReminderInAppTemplates,
  defaultReminderWindows,
  type NotificationEventType,
  type ReminderFamily,
  type ReminderWindowKey,
} from "./catalog";
import {
  buildArchiveHref,
  buildReminderDedupeKey,
  fillTemplate,
  isWindowDue,
  toColomboDateKey,
} from "./helpers";

type NotificationPortal = "admin" | "client";

type NotificationAudience =
  | { kind: "admin_all" }
  | { kind: "client_members"; clientId: string; membershipIds?: string[] };

type NotificationRecipient = {
  portal: NotificationPortal;
  userId: string;
  clientId: string | null;
  email: string | null;
  membershipId: string | null;
};

type RecordNotificationEventInput = {
  eventType: NotificationEventType;
  actorUserId?: string | null;
  clientId?: string | null;
  projectId?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  severity?: "info" | "success" | "warning" | "error";
  dedupeKey?: string | null;
  payload?: Record<string, unknown>;
  audiences: NotificationAudience[];
  title?: string;
  body?: string;
  href?: string | null;
};

type NotificationListInput = {
  userId: string;
  portal: NotificationPortal;
  clientId?: string | null;
  limit?: number;
  onlyUnread?: boolean;
};

type ReminderTemplateSettings = Awaited<ReturnType<typeof getOrCreateNotificationSettings>>;

function defaultNotificationCopy(input: {
  eventType: NotificationEventType;
  payload: Record<string, unknown>;
}) {
  const projectName = String(input.payload.projectName ?? "this project");
  const invoiceTitle = String(input.payload.invoiceTitle ?? "Invoice");
  const requestLabel = String(input.payload.requestLabel ?? "Request");
  const proposalTitle = String(input.payload.proposalTitle ?? "Proposal");
  const commentBody = String(input.payload.commentBody ?? "A new comment is available.");
  const status = String(input.payload.status ?? "updated");

  switch (input.eventType) {
    case "invoice.sent":
      return {
        title: "Invoice sent",
        body: `${invoiceTitle} for ${projectName} is now available in the portal.`,
      };
    case "proposal.sent":
      return {
        title: "Proposal ready",
        body: `${proposalTitle} for ${projectName} is ready to review in the portal.`,
      };
    case "proposal.comment_added":
      return {
        title: "New proposal comment",
        body: `${proposalTitle} has a new comment: ${commentBody}`,
      };
    case "project_request.submitted":
      return {
        title: "New project request",
        body: `${requestLabel} was submitted and is ready for admin review.`,
      };
    case "project_request.reviewed":
      return {
        title: "Project request updated",
        body: `${requestLabel} was ${status}.`,
      };
    case "change_request.submitted":
      return {
        title: "Change request submitted",
        body: `${requestLabel} was submitted and is ready for review.`,
      };
    case "change_request.reviewed":
      return {
        title: "Change request updated",
        body: `${requestLabel} was ${status}.`,
      };
    case "guest_portal_intake.submitted":
      return {
        title: "New guest onboarding request",
        body: `${String(input.payload.company ?? "A company")} submitted a guest onboarding request.`,
      };
    case "guest_portal_intake.reviewed":
      return {
        title: "Guest onboarding updated",
        body: `${String(input.payload.company ?? "Guest onboarding")} was ${status}.`,
      };
    case "payment.proof_submitted":
      return {
        title: "Payment proof submitted",
        body: `A payment proof was submitted for ${invoiceTitle}.`,
      };
    case "invitation.accepted":
      return {
        title: "Invitation accepted",
        body: `${String(input.payload.email ?? "A member")} accepted the invitation.`,
      };
    case "payment.reminder":
    case "access.reminder":
      return {
        title: String(input.payload.title ?? "Reminder"),
        body: String(input.payload.body ?? "A scheduled reminder is ready."),
      };
  }
}

async function resolveAudienceRecipients(
  db: Database,
  audience: NotificationAudience,
): Promise<NotificationRecipient[]> {
  if (audience.kind === "admin_all") {
    const clerk = await getClerkAdminClient();
    const memberships = await clerk.organizations.getOrganizationMembershipList({
      organizationId: env.CLERK_CONCOLABS_ORG_ID,
      limit: 100,
    });

    return memberships.data
      .map((membership) => ({
        portal: "admin" as const,
        userId: membership.publicUserData?.userId ?? "",
        clientId: null,
        email: membership.publicUserData?.identifier ?? null,
        membershipId: null,
      }))
      .filter((item) => item.userId.length > 0);
  }

  const memberships = await db
    .select({
      userId: clientMemberships.userId,
      email: clientMemberships.email,
      membershipId: clientMemberships.id,
    })
    .from(clientMemberships)
    .where(
      and(
        eq(clientMemberships.clientId, audience.clientId),
        eq(clientMemberships.status, "active"),
        audience.membershipIds?.length
          ? inArray(clientMemberships.id, audience.membershipIds)
          : undefined,
      ),
    )
    .orderBy(asc(clientMemberships.createdAt));

  return memberships.map((membership) => ({
    portal: "client" as const,
    userId: membership.userId,
    clientId: audience.clientId,
    email: membership.email,
    membershipId: membership.membershipId,
  }));
}

export async function getOrCreateNotificationSettings(db: Database) {
  const [settings] = await db
    .select()
    .from(notificationSettings)
    .orderBy(desc(notificationSettings.createdAt))
    .limit(1);

  if (settings) return settings;

  const [created] = await db
    .insert(notificationSettings)
    .values({
      paymentReminderWindows: [...defaultReminderWindows],
      accessReminderWindows: [...defaultReminderWindows],
    })
    .returning();

  if (!created) {
    throw new Error("Unable to create notification settings.");
  }

  return created;
}

function reminderValues(payload: Record<string, unknown>) {
  return {
    clientName: String(payload.clientName ?? ""),
    projectName: String(payload.projectName ?? ""),
    invoiceTitle: String(payload.invoiceTitle ?? ""),
    amount: String(payload.amount ?? ""),
    currency: String(payload.currency ?? ""),
    dueDate: String(payload.dueDate ?? ""),
    accessExpiryDate: String(payload.accessExpiryDate ?? ""),
    portalUrl: String(payload.portalUrl ?? ""),
  };
}

function resolveReminderCopy({
  settings,
  family,
  window,
  payload,
}: {
  settings: ReminderTemplateSettings;
  family: ReminderFamily;
  window: ReminderWindowKey;
  payload: Record<string, unknown>;
}) {
  const templateKey = buildReminderTemplateKey(family, window);
  const inAppTemplate =
    settings.inAppTemplates[templateKey] ?? defaultReminderInAppTemplates[templateKey];
  const emailTemplate = settings.emailDraftTemplates[templateKey];
  const defaultEmailTemplate = defaultReminderEmailTemplates[templateKey];
  const values = reminderValues(payload);

  return {
    title: fillTemplate(inAppTemplate.title, values),
    body: fillTemplate(inAppTemplate.body, values),
    emailSubject: fillTemplate(emailTemplate?.subject ?? defaultEmailTemplate.subject, values),
    emailBody: fillTemplate(emailTemplate?.body ?? defaultEmailTemplate.body, values),
    emailTitle: fillTemplate(defaultEmailTemplate.title, values),
  };
}

export async function recordNotificationEvent(db: Database, input: RecordNotificationEventInput) {
  const [event] = await db
    .insert(notificationEvents)
    .values({
      eventType: input.eventType,
      dedupeKey: input.dedupeKey ?? null,
      actorUserId: input.actorUserId ?? null,
      clientId: input.clientId ?? null,
      projectId: input.projectId ?? null,
      entityType: input.entityType ?? null,
      entityId: input.entityId ?? null,
      severity: input.severity ?? "info",
      payloadJson: input.payload ?? {},
    })
    .onConflictDoNothing()
    .returning();

  if (!event) {
    const [existingEvent] = await db
      .select()
      .from(notificationEvents)
      .where(eq(notificationEvents.dedupeKey, input.dedupeKey ?? ""))
      .limit(1);
    return { event: existingEvent ?? null, notifications: [] };
  }

  const recipients = (
    await Promise.all(input.audiences.map((audience) => resolveAudienceRecipients(db, audience)))
  ).flat();

  const copy = input.title && input.body
    ? { title: input.title, body: input.body }
    : defaultNotificationCopy({
        eventType: input.eventType,
        payload: input.payload ?? {},
      });

  const insertedNotifications = recipients.length
    ? await db
        .insert(notificationRows)
        .values(
          recipients.map((recipient) => ({
            eventId: event.id,
            portal: recipient.portal,
            recipientUserId: recipient.userId,
            clientId: recipient.clientId,
            projectId: input.projectId ?? null,
            title: copy.title,
            body: copy.body,
            href:
              input.href ??
              buildArchiveHref({
                portal: recipient.portal,
                projectId: input.projectId ?? null,
                entityType: input.entityType ?? null,
                entityId: input.entityId ?? null,
              }),
            severity: input.severity ?? "info",
          })),
        )
        .returning()
    : [];

  if (insertedNotifications.length > 0) {
    await db.insert(notificationDeliveries).values(
      insertedNotifications.map((notification) => ({
        notificationId: notification.id,
        channel: "in_app" as const,
        status: "sent" as const,
      })),
    );
  }

  await Promise.all(
    insertedNotifications.map((notification) =>
      publishRealtimeNotification(notification.recipientUserId, {
        id: notification.id,
        portal: notification.portal,
        clientId: notification.clientId,
        eventType: event.eventType,
        title: notification.title,
        body: notification.body,
        href: notification.href ?? null,
        severity: notification.severity,
        createdAt: notification.createdAt.toISOString(),
      }),
    ),
  );

  return { event, notifications: insertedNotifications };
}

export async function attachSentEmailDelivery(
  db: Database,
  input: {
    notifications: Array<{ id: string }>;
    sentEmailId: string;
  },
) {
  if (input.notifications.length === 0) return;
  await db.insert(notificationDeliveries).values(
    input.notifications.map((notification) => ({
      notificationId: notification.id,
      channel: "email" as const,
      status: "sent" as const,
      sentEmailId: input.sentEmailId,
    })),
  );
}

export async function attachDraftEmailDelivery(
  db: Database,
  input: {
    notifications: Array<{ id: string }>;
    emailDraftId: string;
  },
) {
  if (input.notifications.length === 0) return;
  await db.insert(notificationDeliveries).values(
    input.notifications.map((notification) => ({
      notificationId: notification.id,
      channel: "email" as const,
      status: "draft" as const,
      emailDraftId: input.emailDraftId,
    })),
  );
}

export async function listNotifications(db: Database, input: NotificationListInput) {
  return db
    .select({
      id: notificationRows.id,
      eventId: notificationRows.eventId,
      portal: notificationRows.portal,
      recipientUserId: notificationRows.recipientUserId,
      clientId: notificationRows.clientId,
      projectId: notificationRows.projectId,
      title: notificationRows.title,
      body: notificationRows.body,
      href: notificationRows.href,
      severity: notificationRows.severity,
      readAt: notificationRows.readAt,
      seenAt: notificationRows.seenAt,
      createdAt: notificationRows.createdAt,
      updatedAt: notificationRows.updatedAt,
      eventType: notificationEvents.eventType,
      entityType: notificationEvents.entityType,
      entityId: notificationEvents.entityId,
      payloadJson: notificationEvents.payloadJson,
    })
    .from(notificationRows)
    .innerJoin(notificationEvents, eq(notificationRows.eventId, notificationEvents.id))
    .where(
      and(
        eq(notificationRows.recipientUserId, input.userId),
        eq(notificationRows.portal, input.portal),
        input.clientId ? eq(notificationRows.clientId, input.clientId) : undefined,
        input.onlyUnread ? isNull(notificationRows.readAt) : undefined,
      ),
    )
    .orderBy(desc(notificationRows.createdAt))
    .limit(input.limit ?? 20);
}

export async function countUnreadNotifications(
  db: Database,
  input: Omit<NotificationListInput, "limit" | "onlyUnread">,
) {
  const rows = await db
    .select({ id: notificationRows.id })
    .from(notificationRows)
    .where(
      and(
        eq(notificationRows.recipientUserId, input.userId),
        eq(notificationRows.portal, input.portal),
        input.clientId ? eq(notificationRows.clientId, input.clientId) : undefined,
        isNull(notificationRows.readAt),
      ),
    );

  return rows.length;
}

export async function markNotificationRead(
  db: Database,
  input: { userId: string; portal: NotificationPortal; notificationId: string; clientId?: string | null },
) {
  const [updated] = await db
    .update(notificationRows)
    .set({
      readAt: new Date(),
      seenAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(notificationRows.id, input.notificationId),
        eq(notificationRows.recipientUserId, input.userId),
        eq(notificationRows.portal, input.portal),
        input.clientId ? eq(notificationRows.clientId, input.clientId) : undefined,
      ),
    )
    .returning();

  return updated ?? null;
}

export async function markAllNotificationsRead(
  db: Database,
  input: { userId: string; portal: NotificationPortal; clientId?: string | null },
) {
  await db
    .update(notificationRows)
    .set({
      readAt: new Date(),
      seenAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(notificationRows.recipientUserId, input.userId),
        eq(notificationRows.portal, input.portal),
        input.clientId ? eq(notificationRows.clientId, input.clientId) : undefined,
        isNull(notificationRows.readAt),
      ),
    );
}

async function createReminderDraftForRecipients(
  db: Database,
  input: {
    dedupeKey: string;
    clientId: string;
    projectId: string;
    templateType: "payment_reminder" | "general_outreach";
    subject: string;
    heading: string;
    body: string;
    relatedEntityType: string;
    relatedEntityId: string;
    recipients: Array<{ membershipId: string; email: string }>;
  },
) {
  const [existing] = await db
    .select({ id: emailDrafts.id })
    .from(emailDrafts)
    .where(eq(emailDrafts.dedupeKey, input.dedupeKey))
    .limit(1);

  if (existing) return existing.id;

  const source = await createDraftSourceFromSettings(db, {
    heading: input.heading,
    body: input.body,
  });
  source.subject = input.subject;
  const rendered = await renderEmailSource(source);

  const [draft] = await db
    .insert(emailDrafts)
    .values({
      source: "suggested",
      status: "suggested",
      templateType: input.templateType,
      clientId: input.clientId,
      projectId: input.projectId,
      subject: input.subject,
      builderSourceJson: source,
      renderedHtml: rendered.html,
      renderedText: rendered.text,
      triggerType: "notification_reminder",
      relatedEntityType: input.relatedEntityType,
      relatedEntityId: input.relatedEntityId,
      dedupeKey: input.dedupeKey,
    })
    .returning();

  if (!draft) {
    throw new Error("Unable to create reminder draft.");
  }

  if (input.recipients.length > 0) {
    await db.insert(emailDraftRecipients).values(
      input.recipients.map((recipient) => ({
        draftId: draft.id,
        recipientMode: "selected_member" as const,
        clientMembershipId: recipient.membershipId,
        email: recipient.email,
        name: recipient.email,
      })),
    );
  }

  return draft.id;
}

export async function getNotificationSettingsSnapshot(db: Database) {
  const settings = await getOrCreateNotificationSettings(db);
  const [lastRun] = await db
    .select()
    .from(notificationRuns)
    .orderBy(desc(notificationRuns.startedAt))
    .limit(1);

  return { settings, lastRun: lastRun ?? null };
}

export async function generateScheduledNotificationReminders(db: Database) {
  const settings = await getOrCreateNotificationSettings(db);
  const [run] = await db
    .insert(notificationRuns)
    .values({ status: "running" })
    .returning();

  let createdNotificationCount = 0;
  let createdDeliveryCount = 0;
  let skippedDuplicateCount = 0;

  try {
    const [artifacts, accessStates] = await Promise.all([
      db
        .select({
          id: projectBillingArtifacts.id,
          clientId: projectBillingArtifacts.clientId,
          projectId: projectBillingArtifacts.projectId,
          title: projectBillingArtifacts.title,
          invoiceNumber: projectBillingArtifacts.invoiceNumber,
          dueAt: projectBillingArtifacts.dueAt,
          currency: projectBillingArtifacts.currency,
          totalAmount: projectBillingArtifacts.totalAmount,
          projectName: projects.name,
        })
        .from(projectBillingArtifacts)
        .innerJoin(projects, eq(projectBillingArtifacts.projectId, projects.id))
        .where(
          and(
            isNull(projectBillingArtifacts.paidAt),
            or(
              eq(projectBillingArtifacts.status, "sent"),
              eq(projectBillingArtifacts.status, "pending_payment"),
              eq(projectBillingArtifacts.status, "proof_submitted"),
              eq(projectBillingArtifacts.status, "overdue"),
            ),
            lte(projectBillingArtifacts.issuedAt, new Date()),
          ),
        ),
      db
        .select({
          projectId: projectBillingAccessStates.projectId,
          clientId: projectBillingAccessStates.clientId,
          accessExpiresAt: projectBillingAccessStates.accessExpiresAt,
          projectName: projects.name,
        })
        .from(projectBillingAccessStates)
        .innerJoin(projects, eq(projectBillingAccessStates.projectId, projects.id))
        .where(isNotNull(projectBillingAccessStates.accessExpiresAt)),
    ]);

    const now = new Date();

    for (const artifact of artifacts) {
      if (!artifact.dueAt || !settings.paymentRemindersEnabled) continue;
      for (const window of settings.paymentReminderWindows as ReminderWindowKey[]) {
        if (!isWindowDue({ targetDate: artifact.dueAt, now, window, timeZone: settings.timezone })) {
          continue;
        }

        const dedupeKey = buildReminderDedupeKey({
          family: "payment",
          entityId: artifact.id,
          window,
          dateKey: toColomboDateKey(now, settings.timezone),
        });

        const copy = resolveReminderCopy({
          settings,
          family: "payment",
          window,
          payload: {
            clientName: "",
            projectName: artifact.projectName,
            invoiceTitle: artifact.title,
            amount: artifact.totalAmount / 100,
            currency: artifact.currency,
            dueDate: artifact.dueAt.toLocaleDateString("en-LK"),
            portalUrl: `/client-portal/projects/${artifact.projectId}/payments/${artifact.id}`,
          },
        });

        const result = await recordNotificationEvent(db, {
          eventType: "payment.reminder",
          clientId: artifact.clientId,
          projectId: artifact.projectId,
          entityType: "invoice",
          entityId: artifact.id,
          severity: window.startsWith("plus_") ? "warning" : "info",
          dedupeKey,
          payload: {
            family: "payment",
            window,
            title: copy.title,
            body: copy.body,
            projectName: artifact.projectName,
            invoiceTitle: artifact.title,
            dueDate: artifact.dueAt.toLocaleDateString("en-LK"),
          },
          title: copy.title,
          body: copy.body,
          href: `/client-portal/projects/${artifact.projectId}/payments/${artifact.id}`,
          audiences: [{ kind: "client_members", clientId: artifact.clientId }],
        });

        if (result.notifications.length === 0) {
          skippedDuplicateCount++;
          continue;
        }

        const recipients = (
          await resolveAudienceRecipients(db, {
            kind: "client_members",
            clientId: artifact.clientId,
          })
        ).filter((recipient): recipient is NotificationRecipient & { membershipId: string; email: string } =>
          recipient.portal === "client" &&
          Boolean(recipient.membershipId) &&
          Boolean(recipient.email),
        );

        const draftId = await createReminderDraftForRecipients(db, {
          dedupeKey: `${dedupeKey}:email`,
          clientId: artifact.clientId,
          projectId: artifact.projectId,
          templateType: "payment_reminder",
          subject: copy.emailSubject,
          heading: copy.emailTitle,
          body: copy.emailBody,
          relatedEntityType: "invoice",
          relatedEntityId: artifact.id,
          recipients: recipients.map((recipient) => ({
            membershipId: recipient.membershipId,
            email: recipient.email,
          })),
        });

        await attachDraftEmailDelivery(db, {
          notifications: result.notifications,
          emailDraftId: draftId,
        });
        createdNotificationCount += result.notifications.length;
        createdDeliveryCount += result.notifications.length;
      }
    }

    for (const accessState of accessStates) {
      if (!accessState.accessExpiresAt || !settings.accessRemindersEnabled) continue;
      for (const window of settings.accessReminderWindows as ReminderWindowKey[]) {
        if (
          !isWindowDue({
            targetDate: accessState.accessExpiresAt,
            now,
            window,
            timeZone: settings.timezone,
          })
        ) {
          continue;
        }

        const dedupeKey = buildReminderDedupeKey({
          family: "access",
          entityId: accessState.projectId,
          window,
          dateKey: toColomboDateKey(now, settings.timezone),
        });
        const copy = resolveReminderCopy({
          settings,
          family: "access",
          window,
          payload: {
            projectName: accessState.projectName,
            accessExpiryDate: accessState.accessExpiresAt.toLocaleDateString("en-LK"),
            portalUrl: `/client-portal/projects/${accessState.projectId}/payments`,
          },
        });
        const result = await recordNotificationEvent(db, {
          eventType: "access.reminder",
          clientId: accessState.clientId,
          projectId: accessState.projectId,
          entityType: "project_access",
          entityId: accessState.projectId,
          severity: window.startsWith("plus_") ? "warning" : "info",
          dedupeKey,
          payload: {
            family: "access",
            window,
            title: copy.title,
            body: copy.body,
            projectName: accessState.projectName,
            accessExpiryDate: accessState.accessExpiresAt.toLocaleDateString("en-LK"),
          },
          title: copy.title,
          body: copy.body,
          href: `/client-portal/projects/${accessState.projectId}/payments`,
          audiences: [{ kind: "client_members", clientId: accessState.clientId }],
        });

        if (result.notifications.length === 0) {
          skippedDuplicateCount++;
          continue;
        }

        const recipients = (
          await resolveAudienceRecipients(db, {
            kind: "client_members",
            clientId: accessState.clientId,
          })
        ).filter((recipient): recipient is NotificationRecipient & { membershipId: string; email: string } =>
          recipient.portal === "client" &&
          Boolean(recipient.membershipId) &&
          Boolean(recipient.email),
        );

        const draftId = await createReminderDraftForRecipients(db, {
          dedupeKey: `${dedupeKey}:email`,
          clientId: accessState.clientId,
          projectId: accessState.projectId,
          templateType: "general_outreach",
          subject: copy.emailSubject,
          heading: copy.emailTitle,
          body: copy.emailBody,
          relatedEntityType: "project_access",
          relatedEntityId: accessState.projectId,
          recipients: recipients.map((recipient) => ({
            membershipId: recipient.membershipId,
            email: recipient.email,
          })),
        });

        await attachDraftEmailDelivery(db, {
          notifications: result.notifications,
          emailDraftId: draftId,
        });
        createdNotificationCount += result.notifications.length;
        createdDeliveryCount += result.notifications.length;
      }
    }

    await db
      .update(notificationRuns)
      .set({
        status: "completed",
        createdNotificationCount,
        createdDeliveryCount,
        skippedDuplicateCount,
        completedAt: new Date(),
      })
      .where(eq(notificationRuns.id, run.id));

    return {
      runId: run.id,
      createdNotificationCount,
      createdDeliveryCount,
      skippedDuplicateCount,
    };
  } catch (error) {
    await db
      .update(notificationRuns)
      .set({
        status: "failed",
        createdNotificationCount,
        createdDeliveryCount,
        skippedDuplicateCount,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        completedAt: new Date(),
      })
      .where(eq(notificationRuns.id, run.id));
    throw error;
  }
}
