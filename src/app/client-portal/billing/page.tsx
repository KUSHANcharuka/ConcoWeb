import { ClientPortalPlaceholder, ClientPortalSection } from "~/components/client-portal/client-portal-shell";

export default function ClientPortalBillingPage() {
  return (
    <ClientPortalSection
      description="This route will hold invoices, payment history, and payment instructions for the active client organization."
      eyebrow="Client Portal"
      title="Billing"
    >
      <ClientPortalPlaceholder
        description="The billing engine is planned separately. This shell already enforces the correct client-org authentication boundary."
        title="Billing shell"
      />
    </ClientPortalSection>
  );
}
