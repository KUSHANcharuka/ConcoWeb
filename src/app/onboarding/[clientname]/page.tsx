import { z } from "zod";

import { DashboardLayout } from "@/components/onboarding/dashboard-layout";

const clientDashboardParamSchema = z
  .string()
  .regex(/^[A-Za-z0-9_-]+_dashboard$/)
  .transform((value) => value.replace(/_dashboard$/, ""));

function titleFromSlug(slug: string) {
  return slug
    .split(/[_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default async function ClientDashboardPage({
  params,
}: {
  params: Promise<{ clientname: string }>;
}) {
  const { clientname } = await params;
  const parsed = clientDashboardParamSchema.safeParse(clientname);
  const clientTitle = parsed.success ? titleFromSlug(parsed.data) || "Client Workspace" : "Client Workspace";

  return <DashboardLayout clientTitle={clientTitle} />;
}
