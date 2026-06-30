import { WebhooksPageClient } from "~/components/admin/settings/webhooks-page-client";
import { SettingsSectionSurface } from "~/components/admin/settings/settings-workspace-shell";

export default function AdminSettingsWebhooksPage() {
  return (
    <SettingsSectionSurface
      eyebrow="Webhooks"
      title="Product webhook dashboards."
      description="Manage the product-scoped billing and entitlement integrations that downstream tools rely on for account activation and lifecycle sync."
    >
      <WebhooksPageClient />
    </SettingsSectionSurface>
  );
}
