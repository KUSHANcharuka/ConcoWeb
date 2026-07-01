import type { ReactNode } from "react";

import { ClientPortalShell } from "~/components/client-portal/client-portal-shell";
import { requireClientPortalAccess } from "~/lib/client-portal-auth";

export default async function ClientPortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { client } = await requireClientPortalAccess();

  return <ClientPortalShell client={client}>{children}</ClientPortalShell>;
}
