"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

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
import { api } from "~/trpc/react";

const planKindOptions = [
  { value: "manual", label: "Manual" },
  { value: "subscription", label: "Subscription" },
  { value: "prepaid_term", label: "Prepaid Term" },
  { value: "milestone", label: "Milestone" },
] as const;

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
    methodType: string;
  }>;
  templates: Array<{
    id: string;
    name: string;
    content: string;
  }>;
}) {
  const utils = api.useUtils();
  const createInvoice = api.admin.projectBilling.createInvoice.useMutation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [planKind, setPlanKind] =
    useState<(typeof planKindOptions)[number]["value"]>("manual");
  const [dueAt, setDueAt] = useState("");
  const [nextDueAt, setNextDueAt] = useState("");
  const [accessExpiresAt, setAccessExpiresAt] = useState("");
  const [terms, setTerms] = useState("");
  const [notes, setNotes] = useState("");
  const [lineLabel, setLineLabel] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitAmount, setUnitAmount] = useState(0);
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [templateId, setTemplateId] = useState("none");

  const total = useMemo(() => quantity * unitAmount, [quantity, unitAmount]);

  async function submit() {
    if (!title.trim()) {
      toast.error("Add an invoice title.");
      return;
    }

    if (!lineLabel.trim()) {
      toast.error("Add at least one line item label.");
      return;
    }

    if (selectedMethods.length === 0) {
      toast.error("Select at least one payment method.");
      return;
    }

    try {
      await createInvoice.mutateAsync({
        projectId,
        title,
        description: description || null,
        planKind,
        currency,
        dueAt: dueAt ? new Date(`${dueAt}T00:00:00.000Z`).toISOString() : null,
        nextDueAt: nextDueAt
          ? new Date(`${nextDueAt}T00:00:00.000Z`).toISOString()
          : null,
        accessExpiresAt: accessExpiresAt
          ? new Date(`${accessExpiresAt}T00:00:00.000Z`).toISOString()
          : null,
        terms: terms || null,
        notes: notes || null,
        lineItems: [
          {
            label: lineLabel,
            description: null,
            quantity,
            unitAmount,
          },
        ],
        paymentMethodConfigIds: selectedMethods,
      });
      await utils.admin.projectBilling.workspace.invalidate({ projectId });
      toast.success("Invoice created.");
      onOpenChange(false);
      setTitle("");
      setDescription("");
      setPlanKind("manual");
      setDueAt("");
      setNextDueAt("");
      setAccessExpiresAt("");
      setTerms("");
      setNotes("");
      setTemplateId("none");
      setLineLabel("");
      setQuantity(1);
      setUnitAmount(0);
      setSelectedMethods([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create invoice.");
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader className="text-left">
          <DialogTitle>Create billing artifact</DialogTitle>
          <DialogDescription>
            Create one invoice/request bundle with due dates, access dates, and one or
            more payment methods.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 md:grid-cols-2">
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
                placeholder="What this billing artifact covers."
                rows={3}
                value={description}
              />
            </div>

            <div className="space-y-2">
              <Label>Plan Kind</Label>
              <Select onValueChange={(value) => setPlanKind(value as typeof planKind)} value={planKind}>
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
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_96px_120px]">
                <div className="space-y-2">
                  <Label htmlFor="line-label">Line Item</Label>
                  <Input
                    id="line-label"
                    onChange={(event) => setLineLabel(event.target.value)}
                    placeholder="Annual Prelim plan"
                    value={lineLabel}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="line-qty">Qty</Label>
                  <Input
                    id="line-qty"
                    min={1}
                    onChange={(event) => setQuantity(Number(event.target.value) || 1)}
                    type="number"
                    value={quantity}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="line-amount">Amount</Label>
                  <Input
                    id="line-amount"
                    min={0}
                    onChange={(event) => setUnitAmount(Number(event.target.value) || 0)}
                    type="number"
                    value={unitAmount}
                  />
                </div>
              </div>
              <p className="mt-3 text-sm text-zinc-600">Current total: {currency} {total.toLocaleString()}</p>
            </div>

            <div className="space-y-2">
              <Label>Template</Label>
              <Select
                onValueChange={(value) => {
                  setTemplateId(value);
                  const selectedTemplate = templates.find((template) => template.id === value);
                  if (selectedTemplate) {
                    setTerms(selectedTemplate.content);
                  }
                }}
                value={templateId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Optional template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No template</SelectItem>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice-terms">Terms</Label>
              <Textarea
                id="invoice-terms"
                onChange={(event) => setTerms(event.target.value)}
                placeholder="Payment terms and agreement notes."
                rows={4}
                value={terms}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice-notes">Notes</Label>
              <Textarea
                id="invoice-notes"
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Internal notes or client-facing message."
                rows={3}
                value={notes}
              />
            </div>

            <div className="space-y-3 rounded-xl border border-zinc-200 p-4">
              <div>
                <div className="text-sm font-medium text-zinc-900">Payment Methods</div>
                <div className="text-xs text-zinc-500">
                  Same invoice can expose more than one payment rail.
                </div>
              </div>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    className="flex items-start gap-3 rounded-lg border border-zinc-200 px-3 py-2"
                    key={method.id}
                  >
                    <Checkbox
                      checked={selectedMethods.includes(method.id)}
                      onCheckedChange={(checked) => {
                        setSelectedMethods((current) =>
                          checked
                            ? [...current, method.id]
                            : current.filter((value) => value !== method.id),
                        );
                      }}
                    />
                    <div>
                      <div className="text-sm font-medium text-zinc-900">{method.name}</div>
                      <div className="text-xs uppercase tracking-wide text-zinc-500">
                        {method.methodType.replaceAll("_", " ")}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="ghost">
            Cancel
          </Button>
          <Button disabled={createInvoice.isPending} onClick={() => void submit()}>
            {createInvoice.isPending ? "Creating..." : "Create Invoice"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
