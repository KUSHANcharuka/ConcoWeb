"use client";

import { useEffect, useState } from "react";
import { LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { api } from "~/trpc/react";

export function WebhookDetailPageClient({ productId }: { productId: string }) {
  const utils = api.useUtils();
  const detailQuery = api.admin.settingsBilling.webhookByProduct.useQuery({ productId });
  const upsertMutation = api.admin.settingsBilling.upsertWebhookConfig.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.admin.settingsBilling.webhookByProduct.invalidate({ productId }),
        utils.admin.settingsBilling.webhooks.invalidate(),
        utils.admin.settingsBilling.page.invalidate(),
      ]);
      toast.success("Webhook configuration saved.");
    },
    onError: (error) => toast.error(error.message),
  });

  const [form, setForm] = useState({
    webhookUrl: "",
    webhookSecret: "",
    reconcileUrl: "",
    reconcileMode: "manual" as "none" | "manual" | "periodic_pull" | "push",
    isActive: true,
    payloadTemplate: "{\n  \"projectId\": \"{{projectId}}\",\n  \"invoiceId\": \"{{invoiceId}}\"\n}",
  });
  const [creatingWebhook, setCreatingWebhook] = useState(false);

  useEffect(() => {
    const config = detailQuery.data?.product;
    if (!config) return;
    setCreatingWebhook(Boolean(config.isConfigured));
    setForm({
      webhookUrl: config.webhookUrl ?? "",
      webhookSecret: config.webhookSecret ?? "",
      reconcileUrl: config.reconcileUrl ?? "",
      reconcileMode: config.reconcileMode ?? "manual",
      isActive: config.isActive ?? false,
      payloadTemplate: JSON.stringify(config.payloadTemplate ?? {}, null, 2),
    });
  }, [detailQuery.data?.product]);

  if (detailQuery.isLoading) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-xl border border-zinc-200 bg-white">
        <LoaderCircleIcon className="size-5 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (detailQuery.isError || !detailQuery.data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        Failed to load the webhook dashboard.
      </div>
    );
  }

  const { product, summary, logs } = detailQuery.data;
  const showWebhookForm = product.isConfigured || creatingWebhook;

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-zinc-900">Webhook configuration</div>
              <div className="mt-1 text-sm text-zinc-600">
                Product-scoped delivery endpoint for {product.productName}.
              </div>
            </div>
            <Badge variant={product.isActive ? "default" : "outline"}>
              {product.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          {!showWebhookForm ? (
            <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6">
              <div className="max-w-xl space-y-3">
                <h3 className="text-lg font-semibold text-zinc-950">No webhook created yet</h3>
                <p className="text-sm leading-7 text-zinc-600">
                  This product exists, but no webhook configuration has been created yet. Create
                  it here to define the endpoint, secret, reconcile behavior, and payload shape.
                </p>
                <div className="pt-2">
                  <Button onClick={() => setCreatingWebhook(true)}>Create Webhook</Button>
                </div>
              </div>
            </div>
          ) : (
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <Input
                  value={form.webhookUrl}
                  onChange={(event) => setForm((current) => ({ ...current, webhookUrl: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Webhook secret</Label>
                <Input
                  placeholder={product.webhookSecretMasked ?? "No secret configured"}
                  value={form.webhookSecret}
                  onChange={(event) => setForm((current) => ({ ...current, webhookSecret: event.target.value }))}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Reconcile URL</Label>
                <Input
                  value={form.reconcileUrl}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, reconcileUrl: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Reconcile mode</Label>
                <Select
                  value={form.reconcileMode}
                  onValueChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      reconcileMode: value as "none" | "manual" | "periodic_pull" | "push",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="periodic_pull">Periodic Pull</SelectItem>
                    <SelectItem value="push">Push</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payload template</Label>
              <Textarea
                className="min-h-[180px] font-mono text-xs"
                value={form.payloadTemplate}
                onChange={(event) =>
                  setForm((current) => ({ ...current, payloadTemplate: event.target.value }))
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3">
              <div>
                <div className="text-sm font-medium text-zinc-900">Webhook active</div>
                <div className="text-sm text-zinc-600">
                  Controls whether this product can emit billing lifecycle webhooks.
                </div>
              </div>
              <Switch
                checked={form.isActive}
                onCheckedChange={(checked) => setForm((current) => ({ ...current, isActive: checked }))}
              />
            </div>

            <div className="flex justify-end">
              <Button
                disabled={upsertMutation.isPending}
                onClick={() => {
                  let payloadTemplate: Record<string, unknown> = {};
                  try {
                    payloadTemplate = JSON.parse(form.payloadTemplate) as Record<string, unknown>;
                  } catch {
                    toast.error("Payload template must be valid JSON.");
                    return;
                  }

                  upsertMutation.mutate({
                    productId,
                    webhookUrl: form.webhookUrl || null,
                    webhookSecret: form.webhookSecret || null,
                    reconcileUrl: form.reconcileUrl || null,
                    reconcileMode: form.reconcileMode,
                    isActive: form.isActive,
                    payloadTemplate,
                  });
                }}
              >
                {upsertMutation.isPending
                  ? "Saving..."
                  : product.isConfigured
                    ? "Save configuration"
                    : "Create webhook"}
              </Button>
            </div>
          </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Deliveries</div>
              <div className="mt-2 text-3xl font-semibold text-zinc-950">{summary.totalDeliveries}</div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Last success</div>
              <div className="mt-2 text-sm text-zinc-950">
                {summary.lastSuccessAt
                  ? new Date(summary.lastSuccessAt).toLocaleString()
                  : "No successful delivery yet"}
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Last failure</div>
              <div className="mt-2 text-sm text-zinc-950">
                {summary.lastFailureAt
                  ? new Date(summary.lastFailureAt).toLocaleString()
                  : "No failed delivery yet"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold text-zinc-900">Recent deliveries</div>
        <div className="mt-4 space-y-3">
          {logs.length === 0 ? (
            <div className="text-sm text-zinc-500">No webhook delivery logs yet.</div>
          ) : (
            logs.map((log) => (
              <div
                className="grid gap-3 rounded-lg border border-zinc-200 p-4 lg:grid-cols-[140px_minmax(0,1fr)_120px_180px]"
                key={log.id}
              >
                <Badge
                  className="justify-center"
                  variant={log.deliveryStatus === "success" ? "default" : "outline"}
                >
                  {log.deliveryStatus}
                </Badge>
                <div className="min-w-0">
                  <div className="font-medium text-zinc-900">{log.eventType}</div>
                  <div className="mt-1 truncate text-sm text-zinc-600">
                    {log.endpointUrl ?? "No endpoint captured"}
                  </div>
                  {log.responseSummary ? (
                    <div className="mt-1 text-sm text-zinc-600">{log.responseSummary}</div>
                  ) : null}
                </div>
                <div className="text-sm text-zinc-700">
                  {log.httpStatus ? `HTTP ${log.httpStatus}` : "No response"}
                </div>
                <div className="text-sm text-zinc-700">
                  {new Date(log.occurredAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
