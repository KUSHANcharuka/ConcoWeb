import { PaymentTemplateBuilderPageClient } from "~/components/admin/settings/payment-template-builder-page-client";
import { SettingsSectionSurface } from "~/components/admin/settings/settings-workspace-shell";

export default async function AdminSettingsPaymentTemplateBuilderPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;

  return (
    <SettingsSectionSurface
      eyebrow="Payment Templates"
      title="Payment template PDF workspace."
      description="Upload and preview the reusable PDF source used by billing templates."
    >
      <PaymentTemplateBuilderPageClient templateId={templateId} />
    </SettingsSectionSurface>
  );
}
