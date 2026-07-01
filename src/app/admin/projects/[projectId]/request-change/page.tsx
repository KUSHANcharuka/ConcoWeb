import { AdminRequestsPageClient } from "~/components/admin/requests/admin-requests-page-client";
import { ProjectSectionSurface } from "~/components/admin/projects/workspace/project-workspace-shell";

export default async function AdminProjectRequestChangePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <ProjectSectionSurface
      description="Review project-scoped feature requests, inspect attachments, and approve or reject follow-up scope from inside the workspace."
      eyebrow="Feature Requests"
      title="New Feature Request"
    >
      <AdminRequestsPageClient
        hideHeader
        hideKindSwitcher
        initialKind="change"
        lockedKind="change"
        projectId={projectId}
      />
    </ProjectSectionSurface>
  );
}
