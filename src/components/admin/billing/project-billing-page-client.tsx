"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { LoaderCircleIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BillingProofUploadField } from "~/components/admin/billing/billing-proof-upload-field";
import { BillingSummaryCards } from "~/components/admin/billing/billing-summary-cards";
import { CreateInvoiceDialog } from "~/components/admin/billing/create-invoice-dialog";
import { api } from "~/trpc/react";

const statusOptions = [
  "draft",
  "sent",
  "pending_payment",
  "proof_submitted",
  "paid",
  "overdue",
  "void",
] as const;

function formatDate(value: string | Date | null | undefined) {
  if (!value) return "Not set";
  return format(new Date(value), "MMM d, yyyy");
}

function formatCurrency(currency: string, amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount / 100);
}

export function ProjectBillingPageClient({ projectId }: { projectId: string }) {
  const utils = api.useUtils();
  const [createOpen, setCreateOpen] = useState(false);
  const workspaceQuery = api.admin.projectBilling.workspace.useQuery({ projectId });
  const updateStatus = api.admin.projectBilling.updateStatus.useMutation({
    onSuccess: async () => {
      await utils.admin.projectBilling.workspace.invalidate({ projectId });
      toast.success("Billing status updated.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const outstanding = useMemo(() => {
    const invoices = workspaceQuery.data?.invoices ?? [];
    return invoices
      .filter((invoice) => invoice.status !== "paid" && invoice.status !== "void")
      .reduce((sum, invoice) => sum + invoice.totalAmount, 0);
  }, [workspaceQuery.data?.invoices]);

  if (workspaceQuery.isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-zinc-200 bg-white">
        <LoaderCircleIcon className="size-5 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (workspaceQuery.isError || !workspaceQuery.data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        Failed to load billing workspace.
      </div>
    );
  }

  const { accessState, availablePaymentMethods, invoices, project } = workspaceQuery.data;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
            Project Billing
          </p>
          <h2 className="mt-2 font-serif text-3xl text-zinc-950">
            Central billing, scoped to this project.
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Manage invoice bundles, shared payment options, proof uploads, and the
            separate entitlement dates that govern access.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => setCreateOpen(true)}>
            <PlusIcon className="size-4" />
            New Invoice
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/settings">Open Billing Settings</Link>
          </Button>
        </div>
      </div>

      <BillingSummaryCards
        accessExpiresAt={formatDate(accessState?.accessExpiresAt)}
        nextDueAt={formatDate(accessState?.nextDueAt)}
        totalOutstanding={formatCurrency(project.currency, outstanding)}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          {invoices.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center">
              <div className="text-lg font-semibold text-zinc-900">No billing artifacts yet</div>
              <p className="mt-2 text-sm text-zinc-600">
                Create the first invoice/request for this project and attach one or more
                payment methods.
              </p>
            </div>
          ) : (
            invoices.map((invoice) => (
              <div
                className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
                key={invoice.id}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-zinc-950">{invoice.title}</h3>
                      <Badge variant="outline">{invoice.invoiceNumber}</Badge>
                    </div>
                    <p className="text-sm text-zinc-600">
                      {invoice.description ?? "No description added."}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge>{invoice.planKind.replaceAll("_", " ")}</Badge>
                    <Select
                      onValueChange={(value) =>
                        void updateStatus.mutateAsync({
                          projectId,
                          artifactId: invoice.id,
                          status: value as (typeof statusOptions)[number],
                        })
                      }
                      value={invoice.status}
                    >
                      <SelectTrigger className="w-[190px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.replaceAll("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-zinc-500">Total</div>
                    <div className="mt-1 text-base font-semibold text-zinc-950">
                      {formatCurrency(invoice.currency, invoice.totalAmount)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-zinc-500">Due</div>
                    <div className="mt-1 text-sm text-zinc-900">{formatDate(invoice.dueAt)}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-zinc-500">Next Due</div>
                    <div className="mt-1 text-sm text-zinc-900">
                      {formatDate(invoice.nextDueAt)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-zinc-500">
                      Access Expires
                    </div>
                    <div className="mt-1 text-sm text-zinc-900">
                      {formatDate(invoice.accessExpiresAt)}
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-zinc-900">Line Items</div>
                      <div className="mt-3 space-y-2">
                        {invoice.lineItems.map((item) => (
                          <div
                            className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                            key={item.id}
                          >
                            <div>
                              <div className="font-medium text-zinc-900">{item.label}</div>
                              <div className="text-xs text-zinc-500">
                                Qty {item.quantity} x {formatCurrency(invoice.currency, item.unitAmount)}
                              </div>
                            </div>
                            <div className="font-medium text-zinc-900">
                              {formatCurrency(invoice.currency, item.totalAmount)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-zinc-900">Payment Methods</div>
                      <div className="mt-3 space-y-2">
                        {invoice.paymentMethods.map((method) => (
                          <div
                            className="rounded-lg border border-zinc-200 px-3 py-3"
                            key={method.id}
                          >
                            <div className="text-sm font-medium text-zinc-900">
                              {method.label}
                            </div>
                            <div className="mt-1 text-xs uppercase tracking-wide text-zinc-500">
                              {method.methodType.replaceAll("_", " ")}
                            </div>
                            {method.paymentUrl ? (
                              <a
                                className="mt-2 inline-block text-sm text-blue-600 underline"
                                href={method.paymentUrl}
                                rel="noreferrer"
                                target="_blank"
                              >
                                Open payment link
                              </a>
                            ) : null}
                            {method.instructions ? (
                              <p className="mt-2 text-sm text-zinc-600">{method.instructions}</p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                    <div>
                      <div className="text-sm font-medium text-zinc-900">Proofs & Attachments</div>
                      <div className="text-xs text-zinc-500">
                        Upload slips or other billing evidence scoped to this invoice.
                      </div>
                    </div>
                    <BillingProofUploadField artifactId={invoice.id} projectId={projectId} />
                    <div className="space-y-2">
                      {invoice.proofAssets.map((asset) => (
                        <div
                          className="rounded-lg border border-zinc-200 bg-white px-3 py-2"
                          key={asset.id}
                        >
                          <div className="text-sm font-medium text-zinc-900">
                            {asset.displayName}
                          </div>
                          <div className="text-xs text-zinc-500">
                            Uploaded {formatDate(asset.uploadedAt)}
                          </div>
                          {asset.url ? (
                            <a
                              className="mt-1 inline-block text-xs text-blue-600 underline"
                              href={asset.url}
                              rel="noreferrer"
                              target="_blank"
                            >
                              View file
                            </a>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-medium text-zinc-900">Access Truth</div>
            <div className="mt-3 space-y-3 text-sm text-zinc-600">
              <div className="flex items-center justify-between">
                <span>Status</span>
                <span className="font-medium text-zinc-950">
                  {accessState?.status?.replaceAll("_", " ") ?? "inactive"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Next Due</span>
                <span className="font-medium text-zinc-950">
                  {formatDate(accessState?.nextDueAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Access Expires</span>
                <span className="font-medium text-zinc-950">
                  {formatDate(accessState?.accessExpiresAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-medium text-zinc-900">Available Shared Methods</div>
            <div className="mt-3 space-y-2">
              {availablePaymentMethods.map((method) => (
                <div className="rounded-lg border border-zinc-200 px-3 py-2" key={method.id}>
                  <div className="text-sm font-medium text-zinc-900">{method.name}</div>
                  <div className="text-xs uppercase tracking-wide text-zinc-500">
                    {method.methodType.replaceAll("_", " ")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-medium text-zinc-900">Billing Templates</div>
            <div className="mt-3 space-y-2">
              {workspaceQuery.data.availableTemplates.length === 0 ? (
                <div className="text-sm text-zinc-500">
                  No billing templates yet. Add them in settings.
                </div>
              ) : (
                workspaceQuery.data.availableTemplates.map((template) => (
                  <div className="rounded-lg border border-zinc-200 px-3 py-2" key={template.id}>
                    <div className="text-sm font-medium text-zinc-900">{template.name}</div>
                    <div className="text-xs uppercase tracking-wide text-zinc-500">
                      {template.templateType}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <CreateInvoiceDialog
        currency={project.currency}
        onOpenChange={setCreateOpen}
        open={createOpen}
        paymentMethods={availablePaymentMethods.map((method) => ({
          id: method.id,
          name: method.name,
          methodType: method.methodType,
        }))}
        projectId={projectId}
        templates={workspaceQuery.data.availableTemplates.map((template) => ({
          id: template.id,
          name: template.name,
          content: template.content,
        }))}
      />
    </div>
  );
}
