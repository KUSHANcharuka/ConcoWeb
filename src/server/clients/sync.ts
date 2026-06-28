import { and, desc, eq } from "drizzle-orm";

import type { Database } from "~/server/db";
import {
  clientInvitations,
  clientMemberships,
  clients,
  users,
} from "~/server/db/schema";
import { fromClerkClientRole, type ClientRole } from "~/server/clients/clerk";

function toDate(value?: number | null) {
  return typeof value === "number" ? new Date(value) : null;
}

export async function findClientByClerkOrgId(db: Database, clerkOrgId: string) {
  const [client] = await db
    .select({
      id: clients.id,
      name: clients.name,
      clerkOrgId: clients.clerkOrgId,
    })
    .from(clients)
    .where(eq(clients.clerkOrgId, clerkOrgId))
    .limit(1);

  return client ?? null;
}

export async function upsertUserRecord(
  db: Database,
  input: {
    userId: string;
    email: string;
    name?: string | null;
    imageUrl?: string | null;
    phone?: string | null;
  },
) {
  await db
    .insert(users)
    .values({
      id: input.userId,
      email: input.email,
      phone: input.phone ?? null,
      name: input.name ?? null,
      imageUrl: input.imageUrl ?? null,
      role: "client",
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email: input.email,
        phone: input.phone ?? null,
        name: input.name ?? null,
        imageUrl: input.imageUrl ?? null,
        updatedAt: new Date(),
      },
    });
}

export async function syncOrganizationInvitation(
  db: Database,
  input: {
    clientId: string;
    clerkInvitationId: string;
    email: string;
    name?: string | null;
    jobTitle?: string | null;
    phone?: string | null;
    role: ClientRole;
    status: "pending" | "accepted" | "revoked" | "expired";
    invitedByUserId?: string | null;
    acceptedUserId?: string | null;
    revokedByUserId?: string | null;
    invitedAt?: number | null;
    acceptedAt?: number | null;
    revokedAt?: number | null;
  },
) {
  const [existingInvitation] = await db
    .select({
      name: clientInvitations.name,
      jobTitle: clientInvitations.jobTitle,
      phone: clientInvitations.phone,
    })
    .from(clientInvitations)
    .where(eq(clientInvitations.clerkInvitationId, input.clerkInvitationId))
    .limit(1);

  const nextName = input.name ?? existingInvitation?.name ?? null;
  const nextJobTitle = input.jobTitle ?? existingInvitation?.jobTitle ?? null;
  const nextPhone = input.phone ?? existingInvitation?.phone ?? null;

  await db
    .insert(clientInvitations)
    .values({
      clientId: input.clientId,
      clerkInvitationId: input.clerkInvitationId,
      email: input.email,
      name: nextName,
      jobTitle: nextJobTitle,
      phone: nextPhone,
      role: input.role,
      status: input.status,
      invitedByUserId: input.invitedByUserId ?? null,
      acceptedUserId: input.acceptedUserId ?? null,
      revokedByUserId: input.revokedByUserId ?? null,
      invitedAt: toDate(input.invitedAt) ?? new Date(),
      acceptedAt: toDate(input.acceptedAt),
      revokedAt: toDate(input.revokedAt),
    })
    .onConflictDoUpdate({
      target: clientInvitations.clerkInvitationId,
      set: {
        email: input.email,
        name: nextName,
        jobTitle: nextJobTitle,
        phone: nextPhone,
        role: input.role,
        status: input.status,
        invitedByUserId: input.invitedByUserId ?? null,
        acceptedUserId: input.acceptedUserId ?? null,
        revokedByUserId: input.revokedByUserId ?? null,
        invitedAt: toDate(input.invitedAt) ?? new Date(),
        acceptedAt: toDate(input.acceptedAt),
        revokedAt: toDate(input.revokedAt),
        updatedAt: new Date(),
      },
    });
}

export async function syncOrganizationMembership(
  db: Database,
  input: {
    clientId: string;
    userId: string;
    email: string;
    jobTitle?: string | null;
    role: ClientRole;
    clerkMembershipId: string;
    joinedAt?: number | null;
    removedAt?: Date | null;
    removedByUserId?: string | null;
  },
) {
  const [matchedInvitation] = await db
    .select({
      id: clientInvitations.id,
      jobTitle: clientInvitations.jobTitle,
    })
    .from(clientInvitations)
    .where(
      and(
        eq(clientInvitations.clientId, input.clientId),
        eq(clientInvitations.email, input.email),
      ),
    )
    .orderBy(desc(clientInvitations.createdAt))
    .limit(1);

  await db
    .insert(clientMemberships)
    .values({
      clientId: input.clientId,
      userId: input.userId,
      email: input.email,
      jobTitle: input.jobTitle ?? matchedInvitation?.jobTitle ?? null,
      role: input.role,
      clerkMembershipId: input.clerkMembershipId,
      sourceInvitationId: matchedInvitation?.id ?? null,
      status: input.removedAt ? "removed" : "active",
      joinedAt: toDate(input.joinedAt) ?? new Date(),
      removedAt: input.removedAt ?? null,
      removedByUserId: input.removedByUserId ?? null,
    })
    .onConflictDoUpdate({
      target: [clientMemberships.clientId, clientMemberships.userId],
      set: {
        clerkMembershipId: input.clerkMembershipId,
        email: input.email,
        jobTitle: input.jobTitle ?? matchedInvitation?.jobTitle ?? null,
        role: input.role,
        sourceInvitationId: matchedInvitation?.id ?? null,
        status: input.removedAt ? "removed" : "active",
        joinedAt: toDate(input.joinedAt) ?? new Date(),
        removedAt: input.removedAt ?? null,
        removedByUserId: input.removedByUserId ?? null,
        updatedAt: new Date(),
      },
    });
}

export async function markMembershipRemoved(
  db: Database,
  input: {
    clientId: string;
    userId: string;
    removedByUserId?: string | null;
  },
) {
  await db
    .update(clientMemberships)
    .set({
      status: "removed",
      removedAt: new Date(),
      removedByUserId: input.removedByUserId ?? null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(clientMemberships.clientId, input.clientId),
        eq(clientMemberships.userId, input.userId),
      ),
    );
}

export function buildMembershipDisplayName(input: {
  firstName?: string | null;
  lastName?: string | null;
}) {
  const value = [input.firstName, input.lastName].filter(Boolean).join(" ").trim();
  return value.length > 0 ? value : null;
}

export function mapWebhookRole(role: string | null | undefined): ClientRole {
  return fromClerkClientRole(role);
}
