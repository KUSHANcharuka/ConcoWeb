"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProjectPaymentStatusPill } from "~/components/admin/billing/project-payment-status-pill";

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

export function ProjectPaymentsTable({
  emptyMessage,
  emptyTitle,
  hrefBuilder,
  invoices,
  showClient = false,
  showPaidDate = true,
  showProject = false,
}: {
  emptyMessage: string;
  emptyTitle?: string;
  hrefBuilder: (invoice: {
    id: string;
    projectId?: string;
  }) => string;
  invoices: Array<{
    id: string;
    projectId?: string;
    title: string;
    invoiceNumber: string;
    status: "draft" | "sent" | "pending_payment" | "proof_submitted" | "paid" | "overdue" | "void";
    currency: string;
    totalAmount: number;
    dueAt: string | Date | null;
    paidAt?: string | Date | null;
    projectName?: string | null;
    clientName?: string | null;
  }>;
  showClient?: boolean;
  showPaidDate?: boolean;
  showProject?: boolean;
}) {
  if (invoices.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-10">
        <div className="space-y-2">
          {emptyTitle ? <div className="text-base font-semibold text-zinc-900">{emptyTitle}</div> : null}
          <div className="text-sm text-zinc-500">{emptyMessage}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-zinc-50/80 hover:bg-zinc-50/80">
            <TableHead className="px-5">Invoice</TableHead>
            {showProject ? <TableHead>Project</TableHead> : null}
            {showClient ? <TableHead>Client</TableHead> : null}
            <TableHead>Amount</TableHead>
            <TableHead>Due Date</TableHead>
            {showPaidDate ? <TableHead>Paid Date</TableHead> : null}
            <TableHead>Status</TableHead>
            <TableHead className="px-5 text-right">Open</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow className="group" key={invoice.id}>
              <TableCell className="px-5 py-4">
                <div className="space-y-1">
                  <div className="font-medium text-zinc-950">{invoice.title}</div>
                  <div className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                    {invoice.invoiceNumber}
                  </div>
                </div>
              </TableCell>
              {showProject ? (
                <TableCell className="py-4">
                  <div className="space-y-1">
                    <div className="font-medium text-zinc-900">{invoice.projectName ?? "Project"}</div>
                    {!showClient && invoice.clientName ? (
                      <div className="text-xs text-zinc-500">{invoice.clientName}</div>
                    ) : null}
                  </div>
                </TableCell>
              ) : null}
              {showClient ? (
                <TableCell className="py-4 text-zinc-700">{invoice.clientName ?? "Client"}</TableCell>
              ) : null}
              <TableCell className="py-4 font-medium text-zinc-900">
                {formatCurrency(invoice.currency, invoice.totalAmount)}
              </TableCell>
              <TableCell className="py-4 text-zinc-700">{formatDate(invoice.dueAt)}</TableCell>
              {showPaidDate ? (
                <TableCell
                  className={cn(
                    "py-4 text-zinc-700",
                    invoice.status === "paid" ? "font-medium text-emerald-700" : "text-zinc-500",
                  )}
                >
                  {invoice.status === "paid" ? formatDate(invoice.paidAt) : "Not paid"}
                </TableCell>
              ) : null}
              <TableCell className="py-4">
                <ProjectPaymentStatusPill status={invoice.status} />
              </TableCell>
              <TableCell className="px-5 py-4 text-right">
                <Button asChild size="sm" variant="outline">
                  <Link href={hrefBuilder(invoice)}>Open</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
