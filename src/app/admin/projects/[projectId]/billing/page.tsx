import { ProjectBillingPageClient } from "~/components/admin/billing/project-billing-page-client";

export default async function AdminProjectBillingPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return <ProjectBillingPageClient projectId={projectId} />;
}
