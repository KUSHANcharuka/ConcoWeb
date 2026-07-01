import { PaymentTemplatesPageClient } from "~/components/admin/settings/payment-templates-page-client";
import { SettingsSectionSurface } from "~/components/admin/settings/settings-workspace-shell";

export default function AdminSettingsPaymentTemplatesPage() {
  return (
    <SettingsSectionSurface
      eyebrow="Payment Templates"
      title="Reusable billing PDF templates."
      description="Keep reusable billing document templates in one place and attach PDFs that invoice documents can inherit."
    >
      <PaymentTemplatesPageClient />
    </SettingsSectionSurface>
  );
}
