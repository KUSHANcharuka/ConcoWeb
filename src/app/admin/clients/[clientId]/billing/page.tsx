import { ClientBillingSummaryPanel } from "~/components/admin/clients/client-billing-summary-panel";
import { ClientSectionSurface } from "~/components/admin/clients/client-workspace-shell";

export default async function AdminClientBillingPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;

  return (
    <ClientSectionSurface
      description="Client-level billing is summary-only here. Payment operations remain inside the linked project billing workspaces."
      eyebrow="Client Billing"
      title="Billing"
    >
      <ClientBillingSummaryPanel clientId={clientId} />
    </ClientSectionSurface>
  );
}
