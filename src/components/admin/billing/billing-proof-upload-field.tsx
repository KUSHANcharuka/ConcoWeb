"use client";

import { useState } from "react";
import { LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/kibo-ui/dropzone";
import { api } from "~/trpc/react";

export function BillingProofUploadField({
  artifactId,
  projectId,
}: {
  artifactId: string;
  projectId: string;
}) {
  const utils = api.useUtils();
  const [files, setFiles] = useState<File[]>();
  const uploadMutation = api.admin.projectBilling.createProofUpload.useMutation();

  async function handleDrop(acceptedFiles: File[]) {
    const file = acceptedFiles[0];
    if (!file) return;

    setFiles([file]);

    try {
      const upload = await uploadMutation.mutateAsync({
        artifactId,
        projectId,
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: file.size,
      });

      const response = await fetch(upload.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error("Upload failed.");
      }

      await utils.admin.projectBilling.workspace.invalidate({ projectId });
      toast.success("Payment proof uploaded.");
      setFiles(undefined);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload payment proof.",
      );
    }
  }

  return (
    <div className="space-y-2">
      <Dropzone
        accept={{ "application/pdf": [], "image/*": [] }}
        className="min-h-[124px] border-dashed bg-zinc-50"
        disabled={uploadMutation.isPending}
        maxFiles={1}
        maxSize={15 * 1024 * 1024}
        onDrop={(acceptedFiles) => void handleDrop(acceptedFiles)}
        src={files}
      >
        {files?.length ? <DropzoneContent /> : <DropzoneEmptyState />}
      </Dropzone>
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>Upload receipt, bank slip, or PDF proof. Max 15MB.</span>
        {uploadMutation.isPending && (
          <span className="inline-flex items-center gap-1">
            <LoaderCircleIcon className="size-3 animate-spin" />
            Uploading
          </span>
        )}
      </div>
    </div>
  );
}
