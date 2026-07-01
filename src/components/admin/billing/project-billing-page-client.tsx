"use client";

import { ProjectPaymentsDashboard } from "~/components/admin/billing/project-payments-dashboard";

export function ProjectBillingPageClient({ projectId }: { projectId: string }) {
  return <ProjectPaymentsDashboard mode="admin" projectId={projectId} />;
}
