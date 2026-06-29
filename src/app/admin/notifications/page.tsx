import { NotificationArchivePageClient } from "~/components/notifications/notification-archive-page-client";

export default function AdminNotificationsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-10">
      <NotificationArchivePageClient archiveHref="/admin/notifications" portal="admin" />
    </div>
  );
}
