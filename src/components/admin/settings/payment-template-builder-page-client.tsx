"use client";

import Link from "next/link";
import { ExternalLinkIcon, LoaderCircleIcon, UploadIcon } from "lucide-react";
import { toast } from "sonner";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/kibo-ui/dropzone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PdfViewerSurface } from "~/components/pdf/pdf-viewer-surface";
import { uploadWithProgress } from "~/lib/upload-with-progress";
import { useUploadProgress } from "~/components/upload/upload-progress-provider";
import { api } from "~/trpc/react";
import { useState } from "react";

function getTemplateTypeLabel(templateType: "invoice" | "agreement") {
  return templateType === "agreement" ? "Terms & Conditions" : "Invoice";
}

export function PaymentTemplateBuilderPageClient({
  templateId,
}: {
  templateId: string;
}) {
  const utils = api.useUtils();
  const uploadProgress = useUploadProgress();
  const builderQuery = api.admin.settingsBilling.getTemplateBuilder.useQuery({ templateId });
  const uploadMutation = api.admin.settingsBilling.createTemplateSourceUpload.useMutation();
  const updateMutation = api.admin.settingsBilling.updateTemplate.useMutation();
  const [files, setFiles] = useState<File[]>();

  if (builderQuery.isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-zinc-200 bg-white">
        <LoaderCircleIcon className="size-5 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (builderQuery.isError || !builderQuery.data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        Failed to load the payment template workspace.
      </div>
    );
  }

  const { template } = builderQuery.data;

  async function handleUpload(droppedFiles: File[]) {
    const file = droppedFiles[0];
    if (!file) return;

    setFiles([file]);
    const tracker = uploadProgress.startUpload({ label: file.name });
    try {
      const upload = await uploadMutation.mutateAsync({
        templateId,
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

      await updateMutation.mutateAsync({
        templateId: template.id,
        name: template.name,
        templateType: template.templateType,
        description: template.description ?? null,
        sourceObjectKey: upload.objectKey,
        sourceFileName: file.name,
        sourceMimeType: file.type || "application/pdf",
        docusealTemplateId: template.docusealTemplateId ?? null,
        docusealTemplateSlug: template.docusealTemplateSlug ?? null,
        content: template.content,
        isDefault: template.isDefault,
      });

      await Promise.all([
        utils.admin.settingsBilling.getTemplateBuilder.invalidate({ templateId }),
        utils.admin.settingsBilling.templates.invalidate(),
        utils.admin.settingsBilling.page.invalidate(),
      ]);
      tracker.succeed("Template PDF updated");
      toast.success("Template PDF updated.");
      setFiles(undefined);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to upload template PDF.";
      tracker.fail(message);
      setFiles(undefined);
      toast.error(message);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <h2 className="font-serif text-3xl text-zinc-950">{template.name}</h2>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{getTemplateTypeLabel(template.templateType)}</Badge>
              {template.isDefault ? <Badge>Default</Badge> : null}
              <Badge variant={template.sourceFileUrl ? "default" : "secondary"}>
                {template.sourceFileUrl ? "PDF uploaded" : "Upload pending"}
              </Badge>
            </div>
            {template.description ? (
              <p className="max-w-3xl text-sm leading-7 text-zinc-600">{template.description}</p>
            ) : null}
          </div>

          <Button asChild type="button" variant="outline">
            <Link href="/admin/settings/payment-templates">
              Back to templates
              <ExternalLinkIcon className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-sm text-zinc-600">
          <UploadIcon className="size-4" />
          Upload a reusable PDF that billing documents can inherit when they do not have a
          document-specific upload.
        </div>
        <Dropzone
          accept={{ "application/pdf": [".pdf"] }}
          className="min-h-[140px] border-dashed bg-zinc-50"
          disabled={uploadMutation.isPending}
          maxFiles={1}
          maxSize={20 * 1024 * 1024}
          onDrop={(acceptedFiles) => void handleUpload(acceptedFiles)}
          src={files}
        >
          {files?.length ? <DropzoneContent /> : <DropzoneEmptyState />}
        </Dropzone>
      </div>

      <PdfViewerSurface
        fileUrl={template.sourceFileUrl}
        title={template.sourceFileName ?? template.name}
      />
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
        This reusable PDF is the default source for billing documents linked to this template.
      </div>
    </div>
  );
}
