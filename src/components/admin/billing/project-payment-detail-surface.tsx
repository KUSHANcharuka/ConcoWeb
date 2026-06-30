"use client";

import { useMemo } from "react";
import { LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { BillingDocumentPanel } from "~/components/admin/billing/billing-document-panel";
import { BillingPaymentMethodCard } from "~/components/admin/billing/billing-payment-method-card";
import { BillingProofPanel } from "~/components/admin/billing/billing-proof-panel";
import { ProjectPaymentStatusPill } from "~/components/admin/billing/project-payment-status-pill";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export function ProjectPaymentDetailSurface({
  artifactId,
  formEmbedHost,
  mode,
  projectId,
}: {
  artifactId: string;
  formEmbedHost: string | null;
  mode: "admin" | "client-preview" | "client";
  projectId: string;
}) {
  const isClientFacing = mode !== "admin";
  const utils = api.useUtils();
  const adminQuery = api.admin.projectBilling.getArtifact.useQuery(
    { artifactId, projectId },
    { enabled: mode !== "client" },
  );
  const clientQuery = api.clientPortal.projectBilling.getArtifact.useQuery(
    { artifactId, projectId },
    { enabled: mode === "client" },
  );
  const query = mode === "client" ? clientQuery : adminQuery;
  const updateStatus = api.admin.projectBilling.updateStatus.useMutation({
    onSuccess: async () => {
      await utils.admin.projectBilling.getArtifact.invalidate({ artifactId, projectId });
      await utils.admin.projectBilling.workspace.invalidate({ projectId });
      toast.success("Invoice status updated.");
    },
    onError: (error) => toast.error(error.message),
  });

  const data = query.data;
  const primaryDocument = useMemo(
    () => data?.artifact.documents.find((document) => document.role === "primary_invoice") ?? null,
    [data?.artifact.documents],
  );
  const termsDocument = useMemo(
    () =>
      data?.artifact.documents.find((document) => document.role === "terms_and_conditions") ?? null,
    [data?.artifact.documents],
  );
  const showTermsDocument = useMemo(() => {
    if (!termsDocument) return false;
    if (!isClientFacing) return true;

    return Boolean(termsDocument.docusealSubmitterEmbedUrl || termsDocument.sourceAsset?.url);
  }, [isClientFacing, termsDocument]);

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
        Failed to load invoice detail.
      </div>
    );
  }

  const { artifact } = data;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-serif text-3xl text-zinc-950">{artifact.title}</h2>
              <ProjectPaymentStatusPill status={artifact.status} />
            </div>
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              {artifact.invoiceNumber}
            </div>
            {artifact.description ? (
              <p className="max-w-3xl text-sm leading-7 text-zinc-600">{artifact.description}</p>
            ) : null}
          </div>

          {mode === "admin" ? (
            <Select
              onValueChange={(value) =>
                void updateStatus.mutateAsync({
                  artifactId,
                  projectId,
                  status: value as (typeof statusOptions)[number],
                })
              }
              value={artifact.status}
            >
              <SelectTrigger className="w-[220px]">
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
          ) : null}
        </div>

        <div className={`mt-6 grid gap-4 ${isClientFacing ? "md:grid-cols-3" : "md:grid-cols-5"}`}>
          <SummaryMetric
            label="Amount"
            value={formatCurrency(artifact.currency, artifact.totalAmount)}
          />
          <SummaryMetric label="Due date" value={formatDate(artifact.dueAt)} />
          <SummaryMetric
            className={artifact.status === "paid" ? "border-emerald-200 bg-emerald-50" : undefined}
            label="Completed on"
            value={artifact.status === "paid" ? formatDate(artifact.paidAt) : "Not paid"}
            valueClassName={artifact.status === "paid" ? "text-emerald-700" : undefined}
          />
          {!isClientFacing ? (
            <SummaryMetric label="Next due" value={formatDate(artifact.nextDueAt)} />
          ) : null}
          {!isClientFacing ? (
            <SummaryMetric
              label="Access expires"
              value={formatDate(artifact.accessExpiresAt ?? data.accessState?.accessExpiresAt)}
            />
          ) : null}
        </div>
      </div>

      {primaryDocument ? (
        <BillingDocumentPanel
          artifactId={artifactId}
          availableTemplates={("availableTemplates" in data ? data.availableTemplates : []).map((template) => ({
            id: template.id,
            name: template.name,
            templateType: template.templateType,
          }))}
          document={primaryDocument}
          formEmbedHost={formEmbedHost}
          mode={mode}
          projectId={projectId}
        />
      ) : null}

      {showTermsDocument && termsDocument ? (
        <BillingDocumentPanel
          artifactId={artifactId}
          availableTemplates={("availableTemplates" in data ? data.availableTemplates : []).map((template) => ({
            id: template.id,
            name: template.name,
            templateType: template.templateType,
          }))}
          document={termsDocument}
          formEmbedHost={formEmbedHost}
          mode={mode}
          projectId={projectId}
        />
      ) : null}

      <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div>
          <div className="text-lg font-semibold text-zinc-950">Payment methods</div>
          <div className="mt-1 text-sm text-zinc-500">
            Choose the payment rail that fits this invoice. Stripe uses the invoice-specific
            checkout URL captured at creation time.
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {artifact.paymentMethods.map((method) => (
            <BillingPaymentMethodCard
              accountName={method.accountName}
              accountNumberMask={method.accountNumberMask}
              bankName={method.bankName}
              imageUrl={method.imageUrl}
              instructions={method.instructions}
              isClientMode={mode === "client"}
              key={method.id}
              label={method.label}
              methodType={method.methodType}
              paymentUrl={method.paymentUrl}
              routingNumberMask={method.routingNumberMask}
            />
          ))}
        </div>
      </div>

      <BillingProofPanel
        artifactId={artifactId}
        mode={mode}
        projectId={projectId}
        proofs={artifact.proofAssets}
      />
    </div>
  );
}

function SummaryMetric({
  className,
  label,
  value,
  valueClassName,
}: {
  className?: string;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4", className)}>
      <div className="text-xs uppercase tracking-[0.14em] text-zinc-500">{label}</div>
      <div className={cn("mt-2 text-base font-semibold text-zinc-950", valueClassName)}>{value}</div>
    </div>
  );
}
