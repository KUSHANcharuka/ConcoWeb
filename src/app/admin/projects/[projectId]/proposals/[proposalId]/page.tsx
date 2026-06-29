import { getDocusealEmbedHost, isDocusealConfigured } from "~/server/docuseal";
import { ProjectProposalDetail } from "~/components/admin/projects/workspace/project-proposal-detail";
import { ProjectSectionSurface } from "~/components/admin/projects/workspace/project-workspace-shell";

export default async function AdminProjectProposalDetailPage({
  params,
}: {
  params: Promise<{ projectId: string; proposalId: string }>;
}) {
  const { projectId, proposalId } = await params;

  return (
    <ProjectSectionSurface
      description="Draft proposals expose DocuSeal authoring. Sent proposals switch to read-only review and comment handling."
      eyebrow="Project Proposals"
      title="Proposal workspace"
    >
      <ProjectProposalDetail
        formEmbedHost={isDocusealConfigured() ? getDocusealEmbedHost() : null}
        mode="admin"
        projectId={projectId}
        proposalId={proposalId}
      />
    </ProjectSectionSurface>
  );
}
