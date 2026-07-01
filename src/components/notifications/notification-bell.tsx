"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { BellIcon, CheckCheckIcon, ExternalLinkIcon } from "lucide-react";
import Pusher from "pusher-js";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "~/trpc/react";

type NotificationBellProps = {
  archiveHref: string;
  clientId?: string | null;
  portal: "admin" | "client";
};

type RealtimeNotificationPayload = {
  id: string;
  portal: "admin" | "client";
  clientId: string | null;
  eventType: string;
  title: string;
  body: string;
  href: string | null;
  severity: string;
  createdAt: string;
};

function formatTimestamp(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const diffMinutes = Math.round((Date.now() - date.getTime()) / 60_000);
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

function NotificationListItem({
  notification,
  onOpen,
}: {
  notification: {
    id: string;
    title: string;
    body: string;
    href: string | null;
    readAt: Date | null;
    severity: "info" | "success" | "warning" | "error";
    createdAt: Date;
  };
  onOpen: (notificationId: string, href: string | null) => void;
}) {
  return (
    <button
      className={cn(
        "w-full border-b border-zinc-200 px-4 py-4 text-left transition-colors last:border-b-0 hover:bg-zinc-50",
        !notification.readAt ? "bg-amber-50/60" : "bg-white",
      )}
      onClick={() => onOpen(notification.id, notification.href)}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1.5">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-block h-2.5 w-2.5 rounded-full",
                notification.severity === "error"
                  ? "bg-rose-500"
                  : notification.severity === "warning"
                    ? "bg-amber-500"
                    : notification.severity === "success"
                      ? "bg-emerald-500"
                      : "bg-sky-500",
              )}
            />
            <div className="truncate text-sm font-semibold text-zinc-950">
              {notification.title}
            </div>
          </div>
          <p className="text-sm leading-6 text-zinc-600">{notification.body}</p>
        </div>

        {!notification.readAt ? <span className="mt-1 h-2 w-2 rounded-full bg-zinc-900" /> : null}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
        <span>{formatTimestamp(notification.createdAt)}</span>
        {notification.href ? (
          <span className="inline-flex items-center gap-1">
            Open
            <ExternalLinkIcon className="size-3" />
          </span>
        ) : null}
      </div>
    </button>
  );
}

export function NotificationBell({
  archiveHref,
  clientId = null,
  portal,
}: NotificationBellProps) {
  const router = useRouter();
  const { userId } = useAuth();
  const utils = api.useUtils();

  const adminUnreadQuery = api.admin.notifications.unreadCount.useQuery(undefined, {
    enabled: portal === "admin",
    refetchInterval: 20_000,
  });
  const clientUnreadQuery = api.clientPortal.notifications.unreadCount.useQuery(undefined, {
    enabled: portal === "client",
    refetchInterval: 20_000,
  });
  const adminRecentQuery = api.admin.notifications.list.useQuery(
    { limit: 8, onlyUnread: false },
    { enabled: portal === "admin", refetchInterval: 60_000 },
  );
  const clientRecentQuery = api.clientPortal.notifications.list.useQuery(
    { limit: 8, onlyUnread: false },
    { enabled: portal === "client", refetchInterval: 60_000 },
  );

  const adminMarkRead = api.admin.notifications.markRead.useMutation();
  const clientMarkRead = api.clientPortal.notifications.markRead.useMutation();
  const adminMarkAllRead = api.admin.notifications.markAllRead.useMutation();
  const clientMarkAllRead = api.clientPortal.notifications.markAllRead.useMutation();

  const unreadCount =
    portal === "admin"
      ? (adminUnreadQuery.data?.count ?? 0)
      : (clientUnreadQuery.data?.count ?? 0);
  const notifications =
    portal === "admin" ? (adminRecentQuery.data ?? []) : (clientRecentQuery.data ?? []);

  async function invalidateNotificationQueries() {
    if (portal === "admin") {
      await Promise.all([
        utils.admin.notifications.unreadCount.invalidate(),
        utils.admin.notifications.list.invalidate(),
        utils.admin.notifications.archive.invalidate(),
      ]);
      return;
    }

    await Promise.all([
      utils.clientPortal.notifications.unreadCount.invalidate(),
      utils.clientPortal.notifications.list.invalidate(),
      utils.clientPortal.notifications.archive.invalidate(),
    ]);
  }

  async function handleOpenNotification(notificationId: string, href: string | null) {
    try {
      if (portal === "admin") {
        await adminMarkRead.mutateAsync({ notificationId });
      } else {
        await clientMarkRead.mutateAsync({ notificationId });
      }
    } finally {
      await invalidateNotificationQueries();
      if (href) {
        router.push(href);
      }
    }
  }

  async function handleMarkAllRead() {
    if (portal === "admin") {
      await adminMarkAllRead.mutateAsync();
    } else {
      await clientMarkAllRead.mutateAsync();
    }
    await invalidateNotificationQueries();
  }

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
    if (!userId || !key || !cluster) return;

    const pusher = new Pusher(key, {
      cluster,
      forceTLS: true,
      channelAuthorization: {
        endpoint: "/api/pusher/auth",
        transport: "ajax",
      },
    });

    const channel = pusher.subscribe(`private-notifications-user-${userId}`);
    const handleNewNotification = (payload: RealtimeNotificationPayload) => {
      if (payload.portal !== portal) return;
      if (portal === "client" && clientId && payload.clientId !== clientId) return;

      void invalidateNotificationQueries();
      toast(payload.title, {
        description: payload.body,
        action: payload.href
          ? {
              label: "Open",
              onClick: () => router.push(payload.href!),
            }
          : undefined,
      });
    };

    channel.bind("notification.new", handleNewNotification);

    return () => {
      channel.unbind("notification.new", handleNewNotification);
      pusher.unsubscribe(`private-notifications-user-${userId}`);
      pusher.disconnect();
    };
  }, [clientId, portal, router, userId]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="Notifications"
          className="relative flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
          type="button"
        >
          <BellIcon size={16} strokeWidth={1.75} />
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-zinc-950 px-1.5 py-0.5 text-[10px] font-semibold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          ) : null}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-[420px] border-zinc-200 bg-white p-0 shadow-[0_18px_48px_rgba(15,23,42,0.14)]"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-4">
          <div>
            <div className="text-base font-semibold text-zinc-950">Your notifications</div>
            <div className="text-xs text-zinc-500">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
            </div>
          </div>

          <Button
            className="h-8 rounded-lg px-3"
            disabled={unreadCount === 0 || adminMarkAllRead.isPending || clientMarkAllRead.isPending}
            onClick={() => void handleMarkAllRead()}
            type="button"
            variant="outline"
          >
            <CheckCheckIcon className="size-4" />
            Mark all read
          </Button>
        </div>

        <ScrollArea className="max-h-[420px]">
          {notifications.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-zinc-500">
              No notifications yet.
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <NotificationListItem
                  key={notification.id}
                  notification={notification}
                  onOpen={handleOpenNotification}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="border-t border-zinc-200 px-4 py-3">
          <Button asChild className="w-full rounded-lg" variant="outline">
            <Link href={archiveHref}>Open notification archive</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
