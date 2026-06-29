"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  CreditCardIcon,
  FolderKanbanIcon,
  LayoutDashboardIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { NotificationBell } from "~/components/notifications/notification-bell";

const navItems = [
  { href: "/client-portal", label: "Dashboard", icon: LayoutDashboardIcon, exact: true },
  { href: "/client-portal/projects", label: "Projects", icon: FolderKanbanIcon, exact: false },
  { href: "/client-portal/billing", label: "Billing", icon: CreditCardIcon, exact: false },
  { href: "/client-portal/settings", label: "Settings", icon: SettingsIcon, exact: false },
] as const;

export function ClientPortalShell({
  client,
  children,
}: {
  client: {
    id: string;
    name: string;
    baseCurrency: string;
    status: "lead" | "active" | "suspended" | "archived";
    primaryContactEmail: string;
    primaryContactPhone: string | null;
    coverUrl: string | null;
    logoUrl: string | null;
  };
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isProjectWorkspaceRoute =
    pathname.startsWith("/client-portal/projects/") && pathname !== "/client-portal/projects";
  const isSettingsWorkspaceRoute = pathname.startsWith("/client-portal/settings");
  const useFullWidthShell = isProjectWorkspaceRoute || isSettingsWorkspaceRoute;

  return (
    <div className="min-h-screen bg-[#f6f4ef] text-zinc-950">
      <header
        className="sticky top-0 z-50 isolate border-b border-[var(--color-border)] bg-white/95 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur supports-[backdrop-filter]:bg-white/85"
        style={{ height: "64px" }}
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-5">
          <div className="flex shrink-0 items-center gap-2">
            <Link
              className="font-serif text-[var(--text-lg)] leading-none text-[var(--color-ink)]"
              href="/client-portal"
            >
              Concolabs
            </Link>
          </div>

          <div className="h-5 w-px shrink-0 bg-[var(--color-border)]" />

          <nav className="hidden flex-1 items-center gap-0.5 overflow-x-auto lg:flex">
            {navItems.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  className={cn(
                    "flex items-center gap-1.5 rounded-[var(--radius-sm)] px-3 py-1.5 text-[var(--text-sm)] font-medium transition-colors",
                    active
                      ? "bg-[var(--color-bg-sidebar)] text-[var(--color-ink)]"
                      : "text-[var(--color-ink-muted)] hover:bg-[var(--color-bg-sidebar)] hover:text-[var(--color-ink)]",
                  )}
                  href={item.href}
                  key={item.href}
                >
                  <Icon size={14} strokeWidth={1.75} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <button
              className="hidden min-w-[220px] items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-app)] px-3 py-1.5 text-[var(--color-ink-subtle)] transition-colors hover:border-[var(--color-primary-soft)] hover:text-[var(--color-ink-muted)] md:flex"
              type="button"
            >
              <SearchIcon size={13} strokeWidth={1.75} />
              <span className="font-mono text-[var(--text-xs)]">Search</span>
            </button>
            <NotificationBell
              archiveHref="/client-portal/notifications"
              clientId={client.id}
              portal="client"
            />
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-7 w-7",
                },
              }}
            />
          </div>
        </div>
      </header>

      <main
        className={
          useFullWidthShell
            ? "min-w-0"
            : "mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-10"
        }
      >
        <div className="min-w-0">{children}</div>
      </main>
      <div className="h-10" />
    </div>
  );
}

export function ClientPortalSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">{eyebrow}</p>
        <h1 className="mt-2 font-serif text-4xl leading-tight text-zinc-950">{title}</h1>
        <p className="mt-3 text-sm leading-7 text-zinc-600">{description}</p>
      </div>
      {children}
    </section>
  );
}

export function ClientPortalPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border border-zinc-200 bg-white p-8">
      <div className="max-w-2xl space-y-2">
        <h2 className="text-xl font-semibold text-zinc-950">{title}</h2>
        <p className="text-sm leading-7 text-zinc-600">{description}</p>
      </div>
    </div>
  );
}
