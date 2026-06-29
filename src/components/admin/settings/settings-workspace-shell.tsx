"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  BellIcon,
  ChevronRightIcon,
  FileTextIcon,
  MailIcon,
  Settings2Icon,
  UserCogIcon,
  WalletCardsIcon,
  WebhookIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

const sectionItems = [
  { href: "/admin/settings", label: "Profile", icon: UserCogIcon, exact: true },
  {
    href: "/admin/settings/payment-templates",
    label: "Payment Templates",
    icon: FileTextIcon,
    exact: false,
  },
  {
    href: "/admin/settings/payment-methods",
    label: "Payment Methods",
    icon: WalletCardsIcon,
    exact: false,
  },
  {
    href: "/admin/settings/cron-notifications",
    label: "Cron Notifications",
    icon: BellIcon,
    exact: false,
  },
  {
    href: "/admin/settings/webhooks",
    label: "Webhooks",
    icon: WebhookIcon,
    exact: false,
  },
  {
    href: "/admin/settings/email-templates",
    label: "Email Templates",
    icon: MailIcon,
    exact: false,
  },
] as const;

export function SettingsWorkspaceShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f6f4ef]">
      <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="border-r border-black/5 bg-[#f1eee7] p-5">
          <div className="overflow-hidden rounded-lg border border-black/5 bg-white">
            <div className="flex min-h-48 items-end justify-between bg-[linear-gradient(135deg,rgba(255,245,157,0.95),rgba(255,255,255,0.95))] p-5">
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Admin Settings
                </div>
                <div className="font-serif text-3xl leading-tight text-zinc-950">
                  Concolabs
                </div>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-black/10 bg-white text-zinc-900">
                <Settings2Icon className="size-6" />
              </div>
            </div>
            <div className="space-y-3 p-5 text-sm text-zinc-600">
              <p>
                Shared workspace configuration for billing operations, outbound documents,
                staff access, and product integrations.
              </p>
            </div>
          </div>

          <nav className="mt-5 space-y-1">
            {sectionItems.map((item) => {
              const Icon = item.icon;
              const active = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-white text-zinc-950 shadow-sm"
                      : "text-zinc-600 hover:bg-white/70 hover:text-zinc-950",
                  )}
                  href={item.href}
                  key={item.href}
                >
                  <Icon className="size-4" />
                  <span className="flex-1">{item.label}</span>
                  <ChevronRightIcon className="size-4 text-zinc-400" />
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0 p-6">
          <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
            <Link className="hover:text-zinc-900" href="/admin/settings">
              Settings
            </Link>
            <ChevronRightIcon className="size-4" />
            <span>
              {sectionItems.find((item) =>
                item.exact
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`),
              )?.label ?? "Settings"}
            </span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

export function SettingsSectionSurface({
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">{eyebrow}</p>
          <h1 className="mt-2 font-serif text-4xl leading-tight text-zinc-950">{title}</h1>
          <p className="mt-3 text-sm leading-7 text-zinc-600">{description}</p>
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}
