import { redirect } from "next/navigation";

export default async function AdminClientWorkspacePage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  redirect(`/admin/clients/${clientId}/overview`);
}
