"use client";

import { LoaderCircleIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { api } from "~/trpc/react";

export function ProductAccountPageClient({ projectId }: { projectId: string }) {
  const accountQuery = api.admin.productAccounts.byProject.useQuery({ projectId });

  if (accountQuery.isLoading) {
    return (
      <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-zinc-200 bg-white">
        <LoaderCircleIcon className="size-5 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (accountQuery.isError || !accountQuery.data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        Failed to load product account context.
      </div>
    );
  }

  const { account, project } = accountQuery.data;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
              Product Account
            </p>
            <h2 className="mt-2 font-serif text-3xl text-zinc-950">
              {project.productName ?? "No linked product yet"}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
              This shell reserves the project-scoped account surface for downstream
              product activation, account health, and tenant stats.
            </p>
          </div>
          <Badge>{account?.status?.replaceAll("_", " ") ?? "not linked"}</Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-medium text-zinc-900">Current Scope</div>
          <dl className="mt-4 grid gap-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-zinc-500">Client</dt>
              <dd className="font-medium text-zinc-950">{project.clientName}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-zinc-500">Project</dt>
              <dd className="font-medium text-zinc-950">{project.name}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-zinc-500">External Account</dt>
              <dd className="font-medium text-zinc-950">
                {account?.externalAccountId ?? "Not configured"}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-zinc-500">External Workspace</dt>
              <dd className="font-medium text-zinc-950">
                {account?.externalWorkspaceId ?? "Not configured"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-medium text-zinc-900">Deferred Stats Surface</div>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Full product-account management is intentionally deferred. This release keeps
            the route, shared project navigation, and context plumbing stable so we can
            add real metrics and actions without changing the information architecture.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-zinc-950 p-4 text-xs text-zinc-100">
            {JSON.stringify(account?.statsSummary ?? {}, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
