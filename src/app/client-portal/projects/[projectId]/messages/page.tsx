import { ProjectPlaceholderPanel, ProjectSectionSurface } from "~/components/admin/projects/workspace/project-workspace-shell";

export default function ClientProjectMessagesPage() {
  return (
    <ProjectSectionSurface
      description="Direct project messaging is deferred, but the route stays visible in the workspace for parity."
      eyebrow="Project Messages"
      title="Messages"
    >
      <ProjectPlaceholderPanel
        description="Project messaging will be implemented later. This version keeps the navigation stable without exposing partial communication tools."
        title="Messages are deferred for this version"
      />
    </ProjectSectionSurface>
  );
}
