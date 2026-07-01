"use client";

import { ClientWorkspaceEmpty } from "~/components/admin/clients/client-workspace-shell";
import { api } from "~/trpc/react";

export function ClientBillingSummaryPanel({ clientId }: { clientId: string }) {
  const billingQuery = api.admin.clients.billing.summary.useQuery({ clientId });

  if (billingQuery.isLoading) {
    return <div className="border border-zinc-200 bg-white p-6 text-sm text-zinc-500">Loading billing summary…</div>;
  }

  if (billingQuery.isError || !billingQuery.data) {
    return (
      <ClientWorkspaceEmpty
        description={billingQuery.error?.message ?? "Billing data could not be loaded."}
        title="Billing unavailable"
      />
    );
  }

  const summary = billingQuery.data;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="border border-zinc-200 bg-white p-5">
          <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Revenue generated</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-950">
            {summary.totalRevenueLabel ?? "—"}
          </div>
        </div>
        <div className="border border-zinc-200 bg-white p-5">
          <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Remaining due</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-950">
            {summary.remainingDueLabel ?? "—"}
          </div>
        </div>
        <div className="border border-zinc-200 bg-white p-5">
          <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Completed payments</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-950">{summary.completedCount}</div>
        </div>
        <div className="border border-zinc-200 bg-white p-5">
          <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Overdue items</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-950">{summary.overdueCount}</div>
        </div>
      </div>

      <div className="border border-zinc-200 bg-white p-5">
        <div className="text-sm font-semibold text-zinc-900">Billing status</div>
        <div className="mt-2 max-w-3xl text-sm leading-7 text-zinc-600">
          {summary.deferred
            ? "Project-level billing operations are intentionally handled inside the project workspace. This client page exposes the summary shell now and will attach to the dedicated billing tables once that change lands."
            : "Billing metrics are available for this client."}
        </div>
        <div className="mt-4 text-sm text-zinc-700">
          Booked proposal value: <span className="font-semibold">{summary.bookedValueLabel ?? "—"}</span>
        </div>
      </div>
    </div>
  );
}
