import { headers } from "next/headers";
import { Webhook } from "svix";
import { clerkClient, type WebhookEvent } from "@clerk/nextjs/server";

import { env } from "~/env";

export const runtime = "nodejs";

/**
 * Clerk webhook.
 *
 * Hybrid admin auth: membership in the Concolabs staff org
 * (`CLERK_CONCOLABS_ORG_ID`) is the source of truth for "this user is an
 * admin." We mirror that fact onto `publicMetadata.role` so the middleware and
 * tRPC adminProcedure can gate cheaply on JWT claims.
 */
export async function POST(req: Request) {
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(env.CLERK_WEBHOOK_SIGNING_SECRET);

  let event: WebhookEvent;
  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("[clerk-webhook] signature verification failed", err);
    return new Response("Invalid signature", { status: 401 });
  }

  const staffOrgId = env.CLERK_CONCOLABS_ORG_ID;

  if (
    event.type === "organizationMembership.created" ||
    event.type === "organizationMembership.deleted"
  ) {
    const orgId = event.data.organization.id;
    const userId = event.data.public_user_data.user_id;

    if (orgId === staffOrgId) {
      const client = await clerkClient();
      const role = event.type === "organizationMembership.created" ? "admin" : null;

      await client.users.updateUserMetadata(userId, {
        publicMetadata: { role },
      });

      console.log(
        `[clerk-webhook] ${event.type} → user ${userId} role=${role ?? "(cleared)"}`,
      );
    }
  }

  return new Response("ok", { status: 200 });
}
