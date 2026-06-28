"use client";

import type { ReactNode } from "react";
import { Boxes, CreditCard, LayoutDashboard } from "lucide-react";

import { AdminSidebar, type SidebarItem } from "~/components/admin/admin-sidebar";
import { api } from "~/trpc/react";

const buildItems = (projectId: string): SidebarItem[] => [
  {
    label: "Overview",
    href: `/admin/projects/${projectId}/overview`,
    icon: LayoutDashboard,
  },
  {
    label: "Billing",
    href: `/admin/projects/${projectId}/billing`,
    icon: CreditCard,
  },
  {
    label: "Product Account",
    href: `/admin/projects/${projectId}/product-account`,
    icon: Boxes,
  },
];

export function ProjectWorkspaceShell({
  projectId,
  children,
}: {
  projectId: string;
  children: ReactNode;
}) {
  const projectQuery = api.admin.projects.byId.useQuery({ projectId });

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <AdminSidebar items={buildItems(projectId)} title="Project Workspace" />
      <div className="flex-1">
        <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-card)] px-6 py-5 lg:px-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--color-ink-subtle)]">
                {projectQuery.data?.client.name ?? "Project"}
              </p>
              <div>
                <h1 className="font-serif text-3xl text-[var(--color-ink)]">
                  {projectQuery.data?.name ?? "Loading project..."}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--color-ink-muted)]">
                  {projectQuery.data?.description ??
                    "Project-scoped workspace for billing operations and linked product account context."}
                </p>
              </div>
            </div>

            <div className="inline-flex w-fit items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-app)] p-1">
              <span className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white">
                Admin View
              </span>
              <span className="px-4 py-2 text-sm text-[var(--color-ink-subtle)]">
                Client View
              </span>
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
