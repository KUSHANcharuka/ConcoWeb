import { ProjectOverview } from "~/components/admin/projects/workspace/project-overview";
import { ProjectSectionSurface } from "~/components/admin/projects/workspace/project-workspace-shell";
import { api } from "~/trpc/server";

export default async function ClientProjectOverviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const overview = await api.clientPortal.projectWorkspace.overview({ projectId });

  return (
    <ProjectSectionSurface
      description="Review the current project posture, client-visible timeline work, proposals, and workspace files."
      eyebrow="Project Overview"
      title="Overview"
    >
      <ProjectOverview data={overview} mode="client" projectId={projectId} />
    </ProjectSectionSurface>
  );
}
