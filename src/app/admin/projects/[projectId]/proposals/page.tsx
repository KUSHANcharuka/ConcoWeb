import { ProjectProposalsDashboard } from "~/components/admin/projects/workspace/project-proposals-dashboard";
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
      description="Proposal drafts, sent documents, signatures, and revisions now live in a dashboard first. Open a proposal to enter the workspace for that record."
      eyebrow="Project Proposals"
      title="Proposals"
    >
      <ProjectProposalsDashboard mode="admin" projectId={projectId} />
    </ProjectSectionSurface>
  );
}
