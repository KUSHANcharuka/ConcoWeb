"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  Code2Icon,
  LoaderCircleIcon,
  MonitorIcon,
  SaveIcon,
  SmartphoneIcon,
  SparklesIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "~/trpc/react";

const templateTypes = ["welcome", "proposal", "payment_reminder", "invoice", "general_outreach"] as const;
const templateStatuses = ["draft", "active", "archived"] as const;

type EditorKind = "template" | "new" | "starter-layout";
type ViewMode = "preview" | "editor";
type SourceTab = "react" | "html" | "text";
type DeviceMode = "desktop" | "mobile";

export function EmailTemplateEditorPageClient({
  kind,
  templateId,
}: {
  kind: EditorKind;
  templateId?: string;
}) {
  const utils = api.useUtils();
  const templateEditorQuery = api.admin.emails.templates.getEditor.useQuery(
    { templateId: templateId ?? "" },
    { enabled: kind === "template" && Boolean(templateId) },
  );
  const starterLayoutQuery = api.admin.emails.settings.getStarterLayoutEditor.useQuery(undefined, {
    enabled: kind !== "template",
  });
  const previewMutation = api.admin.emails.templates.previewSource.useMutation();
  const saveTemplateMutation = api.admin.emails.templates.saveFromReactSource.useMutation({
    onSuccess: async () => {
      await utils.admin.emails.templates.list.invalidate();
      if (templateId) {
        await utils.admin.emails.templates.getEditor.invalidate({ templateId });
      }
    },
  });
  const saveStarterLayoutMutation = api.admin.emails.settings.updateStarterLayout.useMutation({
    onSuccess: async () => {
      await utils.admin.emails.settings.get.invalidate();
      await utils.admin.emails.settings.getStarterLayoutEditor.invalidate();
    },
  });

  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [sourceTab, setSourceTab] = useState<SourceTab>("react");
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [name, setName] = useState("New template");
  const [subject, setSubject] = useState("A note from Concolabs");
  const [templateType, setTemplateType] = useState<(typeof templateTypes)[number]>("general_outreach");
  const [status, setStatus] = useState<(typeof templateStatuses)[number]>("draft");
  const [reactSource, setReactSource] = useState("");
  const [renderedHtml, setRenderedHtml] = useState("");
  const [renderedText, setRenderedText] = useState("");
  const [renderError, setRenderError] = useState<string | null>(null);

  const loading =
    kind === "template" ? templateEditorQuery.isLoading : kind === "starter-layout" ? starterLayoutQuery.isLoading : false;

  useEffect(() => {
    if (kind === "template" && templateEditorQuery.data) {
      setName(templateEditorQuery.data.template.name);
      setSubject(templateEditorQuery.data.template.subject);
      setTemplateType(templateEditorQuery.data.template.templateType);
      setStatus(templateEditorQuery.data.template.status);
      setReactSource(templateEditorQuery.data.reactSource);
      setRenderedHtml(templateEditorQuery.data.rendered.html);
      setRenderedText(templateEditorQuery.data.rendered.text);
      setRenderError(null);
    }
  }, [kind, templateEditorQuery.data]);

  useEffect(() => {
    if ((kind === "starter-layout" || kind === "new") && starterLayoutQuery.data) {
      setName(kind === "starter-layout" ? "Starter Layout" : "New template");
      setSubject(starterLayoutQuery.data.subject);
      setReactSource(starterLayoutQuery.data.reactSource);
      setRenderedHtml(starterLayoutQuery.data.rendered.html);
      setRenderedText(starterLayoutQuery.data.rendered.text);
      setTemplateType("general_outreach");
      setStatus("draft");
      setRenderError(null);
    }
  }, [kind, starterLayoutQuery.data]);

  async function handlePreview() {
    try {
      const preview = await previewMutation.mutateAsync({ reactSource });
      setRenderedHtml(preview.renderedHtml);
      setRenderedText(preview.renderedText);
      setRenderError(null);
    } catch (error) {
      setRenderError(error instanceof Error ? error.message : "Unable to render preview.");
    }
  }

  async function handleSave() {
    try {
      if (kind === "starter-layout") {
        await saveStarterLayoutMutation.mutateAsync({ reactSource });
      } else {
        await saveTemplateMutation.mutateAsync({
          id: kind === "template" ? templateId : undefined,
          name,
          subject,
          templateType,
          status,
          reactSource,
        });
      }
      await handlePreview();
    } catch (error) {
      setRenderError(error instanceof Error ? error.message : "Unable to save source.");
    }
  }

  const title =
    kind === "starter-layout"
      ? "Starter Layout"
      : kind === "template"
        ? "Edit Template"
        : "New Template";
  const description =
    kind === "starter-layout"
      ? "This shared wrapper is the baseline for every new email template."
      : "Write a React-style email source, preview it live, and keep the rendered HTML/text in sync.";

  return (
    <div className="mx-auto max-w-[1500px] px-6 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <Link className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-950" href="/admin/emails">
            <ArrowLeftIcon className="size-4" />
            Back to emails
          </Link>
          <p className="mt-4 text-xs uppercase tracking-[0.22em] text-zinc-500">Emails / Templates</p>
          <h1 className="mt-2 font-serif text-4xl leading-tight text-zinc-950">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-zinc-200 bg-white p-1">
            <ModeButton active={viewMode === "preview"} icon={MonitorIcon} label="Preview" onClick={() => setViewMode("preview")} />
            <ModeButton active={viewMode === "editor"} icon={Code2Icon} label="Editor" onClick={() => setViewMode("editor")} />
          </div>
          <Button disabled={previewMutation.isPending} type="button" variant="outline" onClick={handlePreview}>
            {previewMutation.isPending ? <LoaderCircleIcon className="size-4 animate-spin" /> : <SparklesIcon className="size-4" />}
            Refresh preview
          </Button>
          <Button
            disabled={saveTemplateMutation.isPending || saveStarterLayoutMutation.isPending}
            type="button"
            onClick={handleSave}
          >
            {saveTemplateMutation.isPending || saveStarterLayoutMutation.isPending ? (
              <LoaderCircleIcon className="size-4 animate-spin" />
            ) : (
              <SaveIcon className="size-4" />
            )}
            Save
          </Button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px_220px]">
        <Input disabled={kind === "starter-layout"} value={name} onChange={(event) => setName(event.target.value)} placeholder="Template name" />
        <Input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Subject" />
        {kind !== "starter-layout" ? (
          <select className="h-10 border border-zinc-200 bg-white px-3 text-sm" value={templateType} onChange={(event) => setTemplateType(event.target.value as (typeof templateTypes)[number])}>
            {templateTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        ) : (
          <div className="flex h-10 items-center border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500">System wrapper</div>
        )}
        {kind !== "starter-layout" ? (
          <select className="h-10 border border-zinc-200 bg-white px-3 text-sm" value={status} onChange={(event) => setStatus(event.target.value as (typeof templateStatuses)[number])}>
            {templateStatuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        ) : (
          <div className="flex h-10 items-center border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500">Cannot archive</div>
        )}
      </div>

      {renderError ? (
        <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{renderError}</div>
      ) : null}

      {loading ? (
        <div className="flex min-h-[520px] items-center justify-center border border-zinc-200 bg-white">
          <LoaderCircleIcon className="size-5 animate-spin text-zinc-500" />
        </div>
      ) : viewMode === "preview" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-500">Rendered email preview</div>
            <div className="flex rounded-lg border border-zinc-200 bg-white p-1">
              <ModeButton active={deviceMode === "desktop"} icon={MonitorIcon} label="Desktop" onClick={() => setDeviceMode("desktop")} />
              <ModeButton active={deviceMode === "mobile"} icon={SmartphoneIcon} label="Mobile" onClick={() => setDeviceMode("mobile")} />
            </div>
          </div>
          <div className="overflow-auto border border-zinc-200 bg-[#e9e8e3] p-8">
            <div className={deviceMode === "desktop" ? "mx-auto w-full max-w-[1024px]" : "mx-auto w-[390px] max-w-full"}>
              <iframe
                className="h-[760px] w-full border border-zinc-200 bg-white"
                srcDoc={renderedHtml}
                title="Email preview"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="border border-zinc-200 bg-[#111111] text-white">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="font-medium">source.tsx</div>
              <div className="flex rounded-lg border border-white/10 bg-black/20 p-1">
                <ModeButton active={sourceTab === "react"} label="React" dark onClick={() => setSourceTab("react")} />
                <ModeButton active={sourceTab === "html"} label="HTML" dark onClick={() => setSourceTab("html")} />
                <ModeButton active={sourceTab === "text"} label="Plain Text" dark onClick={() => setSourceTab("text")} />
              </div>
            </div>
            {sourceTab === "react" ? (
              <Textarea
                className="min-h-[720px] border-0 bg-transparent font-mono text-xs leading-6 text-zinc-100 shadow-none focus-visible:ring-0"
                value={reactSource}
                onChange={(event) => setReactSource(event.target.value)}
              />
            ) : sourceTab === "html" ? (
              <ReadonlyCode value={renderedHtml} />
            ) : (
              <ReadonlyCode value={renderedText} />
            )}
          </div>

          <div className="border border-zinc-200 bg-white">
            <div className="border-b border-zinc-200 px-4 py-3">
              <div className="font-medium text-zinc-950">Live preview</div>
              <div className="mt-1 text-sm text-zinc-500">Preview is refreshed from the same server render pipeline used for sending.</div>
            </div>
            <iframe className="h-[720px] w-full bg-white" srcDoc={renderedHtml} title="Live email preview" />
          </div>
        </div>
      )}
    </div>
  );
}

function ModeButton({
  active,
  label,
  icon: Icon,
  dark = false,
  onClick,
}: {
  active: boolean;
  label: string;
  icon?: typeof MonitorIcon;
  dark?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={[
        "inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm transition",
        dark
          ? active
            ? "bg-white/10 text-white"
            : "text-zinc-400 hover:bg-white/5 hover:text-white"
          : active
            ? "bg-zinc-950 text-white"
            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950",
      ].join(" ")}
      onClick={onClick}
      type="button"
    >
      {Icon ? <Icon className="size-4" /> : null}
      {label}
    </button>
  );
}

function ReadonlyCode({ value }: { value: string }) {
  return (
    <pre className="min-h-[720px] overflow-auto px-4 py-4 font-mono text-xs leading-6 text-zinc-200">
      <code>{value}</code>
    </pre>
  );
}
