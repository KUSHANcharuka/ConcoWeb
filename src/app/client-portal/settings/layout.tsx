import type { ReactNode } from "react";

import { ClientSettingsWorkspaceShell } from "~/components/client-portal/client-settings-workspace-shell";
import { requireClientPortalAccess } from "~/lib/client-portal-auth";

export default async function ClientPortalSettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { client } = await requireClientPortalAccess();
  return (
    <ClientSettingsWorkspaceShell clientLogoUrl={client.logoUrl} clientName={client.name}>
      {children}
    </ClientSettingsWorkspaceShell>
  );
}
