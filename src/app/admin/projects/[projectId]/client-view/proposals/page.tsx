import { ProjectProposalsDashboard } from "~/components/admin/projects/workspace/project-proposals-dashboard";
import { ProjectSectionSurface } from "~/components/admin/projects/workspace/project-workspace-shell";
import { api } from "~/trpc/server";

export default async function AdminProjectClientProposalsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const context = await api.admin.projectWorkspace.context({ projectId });
  return (
    <ProjectSectionSurface
      description="This preview route mirrors the client-side proposal dashboard before drilling into a specific proposal signing workspace."
      eyebrow="Client Preview"
      title="Proposals"
    >
      <ProjectProposalsDashboard mode="client-preview" projectId={projectId} />
    </ProjectSectionSurface>
  );
}
