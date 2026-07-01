"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { NotificationBell } from "~/components/notifications/notification-bell";
import { TopNav } from "~/components/admin/top-nav";

export function AdminTopbar() {
  return (
    <header
      className="sticky top-0 z-50 isolate flex h-16 items-center gap-4 border-b border-[var(--color-border)] bg-white/95 px-5 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur supports-[backdrop-filter]:bg-white/85"
      style={{ height: "64px" }}
    >
      {/* Wordmark */}
      <div className="flex shrink-0 items-center gap-2">
        <span className="font-serif text-[var(--text-lg)] text-[var(--color-ink)] leading-none">
          Concolabs
        </span>
      </div>

      {/* Divider */}
      <div className="h-5 w-px shrink-0 bg-[var(--color-border)]" />

      {/* Top nav */}
      <div className="flex-1 overflow-x-auto">
        <TopNav />
      </div>

      {/* Utility cluster */}
      <div className="flex shrink-0 items-center gap-2">
        {/* Search trigger */}
        <button
          type="button"
          onClick={() => {
            /* TODO: open command palette */
          }}
          className="flex min-w-[220px] items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-app)] px-3 py-1.5 text-[var(--color-ink-subtle)] transition-colors hover:border-[var(--color-primary-soft)] hover:text-[var(--color-ink-muted)]"
        >
          <Search size={13} strokeWidth={1.75} />
          <span className="font-mono text-[var(--text-xs)]">Search</span>
          {/* <span className="ml-1 font-mono text-[14px] text-[var(--color-ink-subtle)]"> ⌘K</span> */}
        </button>

        {/* Notifications */}
        <NotificationBell archiveHref="/admin/notifications" portal="admin" />

        {/* User */}
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-7 w-7",
            },
          }}
        />
      </div>
    </header>
  );
}
