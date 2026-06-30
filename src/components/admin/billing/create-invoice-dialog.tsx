"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileTextIcon, LoaderCircleIcon, UploadIcon } from "lucide-react";
import { toast } from "sonner";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/kibo-ui/dropzone";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { uploadWithProgress } from "~/lib/upload-with-progress";
import { useUploadProgress } from "~/components/upload/upload-progress-provider";
import { api } from "~/trpc/react";

const planKindOptions = [
  { value: "manual", label: "Manual" },
  { value: "subscription", label: "Subscription" },
  { value: "prepaid_term", label: "Prepaid Term" },
  { value: "milestone", label: "Milestone" },
] as const;

type PaymentMethodSelection = {
  configId: string;
  stripeCheckoutUrl: string;
};

export function CreateInvoiceDialog({
  open,
  onOpenChange,
  projectId,
  currency,
  paymentMethods,
  templates,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  currency: string;
  paymentMethods: Array<{
    id: string;
    name: string;
    methodType: "stripe_payment_link" | "us_wire_transfer" | "lk_bank_transfer" | "manual";
  }>;
  templates: Array<{
    id: string;
    name: string;
    templateType: "invoice" | "agreement";
    templateLabel: string;
  }>;
}) {
  const router = useRouter();
  const utils = api.useUtils();
  const uploadProgress = useUploadProgress();
  const createInvoice = api.admin.projectBilling.createInvoice.useMutation();
  const uploadDocument = api.admin.projectBilling.createArtifactDocumentUpload.useMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [planKind, setPlanKind] =
    useState<(typeof planKindOptions)[number]["value"]>("manual");
  const [amount, setAmount] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [nextDueAt, setNextDueAt] = useState("");
  const [accessExpiresAt, setAccessExpiresAt] = useState("");
  const [notes, setNotes] = useState("");
  const [termsTemplateId, setTermsTemplateId] = useState("none");
  const [selectedMethods, setSelectedMethods] = useState<Record<string, PaymentMethodSelection>>({});
  const [primaryInvoiceFiles, setPrimaryInvoiceFiles] = useState<File[]>();

  const termsTemplates = useMemo(
    () => templates.filter((template) => template.templateType === "agreement"),
    [templates],
  );

  function resetForm() {
    setTitle("");
    setDescription("");
    setPlanKind("manual");
    setAmount("");
    setDueAt("");
    setNextDueAt("");
    setAccessExpiresAt("");
    setNotes("");
    setTermsTemplateId("none");
    setSelectedMethods({});
    setPrimaryInvoiceFiles(undefined);
  }

  async function submit() {
    const primaryInvoiceFile = primaryInvoiceFiles?.[0];
    const parsedAmount = Number(amount);
    if (!title.trim()) {
      toast.error("Add an invoice title.");
      return;
    }
    if (!primaryInvoiceFile) {
      toast.error("Upload the primary invoice PDF.");
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast.error("Add a valid invoice amount.");
      return;
    }

    const selectedMethodEntries = Object.values(selectedMethods);
    if (selectedMethodEntries.length === 0) {
      toast.error("Select at least one payment method.");
      return;
    }

    const stripeSelection = selectedMethodEntries.find((method) => {
      const config = paymentMethods.find((candidate) => candidate.id === method.configId);
      return config?.methodType === "stripe_payment_link";
    });

    if (stripeSelection && !stripeSelection.stripeCheckoutUrl.trim()) {
      toast.error("Stripe payment methods require a checkout URL.");
      return;
    }

    try {
      const created = await createInvoice.mutateAsync({
        projectId,
        title: title.trim(),
        description: description.trim() || null,
        planKind,
        currency,
        amount: Math.round(parsedAmount * 100),
        dueAt: dueAt ? new Date(`${dueAt}T00:00:00.000Z`).toISOString() : null,
        nextDueAt: nextDueAt ? new Date(`${nextDueAt}T00:00:00.000Z`).toISOString() : null,
        accessExpiresAt: accessExpiresAt
          ? new Date(`${accessExpiresAt}T00:00:00.000Z`).toISOString()
          : null,
        notes: notes.trim() || null,
        terms: null,
        paymentMethods: selectedMethodEntries.map((method) => ({
          configId: method.configId,
          stripeCheckoutUrl: method.stripeCheckoutUrl.trim() || null,
        })),
        documents: [
          {
            role: "primary_invoice",
            title: title.trim(),
            templateId: null,
            isSignable: true,
          },
          ...(termsTemplateId !== "none"
            ? [
                {
                  role: "terms_and_conditions" as const,
                  title: "Terms & Conditions",
                  templateId: termsTemplateId,
                  isSignable: false,
                },
              ]
            : []),
        ],
      });

      const primaryInvoiceDocument = created.documents.find(
        (document) => document.role === "primary_invoice",
      );

      if (!primaryInvoiceDocument) {
        throw new Error("Primary invoice document was not created.");
      }

      const upload = await uploadDocument.mutateAsync({
        artifactId: created.id,
        documentId: primaryInvoiceDocument.id,
        projectId,
        fileName: primaryInvoiceFile.name,
        mimeType: primaryInvoiceFile.type || "application/pdf",
        sizeBytes: primaryInvoiceFile.size,
      });

      const tracker = uploadProgress.startUpload({ label: primaryInvoiceFile.name });
      try {
        await uploadWithProgress({
          url: upload.uploadUrl,
          file: primaryInvoiceFile,
          contentType: primaryInvoiceFile.type || "application/pdf",
          onProgress: tracker.update,
        });
        tracker.succeed("Primary invoice uploaded");
      } catch (uploadError) {
        const message =
          uploadError instanceof Error ? uploadError.message : "Primary invoice upload failed.";
        tracker.fail(message);
        throw new Error(message);
      }

      await utils.admin.projectBilling.workspace.invalidate({ projectId });
      await utils.admin.projectBilling.getArtifact.invalidate({
        projectId,
        artifactId: created.id,
      });
      toast.success("Invoice created.");
      onOpenChange(false);
      resetForm();
      router.push(`/admin/projects/${projectId}/payments/${created.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create invoice.");
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader className="text-left">
          <DialogTitle>Create billing artifact</DialogTitle>
          <DialogDescription>
            Create a simple invoice with one payable total, linked documents, and one or
            more payment methods.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invoice-title">Title</Label>
              <Input
                id="invoice-title"
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Prelim annual renewal"
                value={title}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice-description">Description</Label>
              <Textarea
                id="invoice-description"
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What this invoice covers."
                rows={3}
                value={description}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Plan Kind</Label>
                <Select
                  onValueChange={(value) =>
                    setPlanKind(value as (typeof planKindOptions)[number]["value"])
                  }
                  value={planKind}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {planKindOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoice-amount">Amount ({currency})</Label>
                <Input
                  id="invoice-amount"
                  min={0}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="1200"
                  step="0.01"
                  type="number"
                  value={amount}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="invoice-due">Due Date</Label>
                <Input
                  id="invoice-due"
                  onChange={(event) => setDueAt(event.target.value)}
                  type="date"
                  value={dueAt}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoice-next-due">Next Due</Label>
                <Input
                  id="invoice-next-due"
                  onChange={(event) => setNextDueAt(event.target.value)}
                  type="date"
                  value={nextDueAt}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice-access-expiry">Access Expires</Label>
              <Input
                id="invoice-access-expiry"
                onChange={(event) => setAccessExpiresAt(event.target.value)}
                type="date"
                value={accessExpiresAt}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice-notes">Notes</Label>
              <Textarea
                id="invoice-notes"
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Internal notes or context for the client."
                rows={4}
                value={notes}
              />
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <div>
              <div className="text-sm font-medium text-zinc-950">Invoice documents</div>
                <div className="text-xs text-zinc-500">
                  Upload the invoice PDF now. Terms can still reuse a settings template and the
                  uploaded invoice will be previewed inline from the detail page.
                </div>
              </div>

              <div className="space-y-2">
                <Label>Primary invoice PDF</Label>
                <Dropzone
                  accept={{ "application/pdf": [".pdf"] }}
                  className="min-h-[136px] border-dashed bg-white"
                  disabled={createInvoice.isPending || uploadDocument.isPending}
                  maxFiles={1}
                  maxSize={20 * 1024 * 1024}
                  onDrop={(acceptedFiles) => setPrimaryInvoiceFiles(acceptedFiles.slice(0, 1))}
                  src={primaryInvoiceFiles}
                >
                  {primaryInvoiceFiles?.length ? (
                    <DropzoneContent />
                  ) : (
                    <DropzoneEmptyState />
                  )}
                </Dropzone>
                <div className="rounded-xl border border-zinc-200 bg-white px-3 py-3 text-xs text-zinc-600">
                  <div className="flex items-start gap-2">
                    <FileTextIcon className="mt-0.5 size-4 text-zinc-500" />
                    <div>
                      Upload the actual invoice PDF here. After creation, the invoice detail
                      page uses this file as the inline review surface for admins and clients.
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Terms & Conditions template</Label>
                <Select onValueChange={setTermsTemplateId} value={termsTemplateId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Optional terms template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No template</SelectItem>
                    {termsTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-zinc-200 p-4">
              <div>
                <div className="text-sm font-medium text-zinc-900">Payment methods</div>
                <div className="text-xs text-zinc-500">
                  One invoice can expose multiple payment rails. Stripe requires an
                  invoice-specific checkout URL.
                </div>
              </div>

              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const selected = selectedMethods[method.id];
                  return (
                    <div className="rounded-xl border border-zinc-200 p-3" key={method.id}>
                      <label className="flex items-start gap-3">
                        <Checkbox
                          checked={Boolean(selected)}
                          onCheckedChange={(checked) => {
                            setSelectedMethods((current) => {
                              if (!checked) {
                                const next = { ...current };
                                delete next[method.id];
                                return next;
                              }

                              return {
                                ...current,
                                [method.id]: {
                                  configId: method.id,
                                  stripeCheckoutUrl: current[method.id]?.stripeCheckoutUrl ?? "",
                                },
                              };
                            });
                          }}
                        />
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-zinc-950">{method.name}</div>
                          <div className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                            {method.methodType.replaceAll("_", " ")}
                          </div>
                        </div>
                      </label>

                      {selected && method.methodType === "stripe_payment_link" ? (
                        <div className="mt-3 space-y-2">
                          <Label htmlFor={`stripe-url-${method.id}`}>Stripe checkout URL</Label>
                          <Input
                            id={`stripe-url-${method.id}`}
                            onChange={(event) =>
                              setSelectedMethods((current) => ({
                                ...current,
                                [method.id]: {
                                  configId: method.id,
                                  stripeCheckoutUrl: event.target.value,
                                },
                              }))
                            }
                            placeholder="https://buy.stripe.com/..."
                            value={selected.stripeCheckoutUrl}
                          />
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => {
              onOpenChange(false);
              resetForm();
            }}
            variant="ghost"
          >
            Cancel
          </Button>
          <Button
            disabled={createInvoice.isPending || uploadDocument.isPending}
            onClick={() => void submit()}
          >
            {createInvoice.isPending || uploadDocument.isPending ? (
              <>
                <LoaderCircleIcon className="size-4 animate-spin" />
                {uploadDocument.isPending ? "Uploading invoice..." : "Creating..."}
              </>
            ) : (
              <>
                <UploadIcon className="size-4" />
                Create Invoice
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
