import { getDocusealEmbedHost, isDocusealConfigured } from "~/server/docuseal";
import { ProjectPaymentDetailSurface } from "~/components/admin/billing/project-payment-detail-surface";
import { ProjectSectionSurface } from "~/components/admin/projects/workspace/project-workspace-shell";

export default async function AdminProjectClientPaymentDetailPage({
  params,
}: {
  params: Promise<{ projectId: string; artifactId: string }>;
}) {
  const { projectId, artifactId } = await params;

  return (
    <ProjectSectionSurface
      description="This preview route mirrors the client invoice detail experience with inline documents and payment actions."
      eyebrow="Client Preview"
      title="Invoice workspace"
    >
      <ProjectPaymentDetailSurface
        artifactId={artifactId}
        formEmbedHost={isDocusealConfigured() ? getDocusealEmbedHost() : null}
        mode="client-preview"
        projectId={projectId}
      />
    </ProjectSectionSurface>
  );
}
