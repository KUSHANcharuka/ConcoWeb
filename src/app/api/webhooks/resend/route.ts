import { NextResponse } from "next/server";
import { Resend } from "resend";

import { env } from "~/env";
import { db } from "~/server/db";
import { ingestResendWebhook } from "~/server/emails/service";

export async function POST(request: Request) {
  if (!env.RESEND_API_KEY || !env.RESEND_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Resend webhook is not configured." },
      { status: 503 },
    );
  }

  const payload = await request.text();
  const id = request.headers.get("svix-id");
  const timestamp = request.headers.get("svix-timestamp");
  const signature = request.headers.get("svix-signature");

  if (!id || !timestamp || !signature) {
    return new NextResponse("Missing svix headers", { status: 400 });
  }

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    const verified = resend.webhooks.verify({
      payload,
      headers: {
        id,
        timestamp,
        signature,
      },
      webhookSecret: env.RESEND_WEBHOOK_SECRET,
    });

    const result = await ingestResendWebhook(db, {
      providerEventId: id,
      payload: verified as {
        type: string;
        created_at?: string;
        data?: {
          email_id?: string;
          to?: string[];
          bounce?: { message?: string; type?: string; subType?: string };
          suppressed?: { message?: string; type?: string };
        };
      },
    });

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Webhook verification failed.",
      },
      { status: 400 },
    );
  }
}
