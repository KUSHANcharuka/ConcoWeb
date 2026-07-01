import { ProjectSectionSurface } from "~/components/admin/projects/workspace/project-workspace-shell";
import { ProjectTimelineCanvas } from "~/components/admin/projects/workspace/project-timeline-canvas";

export default async function AdminProjectClientTimelinePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <ProjectSectionSurface
      description="Preview the same project timeline the client sees, without admin-only editing controls."
      eyebrow="Client Preview"
      title="Timeline"
    >
      <ProjectTimelineCanvas mode="client-preview" projectId={projectId} />
    </ProjectSectionSurface>
  );
}
