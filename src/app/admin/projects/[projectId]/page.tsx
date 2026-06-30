import { redirect } from "next/navigation";

export default async function AdminProjectRootPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  redirect(`/admin/projects/${projectId}/overview`);
}
