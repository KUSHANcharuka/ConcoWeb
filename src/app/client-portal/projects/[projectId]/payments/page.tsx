import { ProjectPaymentsDashboard } from "~/components/admin/billing/project-payments-dashboard";
import { ProjectSectionSurface } from "~/components/admin/projects/workspace/project-workspace-shell";

export default async function ClientProjectPaymentsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <ProjectSectionSurface
      description="Review project invoices, open the inline document workspace, and submit payment proofs when manual verification is required."
      eyebrow="Project Payments"
      title="Payments"
    >
      <ProjectPaymentsDashboard mode="client" projectId={projectId} />
    </ProjectSectionSurface>
  );
}
