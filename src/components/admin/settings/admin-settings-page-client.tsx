"use client";

import { useEffect, useState } from "react";
import { LoaderCircleIcon, SaveIcon, SettingsIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "~/trpc/react";

const templateTypes = ["welcome", "proposal", "payment_reminder", "invoice", "general_outreach"] as const;

function safeJson(value: string) {
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return { blocks: [{ type: "heading", value: "A note from Concolabs" }] };
  }
}

export function AdminSettingsPageClient() {
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
    cronCadenceHours: 24,
    starterLayoutJson: "{}",
  });

  useEffect(() => {
    const settings = settingsQuery.data?.settings;
    if (!settings) return;
    setForm({
      fromName: settings.fromName,
      fromEmail: settings.fromEmail,
      replyToEmail: settings.replyToEmail,
      footerCompanyName: settings.footerCompanyName,
      footerAddress: settings.footerAddress ?? "",
      footerContactEmail: settings.footerContactEmail,
      logoUrl: settings.logoUrl ?? "",
      cronCadenceHours: settings.cronCadenceHours,
      starterLayoutJson: JSON.stringify(settings.starterLayoutJson, null, 2),
    });
  }, [settingsQuery.data?.settings]);

  async function handleSave() {
    await updateSettings.mutateAsync({
      fromName: form.fromName,
      fromEmail: form.fromEmail,
      replyToEmail: form.replyToEmail,
      footerCompanyName: form.footerCompanyName,
      footerAddress: form.footerAddress || null,
      footerContactEmail: form.footerContactEmail,
      logoUrl: form.logoUrl || null,
      cronCadenceHours: form.cronCadenceHours,
      starterLayoutJson: safeJson(form.starterLayoutJson),
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
          Settings
        </p>
        <h1 className="mt-2 font-serif text-4xl leading-tight text-zinc-950">
          Workspace settings.
        </h1>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          Configure outbound email identity, starter layout, template defaults, and scheduled suggestion status.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <section className="border border-zinc-200 bg-white p-5">
            <div className="mb-5 flex items-center gap-2">
              <SettingsIcon className="size-5 text-zinc-500" />
              <h2 className="text-lg font-semibold text-zinc-950">Email identity</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input value={form.fromName} onChange={(event) => setForm({ ...form, fromName: event.target.value })} placeholder="From name" />
              <Input value={form.fromEmail} onChange={(event) => setForm({ ...form, fromEmail: event.target.value })} placeholder="From email" />
              <Input value={form.replyToEmail} onChange={(event) => setForm({ ...form, replyToEmail: event.target.value })} placeholder="Reply-to email" />
              <Input value={form.logoUrl} onChange={(event) => setForm({ ...form, logoUrl: event.target.value })} placeholder="Logo URL" />
            </div>
          </section>

          <section className="border border-zinc-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-zinc-950">Starter layout and footer</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Input value={form.footerCompanyName} onChange={(event) => setForm({ ...form, footerCompanyName: event.target.value })} placeholder="Footer company" />
              <Input value={form.footerContactEmail} onChange={(event) => setForm({ ...form, footerContactEmail: event.target.value })} placeholder="Footer email" />
            </div>
            <Textarea className="mt-4" value={form.footerAddress} onChange={(event) => setForm({ ...form, footerAddress: event.target.value })} placeholder="Footer address" />
            <Textarea className="mt-4 min-h-[260px] font-mono text-xs" value={form.starterLayoutJson} onChange={(event) => setForm({ ...form, starterLayoutJson: event.target.value })} />
            <Button className="mt-4" disabled={updateSettings.isPending} onClick={handleSave} type="button">
              {updateSettings.isPending ? <LoaderCircleIcon className="size-4 animate-spin" /> : <SaveIcon className="size-4" />}
              Save Email Settings
            </Button>
          </section>
        </div>

        <aside className="space-y-6">
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
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
