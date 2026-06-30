"use client";

import { useState } from "react";
import { LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/kibo-ui/dropzone";
import { Button } from "@/components/ui/button";
import { uploadWithProgress } from "~/lib/upload-with-progress";
import { useUploadProgress } from "~/components/upload/upload-progress-provider";
import { api } from "~/trpc/react";

function formatDate(value: string | Date | null | undefined) {
  if (!value) return "Not set";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

export function BillingProofPanel({
  artifactId,
  mode,
  projectId,
  proofs,
}: {
  artifactId: string;
  mode: "admin" | "client-preview" | "client";
  projectId: string;
  proofs: Array<{
    id: string;
    displayName: string;
    uploadedAt: string | Date | null;
    url: string | null;
  }>;
}) {
  const utils = api.useUtils();
  const uploadProgress = useUploadProgress();
  const [files, setFiles] = useState<File[]>();
  const adminUpload = api.admin.projectBilling.createProofUpload.useMutation();
  const clientUpload = api.clientPortal.projectBilling.createProofUpload.useMutation();

  const activeUpload = mode === "client" ? clientUpload : adminUpload;
  const canUpload = mode !== "client-preview";

  async function handleDrop(acceptedFiles: File[]) {
    const file = acceptedFiles[0];
    if (!file || !canUpload) return;
    setFiles([file]);

    const tracker = uploadProgress.startUpload({ label: file.name });

    try {
      const upload =
        mode === "client"
          ? await clientUpload.mutateAsync({
              artifactId,
              projectId,
              fileName: file.name,
              mimeType: file.type || "application/octet-stream",
              sizeBytes: file.size,
            })
          : await adminUpload.mutateAsync({
              artifactId,
              projectId,
              fileName: file.name,
              mimeType: file.type || "application/octet-stream",
              sizeBytes: file.size,
            });

      await uploadWithProgress({
        url: upload.uploadUrl,
        file,
        contentType: file.type || "application/octet-stream",
        onProgress: tracker.update,
      });

      if (mode === "client") {
        await utils.clientPortal.projectBilling.getArtifact.invalidate({ artifactId, projectId });
        await utils.clientPortal.projectBilling.list.invalidate({ projectId });
      } else {
        await utils.admin.projectBilling.getArtifact.invalidate({ artifactId, projectId });
        await utils.admin.projectBilling.workspace.invalidate({ projectId });
      }

      tracker.succeed("Payment proof uploaded");
      toast.success("Payment proof uploaded.");
      setFiles(undefined);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to upload payment proof.";
      tracker.fail(message);
      toast.error(message);
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div>
        <div className="text-lg font-semibold text-zinc-950">Proofs & attachments</div>
        <div className="mt-1 text-sm text-zinc-500">
          {mode === "client"
            ? "Upload transfer slips or other payment evidence for manual verification."
            : "Review uploaded receipts and attach payment evidence to this invoice."}
        </div>
      </div>

      {canUpload ? (
        <div className="space-y-2">
          <Dropzone
            accept={{ "application/pdf": [], "image/*": [] }}
            className="min-h-[124px] border-dashed bg-zinc-50"
            disabled={activeUpload.isPending}
            maxFiles={1}
            maxSize={15 * 1024 * 1024}
            onDrop={(acceptedFiles) => void handleDrop(acceptedFiles)}
            src={files}
          >
            {files?.length ? <DropzoneContent /> : <DropzoneEmptyState />}
          </Dropzone>
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Upload receipt, bank slip, or PDF proof. Max 15MB.</span>
            {activeUpload.isPending ? (
              <span className="inline-flex items-center gap-1">
                <LoaderCircleIcon className="size-3 animate-spin" />
                Uploading
              </span>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="space-y-3">
        {proofs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-5 text-sm text-zinc-500">
            No proofs or supporting attachments yet.
          </div>
        ) : (
          proofs.map((proof) => (
            <div
              className="flex flex-col gap-3 rounded-xl border border-zinc-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              key={proof.id}
            >
              <div>
                <div className="font-medium text-zinc-950">{proof.displayName}</div>
                <div className="text-sm text-zinc-500">Uploaded {formatDate(proof.uploadedAt)}</div>
              </div>
              {proof.url ? (
                <Button asChild size="sm" variant="outline">
                  <a href={proof.url} rel="noreferrer" target="_blank">
                    Open file
                  </a>
                </Button>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
