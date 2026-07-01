"use client";

import { useRef, useState } from "react";
import { LoaderCircleIcon, PaperclipIcon, UploadIcon, XIcon } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { uploadWithProgress } from "~/lib/upload-with-progress";
import { useUploadProgress } from "~/components/upload/upload-progress-provider";
import { api } from "~/trpc/react";

export function ClientProjectRequestDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const utils = api.useUtils();
  const uploadProgress = useUploadProgress();
  const prepareUpload = api.clientPortal.requests.prepareProjectAttachmentUpload.useMutation();
  const createRequest = api.clientPortal.requests.createProjectRequest.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.clientPortal.projects.list.invalidate(),
        utils.clientPortal.requests.listProjectRequests.invalidate(),
      ]);
    },
  });
  const [label, setLabel] = useState("");
  const [summary, setSummary] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (selectedFiles.length === 0) return;

    setFiles((current) => {
      const next = [...current];
      for (const file of selectedFiles) {
        const duplicate = next.some(
          (existing) =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.lastModified === file.lastModified,
        );
        if (!duplicate) {
          next.push(file);
        }
      }
      return next.slice(0, 10);
    });

    event.target.value = "";
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, currentIndex) => currentIndex !== index));
  }

  async function handleSubmit() {
    setErrorMessage(null);

    try {
      const attachmentAssetIds: string[] = [];

      for (const file of files) {
        const tracker = uploadProgress.startUpload({ label: file.name });
        try {
          const prepared = await prepareUpload.mutateAsync({
            fileName: file.name,
            mimeType: file.type || "application/octet-stream",
            sizeBytes: file.size,
          });

          await uploadWithProgress({
            url: prepared.uploadUrl,
            file,
            contentType: file.type || "application/octet-stream",
            onProgress: tracker.update,
          });

          tracker.succeed("Attachment uploaded");
          attachmentAssetIds.push(prepared.assetId);
        } catch (uploadError) {
          const message =
            uploadError instanceof Error ? uploadError.message : `Failed to upload ${file.name}.`;
          tracker.fail(message);
          throw new Error(message);
        }
      }

      await createRequest.mutateAsync({
        label: label.trim(),
        summary: summary.trim(),
        attachmentAssetIds,
      });

      setLabel("");
      setSummary("");
      setFiles([]);
      onOpenChange(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to submit your project request.",
      );
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Request a new project</DialogTitle>
          <DialogDescription>
            Send the Concolabs team a scoped project brief with optional supporting files.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <label className="space-y-2">
            <span className="text-sm font-medium text-zinc-800">Project name</span>
            <Input
              onChange={(event) => setLabel(event.target.value)}
              placeholder="New website rollout, internal dashboard, mobile app..."
              value={label}
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-zinc-800">Requirements</span>
            <Textarea
              className="min-h-[132px] resize-none break-all whitespace-pre-wrap overflow-x-hidden [field-sizing:fixed] [overflow-wrap:anywhere] [word-break:break-word]"
              onChange={(event) => setSummary(event.target.value)}
              placeholder="Describe the scope, outcomes, references, stakeholders, and timeline expectations."
              rows={5}
              value={summary}
            />
          </label>

          <div className="space-y-2">
            <div className="text-sm font-medium text-zinc-800">Attachments</div>
            <input
              accept=".pdf,.docx,image/*,.txt"
              className="hidden"
              multiple
              onChange={handleFileInputChange}
              ref={fileInputRef}
              type="file"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              type="button"
              variant="outline"
            >
              <PaperclipIcon className="size-4" />
              Upload attachments
            </Button>
            {files.length > 0 ? (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 bg-white px-3 py-2"
                    key={`${file.name}-${file.size}-${file.lastModified}`}
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-zinc-900">
                        {file.name}
                      </div>
                      <div className="text-xs text-zinc-500">{formatFileSize(file.size)}</div>
                    </div>
                    <Button
                      className="h-8 w-8 px-0"
                      onClick={() => removeFile(index)}
                      type="button"
                      variant="ghost"
                    >
                      <XIcon className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : null}
            <div className="text-xs leading-6 text-zinc-500">
              Upload briefs, screenshots, PDFs, or requirement notes.
            </div>
          </div>

          {errorMessage ? (
            <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} type="button" variant="outline">
            Cancel
          </Button>
          <Button
            disabled={
              !label.trim() ||
              !summary.trim() ||
              createRequest.isPending ||
              prepareUpload.isPending
            }
            onClick={() => void handleSubmit()}
            type="button"
          >
            {createRequest.isPending || prepareUpload.isPending ? (
              <LoaderCircleIcon className="size-4 animate-spin" />
            ) : (
              <UploadIcon className="size-4" />
            )}
            Submit request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
