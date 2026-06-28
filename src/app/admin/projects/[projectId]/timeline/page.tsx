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
      description="The timeline canvas will use React Flow for draggable milestones, checkpoint cards, and client-safe preview rendering."
      eyebrow="Project Timeline"
      title="Timeline"
    >
      <ProjectTimelineCanvas mode="admin" projectId={projectId} />
    </ProjectSectionSurface>
  );
}
