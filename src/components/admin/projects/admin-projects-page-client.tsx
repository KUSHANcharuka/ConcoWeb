"use client";

import { useState } from "react";
import { LoaderCircleIcon, PlusIcon } from "lucide-react";

import { CreateProjectDialog } from "~/components/admin/projects/create-project-dialog";
import { ProjectCardGrid } from "~/components/projects/project-card-grid";
import { ProjectEmptyState } from "~/components/projects/project-empty-state";
import { ProjectFilters } from "~/components/projects/project-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { api } from "~/trpc/react";

export function AdminProjectsPageClient() {
  const [createOpen, setCreateOpen] = useState(false);
  const [filters, setFilters] = useState<{
    search: string;
    clientId: string;
    status: "all" | "pending" | "active" | "paused" | "completed" | "archived";
    projectType:
      | "all"
      | "custom_build"
      | "saas_setup"
      | "website"
      | "mobile_app"
      | "internal_tool"
      | "other";
  }>({
    search: "",
    clientId: "",
    status: "all",
    projectType: "all",
  });

  const clientsQuery = api.admin.clients.options.useQuery();
  const projectsQuery = api.admin.projects.list.useQuery({
    search: filters.search,
    clientIds: filters.clientId ? [filters.clientId] : [],
    statuses: filters.status === "all" ? [] : [filters.status],
    projectTypes: filters.projectType === "all" ? [] : [filters.projectType],
  });

  const hasFilters =
    filters.search.trim().length > 0 ||
    filters.clientId.length > 0 ||
    filters.status !== "all" ||
    filters.projectType !== "all";

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
              Projects
            </p>
            <h1 className="mt-2 font-serif text-4xl leading-tight text-zinc-950">
              Every project, every client.
            </h1>
            <p className="mt-3 text-base leading-7 text-zinc-600">
              Manage the visible project workspaces that clients will see in their portal. This page is built from reusable project components so the admin and client surfaces can share the same view model later.
            </p>
          </div>
          <Button
            className="h-11 rounded-full px-5 text-sm"
            onClick={() => setCreateOpen(true)}
            type="button"
          >
            <PlusIcon className="size-4" />
            New Project
          </Button>
        </div>

        <ProjectFilters
          clientOptions={clientsQuery.data ?? []}
          filters={filters}
          onFiltersChange={setFilters}
        />

        {projectsQuery.isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                className="overflow-hidden rounded-lg border border-zinc-200 bg-white"
                key={index}
              >
                <Skeleton className="aspect-[4/3] rounded-none" />
                <div className="space-y-3 p-5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : projectsQuery.isError ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-lg border border-zinc-200 bg-white px-6 text-center">
            <LoaderCircleIcon className="size-5 text-zinc-500" />
            <div className="space-y-1">
              <div className="text-lg font-semibold text-zinc-900">
                Failed to load projects.
              </div>
              <div className="text-sm text-zinc-600">
                {projectsQuery.error.message}
              </div>
            </div>
            <Button onClick={() => projectsQuery.refetch()} type="button" variant="outline">
              Retry
            </Button>
          </div>
        ) : (projectsQuery.data?.length ?? 0) === 0 ? (
          <ProjectEmptyState hasFilters={hasFilters} onCreate={() => setCreateOpen(true)} />
        ) : (
          <ProjectCardGrid
            projects={(projectsQuery.data ?? []).map((project) => ({
              ...project,
              targetLaunchDate: project.targetLaunchDate
                ? new Date(project.targetLaunchDate).toLocaleDateString()
                : null,
            }))}
          />
        )}
      </div>

      <CreateProjectDialog onOpenChange={setCreateOpen} open={createOpen} />
    </>
  );
}
