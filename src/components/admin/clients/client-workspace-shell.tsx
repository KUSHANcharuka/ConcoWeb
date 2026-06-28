"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  Building2Icon,
  ChevronRightIcon,
  CreditCardIcon,
  FolderKanbanIcon,
  LayoutDashboardIcon,
  UsersIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ClientStatusBadge } from "~/components/clients/client-status-badge";
import { cn } from "@/lib/utils";

type ClientWorkspaceShellProps = {
  client: {
    id: string;
    name: string;
    status: "lead" | "active" | "suspended" | "archived";
    primaryContactEmail: string;
    primaryContactPhone: string | null;
    baseCurrency: string;
    projectCount: number;
    activeMemberCount: number;
    pendingInviteCount: number;
    logoUrl: string | null;
  };
  children: ReactNode;
};

const sectionItems = [
  { key: "overview", label: "Overview", icon: LayoutDashboardIcon },
  { key: "members", label: "Members", icon: UsersIcon },
  { key: "projects", label: "Projects", icon: FolderKanbanIcon },
  { key: "billing", label: "Billing", icon: CreditCardIcon },
] as const;

export function ClientWorkspaceShell({ client, children }: ClientWorkspaceShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f6f4ef]">
      <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="border-r border-black/5 bg-[#f1eee7] p-5">
          <div className="overflow-hidden border border-black/5 bg-white">
            <div className="flex min-h-48 items-end justify-between bg-[linear-gradient(135deg,rgba(255,245,157,0.95),rgba(255,255,255,0.95))] p-5">
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Client</div>
                <div className="font-serif text-3xl leading-tight text-zinc-950">{client.name}</div>
              </div>
              {client.logoUrl ? (
                <img alt={`${client.name} logo`} className="h-14 w-14 border border-black/10 object-cover" src={client.logoUrl} />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center border border-black/10 bg-white text-sm font-semibold text-zinc-900">
                  {client.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className="space-y-4 p-5">
              <div className="grid gap-2 text-sm text-zinc-600">
                <div>{client.primaryContactEmail}</div>
                <div>{client.primaryContactPhone ?? "No phone set"}</div>
              </div>
              <div className="flex items-center gap-2">
                <ClientStatusBadge status={client.status} />
                <span className="border border-black/10 px-2.5 py-1 text-xs text-zinc-500">
                  {client.baseCurrency}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 border border-zinc-200 p-3 text-center text-xs">
                <div>
                  <div className="text-zinc-400">Members</div>
                  <div className="mt-1 font-semibold text-zinc-900">{client.activeMemberCount}</div>
                </div>
                <div>
                  <div className="text-zinc-400">Invites</div>
                  <div className="mt-1 font-semibold text-zinc-900">{client.pendingInviteCount}</div>
                </div>
                <div>
                  <div className="text-zinc-400">Projects</div>
                  <div className="mt-1 font-semibold text-zinc-900">{client.projectCount}</div>
                </div>
              </div>
            </div>
          </div>

          <nav className="mt-5 space-y-1">
            {sectionItems.map((item) => {
              const href = `/admin/clients/${client.id}/${item.key}`;
              const active = pathname === href;
              const Icon = item.icon;
              return (
                <Link
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-white text-zinc-950 shadow-sm"
                      : "text-zinc-600 hover:bg-white/70 hover:text-zinc-950",
                  )}
                  href={href}
                  key={item.key}
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
            <Link className="hover:text-zinc-900" href="/admin/clients">
              Clients
            </Link>
            <ChevronRightIcon className="size-4" />
            <span>{client.name}</span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

export function ClientSectionSurface({
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

export function ClientWorkspaceEmpty({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="border border-dashed border-zinc-300 bg-white p-8">
      <div className="max-w-2xl space-y-2">
        <h2 className="text-xl font-semibold text-zinc-950">{title}</h2>
        <p className="text-sm leading-7 text-zinc-600">{description}</p>
      </div>
      {action ? <div className="mt-6 flex gap-3">{action}</div> : null}
    </div>
  );
}
