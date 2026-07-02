import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { ClientPortalAccessPageClient } from "~/components/client-portal/client-portal-access-page-client";
import { findClientByClerkOrgId } from "~/server/clients/sync";
import { db } from "~/server/db";

export default async function PortalAccessPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const requestedMode = resolvedSearchParams.mode;
  const initialMode = requestedMode === "guest" ? "guest" : "signin";

  let hasPortalAccess = false;
  if (session.userId && session.orgId) {
    const client = await findClientByClerkOrgId(db, session.orgId);
    if (client) {
      hasPortalAccess = true;
    }
  }

  if (hasPortalAccess) {
    redirect("/client-portal");
  }

  return (
    <ClientPortalAccessPageClient
      initialMode={initialMode}
      isSignedIn={Boolean(session.userId)}
      signedInWithoutPortalAccess={Boolean(session.userId && !hasPortalAccess)}
    />
  );
}
