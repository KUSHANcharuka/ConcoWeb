import { ProjectOverview } from "~/components/admin/projects/workspace/project-overview";
import { ProjectSectionSurface } from "~/components/admin/projects/workspace/project-workspace-shell";
import { api } from "~/trpc/server";

export default async function AdminProjectOverviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const overview = await api.admin.projectWorkspace.overview({ projectId });

  return (
    <ProjectSectionSurface
      description="Track the current delivery posture, upcoming timeline work, proposal state, and the amount of client-facing material already inside the workspace."
      eyebrow="Project Overview"
      title="Overview"
    >
      <ProjectOverview data={overview} mode="admin" />
    </ProjectSectionSurface>
  );
}
