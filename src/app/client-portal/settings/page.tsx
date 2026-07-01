import { and, desc, eq } from "drizzle-orm";

import { SettingsSectionSurface } from "~/components/admin/settings/settings-workspace-shell";
import { ClientSettingsProfilePageClient } from "~/components/client-portal/client-settings-profile-page-client";
import { requireClientPortalAccess } from "~/lib/client-portal-auth";
import { db } from "~/server/db";
import { clientInvitations, clientMemberships, users } from "~/server/db/schema";

export default async function ClientPortalSettingsPage() {
  const { client, userId } = await requireClientPortalAccess();

  const [memberRows, invitationRows] = await Promise.all([
    db
      .select({
        id: clientMemberships.id,
        userId: clientMemberships.userId,
        name: users.name,
        email: clientMemberships.email,
        phone: users.phone,
        role: clientMemberships.role,
        status: clientMemberships.status,
        joinedAt: clientMemberships.joinedAt,
      })
      .from(clientMemberships)
      .leftJoin(users, eq(users.id, clientMemberships.userId))
      .where(
        and(
          eq(clientMemberships.clientId, client.id),
          eq(clientMemberships.status, "active"),
        ),
      )
      .orderBy(clientMemberships.role, users.name, clientMemberships.email),
    db
      .select({
        id: clientInvitations.id,
        email: clientInvitations.email,
        name: clientInvitations.name,
        phone: clientInvitations.phone,
        role: clientInvitations.role,
        status: clientInvitations.status,
        invitedAt: clientInvitations.invitedAt,
      })
      .from(clientInvitations)
      .where(eq(clientInvitations.clientId, client.id))
      .orderBy(desc(clientInvitations.createdAt)),
  ]);

  const pendingInvites = invitationRows.filter((invite) => invite.status === "pending");
  const currentMember = memberRows.find((member) => member.userId === userId) ?? null;

  return (
    <SettingsSectionSurface
      eyebrow="Client Profile"
      title="Workspace profile and members."
      description="Review the organization identity, visible members, and pending invitations that back this client portal."
    >
      <ClientSettingsProfilePageClient
        canManageMembers={currentMember?.role === "admin"}
        client={client}
        currentUserId={userId}
        memberRows={memberRows}
        pendingInvites={pendingInvites}
      />
    </SettingsSectionSurface>
  );
}
