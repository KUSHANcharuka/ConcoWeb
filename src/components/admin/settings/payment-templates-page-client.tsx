"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLinkIcon, FileTextIcon, LoaderCircleIcon, PencilIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

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
import { api } from "~/trpc/react";

type TemplateFormState = {
  templateId: string | null;
  name: string;
  templateType: "invoice" | "agreement";
  description: string;
  content: string;
  isDefault: boolean;
};

const emptyForm: TemplateFormState = {
  templateId: null,
  name: "",
  templateType: "agreement",
  description: "",
  content: "Reusable billing PDF template.",
  isDefault: false,
};

function getTemplateTypeLabel(templateType: "invoice" | "agreement") {
  return templateType === "agreement" ? "Terms & Conditions" : "Invoice";
}

export function PaymentTemplatesPageClient() {
  const utils = api.useUtils();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<TemplateFormState>(emptyForm);
  const templatesQuery = api.admin.settingsBilling.templates.useQuery();
  const createMutation = api.admin.settingsBilling.createTemplate.useMutation();
  const updateMutation = api.admin.settingsBilling.updateTemplate.useMutation();

  useEffect(() => {
    if (!dialogOpen) {
      setForm(emptyForm);
    }
  }, [dialogOpen]);

  async function handleSubmit() {
    if (!form.name.trim()) {
      toast.error("Add a template name.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      templateType: form.templateType,
      description: form.description.trim() || null,
      content: form.content.trim() || emptyForm.content,
      isDefault: form.isDefault,
    };

    try {
      if (form.templateId) {
        await updateMutation.mutateAsync({ templateId: form.templateId, ...payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      await utils.admin.settingsBilling.templates.invalidate();
      await utils.admin.settingsBilling.page.invalidate();
      toast.success(form.templateId ? "Payment template updated." : "Payment template created.");
      setDialogOpen(false);
      setForm(emptyForm);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save payment template.");
    }
  }

  if (templatesQuery.isLoading) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-xl border border-zinc-200 bg-white">
        <LoaderCircleIcon className="size-5 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (templatesQuery.isError || !templatesQuery.data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        Failed to load payment templates.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        <div className="flex justify-end">
          <Button onClick={() => setDialogOpen(true)}>
            <PlusIcon className="size-4" />
            New Template
          </Button>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {templatesQuery.data.map((template) => (
            <div
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300"
              key={template.id}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileTextIcon className="size-4 text-zinc-500" />
                    <div className="text-lg font-semibold text-zinc-950">{template.name}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{getTemplateTypeLabel(template.templateType)}</Badge>
                    {template.isDefault ? <Badge>Default</Badge> : null}
                    <Badge variant={template.sourceFileUrl ? "default" : "secondary"}>
                      {template.sourceFileUrl ? "PDF uploaded" : "No PDF yet"}
                    </Badge>
                  </div>
                </div>
                <div className="text-xs text-zinc-500">
                  Updated {new Date(template.updatedAt).toLocaleDateString()}
                </div>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-zinc-600 sm:grid-cols-2">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                    Source file
                  </div>
                  <div className="mt-1">{template.sourceFileName ?? "Not uploaded"}</div>
                </div>
              </div>
              {template.description ? (
                <p className="mt-4 text-sm leading-6 text-zinc-600">{template.description}</p>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  asChild
                  type="button"
                  variant={template.sourceFileUrl ? "default" : "outline"}
                >
                  <Link href={`/admin/settings/payment-templates/${template.id}/builder`}>
                    <ExternalLinkIcon className="size-4" />
                    {template.sourceFileUrl ? "Open PDF workspace" : "Upload PDF"}
                  </Link>
                </Button>
                <Button
                  onClick={() => {
                    setForm({
                      templateId: template.id,
                      name: template.name,
                      templateType: template.templateType,
                      description: template.description ?? "",
                      content: template.content,
                      isDefault: template.isDefault,
                    });
                    setDialogOpen(true);
                  }}
                  type="button"
                  variant="ghost"
                >
                  <PencilIcon className="size-4" />
                  Edit metadata
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{form.templateId ? "Edit payment template" : "Create payment template"}</DialogTitle>
              <DialogDescription>
              Save reusable template metadata here. Upload the actual PDF from the template
              workspace after the record exists.
            </DialogDescription>
          </DialogHeader>

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
                <Label>Type</Label>
                <Select
                  value={form.templateType}
                  onValueChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      templateType: value as "invoice" | "agreement",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agreement">Terms &amp; Conditions</SelectItem>
                    <SelectItem value="invoice">Invoice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                rows={4}
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Internal note</Label>
              <Textarea
                rows={4}
                value={form.content}
                onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3">
              <div>
                <div className="text-sm font-medium text-zinc-900">Default template</div>
                <div className="text-sm text-zinc-600">
                  Use this as the default payment contract for the selected template type.
                </div>
              </div>
              <Switch
                checked={form.isDefault}
                onCheckedChange={(checked) => setForm((current) => ({ ...current, isDefault: checked }))}
              />
            </div>

            {form.templateId ? (
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
                Use the template workspace after saving to upload or replace the reusable PDF.
              </div>
            ) : (
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
                Creating the template saves the metadata record. The new template appears in
                the list below — click &ldquo;Upload PDF&rdquo; on its card to attach the reusable file.
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={createMutation.isPending || updateMutation.isPending}
              onClick={() => void handleSubmit()}
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : form.templateId
                  ? "Save changes"
                  : "Create template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
