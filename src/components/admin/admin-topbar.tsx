"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { TopNav } from "~/components/admin/top-nav";

export function AdminTopbar() {
  return (
    <header
      className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-[var(--color-border)] bg-[var(--color-bg-card)] px-5"
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
          className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-app)] px-3 py-1.5 text-[var(--color-ink-subtle)] transition-colors hover:border-[var(--color-primary-soft)] hover:text-[var(--color-ink-muted)]"
        >
          <Search size={13} strokeWidth={1.75} />
          <span className="font-mono text-[var(--text-xs)]">Search</span>
          <span className="ml-1 font-mono text-[10px] text-[var(--color-ink-subtle)]">⌘K</span>
        </button>

        {/* + New */}
        <button
          type="button"
          onClick={() => {
            /* TODO: open new entity menu */
          }}
          className="flex items-center gap-1 rounded-[var(--radius-pill)] bg-[var(--color-primary)] px-3 py-1.5 text-[var(--text-sm)] font-medium text-white transition-opacity hover:opacity-90"
        >
          <span className="text-base leading-none">+</span>
          <span>New</span>
        </button>

        {/* Notifications */}
        <Link
          href="/admin/notifications"
          className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-ink-muted)] transition-colors hover:bg-[var(--color-bg-sidebar)] hover:text-[var(--color-ink)]"
          aria-label="Notifications"
        >
          <Bell size={16} strokeWidth={1.75} />
        </Link>

        {/* Scope tag */}
        <span className="rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-bg-app)] px-2.5 py-1 font-mono text-[var(--text-xs)] text-[var(--color-ink-muted)]">
          All clients
        </span>

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
