"use client";

import { useState } from "react";
import { LoaderCircleIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ClientProjectRequestDialog } from "~/components/client-portal/client-project-request-dialog";
import { ProjectCardGrid } from "~/components/projects/project-card-grid";
import { ProjectEmptyState } from "~/components/projects/project-empty-state";
import { ProjectFilters } from "~/components/projects/project-filters";
import { api } from "~/trpc/react";

export function ClientProjectsPageClient() {
  const [requestOpen, setRequestOpen] = useState(false);
  const [filters, setFilters] = useState<{
    search: string;
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
    status: "all",
    projectType: "all",
  });

  const projectsQuery = api.clientPortal.projects.list.useQuery({
    search: filters.search,
    statuses: filters.status === "all" ? [] : [filters.status],
    projectTypes: filters.projectType === "all" ? [] : [filters.projectType],
  });

  const hasFilters =
    filters.search.trim().length > 0 ||
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
              Your project workspaces.
            </h1>
            <p className="mt-3 text-base leading-7 text-zinc-600">
              Review the active project workspaces visible to your organization and submit new requests when new work needs to be scoped.
            </p>
          </div>
          <Button className="h-11 px-5 text-sm" onClick={() => setRequestOpen(true)} type="button">
            <PlusIcon className="size-4" />
            Request project
          </Button>
        </div>

        <ProjectFilters
          clientOptions={[]}
          filters={{
            search: filters.search,
            clientId: "",
            status: filters.status,
            projectType: filters.projectType,
          }}
          onFiltersChange={(next) =>
            setFilters({
              search: next.search,
              status: next.status,
              projectType: next.projectType,
            })
          }
        />

        {projectsQuery.isLoading ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-lg border border-zinc-200 bg-white px-6 text-center">
            <LoaderCircleIcon className="size-5 text-zinc-500" />
            <div className="space-y-1">
              <div className="text-lg font-semibold text-zinc-900">Loading projects…</div>
            </div>
          </div>
        ) : projectsQuery.isError ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-lg border border-zinc-200 bg-white px-6 text-center">
            <LoaderCircleIcon className="size-5 text-zinc-500" />
            <div className="space-y-1">
              <div className="text-lg font-semibold text-zinc-900">
                Failed to load projects.
              </div>
              <div className="text-sm text-zinc-600">{projectsQuery.error.message}</div>
            </div>
            <Button onClick={() => projectsQuery.refetch()} type="button" variant="outline">
              Retry
            </Button>
          </div>
        ) : (projectsQuery.data?.projects.length ?? 0) === 0 ? (
          <ProjectEmptyState hasFilters={hasFilters} onCreate={() => setRequestOpen(true)} />
        ) : (
          <ProjectCardGrid
            hrefBuilder={(project) => `/client-portal/projects/${project.id}/overview`}
            projects={(projectsQuery.data?.projects ?? []).map((project) => ({
              ...project,
              targetLaunchDate: project.targetLaunchDate
                ? new Date(project.targetLaunchDate).toLocaleDateString()
                : null,
            }))}
          />
        )}
      </div>

      <ClientProjectRequestDialog onOpenChange={setRequestOpen} open={requestOpen} />
    </>
  );
}
