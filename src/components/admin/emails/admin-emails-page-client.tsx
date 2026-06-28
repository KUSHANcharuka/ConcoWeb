"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArchiveIcon,
  EyeIcon,
  FileTextIcon,
  LoaderCircleIcon,
  MailIcon,
  PlusIcon,
  SendIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "~/trpc/react";

const sections = ["templates", "compose", "suggested", "sent"] as const;
const templateTypes = ["welcome", "proposal", "payment_reminder", "invoice", "general_outreach"] as const;
const templateStatuses = ["draft", "active", "archived"] as const;

type Section = (typeof sections)[number];

const defaultSource = {
  blocks: [
    { type: "heading", value: "A note from Concolabs" },
    { type: "text", value: "Write the email body here." },
  ],
};

function safeJson(value: string) {
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return defaultSource;
  }
}

function SectionButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={[
        "h-10 border px-4 text-sm transition",
        active
          ? "border-zinc-950 bg-zinc-950 text-white"
          : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400",
      ].join(" ")}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export function AdminEmailsPageClient() {
  const [section, setSection] = useState<Section>("templates");

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
            Emails
          </p>
          <h1 className="mt-2 font-serif text-4xl leading-tight text-zinc-950">
            Client communication.
          </h1>
          <p className="mt-3 text-base leading-7 text-zinc-600">
            Create branded templates, prepare suggested drafts, send through Resend, and keep immutable sent snapshots.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <SectionButton active={section === "templates"} onClick={() => setSection("templates")}>
          Templates
        </SectionButton>
        <SectionButton active={section === "compose"} onClick={() => setSection("compose")}>
          Compose
        </SectionButton>
        <SectionButton active={section === "suggested"} onClick={() => setSection("suggested")}>
          Suggested
        </SectionButton>
        <SectionButton active={section === "sent"} onClick={() => setSection("sent")}>
          Sent
        </SectionButton>
      </div>

      <div className="mt-8">
        {section === "templates" ? <TemplatesSection /> : null}
        {section === "compose" ? <ComposeSection /> : null}
        {section === "suggested" ? <SuggestedSection /> : null}
        {section === "sent" ? <SentSection /> : null}
      </div>
    </div>
  );
}

function TemplatesSection() {
  const utils = api.useUtils();
  const templatesQuery = api.admin.emails.templates.list.useQuery({
    search: "",
    includeArchived: true,
  });
  const saveTemplate = api.admin.emails.templates.save.useMutation({
    onSuccess: async () => {
      await utils.admin.emails.templates.list.invalidate();
    },
  });
  const setStatus = api.admin.emails.templates.setStatus.useMutation({
    onSuccess: async () => {
      await utils.admin.emails.templates.list.invalidate();
    },
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "New template",
    templateType: "general_outreach",
    status: "draft",
    subject: "A note from Concolabs",
    source: JSON.stringify(defaultSource, null, 2),
  });

  const editingTemplate = templatesQuery.data?.find((template) => template.id === editingId);

  useEffect(() => {
    if (!editingTemplate) return;
    setForm((current) => ({
      ...current,
      name: editingTemplate.name,
      templateType: editingTemplate.templateType,
      status: editingTemplate.status,
      subject: editingTemplate.subject,
    }));
  }, [editingTemplate]);

  async function handleSave() {
    await saveTemplate.mutateAsync({
      id: editingId ?? undefined,
      name: form.name,
      templateType: form.templateType as (typeof templateTypes)[number],
      status: form.status as (typeof templateStatuses)[number],
      subject: form.subject,
      builderSourceJson: safeJson(form.source),
    });
    setEditingId(null);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <div className="border border-zinc-200 bg-white">
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">Templates</h2>
            <p className="text-sm text-zinc-600">Typed templates with draft, active, and archived states.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setEditingId(null);
              setForm({
                name: "New template",
                templateType: "general_outreach",
                status: "draft",
                subject: "A note from Concolabs",
                source: JSON.stringify(defaultSource, null, 2),
              });
            }}
          >
            <PlusIcon className="size-4" />
            New
          </Button>
        </div>
        <div className="divide-y divide-zinc-100">
          {templatesQuery.isLoading ? (
            <EmptyState icon={LoaderCircleIcon} title="Loading templates" />
          ) : (templatesQuery.data?.length ?? 0) === 0 ? (
            <EmptyState icon={FileTextIcon} title="No templates yet" />
          ) : (
            templatesQuery.data?.map((template) => (
              <div className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between" key={template.id}>
                <button className="text-left" onClick={() => setEditingId(template.id)} type="button">
                  <div className="font-medium text-zinc-950">{template.name}</div>
                  <div className="mt-1 text-sm text-zinc-600">
                    {template.templateType} · {template.status} · {template.subject}
                  </div>
                </button>
                <div className="flex gap-2">
                  <Button size="sm" type="button" variant="outline" onClick={() => setEditingId(template.id)}>
                    <EyeIcon className="size-4" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    type="button"
                    variant="outline"
                    onClick={() => setStatus.mutate({ templateId: template.id, status: template.status === "active" ? "archived" : "active" })}
                  >
                    <ArchiveIcon className="size-4" />
                    {template.status === "active" ? "Archive" : "Activate"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="border border-zinc-200 bg-white p-5">
        <h3 className="text-base font-semibold text-zinc-950">{editingId ? "Edit template" : "Create template"}</h3>
        <div className="mt-4 space-y-4">
          <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <Input value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} />
          <select className="h-10 w-full border border-zinc-200 bg-white px-3 text-sm" value={form.templateType} onChange={(event) => setForm({ ...form, templateType: event.target.value })}>
            {templateTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
          <select className="h-10 w-full border border-zinc-200 bg-white px-3 text-sm" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
            {templateStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <Textarea className="min-h-[260px] font-mono text-xs" value={form.source} onChange={(event) => setForm({ ...form, source: event.target.value })} />
          <Button className="w-full" disabled={saveTemplate.isPending} onClick={handleSave} type="button">
            {saveTemplate.isPending ? <LoaderCircleIcon className="size-4 animate-spin" /> : <FileTextIcon className="size-4" />}
            Save Template
          </Button>
        </div>
      </div>
    </div>
  );
}

function ComposeSection() {
  const utils = api.useUtils();
  const templatesQuery = api.admin.emails.templates.list.useQuery({
    search: "",
    status: "active",
    includeArchived: false,
  });
  const clientsQuery = api.admin.emails.recipients.clients.useQuery();
  const [clientId, setClientId] = useState("");
  const membersQuery = api.admin.emails.recipients.members.useQuery(
    { clientId },
    { enabled: clientId.length > 0 },
  );
  const [templateId, setTemplateId] = useState("");
  const [subject, setSubject] = useState("A note from Concolabs");
  const [draftId, setDraftId] = useState("");
  const [recipientMode, setRecipientMode] = useState<"client_default_contact" | "selected_member">("client_default_contact");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const createDraft = api.admin.emails.drafts.create.useMutation({
    onSuccess: async (draft) => {
      setDraftId(draft.id);
      await utils.admin.emails.drafts.list.invalidate();
    },
  });
  const updateRecipients = api.admin.emails.drafts.updateRecipients.useMutation();
  const sendDraft = api.admin.emails.drafts.send.useMutation({
    onSuccess: async () => {
      await utils.admin.emails.sent.list.invalidate();
      await utils.admin.emails.drafts.list.invalidate();
    },
  });

  async function handleCreateDraft() {
    const template = templatesQuery.data?.find((item) => item.id === templateId);
    const draft = await createDraft.mutateAsync({
      templateId: templateId || null,
      templateType: template?.templateType ?? "general_outreach",
      clientId: clientId || null,
      projectId: null,
      subject,
    });
    setDraftId(draft.id);
  }

  async function handleRecipients() {
    if (!draftId) return;
    await updateRecipients.mutateAsync({
      draftId,
      mode: recipientMode,
      clientId: clientId || null,
      membershipIds: recipientMode === "selected_member" ? selectedMembers : [],
    });
  }

  async function handleSend() {
    await handleRecipients();
    if (draftId) await sendDraft.mutateAsync({ draftId });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
      <div className="space-y-4 border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-zinc-950">Compose</h2>
        <select className="h-10 w-full border border-zinc-200 bg-white px-3 text-sm" value={templateId} onChange={(event) => setTemplateId(event.target.value)}>
          <option value="">Start from global layout</option>
          {templatesQuery.data?.map((template) => <option key={template.id} value={template.id}>{template.name}</option>)}
        </select>
        <Input value={subject} onChange={(event) => setSubject(event.target.value)} />
        <select className="h-10 w-full border border-zinc-200 bg-white px-3 text-sm" value={clientId} onChange={(event) => setClientId(event.target.value)}>
          <option value="">No client selected</option>
          {clientsQuery.data?.map((client) => <option key={client.id} value={client.id}>{client.name} · {client.email}</option>)}
        </select>
        <select className="h-10 w-full border border-zinc-200 bg-white px-3 text-sm" value={recipientMode} onChange={(event) => setRecipientMode(event.target.value as "client_default_contact" | "selected_member")}>
          <option value="client_default_contact">Client default contact</option>
          <option value="selected_member">Selected members</option>
        </select>
        {recipientMode === "selected_member" ? (
          <div className="max-h-48 space-y-2 overflow-auto border border-zinc-100 p-3">
            {membersQuery.data?.map((member) => (
              <label className="flex items-center gap-2 text-sm" key={member.id}>
                <input
                  checked={selectedMembers.includes(member.id)}
                  onChange={(event) => {
                    setSelectedMembers((current) =>
                      event.target.checked
                        ? [...current, member.id]
                        : current.filter((id) => id !== member.id),
                    );
                  }}
                  type="checkbox"
                />
                {member.email}
              </label>
            ))}
          </div>
        ) : null}
        <Button className="w-full" type="button" onClick={handleCreateDraft} disabled={createDraft.isPending}>
          <PlusIcon className="size-4" />
          Create Draft
        </Button>
        <Button className="w-full" type="button" onClick={handleSend} disabled={!draftId || sendDraft.isPending}>
          <SendIcon className="size-4" />
          Send Draft
        </Button>
        {sendDraft.data?.status === "failed" ? (
          <p className="text-sm text-red-600">{sendDraft.data.errorMessage}</p>
        ) : null}
      </div>
      <DraftPreview draftId={draftId} />
    </div>
  );
}

function SuggestedSection() {
  const utils = api.useUtils();
  const draftsQuery = api.admin.emails.drafts.list.useQuery({ source: "suggested" });
  const sendDraft = api.admin.emails.drafts.send.useMutation({
    onSuccess: async () => {
      await utils.admin.emails.drafts.list.invalidate({ source: "suggested" });
      await utils.admin.emails.sent.list.invalidate();
    },
  });

  return (
    <div className="border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-zinc-950">Suggested drafts</h2>
        <p className="text-sm text-zinc-600">Generated by the scheduled email suggestion job. Nothing sends until an admin clicks send.</p>
      </div>
      <div className="divide-y divide-zinc-100">
        {(draftsQuery.data?.length ?? 0) === 0 ? (
          <EmptyState icon={MailIcon} title="No suggested drafts" />
        ) : (
          draftsQuery.data?.map((draft) => (
            <div className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between" key={draft.id}>
              <div>
                <div className="font-medium text-zinc-950">{draft.subject}</div>
                <div className="mt-1 text-sm text-zinc-600">
                  {draft.clientName ?? "No client"} · {draft.projectName ?? "No project"} · {draft.status}
                </div>
                <div className="mt-1 font-mono text-xs text-zinc-400">{draft.dedupeKey}</div>
              </div>
              <Button type="button" onClick={() => sendDraft.mutate({ draftId: draft.id })}>
                <SendIcon className="size-4" />
                Send
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function SentSection() {
  const [selectedId, setSelectedId] = useState("");
  const sentQuery = api.admin.emails.sent.list.useQuery();
  const sentDetailQuery = api.admin.emails.sent.get.useQuery(
    { sentEmailId: selectedId },
    { enabled: selectedId.length > 0 },
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
      <div className="border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-zinc-950">Sent archive</h2>
        </div>
        <div className="divide-y divide-zinc-100">
          {(sentQuery.data?.length ?? 0) === 0 ? (
            <EmptyState icon={ArchiveIcon} title="No sent emails" />
          ) : (
            sentQuery.data?.map((email) => (
              <button className="block w-full px-5 py-4 text-left hover:bg-zinc-50" key={email.id} onClick={() => setSelectedId(email.id)} type="button">
                <div className="font-medium text-zinc-950">{email.subject}</div>
                <div className="mt-1 text-sm text-zinc-600">{email.status} · {email.clientName ?? "No client"}</div>
              </button>
            ))
          )}
        </div>
      </div>
      <div className="min-h-[520px] border border-zinc-200 bg-white p-5">
        {sentDetailQuery.data ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-zinc-950">{sentDetailQuery.data.email.subject}</h3>
              <p className="text-sm text-zinc-600">{sentDetailQuery.data.email.status} · {sentDetailQuery.data.email.providerMessageId ?? "no provider id"}</p>
            </div>
            <div className="rounded border border-zinc-200 p-3 text-sm text-zinc-600">
              {sentDetailQuery.data.recipients.map((recipient) => recipient.email).join(", ")}
            </div>
            <iframe className="h-[520px] w-full border border-zinc-200 bg-white" srcDoc={sentDetailQuery.data.email.renderedHtml} title="Sent email preview" />
          </div>
        ) : (
          <EmptyState icon={EyeIcon} title="Select a sent email" />
        )}
      </div>
    </div>
  );
}

function DraftPreview({ draftId }: { draftId: string }) {
  const draftQuery = api.admin.emails.drafts.get.useQuery(
    { draftId },
    { enabled: draftId.length > 0 },
  );

  if (!draftId) {
    return <EmptyState icon={FileTextIcon} title="Create a draft to preview it" />;
  }

  if (draftQuery.isLoading) {
    return <EmptyState icon={LoaderCircleIcon} title="Loading draft" />;
  }

  return (
    <div className="border border-zinc-200 bg-white p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-zinc-950">{draftQuery.data?.draft.subject}</h3>
        <p className="text-sm text-zinc-600">{draftQuery.data?.recipients.length ?? 0} recipients</p>
      </div>
      <iframe className="h-[560px] w-full border border-zinc-200 bg-white" srcDoc={draftQuery.data?.draft.renderedHtml ?? ""} title="Draft preview" />
    </div>
  );
}

function EmptyState({ icon: Icon, title }: { icon: typeof MailIcon; title: string }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 px-6 py-10 text-center text-zinc-500">
      <Icon className="size-5" />
      <div className="text-sm">{title}</div>
    </div>
  );
}
