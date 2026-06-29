import { ProjectFileManager } from "~/components/admin/projects/workspace/project-file-manager";
import { ProjectSectionSurface } from "~/components/admin/projects/workspace/project-workspace-shell";

export default async function ClientProjectFilesPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <ProjectSectionSurface
      description="Browse project files that have been marked as client-visible."
      eyebrow="Project Files"
      title="Files"
    >
      <ProjectFileManager mode="client" projectId={projectId} />
    </ProjectSectionSurface>
  );
}
