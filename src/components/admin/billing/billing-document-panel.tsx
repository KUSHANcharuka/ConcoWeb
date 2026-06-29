"use client";

import { useMemo, useState } from "react";
import {
  ExternalLinkIcon,
  UploadIcon,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/kibo-ui/dropzone";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PdfViewerSurface } from "~/components/pdf/pdf-viewer-surface";
import { uploadWithProgress } from "~/lib/upload-with-progress";
import { useUploadProgress } from "~/components/upload/upload-progress-provider";
import { api } from "~/trpc/react";

export function BillingDocumentPanel({
  artifactId,
  availableTemplates,
  document,
  formEmbedHost,
  mode,
  projectId,
}: {
  artifactId: string;
  availableTemplates: Array<{
    id: string;
    name: string;
    templateType: "invoice" | "agreement";
  }>;
  document: {
    id: string;
    role: "primary_invoice" | "terms_and_conditions";
    title: string;
    isSignable: boolean;
    templateId: string | null;
    docusealSubmissionStatus: string | null;
    docusealSubmitterEmbedUrl: string | null;
    sourceAsset: {
      id: string;
      fileName: string;
      mimeType: string;
      url: string | null;
      isTemplateSource?: boolean;
    } | null;
  };
  formEmbedHost: string | null;
  mode: "admin" | "client-preview" | "client";
  projectId: string;
}) {
  const utils = api.useUtils();
  const uploadProgress = useUploadProgress();
  const [files, setFiles] = useState<File[]>();

  const uploadMutation = api.admin.projectBilling.createArtifactDocumentUpload.useMutation();
  const updateMutation = api.admin.projectBilling.updateArtifactDocument.useMutation();

  const relevantTemplates = useMemo(
    () =>
      availableTemplates.filter((template) =>
        document.role === "primary_invoice"
          ? template.templateType === "invoice"
          : template.templateType === "agreement",
      ),
    [availableTemplates, document.role],
  );
  async function refresh() {
    await utils.admin.projectBilling.getArtifact.invalidate({ artifactId, projectId });
  }

  async function handleUpload(acceptedFiles: File[]) {
    const file = acceptedFiles[0];
    if (!file || mode !== "admin") return;
    setFiles([file]);

    const tracker = uploadProgress.startUpload({ label: file.name });

    try {
      const upload = await uploadMutation.mutateAsync({
        artifactId,
        documentId: document.id,
        projectId,
        fileName: file.name,
        mimeType: file.type || "application/pdf",
        sizeBytes: file.size,
      });

      await uploadWithProgress({
        url: upload.uploadUrl,
        file,
        contentType: file.type || "application/pdf",
        onProgress: tracker.update,
      });

      await refresh();
      setFiles(undefined);
      tracker.succeed("Document source uploaded");
      toast.success("Document source uploaded.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to upload source document.";
      tracker.fail(message);
      toast.error(message);
    }
  }

  async function handleTemplateChange(value: string) {
    try {
      await updateMutation.mutateAsync({
        artifactId,
        documentId: document.id,
        projectId,
        templateId: value === "none" ? null : value,
      });
      await refresh();
      toast.success("Document template updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update template.");
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-lg font-semibold text-zinc-950">{document.title}</div>
          <div className="mt-1 text-xs uppercase tracking-[0.16em] text-zinc-500">
            {document.role === "primary_invoice" ? "Primary invoice document" : "Terms & Conditions"}
          </div>
        </div>
        {document.docusealSubmissionStatus ? (
          <div className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs uppercase tracking-[0.14em] text-zinc-600">
            {document.docusealSubmissionStatus}
          </div>
        ) : null}
      </div>

      {mode === "admin" ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-2">
            <Label>Linked template</Label>
            <Select
              onValueChange={(value) => void handleTemplateChange(value)}
              value={document.templateId ?? "none"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Optional template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No template</SelectItem>
                {relevantTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Source document</Label>
            <Dropzone
              accept={{ "application/pdf": [], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [] }}
              className="min-h-[116px] border-dashed bg-zinc-50"
              disabled={uploadMutation.isPending}
              maxFiles={1}
              maxSize={20 * 1024 * 1024}
              onDrop={(acceptedFiles) => void handleUpload(acceptedFiles)}
              src={files}
            >
              {files?.length ? <DropzoneContent /> : <DropzoneEmptyState />}
            </Dropzone>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {document.sourceAsset?.url ? (
          <Button asChild type="button" variant="outline">
            <a href={document.sourceAsset.url} rel="noreferrer" target="_blank">
              Open source file
              <ExternalLinkIcon className="size-4" />
            </a>
          </Button>
        ) : null}
      </div>

      {document.sourceAsset?.isTemplateSource ? (
        <div className="rounded-xl border border-zinc-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          This preview is inherited from the linked template because this document does not have
          its own uploaded PDF yet.
        </div>
      ) : null}

      <PdfViewerSurface fileUrl={document.sourceAsset?.url ?? null} title={document.title} />
    </div>
  );
}
