import { redirect } from "next/navigation";

export default async function ClientProjectRootPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  redirect(`/client-portal/projects/${projectId}/overview`);
}
