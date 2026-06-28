import { ProjectProposalsPanel } from "~/components/admin/projects/workspace/project-proposals-panel";
import { ProjectSectionSurface } from "~/components/admin/projects/workspace/project-workspace-shell";
import { api } from "~/trpc/server";

export default async function AdminProjectProposalsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const context = await api.admin.projectWorkspace.context({ projectId });
  return (
    <ProjectSectionSurface
      description="Proposal records, source uploads, DocuSeal metadata, and side comments are all now modeled for this project scope."
      eyebrow="Project Proposals"
      title="Proposals"
    >
      <ProjectProposalsPanel currency={context.currency} mode="admin" projectId={projectId} />
    </ProjectSectionSurface>
  );
}
