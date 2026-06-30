import { ClientProjectsPanel } from "~/components/admin/clients/client-projects-panel";
import { ClientSectionSurface } from "~/components/admin/clients/client-workspace-shell";

export default async function AdminClientProjectsPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;

  return (
    <ClientSectionSurface
      description="These are the project workspaces currently linked to this client company. New projects created here are pre-bound to the same client."
      eyebrow="Client Projects"
      title="Projects"
    >
      <ClientProjectsPanel clientId={clientId} />
    </ClientSectionSurface>
  );
}
