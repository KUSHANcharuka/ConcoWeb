import "server-only";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "~/server/db";
import { clients } from "~/server/db/schema";

export async function requireClientPortalAccess() {
  const session = await auth();

  if (!session.userId) {
    redirect("/sign-in");
  }

  if (!session.orgId) {
    redirect("/client-portal/no-access");
  }

  const [client] = await db
    .select({
      id: clients.id,
      name: clients.name,
      baseCurrency: clients.baseCurrency,
      status: clients.status,
      primaryContactEmail: clients.primaryContactEmail,
      primaryContactPhone: clients.primaryContactPhone,
    })
    .from(clients)
    .where(eq(clients.clerkOrgId, session.orgId))
    .limit(1);

  if (!client) {
    redirect("/client-portal/no-access");
  }

  return {
    userId: session.userId,
    orgId: session.orgId,
    client,
  };
}
