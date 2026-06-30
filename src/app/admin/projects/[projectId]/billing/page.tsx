import { redirect } from "next/navigation";

export default async function AdminProjectBillingPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  redirect(`/admin/projects/${projectId}/payments`);
}
