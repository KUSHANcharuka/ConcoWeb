import { ProjectPlaceholderPanel, ProjectSectionSurface } from "~/components/admin/projects/workspace/project-workspace-shell";

export default function AdminProjectClientMessagesPage() {
  return (
    <ProjectSectionSurface
      description="Messaging is deferred in this change, so the preview route remains informational only."
      eyebrow="Client Preview"
      title="Messages"
    >
      <ProjectPlaceholderPanel
        description="Messages will be implemented later. This preview route intentionally exposes no incomplete client actions."
        title="Messages are deferred for this version"
      />
    </ProjectSectionSurface>
  );
}
