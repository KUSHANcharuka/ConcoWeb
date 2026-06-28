import { ProjectProposalsPanel } from "~/components/admin/projects/workspace/project-proposals-panel";
import { ProjectSectionSurface } from "~/components/admin/projects/workspace/project-workspace-shell";
import { api } from "~/trpc/server";

export default async function AdminProjectClientProposalsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const context = await api.admin.projectWorkspace.context({ projectId });
  return (
    <ProjectSectionSurface
      description="This preview route will render the client-facing proposal signing surface and side comments."
      eyebrow="Client Preview"
      title="Proposals"
    >
      <ProjectProposalsPanel
        currency={context.currency}
        mode="client-preview"
        projectId={projectId}
      />
    </ProjectSectionSurface>
  );
}
