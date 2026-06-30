import { getDocusealEmbedHost, isDocusealConfigured } from "~/server/docuseal";
import { ProjectProposalDetail } from "~/components/admin/projects/workspace/project-proposal-detail";
import { ProjectSectionSurface } from "~/components/admin/projects/workspace/project-workspace-shell";

export default async function AdminProjectClientProposalDetailPage({
  params,
}: {
  params: Promise<{ projectId: string; proposalId: string }>;
}) {
  const { projectId, proposalId } = await params;

  return (
    <ProjectSectionSurface
      description="This preview route mirrors the client-side read-only proposal and signing experience."
      eyebrow="Client Preview"
      title="Proposal workspace"
    >
      <ProjectProposalDetail
        formEmbedHost={isDocusealConfigured() ? getDocusealEmbedHost() : null}
        mode="client-preview"
        projectId={projectId}
        proposalId={proposalId}
      />
    </ProjectSectionSurface>
  );
}
