import { BillingHistoryPageClient } from "~/components/admin/billing/billing-history-page-client";
import { ClientPortalSection } from "~/components/client-portal/client-portal-shell";

export default function ClientPortalBillingPage() {
  return (
    <ClientPortalSection
      description="Review your full invoice history in one place, track what is due next, and open any invoice to inspect payment details."
      eyebrow="Client Portal"
      title="Billing"
    >
      <BillingHistoryPageClient mode="client" />
    </ClientPortalSection>
  );
}
