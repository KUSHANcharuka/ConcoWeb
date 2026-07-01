import { AdminNotificationSettingsPageClient } from "~/components/admin/settings/admin-notification-settings-page-client";
import { SettingsSectionSurface } from "~/components/admin/settings/settings-workspace-shell";

export default function AdminSettingsCronNotificationsPage() {
  return (
    <SettingsSectionSurface
      eyebrow="Cron Notifications"
      title="Reminder policy and cron message copy."
      description="Configure the Sri Lanka timezone reminder policy, supported reminder windows, and the in-app and email draft copy used by the Railway cron reminder run."
    >
      <AdminNotificationSettingsPageClient />
    </SettingsSectionSurface>
  );
}
