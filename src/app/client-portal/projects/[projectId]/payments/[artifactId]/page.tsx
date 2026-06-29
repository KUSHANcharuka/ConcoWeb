import { getDocusealEmbedHost, isDocusealConfigured } from "~/server/docuseal";
import { ProjectPaymentDetailSurface } from "~/components/admin/billing/project-payment-detail-surface";
import { ProjectSectionSurface } from "~/components/admin/projects/workspace/project-workspace-shell";

export default async function ClientProjectPaymentDetailPage({
  params,
}: {
  params: Promise<{ projectId: string; artifactId: string }>;
}) {
  const { projectId, artifactId } = await params;

  return (
    <ProjectSectionSurface
      description="Open the invoice documents, choose a payment method, and submit proof when the selected rail requires manual verification."
      eyebrow="Project Payments"
      title="Invoice workspace"
    >
      <ProjectPaymentDetailSurface
        artifactId={artifactId}
        formEmbedHost={isDocusealConfigured() ? getDocusealEmbedHost() : null}
        mode="client"
        projectId={projectId}
      />
    </ProjectSectionSurface>
  );
}
