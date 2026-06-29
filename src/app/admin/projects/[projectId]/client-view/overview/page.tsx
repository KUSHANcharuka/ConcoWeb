import { ProjectOverview } from "~/components/admin/projects/workspace/project-overview";
import { ProjectSectionSurface } from "~/components/admin/projects/workspace/project-workspace-shell";
import { api } from "~/trpc/server";

export default async function AdminProjectClientOverviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const overview = await api.admin.projectWorkspace.overview({ projectId });

  return (
    <ProjectSectionSurface
      description="This preview mirrors the client-facing summary surface while keeping the admin navigation visible."
      eyebrow="Client Preview"
      title="Overview"
    >
      <ProjectOverview data={overview} mode="client-preview" projectId={projectId} />
    </ProjectSectionSurface>
  );
}
