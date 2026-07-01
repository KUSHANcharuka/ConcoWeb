"use client";

import { useMemo, useState } from "react";
import { LoaderCircleIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BillingSummaryCards } from "~/components/admin/billing/billing-summary-cards";
import { CreateInvoiceDialog } from "~/components/admin/billing/create-invoice-dialog";
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

export function ProjectPaymentsDashboard({
  mode,
  projectId,
}: {
  mode: "admin" | "client-preview" | "client";
  projectId: string;
}) {
  const isClientFacing = mode !== "admin";
  const [createOpen, setCreateOpen] = useState(false);

  const adminQuery = api.admin.projectBilling.workspace.useQuery(
    { projectId },
    { enabled: mode !== "client" },
  );
  const clientQuery = api.clientPortal.projectBilling.list.useQuery(
    { projectId },
    { enabled: mode === "client" },
  );

  const query = mode === "client" ? clientQuery : adminQuery;
  const data = query.data;

  const outstanding = useMemo(() => {
    const invoices = data?.invoices ?? [];
    return invoices
      .filter((invoice) => invoice.status !== "paid" && invoice.status !== "void")
      .reduce((sum, invoice) => sum + invoice.totalAmount, 0);
  }, [data?.invoices]);

  if (query.isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-zinc-200 bg-white">
        <LoaderCircleIcon className="size-5 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (query.isError || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        Failed to load project payments.
      </div>
    );
  }

  const rowBasePath =
    mode === "admin"
      ? `/admin/projects/${projectId}/payments`
      : mode === "client-preview"
        ? `/admin/projects/${projectId}/client-view/payments`
        : `/client-portal/projects/${projectId}/payments`;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
            Project Payments
          </p>
          <h2 className="mt-2 font-serif text-3xl text-zinc-950">
            Invoice history and payment actions for this project.
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Open an invoice to review inline documents, payment rails, proofs, and access
            deadlines from one workspace.
          </p>
        </div>

        {mode === "admin" ? (
          <Button onClick={() => setCreateOpen(true)}>
            <PlusIcon className="size-4" />
            New Invoice
          </Button>
        ) : null}
      </div>

      <BillingSummaryCards
        accessExpiresAt={formatDate(data.accessState?.accessExpiresAt)}
        nextDueAt={formatDate(data.accessState?.nextDueAt)}
        showAccessExpires={!isClientFacing}
        showNextDue={!isClientFacing}
        totalOutstanding={formatCurrency(data.project.currency, outstanding)}
      />

      <ProjectPaymentsTable
        emptyMessage={
          mode === "admin"
            ? "No billing artifacts exist for this project yet."
            : "No invoices are visible for this project yet."
        }
        hrefBuilder={(invoice) => `${rowBasePath}/${invoice.id}`}
        invoices={data.invoices}
        showClient={false}
        showPaidDate
        showProject={false}
      />

      {mode === "admin" && "availableTemplates" in data && "availablePaymentMethods" in data ? (
        <CreateInvoiceDialog
          currency={data.project.currency}
          onOpenChange={setCreateOpen}
          open={createOpen}
          paymentMethods={data.availablePaymentMethods.map((method) => ({
            id: method.id,
            name: method.name,
            methodType: method.methodType,
          }))}
          projectId={projectId}
          templates={data.availableTemplates.map((template) => ({
            id: template.id,
            name: template.name,
            templateType: template.templateType,
            templateLabel: template.templateLabel,
          }))}
        />
      ) : null}
    </div>
  );
}
