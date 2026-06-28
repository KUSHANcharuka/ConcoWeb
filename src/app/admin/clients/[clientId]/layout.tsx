import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { ClientWorkspaceShell } from "~/components/admin/clients/client-workspace-shell";
import { api } from "~/trpc/server";

export default async function AdminClientWorkspaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;

  try {
    const client = await api.admin.clients.context({ clientId });
    return <ClientWorkspaceShell client={client}>{children}</ClientWorkspaceShell>;
  } catch (error) {
    if (error instanceof Error && /Client not found/i.test(error.message)) {
      notFound();
    }
    throw error;
  }
}
