import { and, eq, or } from "drizzle-orm";
import { NextResponse } from "next/server";

import { env } from "~/env";
import { db } from "~/server/db";
import { proposals } from "~/server/db/schema/project-proposals";

type DocusealWebhookPayload = {
  event_type?: string;
  timestamp?: string;
  data?: {
    id?: number | string;
    submission_id?: number | string;
    external_id?: string;
    status?: string;
    completed_at?: string | null;
    declined_at?: string | null;
    submission?: {
      id?: number | string;
      status?: string;
      audit_log_url?: string | null;
      combined_document_url?: string | null;
    };
  };
};

export async function POST(request: Request) {
  const secret = env.DOCUSEAL_WEBHOOK_SECRET;
  if (secret) {
    const providedSecret = request.headers.get("x-docuseal-secret");
    if (providedSecret !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const payload = (await request.json()) as DocusealWebhookPayload;
  const eventType = payload.event_type;
  const submitterId = payload.data?.id ? String(payload.data.id) : null;
  const submissionId = payload.data?.submission_id
    ? String(payload.data.submission_id)
    : payload.data?.submission?.id
      ? String(payload.data.submission.id)
      : null;
  const externalId = payload.data?.external_id ?? null;

  if (
    !eventType ||
    (eventType !== "form.completed" &&
      eventType !== "form.declined" &&
      eventType !== "submission.completed")
  ) {
    return NextResponse.json({ ok: true });
  }

  if (!submitterId && !submissionId && !externalId) {
    return NextResponse.json({ ok: true });
  }

  const [proposal] = await db
    .select({
      id: proposals.id,
      lastWebhookEventId: proposals.lastWebhookEventId,
    })
    .from(proposals)
    .where(
      or(
        ...(submitterId ? [eq(proposals.docusealSubmitterId, submitterId)] : []),
        ...(submissionId ? [eq(proposals.docusealSubmissionId, submissionId)] : []),
        ...(externalId ? [eq(proposals.id, externalId)] : []),
      ),
    )
    .limit(1);

  if (!proposal) {
    return NextResponse.json({ ok: true });
  }

  const derivedEventId = [
    eventType,
    payload.timestamp ?? "",
    submitterId ?? "",
    submissionId ?? "",
  ].join(":");

  if (proposal.lastWebhookEventId === derivedEventId) {
    return NextResponse.json({ ok: true, deduped: true });
  }

  const nextStatus =
    eventType === "form.declined" ? "declined" : eventType === "form.completed" || eventType === "submission.completed" ? "signed" : undefined;

  await db
    .update(proposals)
    .set({
      status: nextStatus,
      docusealSubmissionId: submissionId ?? undefined,
      docusealSubmissionStatus: payload.data?.submission?.status ?? payload.data?.status,
      docusealSubmitterId: submitterId ?? undefined,
      signedAt:
        nextStatus === "signed" && payload.data?.completed_at
          ? new Date(payload.data.completed_at)
          : undefined,
      declinedAt:
        nextStatus === "declined" && payload.data?.declined_at
          ? new Date(payload.data.declined_at)
          : undefined,
      lastWebhookEventId: derivedEventId,
      lastWebhookEventType: eventType,
      lastWebhookPayload: payload,
      lastWebhookReceivedAt: new Date(payload.timestamp ?? Date.now()),
      updatedAt: new Date(),
    })
    .where(eq(proposals.id, proposal.id));

  return NextResponse.json({ ok: true });
}
