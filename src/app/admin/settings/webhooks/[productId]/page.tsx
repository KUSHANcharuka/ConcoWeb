import { WebhookDetailPageClient } from "~/components/admin/settings/webhook-detail-page-client";
import { SettingsSectionSurface } from "~/components/admin/settings/settings-workspace-shell";

export default async function AdminSettingsWebhookDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  return (
    <SettingsSectionSurface
      eyebrow="Webhook Detail"
      title="Webhook configuration and delivery logs."
      description="Inspect the product-scoped endpoint, reconcile behavior, and the recent delivery history for this integration."
    >
      <WebhookDetailPageClient productId={productId} />
    </SettingsSectionSurface>
  );
}
