import { ClientOverviewPanel } from "~/components/admin/clients/client-overview-panel";
import { ClientSectionSurface } from "~/components/admin/clients/client-workspace-shell";

export default async function AdminClientOverviewPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;

  return (
    <ClientSectionSurface
      description="Review the client company profile, current member/project counts, and the most recent activity touching this account."
      eyebrow="Client Overview"
      title="Overview"
    >
      <ClientOverviewPanel clientId={clientId} />
    </ClientSectionSurface>
  );
}
