import { ProductAccountPageClient } from "~/components/admin/projects/product-account-page-client";

export default async function AdminProjectProductAccountPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return <ProductAccountPageClient projectId={projectId} />;
}
