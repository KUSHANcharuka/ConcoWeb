import { ClientProjectChangeRequestPageClient } from "~/components/client-portal/client-project-change-request-page-client";
import { ProjectSectionSurface } from "~/components/admin/projects/workspace/project-workspace-shell";

export default async function ClientProjectRequestChangePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <ProjectSectionSurface
      description="Request new scoped feature work for this project and track the current review history."
      eyebrow="Feature Requests"
      title="New Feature Request"
    >
      <ClientProjectChangeRequestPageClient projectId={projectId} />
    </ProjectSectionSurface>
  );
}
