"use client";

import { useEffect, useState } from "react";
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

export function ProjectCoverUploadField({
  clientId,
  onUploaded,
}: {
  clientId: string;
  onUploaded: (assetId: string | null) => void;
}) {
  const [files, setFiles] = useState<File[]>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const uploadMutation = api.admin.assets.createProjectCoverUpload.useMutation();
  const uploadProgress = useUploadProgress();

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function handleDrop(acceptedFiles: File[]) {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!clientId) {
      toast.error("Select a client before uploading a project cover.");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(nextPreviewUrl);
    setFiles([file]);

    const tracker = uploadProgress.startUpload({ label: file.name });
    try {
      const upload = await uploadMutation.mutateAsync({
        clientId,
        fileName: file.name,
        mimeType: file.type || "image/png",
        sizeBytes: file.size,
      });

      await uploadWithProgress({
        url: upload.uploadUrl,
        file,
        contentType: file.type || "application/octet-stream",
        onProgress: tracker.update,
      });

      onUploaded(upload.assetId);
      tracker.succeed("Project cover uploaded");
      toast.success("Project cover uploaded.");
    } catch (error) {
      URL.revokeObjectURL(nextPreviewUrl);
      onUploaded(null);
      setFiles(undefined);
      setPreviewUrl(null);
      const message = error instanceof Error ? error.message : "Failed to upload project cover.";
      tracker.fail(message);
      toast.error(message);
    }
  }

  return (
    <div className="space-y-3">
      <Dropzone
        accept={{ "image/*": [] }}
        className="min-h-[180px] border-dashed"
        disabled={uploadMutation.isPending}
        maxFiles={1}
        maxSize={10 * 1024 * 1024}
        onDrop={(acceptedFiles) => void handleDrop(acceptedFiles)}
        src={files}
      >
        {previewUrl ? (
          <div className="flex w-full flex-col items-center gap-3">
            <div className="overflow-hidden rounded-md border border-zinc-200">
              <img
                alt="Project cover preview"
                className="h-28 w-44 object-cover"
                src={previewUrl}
              />
            </div>
            <DropzoneContent />
          </div>
        ) : (
          <DropzoneEmptyState />
        )}
      </Dropzone>
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>PNG, JPG, or WEBP. Max 10MB.</span>
        {uploadMutation.isPending && (
          <span className="inline-flex items-center gap-1">
            <LoaderCircleIcon className="size-3 animate-spin" />
            Uploading
          </span>
        )}
      </div>
      {previewUrl && (
        <Button
          onClick={() => {
            if (previewUrl) {
              URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(null);
            setFiles(undefined);
            onUploaded(null);
          }}
          size="sm"
          type="button"
          variant="ghost"
        >
          Remove cover
        </Button>
      )}
    </div>
  );
}
