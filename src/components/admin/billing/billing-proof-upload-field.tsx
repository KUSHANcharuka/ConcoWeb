"use client";

import { useState } from "react";
import { LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/kibo-ui/dropzone";
import { uploadWithProgress } from "~/lib/upload-with-progress";
import { useUploadProgress } from "~/components/upload/upload-progress-provider";
import { api } from "~/trpc/react";

export function BillingProofUploadField({
  artifactId,
  projectId,
}: {
  artifactId: string;
  projectId: string;
}) {
  const utils = api.useUtils();
  const uploadProgress = useUploadProgress();
  const [files, setFiles] = useState<File[]>();
  const uploadMutation = api.admin.projectBilling.createProofUpload.useMutation();

  async function handleDrop(acceptedFiles: File[]) {
    const file = acceptedFiles[0];
    if (!file) return;

    setFiles([file]);
    const tracker = uploadProgress.startUpload({ label: file.name });

    try {
      const upload = await uploadMutation.mutateAsync({
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

      await utils.admin.projectBilling.workspace.invalidate({ projectId });
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
