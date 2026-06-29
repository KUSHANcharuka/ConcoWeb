import { AdminSettingsPageClient } from "~/components/admin/settings/admin-settings-page-client";
import { SettingsSectionSurface } from "~/components/admin/settings/settings-workspace-shell";

export default function AdminSettingsEmailTemplatesPage() {
  return (
    <SettingsSectionSurface
      eyebrow="Email Templates"
      title="Email defaults and routing."
      description="Template authoring lives in the Emails workspace. This settings route only keeps defaults and scheduled suggestion controls."
    >
      <AdminSettingsPageClient embedded />
    </SettingsSectionSurface>
  );
}
