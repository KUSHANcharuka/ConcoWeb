"use client";

import { useEffect, useMemo, useState } from "react";
import { LoaderCircleIcon, SaveIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { api } from "~/trpc/react";

type ReminderWindowKey =
  | "t_minus_7d"
  | "t_minus_1d"
  | "day_of"
  | "plus_1d"
  | "plus_3d"
  | "plus_7d";

type TemplateMap = Record<string, { title: string; body: string }>;
type EmailTemplateMap = Record<string, { subject: string; body: string }>;

type FormState = {
  timezone: string;
  cadenceMinutes: number;
  paymentRemindersEnabled: boolean;
  accessRemindersEnabled: boolean;
  paymentReminderWindows: ReminderWindowKey[];
  accessReminderWindows: ReminderWindowKey[];
  inAppTemplates: TemplateMap;
  emailDraftTemplates: EmailTemplateMap;
};

const previewValues = {
  clientName: "Acme Homes",
  projectName: "Lakeside Villa",
  invoiceTitle: "June Progress Invoice",
  amount: "150,000.00",
  currency: "LKR",
  dueDate: "2026-07-07",
  accessExpiryDate: "2026-07-07",
  portalUrl: "https://app.concolabs.com/client-portal/projects/alpha/payments",
};

function renderPreview(template: string) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, token: string) => {
    return previewValues[token as keyof typeof previewValues] ?? "";
  });
}

function buildWindowLabel(window: ReminderWindowKey) {
  switch (window) {
    case "t_minus_7d":
      return "7 days before";
    case "t_minus_1d":
      return "1 day before";
    case "day_of":
      return "Day of at 8:00 AM";
    case "plus_1d":
      return "1 day after";
    case "plus_3d":
      return "3 days after";
    case "plus_7d":
      return "7 days after";
  }
}

function familyWindowKeys(prefix: "payment" | "access") {
  return [
    `${prefix}.t_minus_7d`,
    `${prefix}.t_minus_1d`,
    `${prefix}.day_of`,
    `${prefix}.plus_1d`,
    `${prefix}.plus_3d`,
    `${prefix}.plus_7d`,
  ] as const;
}

export function AdminNotificationSettingsPageClient() {
  const utils = api.useUtils();
  const settingsQuery = api.admin.notificationSettings.get.useQuery();
  const defaultsQuery = api.admin.notificationSettings.getDefaults.useQuery();
  const updateMutation = api.admin.notificationSettings.update.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.admin.notificationSettings.get.invalidate(),
        utils.admin.notificationSettings.getDefaults.invalidate(),
      ]);
      toast.success("Cron notification settings updated.");
    },
    onError: (error) => toast.error(error.message),
  });

  const [form, setForm] = useState<FormState | null>(null);

  useEffect(() => {
    if (!settingsQuery.data?.settings || !defaultsQuery.data) return;

    setForm({
      timezone: settingsQuery.data.settings.timezone,
      cadenceMinutes: settingsQuery.data.settings.cadenceMinutes,
      paymentRemindersEnabled: settingsQuery.data.settings.paymentRemindersEnabled,
      accessRemindersEnabled: settingsQuery.data.settings.accessRemindersEnabled,
      paymentReminderWindows:
        settingsQuery.data.settings.paymentReminderWindows as ReminderWindowKey[],
      accessReminderWindows:
        settingsQuery.data.settings.accessReminderWindows as ReminderWindowKey[],
      inAppTemplates: {
        ...defaultsQuery.data.defaultInAppTemplates,
        ...settingsQuery.data.settings.inAppTemplates,
      },
      emailDraftTemplates: {
        ...defaultsQuery.data.defaultEmailDraftTemplates,
        ...settingsQuery.data.settings.emailDraftTemplates,
      },
    });
  }, [defaultsQuery.data, settingsQuery.data?.settings]);

  const lastRun = settingsQuery.data?.lastRun ?? null;
  const schedulerSummary = useMemo(
    () => [
      {
        label: "Timezone",
        value: form?.timezone ?? "Asia/Colombo",
      },
      {
        label: "Cadence",
        value: `${form?.cadenceMinutes ?? 60} minute(s)`,
      },
      {
        label: "Last run",
        value: lastRun?.startedAt
          ? new Date(lastRun.startedAt).toLocaleString()
          : "No runs yet",
      },
      {
        label: "Last status",
        value: lastRun?.status ?? "Awaiting first cron run",
      },
    ],
    [form?.cadenceMinutes, form?.timezone, lastRun?.startedAt, lastRun?.status],
  );

  if (settingsQuery.isLoading || defaultsQuery.isLoading || !form) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-zinc-200 bg-white">
        <LoaderCircleIcon className="size-5 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (settingsQuery.isError || defaultsQuery.isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        Failed to load cron notification settings.
      </div>
    );
  }

  function toggleWindow(
    family: "paymentReminderWindows" | "accessReminderWindows",
    window: ReminderWindowKey,
    checked: boolean,
  ) {
    setForm((current) => {
      if (!current) return current;
      const next = new Set(current[family]);
      if (checked) {
        next.add(window);
      } else {
        next.delete(window);
      }
      return {
        ...current,
        [family]: Array.from(next),
      };
    });
  }

  function updateInAppTemplate(key: string, field: "title" | "body", value: string) {
    setForm((current) => {
      if (!current) return current;
      return {
        ...current,
        inAppTemplates: {
          ...current.inAppTemplates,
          [key]: {
            ...current.inAppTemplates[key],
            [field]: value,
          },
        },
      };
    });
  }

  function updateEmailTemplate(key: string, field: "subject" | "body", value: string) {
    setForm((current) => {
      if (!current) return current;
      return {
        ...current,
        emailDraftTemplates: {
          ...current.emailDraftTemplates,
          [key]: {
            ...current.emailDraftTemplates[key],
            [field]: value,
          },
        },
      };
    });
  }

  async function handleSave() {
    if (!form) return;
    await updateMutation.mutateAsync(form);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-lg font-semibold text-zinc-950">Scheduler policy</h2>
            <p className="mt-1 text-sm leading-6 text-zinc-600">
              Railway cron calls the notification endpoint on a fixed cadence. The application
              decides which reminder windows are due using the configured workspace timezone.
            </p>
          </div>
          <Button disabled={updateMutation.isPending} onClick={() => void handleSave()} type="button">
            <SaveIcon className="size-4" />
            {updateMutation.isPending ? "Saving..." : "Save settings"}
          </Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {schedulerSummary.map((item) => (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4" key={item.label}>
              <div className="text-xs uppercase tracking-[0.14em] text-zinc-500">{item.label}</div>
              <div className="mt-2 text-sm font-semibold text-zinc-950">{item.value}</div>
            </div>
          ))}
        </div>

        {lastRun?.errorMessage ? (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            Last cron error: {lastRun.errorMessage}
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-zinc-700">Workspace timezone</label>
            <Input
              className="mt-1"
              onChange={(event) =>
                setForm((current) =>
                  current ? { ...current, timezone: event.target.value } : current,
                )
              }
              value={form.timezone}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-700">Cron cadence (minutes)</label>
            <Input
              className="mt-1"
              min={15}
              onChange={(event) =>
                setForm((current) =>
                  current
                    ? {
                        ...current,
                        cadenceMinutes: Number(event.target.value || "60"),
                      }
                    : current,
                )
              }
              type="number"
              value={form.cadenceMinutes}
            />
          </div>
        </div>
      </section>

      {(
        [
          {
            description:
              "These windows control payment due and overdue reminders for unpaid invoices.",
            emailKeys: familyWindowKeys("payment"),
            enabledField: "paymentRemindersEnabled" as const,
            title: "Payment reminders",
            windowField: "paymentReminderWindows" as const,
          },
          {
            description:
              "These windows control access-expiry and post-expiry reminders tied to project access states.",
            emailKeys: familyWindowKeys("access"),
            enabledField: "accessRemindersEnabled" as const,
            title: "Access reminders",
            windowField: "accessReminderWindows" as const,
          },
        ] as const
      ).map((section) => (
        <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm" key={section.title}>
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-3xl">
              <h2 className="text-lg font-semibold text-zinc-950">{section.title}</h2>
              <p className="mt-1 text-sm leading-6 text-zinc-600">{section.description}</p>
            </div>

            <div className="flex items-center gap-3 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2">
              <span className="text-sm text-zinc-700">Enabled</span>
              <Switch
                checked={form[section.enabledField]}
                onCheckedChange={(checked) =>
                  setForm((current) =>
                    current
                      ? {
                          ...current,
                          [section.enabledField]: checked,
                        }
                      : current,
                  )
                }
              />
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {(defaultsQuery.data?.windowOptions ?? []).map((windowOption) => {
              const checked = form[section.windowField].includes(
                windowOption.value as ReminderWindowKey,
              );
              return (
                <label
                  className="flex items-center gap-3 rounded-xl border border-zinc-200 px-4 py-3"
                  key={windowOption.value}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(value) =>
                      toggleWindow(
                        section.windowField,
                        windowOption.value as ReminderWindowKey,
                        value === true,
                      )
                    }
                  />
                  <div>
                    <div className="text-sm font-medium text-zinc-950">{windowOption.label}</div>
                    <div className="text-xs text-zinc-500">{windowOption.value}</div>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="mt-6 space-y-6">
            {section.emailKeys.map((templateKey) => {
              const window = templateKey.split(".")[1] as ReminderWindowKey;
              const inAppTemplate = form.inAppTemplates[templateKey];
              const emailTemplate = form.emailDraftTemplates[templateKey];

              return (
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4" key={templateKey}>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-zinc-950">
                        {buildWindowLabel(window)}
                      </div>
                      <div className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                        {templateKey}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5 xl:grid-cols-2">
                    <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
                      <div>
                        <div className="text-sm font-semibold text-zinc-950">In-app reminder</div>
                        <div className="text-xs text-zinc-500">
                          Appears in the portal notification bell and archive.
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-zinc-700">Title</label>
                        <Input
                          className="mt-1"
                          onChange={(event) =>
                            updateInAppTemplate(templateKey, "title", event.target.value)
                          }
                          value={inAppTemplate?.title ?? ""}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-zinc-700">Body</label>
                        <Textarea
                          className="mt-1 min-h-[110px]"
                          onChange={(event) =>
                            updateInAppTemplate(templateKey, "body", event.target.value)
                          }
                          value={inAppTemplate?.body ?? ""}
                        />
                      </div>
                      <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-3 text-sm text-zinc-600">
                        <div className="font-medium text-zinc-900">
                          {renderPreview(inAppTemplate?.title ?? "")}
                        </div>
                        <div className="mt-1 leading-6">
                          {renderPreview(inAppTemplate?.body ?? "")}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
                      <div>
                        <div className="text-sm font-semibold text-zinc-950">Reminder email draft</div>
                        <div className="text-xs text-zinc-500">
                          Cron creates draft rows only in v1. Admins send them explicitly later.
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-zinc-700">Subject</label>
                        <Input
                          className="mt-1"
                          onChange={(event) =>
                            updateEmailTemplate(templateKey, "subject", event.target.value)
                          }
                          value={emailTemplate?.subject ?? ""}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-zinc-700">Body</label>
                        <Textarea
                          className="mt-1 min-h-[110px]"
                          onChange={(event) =>
                            updateEmailTemplate(templateKey, "body", event.target.value)
                          }
                          value={emailTemplate?.body ?? ""}
                        />
                      </div>
                      <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-3 text-sm text-zinc-600">
                        <div className="font-medium text-zinc-900">
                          {renderPreview(emailTemplate?.subject ?? "")}
                        </div>
                        <div className="mt-1 leading-6">
                          {renderPreview(emailTemplate?.body ?? "")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-950">Supported placeholders</h2>
        <p className="mt-1 text-sm leading-6 text-zinc-600">
          Use structured placeholders so reminder previews stay safe and predictable.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.keys(previewValues).map((token) => (
            <span
              className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-700"
              key={token}
            >
              {`{{${token}}}`}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
