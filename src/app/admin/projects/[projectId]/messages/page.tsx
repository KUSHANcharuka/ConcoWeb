import { ProjectPlaceholderPanel, ProjectSectionSurface } from "~/components/admin/projects/workspace/project-workspace-shell";

export default function AdminProjectMessagesPage() {
  return (
    <ProjectSectionSurface
      description="Communication workflows are intentionally deferred in this change."
      eyebrow="Deferred"
      title="Messages"
    >
      <ProjectPlaceholderPanel
        description="Messages will be added once the project communication model is ready. This version keeps the route visible without exposing unfinished send or reply controls."
        title="Messages are deferred for this version"
      />
    </ProjectSectionSurface>
  );
}
