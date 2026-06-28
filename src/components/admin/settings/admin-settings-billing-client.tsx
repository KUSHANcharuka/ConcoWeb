"use client";

import { useState } from "react";
import { LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { api } from "~/trpc/react";

export function AdminSettingsBillingClient() {
  const utils = api.useUtils();
  const settingsQuery = api.admin.settingsBilling.page.useQuery();
  const createTemplate = api.admin.settingsBilling.createTemplate.useMutation({
    onSuccess: async () => {
      await utils.admin.settingsBilling.page.invalidate();
      toast.success("Template created.");
    },
    onError: (error) => toast.error(error.message),
  });
  const createMethod = api.admin.settingsBilling.createPaymentMethod.useMutation({
    onSuccess: async () => {
      await utils.admin.settingsBilling.page.invalidate();
      toast.success("Payment method created.");
    },
    onError: (error) => toast.error(error.message),
  });
  const upsertWebhook = api.admin.settingsBilling.upsertWebhookConfig.useMutation({
    onSuccess: async () => {
      await utils.admin.settingsBilling.page.invalidate();
      toast.success("Webhook configuration saved.");
    },
    onError: (error) => toast.error(error.message),
  });

  const [templateName, setTemplateName] = useState("");
  const [templateType, setTemplateType] = useState<"invoice" | "agreement">("invoice");
  const [templateContent, setTemplateContent] = useState("");

  const [methodName, setMethodName] = useState("");
  const [methodType, setMethodType] =
    useState<"stripe_payment_link" | "us_wire_transfer" | "lk_bank_transfer" | "manual">(
      "stripe_payment_link",
    );
  const [methodInstructions, setMethodInstructions] = useState("");
  const [methodUrl, setMethodUrl] = useState("");

  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [reconcileUrl, setReconcileUrl] = useState("");
  const [reconcileMode, setReconcileMode] =
    useState<"manual" | "none" | "periodic_pull" | "push">("manual");

  if (settingsQuery.isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-zinc-200 bg-white">
        <LoaderCircleIcon className="size-5 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (settingsQuery.isError || !settingsQuery.data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        Failed to load settings.
      </div>
    );
  }

  const { paymentMethods, templates, webhooks } = settingsQuery.data;
  const selectedWebhook = webhooks.find((item) => item.productId === selectedProductId);

  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
          Settings
        </p>
        <h1 className="mt-2 font-serif text-4xl text-zinc-950">Billing settings.</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Shared workspace configuration for project billing. These tabs back the
          per-project billing flows rather than duplicating setup inside each project.
        </p>
      </div>

      <Tabs className="gap-6" defaultValue="templates">
        <TabsList className="h-auto rounded-full border border-zinc-200 bg-white p-1">
          <TabsTrigger className="rounded-full px-4" value="templates">
            Templates
          </TabsTrigger>
          <TabsTrigger className="rounded-full px-4" value="payment-methods">
            Payment Methods
          </TabsTrigger>
          <TabsTrigger className="rounded-full px-4" value="webhooks">
            Webhooks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-4">
              {templates.map((template) => (
                <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm" key={template.id}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-zinc-900">{template.name}</div>
                      <div className="text-xs uppercase tracking-wide text-zinc-500">
                        {template.templateType}
                      </div>
                    </div>
                    {template.isDefault ? (
                      <span className="rounded-full bg-zinc-950 px-3 py-1 text-xs text-white">
                        Default
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 line-clamp-6 text-sm leading-6 text-zinc-600">
                    {template.content}
                  </p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-medium text-zinc-900">New Template</div>
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label>Template Name</Label>
                  <Input onChange={(e) => setTemplateName(e.target.value)} value={templateName} />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select onValueChange={(value) => setTemplateType(value as "invoice" | "agreement")} value={templateType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="invoice">Invoice</SelectItem>
                      <SelectItem value="agreement">Agreement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    onChange={(e) => setTemplateContent(e.target.value)}
                    rows={10}
                    value={templateContent}
                  />
                </div>
                <Button
                  className="w-full"
                  disabled={createTemplate.isPending}
                  onClick={() =>
                    void createTemplate.mutateAsync({
                      name: templateName,
                      templateType,
                      content: templateContent,
                    })
                  }
                >
                  Save Template
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payment-methods">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm" key={method.id}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-zinc-900">{method.name}</div>
                      <div className="text-xs uppercase tracking-wide text-zinc-500">
                        {method.methodType.replaceAll("_", " ")}
                      </div>
                    </div>
                    <span className="text-xs text-zinc-500">
                      {method.currency ?? "Any currency"}
                    </span>
                  </div>
                  {method.instructions ? (
                    <p className="mt-3 text-sm leading-6 text-zinc-600">{method.instructions}</p>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-medium text-zinc-900">New Payment Method</div>
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input onChange={(e) => setMethodName(e.target.value)} value={methodName} />
                </div>
                <div className="space-y-2">
                  <Label>Method Type</Label>
                  <Select
                    onValueChange={(value) =>
                      setMethodType(
                        value as
                          | "stripe_payment_link"
                          | "us_wire_transfer"
                          | "lk_bank_transfer"
                          | "manual",
                      )
                    }
                    value={methodType}
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
                <div className="space-y-2">
                  <Label>Instructions</Label>
                  <Textarea
                    onChange={(e) => setMethodInstructions(e.target.value)}
                    rows={5}
                    value={methodInstructions}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Payment URL</Label>
                  <Input onChange={(e) => setMethodUrl(e.target.value)} value={methodUrl} />
                </div>
                <Button
                  className="w-full"
                  disabled={createMethod.isPending}
                  onClick={() =>
                    void createMethod.mutateAsync({
                      name: methodName,
                      methodType,
                      instructions: methodInstructions || null,
                      paymentUrl: methodUrl || null,
                    })
                  }
                >
                  Save Payment Method
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="webhooks">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-4">
              {webhooks.map((webhook) => (
                <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm" key={webhook.productId}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-zinc-900">{webhook.productName}</div>
                      <div className="text-xs uppercase tracking-wide text-zinc-500">
                        {webhook.productSlug}
                      </div>
                    </div>
                    <span className="text-xs text-zinc-500">
                      {webhook.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="mt-3 space-y-1 text-sm text-zinc-600">
                    <div>Webhook: {webhook.webhookUrl ?? "Not configured"}</div>
                    <div>Reconcile: {webhook.reconcileUrl ?? "Not configured"}</div>
                    <div>Mode: {webhook.reconcileMode ?? "manual"}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-medium text-zinc-900">Product Webhook Config</div>
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label>Product</Label>
                  <Select
                    onValueChange={(value) => {
                      setSelectedProductId(value);
                      const match = webhooks.find((item) => item.productId === value);
                      setWebhookUrl(match?.webhookUrl ?? "");
                      setWebhookSecret(match?.webhookSecret ?? "");
                      setReconcileUrl(match?.reconcileUrl ?? "");
                      setReconcileMode(
                        (match?.reconcileMode as "manual" | "none" | "periodic_pull" | "push") ??
                          "manual",
                      );
                    }}
                    value={selectedProductId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {webhooks.map((webhook) => (
                        <SelectItem key={webhook.productId} value={webhook.productId}>
                          {webhook.productName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Webhook URL</Label>
                  <Input onChange={(e) => setWebhookUrl(e.target.value)} value={webhookUrl} />
                </div>
                <div className="space-y-2">
                  <Label>Webhook Secret</Label>
                  <Input onChange={(e) => setWebhookSecret(e.target.value)} value={webhookSecret} />
                </div>
                <div className="space-y-2">
                  <Label>Reconcile URL</Label>
                  <Input onChange={(e) => setReconcileUrl(e.target.value)} value={reconcileUrl} />
                </div>
                <div className="space-y-2">
                  <Label>Reconcile Mode</Label>
                  <Select
                    onValueChange={(value) =>
                      setReconcileMode(
                        value as "manual" | "none" | "periodic_pull" | "push",
                      )
                    }
                    value={reconcileMode}
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
                <Button
                  className="w-full"
                  disabled={upsertWebhook.isPending || !selectedProductId}
                  onClick={() =>
                    void upsertWebhook.mutateAsync({
                      productId: selectedProductId,
                      webhookUrl: webhookUrl || null,
                      webhookSecret: webhookSecret || null,
                      reconcileUrl: reconcileUrl || null,
                      reconcileMode,
                      isActive: true,
                      payloadTemplate:
                        selectedWebhook?.configId
                          ? { mode: "stable-envelope" }
                          : { mode: "stable-envelope" },
                    })
                  }
                >
                  Save Webhook Config
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
