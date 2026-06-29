import { ProjectPaymentsDashboard } from "~/components/admin/billing/project-payments-dashboard";
import { ProjectSectionSurface } from "~/components/admin/projects/workspace/project-workspace-shell";

export default async function AdminProjectClientPaymentsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <ProjectSectionSurface
      description="This preview route mirrors the client-side invoice list and payment-detail journey."
      eyebrow="Client Preview"
      title="Payments"
    >
      <ProjectPaymentsDashboard mode="client-preview" projectId={projectId} />
    </ProjectSectionSurface>
  );
}
