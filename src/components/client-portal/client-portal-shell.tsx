"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  CreditCardIcon,
  FolderKanbanIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  SquarePenIcon,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/client-portal", label: "Overview", icon: LayoutDashboardIcon, exact: true },
  { href: "/client-portal/projects", label: "Projects", icon: FolderKanbanIcon, exact: false },
  { href: "/client-portal/requests", label: "Requests", icon: SquarePenIcon, exact: false },
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
  };
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f6f4ef] text-zinc-950">
      <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-r border-black/5 bg-[#f1eee7] p-5">
          <div className="border border-black/5 bg-white">
            <div className="border-b border-black/5 px-5 py-5">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Client Portal</div>
              <div className="mt-2 font-serif text-3xl leading-tight text-zinc-950">
                {client.name}
              </div>
              <div className="mt-2 text-sm text-zinc-600">{client.primaryContactEmail}</div>
            </div>
            <div className="grid grid-cols-2 gap-px bg-zinc-200">
              <div className="bg-white px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-400">Status</div>
                <div className="mt-1 text-sm font-medium text-zinc-900">{client.status}</div>
              </div>
              <div className="bg-white px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-400">Currency</div>
                <div className="mt-1 text-sm font-medium text-zinc-900">{client.baseCurrency}</div>
              </div>
            </div>
          </div>

          <nav className="mt-5 space-y-1">
            {navItems.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-white text-zinc-950 shadow-sm"
                      : "text-zinc-600 hover:bg-white/70 hover:text-zinc-950",
                  )}
                  href={item.href}
                  key={item.href}
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0">
          <header className="flex h-16 items-center justify-between border-b border-black/5 bg-white/80 px-6 backdrop-blur">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Portal</div>
              <div className="text-sm text-zinc-700">Authenticated against your active client organization.</div>
            </div>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
          </header>
          <div className="p-6">{children}</div>
        </main>
      </div>
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
