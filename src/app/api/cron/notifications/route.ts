import { NextResponse } from "next/server";

import { env } from "~/env";
import { db } from "~/server/db";
import { generateScheduledNotificationReminders } from "~/server/notifications/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (env.OUTBOUND_WEBHOOK_SIGNING_KEY) {
    const authorization = request.headers.get("authorization");
    if (authorization !== `Bearer ${env.OUTBOUND_WEBHOOK_SIGNING_KEY}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const result = await generateScheduledNotificationReminders(db);
    return NextResponse.json({
      ok: true,
      result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to generate scheduled reminders.",
      },
      { status: 500 },
    );
  }
}
