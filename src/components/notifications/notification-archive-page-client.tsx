"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCheckIcon, ExternalLinkIcon, LoaderCircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "~/trpc/react";

type NotificationArchivePageClientProps = {
  archiveHref: string;
  portal: "admin" | "client";
};

type ReadFilter = "all" | "read" | "unread";

function formatTimestamp(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function NotificationArchivePageClient({
  archiveHref,
  portal,
}: NotificationArchivePageClientProps) {
  const router = useRouter();
  const utils = api.useUtils();
  const [readFilter, setReadFilter] = useState<ReadFilter>("all");
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all");

  const adminArchiveQuery = api.admin.notifications.archive.useQuery(
    { limit: 200, onlyUnread: false },
    { enabled: portal === "admin", refetchInterval: 60_000 },
  );
  const clientArchiveQuery = api.clientPortal.notifications.archive.useQuery(
    { limit: 200, onlyUnread: false },
    { enabled: portal === "client", refetchInterval: 60_000 },
  );
  const adminMarkRead = api.admin.notifications.markRead.useMutation();
  const clientMarkRead = api.clientPortal.notifications.markRead.useMutation();
  const adminMarkAllRead = api.admin.notifications.markAllRead.useMutation();
  const clientMarkAllRead = api.clientPortal.notifications.markAllRead.useMutation();

  const notifications =
    portal === "admin" ? (adminArchiveQuery.data ?? []) : (clientArchiveQuery.data ?? []);
  const isLoading =
    portal === "admin" ? adminArchiveQuery.isLoading : clientArchiveQuery.isLoading;
  const isError = portal === "admin" ? adminArchiveQuery.isError : clientArchiveQuery.isError;

  const eventTypes = useMemo(
    () => Array.from(new Set(notifications.map((notification) => notification.eventType))),
    [notifications],
  );

  const filteredNotifications = useMemo(
    () =>
      notifications.filter((notification) => {
        if (readFilter === "read" && !notification.readAt) return false;
        if (readFilter === "unread" && notification.readAt) return false;
        if (eventTypeFilter !== "all" && notification.eventType !== eventTypeFilter) return false;
        return true;
      }),
    [eventTypeFilter, notifications, readFilter],
  );

  const unreadCount = notifications.filter((notification) => !notification.readAt).length;

  async function invalidate() {
    if (portal === "admin") {
      await Promise.all([
        utils.admin.notifications.archive.invalidate(),
        utils.admin.notifications.list.invalidate(),
        utils.admin.notifications.unreadCount.invalidate(),
      ]);
      return;
    }

    await Promise.all([
      utils.clientPortal.notifications.archive.invalidate(),
      utils.clientPortal.notifications.list.invalidate(),
      utils.clientPortal.notifications.unreadCount.invalidate(),
    ]);
  }

  async function handleMarkRead(notificationId: string, href: string | null) {
    if (portal === "admin") {
      await adminMarkRead.mutateAsync({ notificationId });
    } else {
      await clientMarkRead.mutateAsync({ notificationId });
    }

    await invalidate();
    if (href) {
      router.push(href);
    }
  }

  async function handleMarkAllRead() {
    if (portal === "admin") {
      await adminMarkAllRead.mutateAsync();
    } else {
      await clientMarkAllRead.mutateAsync();
    }
    await invalidate();
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-zinc-200 bg-white">
        <LoaderCircleIcon className="size-5 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        Failed to load notifications.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Notifications</p>
            <h1 className="mt-2 font-serif text-4xl leading-tight text-zinc-950">
              Notification archive.
            </h1>
            <p className="mt-3 text-sm leading-7 text-zinc-600">
              Review the persisted inbox for this portal, filter by read state or notification
              type, and open the original workflow from each item.
            </p>
          </div>

          <Button
            className="rounded-lg"
            disabled={unreadCount === 0}
            onClick={() => void handleMarkAllRead()}
            type="button"
            variant="outline"
          >
            <CheckCheckIcon className="size-4" />
            Mark all read
          </Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[auto_auto_minmax(0,240px)]">
          <div className="flex flex-wrap gap-2">
            {(["all", "unread", "read"] as const).map((filter) => (
              <button
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  readFilter === filter
                    ? "border-zinc-950 bg-zinc-950 text-white"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-950",
                )}
                key={filter}
                onClick={() => setReadFilter(filter)}
                type="button"
              >
                {filter === "all"
                  ? "All"
                  : filter === "unread"
                    ? `Unread (${unreadCount})`
                    : "Read"}
              </button>
            ))}
          </div>

          <div className="text-sm text-zinc-500">
            Showing {filteredNotifications.length} of {notifications.length} notifications
          </div>

          <Select onValueChange={setEventTypeFilter} value={eventTypeFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All notification types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All notification types</SelectItem>
              {eventTypes.map((eventType) => (
                <SelectItem key={eventType} value={eventType}>
                  {eventType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        {filteredNotifications.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-zinc-500">
            No notifications matched the selected filters.
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <button
              className={cn(
                "flex w-full items-start justify-between gap-4 border-b border-zinc-200 px-6 py-5 text-left transition-colors last:border-b-0 hover:bg-zinc-50",
                !notification.readAt ? "bg-amber-50/50" : "bg-white",
              )}
              key={notification.id}
              onClick={() => void handleMarkRead(notification.id, notification.href)}
              type="button"
            >
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                    {notification.eventType}
                  </span>
                  {!notification.readAt ? (
                    <span className="rounded-full bg-zinc-950 px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-white">
                      New
                    </span>
                  ) : null}
                </div>

                <div className="text-lg font-semibold text-zinc-950">{notification.title}</div>
                <p className="max-w-3xl text-sm leading-7 text-zinc-600">{notification.body}</p>
              </div>

              <div className="flex shrink-0 items-center gap-2 text-xs text-zinc-500">
                <span>{formatTimestamp(notification.createdAt)}</span>
                {notification.href ? <ExternalLinkIcon className="size-3.5" /> : null}
              </div>
            </button>
          ))
        )}
      </div>

      <div className="text-sm text-zinc-500">
        Current archive route: <span className="font-mono">{archiveHref}</span>
      </div>
    </div>
  );
}
