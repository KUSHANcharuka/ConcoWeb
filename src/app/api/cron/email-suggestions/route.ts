import { NextResponse } from "next/server";

import { env } from "~/env";
import { db } from "~/server/db";
import { generateSuggestedEmailDrafts } from "~/server/emails/service";

async function runProductInvalidationDispatch() {
  return { ok: true };
}

export async function POST(request: Request) {
  if (env.OUTBOUND_WEBHOOK_SIGNING_KEY) {
    const authorization = request.headers.get("authorization");
    if (authorization !== `Bearer ${env.OUTBOUND_WEBHOOK_SIGNING_KEY}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const [emailResult, productResult] = await Promise.allSettled([
    generateSuggestedEmailDrafts(db),
    runProductInvalidationDispatch(),
  ]);

  return NextResponse.json({
    ok: emailResult.status === "fulfilled",
    email:
      emailResult.status === "fulfilled"
        ? emailResult.value
        : { error: emailResult.reason instanceof Error ? emailResult.reason.message : "failed" },
    productInvalidation:
      productResult.status === "fulfilled"
        ? productResult.value
        : { ok: false, error: productResult.reason instanceof Error ? productResult.reason.message : "failed" },
  });
}
