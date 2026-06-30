"use client";

import { useState } from "react";
import { LoaderCircleIcon, PlusIcon } from "lucide-react";

import { ClientCardGrid } from "~/components/admin/clients/client-card-grid";
import { ClientFilters } from "~/components/admin/clients/client-filters";
import { CreateClientDialog } from "~/components/admin/clients/create-client-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { api } from "~/trpc/react";

export function AdminClientsPageClient() {
  const [createOpen, setCreateOpen] = useState(false);
  const [filters, setFilters] = useState<{
    search: string;
    status: "all" | "lead" | "active" | "suspended" | "archived";
  }>({
    search: "",
    status: "all",
  });

  const clientsQuery = api.admin.clients.list.useQuery({
    search: filters.search,
    statuses: filters.status === "all" ? [] : [filters.status],
  });

  const hasFilters = filters.search.trim().length > 0 || filters.status !== "all";

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
              Clients
            </p>
            <h1 className="mt-2 font-serif text-4xl leading-tight text-zinc-950">
              Every client company.
            </h1>
            <p className="mt-3 text-base leading-7 text-zinc-600">
              Manage company records, linked members, and the projects each client will see inside their portal.
            </p>
          </div>
          <Button className="h-11 px-5 text-sm" onClick={() => setCreateOpen(true)} type="button">
            <PlusIcon className="size-4" />
            New Client
          </Button>
        </div>

        <ClientFilters filters={filters} onFiltersChange={setFilters} />

        {clientsQuery.isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="overflow-hidden border border-zinc-200 bg-white" key={index}>
                <Skeleton className="h-44 rounded-none" />
                <div className="space-y-3 p-5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : clientsQuery.isError ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 border border-zinc-200 bg-white px-6 text-center">
            <LoaderCircleIcon className="size-5 text-zinc-500" />
            <div className="space-y-1">
              <div className="text-lg font-semibold text-zinc-900">Failed to load clients.</div>
              <div className="text-sm text-zinc-600">{clientsQuery.error.message}</div>
            </div>
            <Button onClick={() => clientsQuery.refetch()} type="button" variant="outline">
              Retry
            </Button>
          </div>
        ) : (clientsQuery.data?.length ?? 0) === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 border border-dashed border-zinc-300 bg-white px-6 text-center">
            <div className="space-y-1">
              <div className="text-lg font-semibold text-zinc-900">
                {hasFilters ? "No clients match these filters." : "No clients yet."}
              </div>
              <div className="text-sm text-zinc-600">
                {hasFilters
                  ? "Adjust the search or status filter and try again."
                  : "Create the first company and optionally send the first invite in the same flow."}
              </div>
            </div>
            <Button onClick={() => setCreateOpen(true)} type="button">
              <PlusIcon className="size-4" />
              New Client
            </Button>
          </div>
        ) : (
          <ClientCardGrid clients={clientsQuery.data ?? []} />
        )}
      </div>

      <CreateClientDialog onOpenChange={setCreateOpen} open={createOpen} />
    </>
  );
}
