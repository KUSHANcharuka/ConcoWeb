"use client";

import { useEffect, useMemo, useState } from "react";
import { CreditCardIcon, LoaderCircleIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

import {
  Dropzone,
  DropzoneEmptyState,
} from "@/components/kibo-ui/dropzone";
import { Badge } from "@/components/ui/badge";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { uploadWithProgress } from "~/lib/upload-with-progress";
import { useUploadProgress } from "~/components/upload/upload-progress-provider";
import { api } from "~/trpc/react";

type PaymentMethodFormState = {
  paymentMethodId: string | null;
  name: string;
  methodType: "stripe_payment_link" | "us_wire_transfer" | "lk_bank_transfer" | "manual";
  imageObjectKey: string | null;
  imageUrl: string | null;
  currency: string;
  instructions: string;
  paymentUrl: string;
  accountName: string;
  accountNumberMask: string;
  routingNumberMask: string;
  bankName: string;
  isActive: boolean;
};

const emptyForm: PaymentMethodFormState = {
  paymentMethodId: null,
  name: "",
  methodType: "stripe_payment_link",
  imageObjectKey: null,
  imageUrl: null,
  currency: "",
  instructions: "",
  paymentUrl: "",
  accountName: "",
  accountNumberMask: "",
  routingNumberMask: "",
  bankName: "",
  isActive: true,
};

export function PaymentMethodsPageClient() {
  const utils = api.useUtils();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<PaymentMethodFormState>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const methodsQuery = api.admin.settingsBilling.paymentMethods.useQuery();
  const imageUploadMutation = api.admin.settingsBilling.createPaymentMethodImageUpload.useMutation();
  const uploadProgress = useUploadProgress();
  const createMutation = api.admin.settingsBilling.createPaymentMethod.useMutation({
    onSuccess: async () => {
      await utils.admin.settingsBilling.paymentMethods.invalidate();
      await utils.admin.settingsBilling.page.invalidate();
      toast.success("Payment method created.");
      setDialogOpen(false);
      setForm(emptyForm);
    },
    onError: (error) => toast.error(error.message),
  });
  const updateMutation = api.admin.settingsBilling.updatePaymentMethod.useMutation({
    onSuccess: async () => {
      await utils.admin.settingsBilling.paymentMethods.invalidate();
      await utils.admin.settingsBilling.page.invalidate();
      toast.success("Payment method updated.");
      setDialogOpen(false);
      setForm(emptyForm);
    },
    onError: (error) => toast.error(error.message),
  });

  useEffect(() => {
    if (!dialogOpen) {
      setForm(emptyForm);
      setUploading(false);
    }
  }, [dialogOpen]);

  const busy = createMutation.isPending || updateMutation.isPending || uploading;

  const methodSubtitle = useMemo(() => {
    switch (form.methodType) {
      case "stripe_payment_link":
        return form.paymentUrl || "Stripe payment link";
      case "us_wire_transfer":
      case "lk_bank_transfer":
        return [form.bankName, form.accountNumberMask].filter(Boolean).join(" · ");
      default:
        return form.instructions || "Manual payment instructions";
    }
  }, [form]);

  async function handleImageDrop(acceptedFiles: File[]) {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    const localPreview = URL.createObjectURL(file);
    setForm((current) => ({ ...current, imageUrl: localPreview }));

    const tracker = uploadProgress.startUpload({ label: file.name });
    try {
      const upload = await imageUploadMutation.mutateAsync({
        fileName: file.name,
        mimeType: file.type || "image/png",
        sizeBytes: file.size,
      });

      await uploadWithProgress({
        url: upload.uploadUrl,
        file,
        contentType: file.type || "application/octet-stream",
        onProgress: tracker.update,
      });

      setForm((current) => ({
        ...current,
        imageObjectKey: upload.objectKey,
        imageUrl: localPreview,
      }));
      tracker.succeed("Image uploaded");
      toast.success("Image uploaded.");
    } catch (error) {
      URL.revokeObjectURL(localPreview);
      setForm((current) => ({ ...current, imageObjectKey: null, imageUrl: null }));
      const message = error instanceof Error ? error.message : "Failed to upload image.";
      tracker.fail(message);
      toast.error(message);
    } finally {
      setUploading(false);
    }
  }

  if (methodsQuery.isLoading) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-xl border border-zinc-200 bg-white">
        <LoaderCircleIcon className="size-5 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (methodsQuery.isError || !methodsQuery.data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        Failed to load payment methods.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        <div className="flex justify-end">
          <Button onClick={() => setDialogOpen(true)}>
            <PlusIcon className="size-4" />
            New Payment Method
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {methodsQuery.data.map((method) => (
            <button
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white text-left shadow-sm transition hover:border-zinc-300"
              key={method.id}
              onClick={() => {
                setForm({
                  paymentMethodId: method.id,
                  name: method.name,
                  methodType: method.methodType,
                  imageObjectKey: method.imageObjectKey,
                  imageUrl: method.imageUrl,
                  currency: method.currency ?? "",
                  instructions: method.instructions ?? "",
                  paymentUrl: method.paymentUrl ?? "",
                  accountName: method.accountName ?? "",
                  accountNumberMask: method.accountNumberMask ?? "",
                  routingNumberMask: method.routingNumberMask ?? "",
                  bankName: method.bankName ?? "",
                  isActive: method.isActive,
                });
                setDialogOpen(true);
              }}
              type="button"
            >
              <div className="flex aspect-square items-center justify-center bg-[linear-gradient(135deg,#fff7d1,#f4f1ea)]">
                {method.imageUrl ? (
                  <img alt={method.name} className="h-full w-full object-cover" src={method.imageUrl} />
                ) : (
                  <CreditCardIcon className="size-10 text-zinc-500" />
                )}
              </div>
              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold text-zinc-950">{method.name}</div>
                    <div className="mt-1 text-sm text-zinc-600">
                      {method.methodType.replaceAll("_", " ")}
                    </div>
                  </div>
                  <Badge variant={method.isActive ? "default" : "outline"}>
                    {method.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm text-zinc-600">
                  {method.bankName ? <div>{method.bankName}</div> : null}
                  {method.accountName ? <div>{method.accountName}</div> : null}
                  {method.accountNumberMask ? <div>{method.accountNumberMask}</div> : null}
                  {method.paymentUrl ? <div className="truncate">{method.paymentUrl}</div> : null}
                  {method.instructions ? (
                    <p className="line-clamp-3 leading-6 text-zinc-600">{method.instructions}</p>
                  ) : null}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{form.paymentMethodId ? "Edit payment method" : "Create payment method"}</DialogTitle>
            <DialogDescription>
              Configure a reusable payment method card that can be attached to project invoices.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                <div className="flex aspect-square items-center justify-center bg-[linear-gradient(135deg,#fff7d1,#f4f1ea)]">
                  {form.imageUrl ? (
                    <img alt={form.name || "Payment method"} className="h-full w-full object-cover" src={form.imageUrl} />
                  ) : (
                    <CreditCardIcon className="size-10 text-zinc-500" />
                  )}
                </div>
                <div className="space-y-3 p-4">
                  <div className="text-lg font-semibold text-zinc-950">{form.name || "Untitled method"}</div>
                  <div className="text-sm text-zinc-600">
                    {form.methodType.replaceAll("_", " ")}
                  </div>
                  <div className="text-sm text-zinc-600">{methodSubtitle || "No payment summary yet."}</div>
                </div>
              </div>

              <Dropzone
                accept={{ "image/*": [] }}
                className="min-h-[160px] border-dashed"
                disabled={busy}
                maxFiles={1}
                maxSize={10 * 1024 * 1024}
                onDrop={(acceptedFiles) => void handleImageDrop(acceptedFiles)}
                src={undefined}
              >
                {form.imageUrl ? (
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="overflow-hidden rounded-lg border border-zinc-200">
                      <img
                        alt={form.name || "Payment method"}
                        className="h-24 w-24 object-cover"
                        src={form.imageUrl}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-zinc-900">Replace image</div>
                      <div className="text-xs text-zinc-500">
                        Drag and drop or click to upload a new card image.
                      </div>
                    </div>
                  </div>
                ) : (
                  <DropzoneEmptyState />
                )}
              </Dropzone>
              <div className="text-xs text-zinc-500">PNG, JPG, or WEBP. Max 10MB.</div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Method type</Label>
                  <Select
                    value={form.methodType}
                    onValueChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        methodType: value as PaymentMethodFormState["methodType"],
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stripe_payment_link">Stripe Payment Link</SelectItem>
                      <SelectItem value="us_wire_transfer">US Wire Transfer</SelectItem>
                      <SelectItem value="lk_bank_transfer">Sri Lankan Bank Transfer</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Input
                    placeholder="USD"
                    value={form.currency}
                    onChange={(event) => setForm((current) => ({ ...current, currency: event.target.value }))}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3">
                  <div>
                    <div className="text-sm font-medium text-zinc-900">Active</div>
                    <div className="text-sm text-zinc-600">Available in project billing flows.</div>
                  </div>
                  <Switch
                    checked={form.isActive}
                    onCheckedChange={(checked) => setForm((current) => ({ ...current, isActive: checked }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Payment URL</Label>
                <Input
                  placeholder="https://buy.stripe.com/..."
                  value={form.paymentUrl}
                  onChange={(event) => setForm((current) => ({ ...current, paymentUrl: event.target.value }))}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Bank name</Label>
                  <Input
                    value={form.bankName}
                    onChange={(event) => setForm((current) => ({ ...current, bankName: event.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Account name</Label>
                  <Input
                    value={form.accountName}
                    onChange={(event) => setForm((current) => ({ ...current, accountName: event.target.value }))}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Account detail</Label>
                  <Input
                    placeholder="Account number or mask"
                    value={form.accountNumberMask}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, accountNumberMask: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Routing / branch detail</Label>
                  <Input
                    value={form.routingNumberMask}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, routingNumberMask: event.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Instructions</Label>
                <Textarea
                  rows={5}
                  value={form.instructions}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, instructions: event.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={busy}
              onClick={() => {
                const payload = {
                  name: form.name,
                  methodType: form.methodType,
                  imageObjectKey: form.imageObjectKey,
                  currency: form.currency || null,
                  instructions: form.instructions || null,
                  paymentUrl: form.paymentUrl || null,
                  accountName: form.accountName || null,
                  accountNumberMask: form.accountNumberMask || null,
                  routingNumberMask: form.routingNumberMask || null,
                  bankName: form.bankName || null,
                  isActive: form.isActive,
                };

                if (form.paymentMethodId) {
                  updateMutation.mutate({
                    paymentMethodId: form.paymentMethodId,
                    ...payload,
                  });
                  return;
                }

                createMutation.mutate(payload);
              }}
            >
              {busy ? "Saving..." : form.paymentMethodId ? "Save changes" : "Create payment method"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
