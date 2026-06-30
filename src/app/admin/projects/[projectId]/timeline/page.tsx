import { ProjectSectionSurface } from "~/components/admin/projects/workspace/project-workspace-shell";
import { ProjectTimelineCanvas } from "~/components/admin/projects/workspace/project-timeline-canvas";

export default async function AdminProjectTimelinePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <ProjectSectionSurface
      description="Shape the client-facing delivery story with dated milestones, review notes, payment reminders, and delivery checkpoints."
      eyebrow="Project Timeline"
      title="Timeline"
    >
      <ProjectTimelineCanvas mode="admin" projectId={projectId} />
    </ProjectSectionSurface>
  );
}
