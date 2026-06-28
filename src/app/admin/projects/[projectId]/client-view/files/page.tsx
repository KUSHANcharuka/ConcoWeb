import { ProjectFileManager } from "~/components/admin/projects/workspace/project-file-manager";
import { ProjectSectionSurface } from "~/components/admin/projects/workspace/project-workspace-shell";

export default async function AdminProjectClientFilesPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <ProjectSectionSurface
      description="This preview route will render the client-visible project file tree in read-only mode."
      eyebrow="Client Preview"
      title="Files"
    >
      <ProjectFileManager mode="client-preview" projectId={projectId} />
    </ProjectSectionSurface>
  );
}
