import { PaymentMethodsPageClient } from "~/components/admin/settings/payment-methods-page-client";
import { SettingsSectionSurface } from "~/components/admin/settings/settings-workspace-shell";

export default function AdminSettingsPaymentMethodsPage() {
  return (
    <SettingsSectionSurface
      eyebrow="Payment Methods"
      title="Reusable payment method cards."
      description="Create the Stripe, wire, and manual payment options that invoice requests can expose as alternatives inside each project."
    >
      <PaymentMethodsPageClient />
    </SettingsSectionSurface>
  );
}
