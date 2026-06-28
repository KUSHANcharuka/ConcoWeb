import { ProjectPlaceholderPanel, ProjectSectionSurface } from "~/components/admin/projects/workspace/project-workspace-shell";

export default function AdminProjectClientPaymentsPage() {
  return (
    <ProjectSectionSurface
      description="Billing is deferred in this change, so the preview route remains informational only."
      eyebrow="Client Preview"
      title="Payments"
    >
      <ProjectPlaceholderPanel
        description="Payments will be implemented later. This preview route intentionally exposes no incomplete client actions."
        title="Payments are deferred for this version"
      />
    </ProjectSectionSurface>
  );
}
