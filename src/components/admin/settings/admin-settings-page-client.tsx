"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LoaderCircleIcon, SaveIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "~/trpc/react";

const templateTypes = ["welcome", "proposal", "payment_reminder", "invoice", "general_outreach"] as const;

export function AdminSettingsPageClient({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const utils = api.useUtils();
  const settingsQuery = api.admin.emails.settings.get.useQuery();
  const templatesQuery = api.admin.emails.templates.list.useQuery({
    search: "",
    status: "active",
    includeArchived: false,
  });
  const updateSettings = api.admin.emails.settings.update.useMutation({
    onSuccess: async () => {
      await utils.admin.emails.settings.get.invalidate();
    },
  });
  const setAssignment = api.admin.emails.templates.setAssignment.useMutation({
    onSuccess: async () => {
      await utils.admin.emails.settings.get.invalidate();
    },
  });
  const [form, setForm] = useState({
    fromName: "Concolabs",
    fromEmail: "hello@concolabs.com",
    replyToEmail: "hello@concolabs.com",
    footerCompanyName: "Concolabs",
    footerAddress: "",
    footerContactEmail: "hello@concolabs.com",
    logoUrl: "",
    requestNotificationEmails: [] as string[],
    cronCadenceHours: 24,
  });

  useEffect(() => {
    const settings = settingsQuery.data?.settings;
    if (!settings) return;
    setForm({
      fromName: settings.fromName ?? "Concolabs",
      fromEmail: settings.fromEmail ?? "hello@concolabs.com",
      replyToEmail: settings.replyToEmail ?? "hello@concolabs.com",
      footerCompanyName: settings.footerCompanyName ?? "Concolabs",
      footerAddress: settings.footerAddress ?? "",
      footerContactEmail: settings.footerContactEmail ?? "hello@concolabs.com",
      logoUrl: settings.logoUrl ?? "",
      requestNotificationEmails: settings.requestNotificationEmails ?? [],
      cronCadenceHours: settings.cronCadenceHours,
    });
  }, [settingsQuery.data?.settings]);

  async function handleSave() {
    await updateSettings.mutateAsync({
      fromName: form.fromName,
      fromEmail: form.fromEmail,
      replyToEmail: form.replyToEmail,
      requestNotificationEmails: form.requestNotificationEmails,
      starterLayoutJson:
        (settingsQuery.data?.settings.starterLayoutJson as Record<string, unknown> | undefined) ??
        {},
      footerCompanyName: form.footerCompanyName,
      footerAddress: form.footerAddress || null,
      footerContactEmail: form.footerContactEmail,
      logoUrl: form.logoUrl || null,
      cronCadenceHours: form.cronCadenceHours,
    });
  }

  const readiness = settingsQuery.data?.readiness;

  return (
    <div className={embedded ? "space-y-8" : "mx-auto max-w-7xl px-8 py-10"}>
      {!embedded ? (
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
            Settings
          </p>
          <h1 className="mt-2 font-serif text-4xl leading-tight text-zinc-950">
            Email defaults.
          </h1>
          <p className="mt-3 text-base leading-7 text-zinc-600">
            Keep template defaults and suggestion scheduling clean. Template authoring now lives in the Emails workspace.
          </p>
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <section className="border border-zinc-200 bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">Template authoring</h2>
                <p className="mt-1 text-sm leading-6 text-zinc-600">
                  The starter layout and all reusable email templates are now edited from the Emails workspace with the preview/editor UI.
                </p>
              </div>
              <Button asChild type="button" variant="outline">
                <Link href="/admin/emails">Open Emails</Link>
              </Button>
            </div>
          </section>

          <section className="border border-zinc-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-zinc-950">Sender identity</h2>
            <div className="mt-4 grid gap-4">
              <div>
                <label className="text-sm font-medium text-zinc-700">From name</label>
                <Input
                  className="mt-1"
                  onChange={(event) => setForm((current) => ({ ...current, fromName: event.target.value }))}
                  value={form.fromName}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700">From email</label>
                <Input
                  className="mt-1"
                  onChange={(event) => setForm((current) => ({ ...current, fromEmail: event.target.value }))}
                  value={form.fromEmail}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700">Reply-to email</label>
                <Input
                  className="mt-1"
                  onChange={(event) => setForm((current) => ({ ...current, replyToEmail: event.target.value }))}
                  value={form.replyToEmail}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700">Footer company name</label>
                <Input
                  className="mt-1"
                  onChange={(event) => setForm((current) => ({ ...current, footerCompanyName: event.target.value }))}
                  value={form.footerCompanyName}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700">Footer address</label>
                <Textarea
                  className="mt-1 min-h-[90px]"
                  onChange={(event) => setForm((current) => ({ ...current, footerAddress: event.target.value }))}
                  value={form.footerAddress}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700">Footer contact email</label>
                <Input
                  className="mt-1"
                  onChange={(event) => setForm((current) => ({ ...current, footerContactEmail: event.target.value }))}
                  value={form.footerContactEmail}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700">Logo URL</label>
                <Input
                  className="mt-1"
                  onChange={(event) => setForm((current) => ({ ...current, logoUrl: event.target.value }))}
                  placeholder="https://assets.example.com/logo.png"
                  value={form.logoUrl}
                />
              </div>
              <p className="text-xs leading-6 text-zinc-500">
                The sender email must match the verified sender policy configured in the server environment.
              </p>
            </div>
          </section>

          <section className="border border-zinc-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-zinc-950">Template defaults</h2>
            <div className="mt-4 space-y-4">
              {templateTypes.map((type) => {
                const current = settingsQuery.data?.assignments.find((assignment) => assignment.templateType === type && !assignment.projectId);
                return (
                  <div key={type}>
                    <label className="text-sm font-medium text-zinc-700">{type}</label>
                    <select
                      className="mt-1 h-10 w-full border border-zinc-200 bg-white px-3 text-sm"
                      value={current?.templateId ?? ""}
                      onChange={(event) => {
                        if (!event.target.value) return;
                        setAssignment.mutate({
                          templateType: type,
                          templateId: event.target.value,
                          projectId: null,
                        });
                      }}
                    >
                      <option value="">No default</option>
                      {templatesQuery.data
                        ?.filter((template) => template.templateType === type)
                        .map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.name}
                          </option>
                        ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="border border-zinc-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-zinc-950">Resend readiness</h2>
            <div className="mt-4 space-y-3 text-sm text-zinc-600">
              <div>Provider secret: {readiness?.providerSecretPresent ? "configured" : "missing"}</div>
              <div>Webhook secret: {readiness?.webhookSecretPresent ? "configured" : "missing"}</div>
              <div>Sender policy: {readiness?.senderPolicyConfigured ? "configured" : "missing"}</div>
              <div>Sender valid: {readiness?.senderPolicyValid ? "yes" : "no"}</div>
              <div>Webhook endpoint: {readiness?.webhookEndpointConfigured ? "ready" : "missing secret"}</div>
              <div>Can send: {readiness?.canSend ? "yes" : "no"}</div>
              <div>Last successful send: {readiness?.lastSuccessfulSendAt ? new Date(readiness.lastSuccessfulSendAt).toLocaleString() : "never"}</div>
              <div>Last webhook receipt: {readiness?.lastWebhookReceivedAt ? new Date(readiness.lastWebhookReceivedAt).toLocaleString() : "never"}</div>
              {readiness?.allowedFromDomains?.length ? (
                <div>Allowed domains: {readiness.allowedFromDomains.join(", ")}</div>
              ) : null}
              {readiness?.allowedFromEmails?.length ? (
                <div>Allowed emails: {readiness.allowedFromEmails.join(", ")}</div>
              ) : null}
              {readiness?.errors?.length ? (
                <div className="rounded border border-red-200 bg-red-50 p-3 text-red-700">
                  {readiness.errors.join(" ")}
                </div>
              ) : null}
            </div>
          </section>

          <section className="border border-zinc-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-zinc-950">Suggestion cron</h2>
            <div className="mt-4 space-y-3">
              <label className="text-sm font-medium text-zinc-700">Cadence hours</label>
              <select
                className="h-10 w-full border border-zinc-200 bg-white px-3 text-sm"
                value={form.cronCadenceHours}
                onChange={(event) => setForm({ ...form, cronCadenceHours: Number(event.target.value) })}
              >
                <option value={12}>12 hours</option>
                <option value={24}>24 hours</option>
              </select>
              <div className="rounded border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-600">
                <div>Status: {settingsQuery.data?.lastRun?.status ?? "never run"}</div>
                <div>Created: {settingsQuery.data?.lastRun?.createdDraftCount ?? 0}</div>
                <div>Skipped: {settingsQuery.data?.lastRun?.skippedDuplicateCount ?? 0}</div>
                {settingsQuery.data?.lastRun?.errorMessage ? (
                  <div className="text-red-600">{settingsQuery.data.lastRun.errorMessage}</div>
                ) : null}
              </div>
              <Textarea
                className="min-h-[120px]"
                onChange={(event) =>
                  setForm({
                    ...form,
                    requestNotificationEmails: event.target.value
                      .split("\n")
                      .map((value) => value.trim())
                      .filter(Boolean),
                  })
                }
                placeholder={"ops@concolabs.com\nowners@concolabs.com"}
                value={form.requestNotificationEmails.join("\n")}
              />
              <p className="text-xs leading-6 text-zinc-500">
                One email per line. These recipients receive new project request and feature request notifications.
              </p>
              <Button className="w-full" disabled={updateSettings.isPending} onClick={handleSave} type="button">
                {updateSettings.isPending ? <LoaderCircleIcon className="size-4 animate-spin" /> : <SaveIcon className="size-4" />}
                Save Email Defaults
              </Button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
