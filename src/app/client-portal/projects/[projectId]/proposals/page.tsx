import { ProjectProposalsDashboard } from "~/components/admin/projects/workspace/project-proposals-dashboard";
import { ProjectSectionSurface } from "~/components/admin/projects/workspace/project-workspace-shell";

export default async function ClientProjectProposalsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <ProjectSectionSurface
      description="Review proposal versions, signing status, and open the signing workspace for each document."
      eyebrow="Project Proposals"
      title="Proposals"
    >
      <ProjectProposalsDashboard mode="client" projectId={projectId} />
    </ProjectSectionSurface>
  );
}
