import { ProjectPlaceholderPanel, ProjectSectionSurface } from "~/components/admin/projects/workspace/project-workspace-shell";

export default function AdminProjectPaymentsPage() {
  return (
    <ProjectSectionSurface
      description="Billing and payment workflows are intentionally deferred in this change."
      eyebrow="Deferred"
      title="Payments"
    >
      <ProjectPlaceholderPanel
        description="Payments will become the centralized billing surface in a follow-up change. This version keeps the route visible without exposing incomplete workflow controls."
        title="Payments are deferred for this version"
      />
    </ProjectSectionSurface>
  );
}
