import { ProjectSectionSurface } from "~/components/admin/projects/workspace/project-workspace-shell";
import { ProjectTimelineCanvas } from "~/components/admin/projects/workspace/project-timeline-canvas";

export default async function ClientProjectTimelinePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <ProjectSectionSurface
      description="Client-visible timeline events, delivery milestones, and upcoming checkpoints."
      eyebrow="Project Timeline"
      title="Timeline"
    >
      <ProjectTimelineCanvas mode="client" projectId={projectId} />
    </ProjectSectionSurface>
  );
}
