import { NextResponse } from "next/server";
import { TRPCError } from "@trpc/server";

import { db } from "~/server/db";
import {
  applyProductAccessCallback,
  getProductWebhookConfigBySlug,
  productAccessCallbackSchema,
  verifyProductAccessSignature,
} from "~/server/product-access";

export async function POST(
  request: Request,
  context: { params: Promise<{ productSlug: string }> },
) {
  const { productSlug } = await context.params;
  const rawPayload = await request.text();
  const signatureHeader = request.headers.get("x-concolabs-signature");

  try {
    const webhook = await getProductWebhookConfigBySlug(db, productSlug);

    if (!webhook.webhookSecret) {
      return NextResponse.json(
        { ok: false, error: "Product webhook secret is not configured." },
        { status: 503 },
      );
    }

    const verified = verifyProductAccessSignature({
      payload: rawPayload,
      signatureHeader,
      secret: webhook.webhookSecret,
    });

    if (!verified) {
      return NextResponse.json(
        { ok: false, error: "Signature verification failed." },
        { status: 401 },
      );
    }

    const parsed = productAccessCallbackSchema.parse(
      JSON.parse(rawPayload) as unknown,
    );
    const result = await applyProductAccessCallback(db, {
      productSlug,
      payload: parsed,
    });

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    if (error instanceof TRPCError) {
      const status =
        error.code === "NOT_FOUND"
          ? 404
          : error.code === "BAD_REQUEST"
            ? 400
            : 500;

      return NextResponse.json(
        { ok: false, error: error.message },
        { status },
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON payload." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Webhook handling failed.",
      },
      { status: 400 },
    );
  }
}
