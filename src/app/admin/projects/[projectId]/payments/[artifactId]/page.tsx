import { getDocusealEmbedHost, isDocusealConfigured } from "~/server/docuseal";
import { ProjectPaymentDetailSurface } from "~/components/admin/billing/project-payment-detail-surface";
import { ProjectSectionSurface } from "~/components/admin/projects/workspace/project-workspace-shell";

export default async function AdminProjectPaymentDetailPage({
  params,
}: {
  params: Promise<{ projectId: string; artifactId: string }>;
}) {
  const { projectId, artifactId } = await params;

  return (
    <ProjectSectionSurface
      description="Review the invoice bundle, inline documents, payment rails, and uploaded proofs for this project invoice."
      eyebrow="Project Payments"
      title="Invoice workspace"
    >
      <ProjectPaymentDetailSurface
        artifactId={artifactId}
        formEmbedHost={isDocusealConfigured() ? getDocusealEmbedHost() : null}
        mode="admin"
        projectId={projectId}
      />
    </ProjectSectionSurface>
  );
}
