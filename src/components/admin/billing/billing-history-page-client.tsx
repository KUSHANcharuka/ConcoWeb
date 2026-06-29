"use client";

import { useState, type ComponentType } from "react";
import { AlertCircleIcon, CalendarDaysIcon, CircleDollarSignIcon, LoaderCircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  billingHistoryFilterValues,
  matchesBillingHistoryFilter,
  type BillingHistoryFilter,
} from "~/lib/billing-history";
import { ProjectPaymentsTable } from "~/components/admin/billing/project-payments-table";
import { api } from "~/trpc/react";

function formatDate(value: string | Date | null | undefined) {
  if (!value) return "Not set";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatCurrency(currency: string, amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount / 100);
}

function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function buildNarrative(summary: {
  nextPaymentDueAt: string | Date | null;
  overdueCount: number;
  unpaidCount: number;
}) {
  if (summary.overdueCount > 0) {
    return {
      tone: "overdue" as const,
      title: "Payment attention needed.",
      body: `${pluralize(summary.overdueCount, "invoice")} ${summary.overdueCount === 1 ? "is" : "are"} overdue and should be reviewed now.`,
    };
  }

  if (summary.unpaidCount > 0) {
    return {
      tone: "upcoming" as const,
      title: "You're all set for now.",
      body: summary.nextPaymentDueAt
        ? `Your next payment is due on ${formatDate(summary.nextPaymentDueAt)}.`
        : `${pluralize(summary.unpaidCount, "invoice")} ${summary.unpaidCount === 1 ? "is" : "are"} still open.`,
    };
  }

  return {
    tone: "clear" as const,
    title: "You're all caught up.",
    body: "No payments are due right now.",
  };
}

function buildRemainingDue(summary: {
  unpaidCount: number;
  remainingDueByCurrency: Array<{ currency: string; totalAmount: number }>;
}) {
  if (summary.unpaidCount === 0) {
    return {
      value: "All clear",
      hint: "No unpaid invoices at the moment.",
    };
  }

  if (summary.remainingDueByCurrency.length === 1) {
    const [total] = summary.remainingDueByCurrency;
    return {
      value: formatCurrency(total.currency, total.totalAmount),
      hint: `${pluralize(summary.unpaidCount, "invoice")} awaiting payment.`,
    };
  }

  return {
    value: `${pluralize(summary.unpaidCount, "open invoice")}`,
    hint: `Across ${pluralize(summary.remainingDueByCurrency.length, "currency", "currencies")}.`,
  };
}

function buildNextDue(summary: {
  nextPaymentDueAt: string | Date | null;
  overdueCount: number;
  unpaidCount: number;
}) {
  if (summary.nextPaymentDueAt) {
    return {
      value: formatDate(summary.nextPaymentDueAt),
      hint: "Next scheduled due date across open invoices.",
    };
  }

  if (summary.overdueCount > 0) {
    return {
      value: `${pluralize(summary.overdueCount, "overdue invoice")}`,
      hint: "Payment attention is needed now.",
    };
  }

  if (summary.unpaidCount > 0) {
    return {
      value: "Awaiting updates",
      hint: "An open invoice exists without a due date.",
    };
  }

  return {
    value: "Nothing upcoming",
    hint: "No future payment dates are currently scheduled.",
  };
}

function getEmptyMessage(filter: BillingHistoryFilter, mode: "admin" | "client") {
  if (filter === "paid") {
    return "Completed invoices will appear here once payments are marked paid.";
  }

  if (filter === "overdue") {
    return "There are no overdue invoices right now.";
  }

  if (filter === "due") {
    return "There are no unpaid invoices waiting on payment right now.";
  }

  return mode === "admin"
    ? "No billing history has been created yet."
    : "No billing history is visible for your organization yet.";
}

export function BillingHistoryPageClient({ mode }: { mode: "admin" | "client" }) {
  const [status, setStatus] = useState<BillingHistoryFilter>("all");
  const adminQuery = api.admin.billing.listAll.useQuery({}, { enabled: mode === "admin" });
  const clientQuery = api.clientPortal.billing.listAll.useQuery({}, {
    enabled: mode === "client",
  });
  const query = mode === "admin" ? adminQuery : clientQuery;
  const allInvoices = query.data?.invoices ?? [];
  const invoices = allInvoices.filter((invoice) => matchesBillingHistoryFilter(invoice.status, status));

  if (query.isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-zinc-200 bg-white">
        <LoaderCircleIcon className="size-5 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
        {query.error?.message ?? "Failed to load billing history."}
      </div>
    );
  }

  const { summary } = query.data;
  const narrative = buildNarrative(summary);
  const remainingDue = buildRemainingDue(summary);
  const nextDue = buildNextDue(summary);

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "overflow-hidden rounded-[28px] border px-6 py-6 shadow-sm sm:px-7",
          narrative.tone === "overdue" &&
            "border-rose-200 bg-[linear-gradient(135deg,rgba(255,241,242,0.98),rgba(255,255,255,0.98))]",
          narrative.tone === "upcoming" &&
            "border-amber-200 bg-[linear-gradient(135deg,rgba(255,251,235,0.98),rgba(255,255,255,0.98))]",
          narrative.tone === "clear" &&
            "border-emerald-200 bg-[linear-gradient(135deg,rgba(236,253,245,0.98),rgba(255,255,255,0.98))]",
        )}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em]",
                narrative.tone === "overdue" && "border-rose-200 bg-white/80 text-rose-700",
                narrative.tone === "upcoming" && "border-amber-200 bg-white/80 text-amber-700",
                narrative.tone === "clear" && "border-emerald-200 bg-white/80 text-emerald-700",
              )}
            >
              <AlertCircleIcon className="size-3.5" />
              Billing overview
            </div>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-zinc-950">{narrative.title}</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-600">{narrative.body}</p>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2 lg:max-w-[440px]">
            <SummaryCard
              hint={remainingDue.hint}
              icon={CircleDollarSignIcon}
              label="Remaining due"
              value={remainingDue.value}
            />
            <SummaryCard
              hint={nextDue.hint}
              icon={CalendarDaysIcon}
              label="Next payment due"
              value={nextDue.value}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-lg font-semibold text-zinc-950">Billing history</div>
            <div className="mt-1 text-sm text-zinc-500">
              Open any invoice to review payment status, proof uploads, and invoice documents.
            </div>
          </div>

          <Tabs
            className="gap-0"
            onValueChange={(value) => setStatus(value as BillingHistoryFilter)}
            value={status}
          >
            <TabsList className="h-auto rounded-full border border-zinc-200 bg-zinc-50 p-1">
              {billingHistoryFilterValues.map((filter) => (
                <TabsTrigger
                  className="rounded-full px-4 data-[state=active]:bg-white"
                  key={filter}
                  value={filter}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <ProjectPaymentsTable
          emptyMessage={getEmptyMessage(status, mode)}
          emptyTitle="No invoices here yet"
          hrefBuilder={(invoice) =>
            mode === "admin"
              ? `/admin/projects/${invoice.projectId}/payments/${invoice.id}`
              : `/client-portal/projects/${invoice.projectId}/payments/${invoice.id}`
          }
          invoices={invoices}
          showClient={mode === "admin"}
          showPaidDate
          showProject
        />
      </div>
    </div>
  );
}

function SummaryCard({
  hint,
  icon: Icon,
  label,
  value,
}: {
  hint: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-[0.16em] text-zinc-500">{label}</div>
          <div className="text-2xl font-semibold text-zinc-950">{value}</div>
          <div className="text-sm text-zinc-500">{hint}</div>
        </div>
        <div className="rounded-full border border-zinc-200 bg-zinc-50 p-2.5 text-zinc-600">
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}
