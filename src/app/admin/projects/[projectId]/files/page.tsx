import { ProjectFileManager } from "~/components/admin/projects/workspace/project-file-manager";
import { ProjectSectionSurface } from "~/components/admin/projects/workspace/project-workspace-shell";

export default async function AdminProjectFilesPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <ProjectSectionSurface
      description="Files are scoped by client and project, backed by R2, and ready for nested folders plus read and upload URL flows."
      eyebrow="Project Files"
      title="Files"
    >
      <ProjectFileManager mode="admin" projectId={projectId} />
    </ProjectSectionSurface>
  );
}
