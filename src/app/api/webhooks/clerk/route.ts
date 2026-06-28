import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { Webhook } from "svix";
import { clerkClient, type WebhookEvent } from "@clerk/nextjs/server";

import { env } from "~/env";
import { db } from "~/server/db";
import { clients } from "~/server/db/schema";
import {
  buildMembershipDisplayName,
  findClientByClerkOrgId,
  mapWebhookRole,
  markMembershipRemoved,
  syncOrganizationInvitation,
  syncOrganizationMembership,
  upsertUserRecord,
} from "~/server/clients/sync";

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
  const client = await clerkClient();

  if (
    event.type === "organizationMembership.created" ||
    event.type === "organizationMembership.deleted" ||
    event.type === "organizationMembership.updated"
  ) {
    const orgId = event.data.organization.id;
    const userId = event.data.public_user_data.user_id;

    if (orgId === staffOrgId) {
      const role = event.type === "organizationMembership.deleted" ? null : "admin";

      await client.users.updateUserMetadata(userId, {
        publicMetadata: { role },
      });

      console.log(
        `[clerk-webhook] ${event.type} → user ${userId} role=${role ?? "(cleared)"}`,
      );
      return new Response("ok", { status: 200 });
    }

    const matchedClient = await findClientByClerkOrgId(db, orgId);
    if (!matchedClient) {
      return new Response("ok", { status: 200 });
    }

    if (event.type === "organizationMembership.deleted") {
      await markMembershipRemoved(db, {
        clientId: matchedClient.id,
        userId,
      });
      return new Response("ok", { status: 200 });
    }

    await upsertUserRecord(db, {
      userId,
      email: event.data.public_user_data.identifier,
      name: buildMembershipDisplayName({
        firstName: event.data.public_user_data.first_name,
        lastName: event.data.public_user_data.last_name,
      }),
      imageUrl: event.data.public_user_data.image_url,
    });

    await syncOrganizationMembership(db, {
      clientId: matchedClient.id,
      userId,
      email: event.data.public_user_data.identifier,
      role: mapWebhookRole(event.data.role),
      clerkMembershipId: event.data.id,
      joinedAt: event.data.created_at,
    });

    return new Response("ok", { status: 200 });
  }

  if (event.type === "organization.updated") {
    const matchedClient = await findClientByClerkOrgId(db, event.data.id);
    if (!matchedClient) {
      return new Response("ok", { status: 200 });
    }

    await db
      .update(clients)
      .set({
        name: event.data.name,
        updatedAt: new Date(),
      })
      .where(eq(clients.id, matchedClient.id));

    return new Response("ok", { status: 200 });
  }

  if (
    event.type === "organizationInvitation.created" ||
    event.type === "organizationInvitation.revoked"
  ) {
    const matchedClient = await findClientByClerkOrgId(
      db,
      event.data.organization_id,
    );
    if (!matchedClient) {
      return new Response("ok", { status: 200 });
    }

    await syncOrganizationInvitation(db, {
      clientId: matchedClient.id,
      clerkInvitationId: event.data.id,
      email: event.data.email_address,
      role: mapWebhookRole(event.data.role),
      status: event.type === "organizationInvitation.revoked" ? "revoked" : "pending",
      invitedAt: event.data.created_at,
      revokedAt: event.type === "organizationInvitation.revoked" ? Date.now() : null,
    });

    return new Response("ok", { status: 200 });
  }

  if (event.type === "organizationInvitation.accepted") {
    const matchedClient = await findClientByClerkOrgId(
      db,
      event.data.organization_id,
    );
    if (!matchedClient) {
      return new Response("ok", { status: 200 });
    }

    const user = await client.users.getUser(event.data.user_id);

    await upsertUserRecord(db, {
      userId: user.id,
      email: event.data.email_address,
      name: [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || null,
      imageUrl: user.imageUrl,
      phone: user.primaryPhoneNumber?.phoneNumber ?? null,
    });

    await syncOrganizationInvitation(db, {
      clientId: matchedClient.id,
      clerkInvitationId: event.data.id,
      email: event.data.email_address,
      role: mapWebhookRole(event.data.role),
      status: "accepted",
      acceptedUserId: event.data.user_id,
      invitedAt: event.data.created_at,
      acceptedAt: event.data.updated_at,
    });

    return new Response("ok", { status: 200 });
  }

  return new Response("ok", { status: 200 });
}
