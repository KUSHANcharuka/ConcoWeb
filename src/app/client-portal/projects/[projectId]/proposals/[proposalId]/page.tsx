import { getDocusealEmbedHost, isDocusealConfigured } from "~/server/docuseal";
import { ProjectProposalDetail } from "~/components/admin/projects/workspace/project-proposal-detail";
import { ProjectSectionSurface } from "~/components/admin/projects/workspace/project-workspace-shell";

export default async function ClientProjectProposalDetailPage({
  params,
}: {
  params: Promise<{ projectId: string; proposalId: string }>;
}) {
  const { projectId, proposalId } = await params;

  return (
    <ProjectSectionSurface
      description="Open the proposal document, review any existing comments, and complete signature steps when they are available."
      eyebrow="Project Proposals"
      title="Proposal workspace"
    >
      <ProjectProposalDetail
        formEmbedHost={isDocusealConfigured() ? getDocusealEmbedHost() : null}
        mode="client"
        projectId={projectId}
        proposalId={proposalId}
      />
    </ProjectSectionSurface>
  );
}
