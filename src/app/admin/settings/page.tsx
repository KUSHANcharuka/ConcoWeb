import { SettingsProfilePageClient } from "~/components/admin/settings/settings-profile-page-client";
import { SettingsSectionSurface } from "~/components/admin/settings/settings-workspace-shell";

export default function AdminSettingsPage() {
  return (
    <SettingsSectionSurface
      eyebrow="Concolabs Profile"
      title="Workspace profile and members."
      description="Manage the internal Concolabs identity that backs the admin workspace and shared operations."
    >
      <SettingsProfilePageClient />
    </SettingsSectionSurface>
  );
}
