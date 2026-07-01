import { ProductAccessPageClient } from "~/components/admin/projects/product-access-page-client";
import { ProjectSectionSurface } from "~/components/admin/projects/workspace/project-workspace-shell";

export default async function AdminProjectProductAccessPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <ProjectSectionSurface
      eyebrow="Product Access"
      title="Product Access"
      description="Manage manual access grants, extensions, revocations, and downstream sync status for the product linked to this client project."
    >
      <ProductAccessPageClient projectId={projectId} />
    </ProjectSectionSurface>
  );
}
