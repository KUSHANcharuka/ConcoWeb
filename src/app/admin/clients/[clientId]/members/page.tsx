import { ClientMembersPanel } from "~/components/admin/clients/client-members-panel";
import { ClientSectionSurface } from "~/components/admin/clients/client-workspace-shell";

export default async function AdminClientMembersPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;

  return (
    <ClientSectionSurface
      description="Manage the organization membership for this client company, including pending invites, accepted members, role changes, and removals."
      eyebrow="Client Members"
      title="Members"
    >
      <ClientMembersPanel clientId={clientId} />
    </ClientSectionSurface>
  );
}
