"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  BoxesIcon,
  ChevronRightIcon,
  EyeIcon,
  FileTextIcon,
  FolderIcon,
  GitCommitHorizontalIcon,
  LayoutDashboardIcon,
  SearchIcon,
  SparklesIcon,
  WalletIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProjectCover } from "~/components/projects/project-cover";
import { ProjectStatusBadge } from "~/components/projects/project-status-badge";
import { cn } from "@/lib/utils";

type ProjectWorkspaceShellProps = {
  project: {
    id: string;
    name: string;
    description: string;
    status: "pending" | "active" | "paused" | "completed" | "archived";
    currency: string;
    coverUrl: string | null;
    client: {
      name: string;
    };
  };
  mode: "admin" | "client-preview" | "client";
  children: ReactNode;
};

const adminSectionItems = [
  { key: "overview", label: "Overview", icon: LayoutDashboardIcon },
  { key: "timeline", label: "Timeline", icon: GitCommitHorizontalIcon },
  { key: "proposals", label: "Proposals", icon: FileTextIcon },
  { key: "files", label: "Files", icon: FolderIcon },
  { key: "payments", label: "Payments", icon: WalletIcon },
  { key: "product-access", label: "Product Access", icon: BoxesIcon },
  { key: "request-change", label: "New Feature Request", icon: SparklesIcon },
] as const;

const previewSectionItems = adminSectionItems.filter(
  (item) => item.key !== "request-change" && item.key !== "product-access",
);

const clientSectionItems = adminSectionItems.filter(
  (item) => item.key !== "product-access",
);

function buildSectionHref(
  projectId: string,
  section: (typeof adminSectionItems)[number]["key"],
  mode: "admin" | "client-preview" | "client",
) {
  if (mode === "client") {
    return `/client-portal/projects/${projectId}/${section}`;
  }

  if (mode === "client-preview") {
    return `/admin/projects/${projectId}/client-view/${section}`;
  }

  return `/admin/projects/${projectId}/${section}`;
}

function buildModeToggleHref(
  pathname: string,
  projectId: string,
  mode: "admin" | "client-preview",
) {
  const adminBase = `/admin/projects/${projectId}`;
  const clientBase = `${adminBase}/client-view`;

  if (mode === "admin") {
    if (pathname.startsWith(clientBase)) {
      return pathname.replace(clientBase, adminBase);
    }
    return pathname;
  }

  if (pathname.startsWith(clientBase)) {
    return pathname;
  }

  if (pathname.startsWith(adminBase)) {
    return pathname.replace(adminBase, clientBase);
  }

  return `${clientBase}/overview`;
}

export function ProjectWorkspaceShell({
  project,
  mode,
  children,
}: ProjectWorkspaceShellProps) {
  const pathname = usePathname();
  const sectionItems =
    mode === "client"
      ? clientSectionItems
      : mode === "client-preview"
        ? previewSectionItems
        : adminSectionItems;
  const clientRouteBase = `/client-portal/projects/${project.id}`;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f6f4ef]">
      {mode !== "client" ? (
        <div className="border-b border-black/5 bg-white/70 px-6 py-4 backdrop-blur">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="inline-flex rounded-full border border-black/10 bg-white p-1">
              <Link
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  mode === "admin"
                    ? "bg-zinc-950 text-white"
                    : "text-zinc-600 hover:text-zinc-950",
                )}
                href={buildModeToggleHref(pathname, project.id, "admin")}
              >
                Admin View
              </Link>
              <Link
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  mode === "client-preview"
                    ? "bg-zinc-950 text-white"
                    : "text-zinc-600 hover:text-zinc-950",
                )}
                href={buildModeToggleHref(pathname, project.id, "client-preview")}
              >
                Client View
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-sm text-zinc-500">
                <SearchIcon className="size-4" />
                Search this workspace
              </div>
              {mode === "client-preview" && (
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                  <EyeIcon className="size-4" />
                  Preview mode
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid min-h-[calc(100vh-128px)] grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="border-r border-black/5 bg-[#f1eee7] p-5">
          <div className="overflow-hidden rounded-lg border border-black/5 bg-white">
            <div className="aspect-[4/3]">
              <ProjectCover
                clientName={project.client.name}
                coverUrl={project.coverUrl}
                projectName={project.name}
              />
            </div>
            <div className="space-y-4 p-5">
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  {project.client.name}
                </div>
                <div className="font-serif text-3xl leading-tight text-zinc-950">
                  {project.name}
                </div>
                <p className="text-sm leading-6 text-zinc-600">{project.description}</p>
              </div>
              <div className="flex items-center gap-2">
              <ProjectStatusBadge status={project.status} />
              <span className="rounded-full border border-black/10 px-2.5 py-1 text-xs text-zinc-500">
                {project.currency}
              </span>
              </div>
            </div>
          </div>

          <nav className="mt-5 space-y-1">
            {sectionItems.map((item) => {
              const href = buildSectionHref(project.id, item.key, mode);
              const active = pathname === href || pathname.startsWith(`${href}/`);
              const Icon = item.icon;
              return (
                <Link
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
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
          {mode === "client-preview" && (
            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <SparklesIcon className="size-4" />
              This is an admin preview of the client-facing project workspace. Editing controls are disabled here.
            </div>
          )}

          <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
            <Link
              className="hover:text-zinc-900"
              href={mode === "client" ? "/client-portal/projects" : "/admin/projects"}
            >
              Projects
            </Link>
            <ChevronRightIcon className="size-4" />
            {mode === "client" ? (
              <>
                <Link className="hover:text-zinc-900" href={clientRouteBase}>
                  {project.name}
                </Link>
                {pathname !== `${clientRouteBase}/overview` && pathname !== clientRouteBase ? (
                  <>
                    <ChevronRightIcon className="size-4" />
                    <span>
                      {sectionItems.find((item) => pathname === buildSectionHref(project.id, item.key, mode) || pathname.startsWith(`${buildSectionHref(project.id, item.key, mode)}/`))?.label ??
                        project.name}
                    </span>
                  </>
                ) : null}
              </>
            ) : (
              <span>{project.name}</span>
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

export function ProjectSectionSurface({
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

export function ProjectPlaceholderPanel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[28px] border border-black/5 bg-white p-8 shadow-sm">
      <div className="max-w-2xl space-y-2">
        <h2 className="text-xl font-semibold text-zinc-950">{title}</h2>
        <p className="text-sm leading-7 text-zinc-600">{description}</p>
      </div>
      <div className="mt-6 flex gap-3">
        <Button disabled variant="outline">
          Coming in this change
        </Button>
      </div>
    </div>
  );
}
