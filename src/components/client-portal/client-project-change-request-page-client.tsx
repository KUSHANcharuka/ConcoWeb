"use client";

import { useRef, useState } from "react";
import { LoaderCircleIcon, PaperclipIcon, UploadIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadWithProgress } from "~/lib/upload-with-progress";
import { useUploadProgress } from "~/components/upload/upload-progress-provider";
import { api } from "~/trpc/react";

export function ClientProjectChangeRequestPageClient({
  projectId,
}: {
  projectId: string;
}) {
  const utils = api.useUtils();
  const uploadProgress = useUploadProgress();
  const requestsQuery = api.clientPortal.requests.listChangeRequests.useQuery({ projectId });
  const prepareUpload = api.clientPortal.requests.prepareChangeAttachmentUpload.useMutation();
  const createRequest = api.clientPortal.requests.createChangeRequest.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.clientPortal.requests.listChangeRequests.invalidate({ projectId }),
        utils.clientPortal.projectWorkspace.overview.invalidate({ projectId }),
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
            projectId,
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
        projectId,
        label: label.trim(),
        summary: summary.trim(),
        attachmentAssetIds,
      });

      setLabel("");
      setSummary("");
      setFiles([]);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to submit your feature request.",
      );
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <section className="rounded-lg border border-zinc-200 bg-white p-6">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">New Feature Request</div>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-950">
            Submit a scoped feature request.
          </h2>
          <p className="mt-3 text-sm leading-7 text-zinc-600">
            Describe the feature, attach references, and the request will enter the admin review queue.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <label className="space-y-2">
            <span className="text-sm font-medium text-zinc-800">Request title</span>
            <Input
              onChange={(event) => setLabel(event.target.value)}
              placeholder="New dashboard metric, copy update, workflow revision..."
              value={label}
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-zinc-800">Describe the change</span>
            <Textarea
              onChange={(event) => setSummary(event.target.value)}
              placeholder="Explain the feature you want, why it matters, and any acceptance notes."
              rows={8}
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
          </div>

          {errorMessage ? (
            <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <Button
            disabled={
              !label.trim() ||
              !summary.trim() ||
              prepareUpload.isPending ||
              createRequest.isPending
            }
            onClick={() => void handleSubmit()}
            type="button"
          >
            {prepareUpload.isPending || createRequest.isPending ? (
              <LoaderCircleIcon className="size-4 animate-spin" />
            ) : (
              <UploadIcon className="size-4" />
            )}
            Submit request
          </Button>
        </div>
      </section>

      <aside className="rounded-lg border border-zinc-200 bg-white p-5">
        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">History</div>
        <h3 className="mt-2 text-xl font-semibold text-zinc-950">Recent feature requests</h3>

        <div className="mt-5 space-y-3">
          {requestsQuery.isLoading ? (
            <div className="text-sm text-zinc-500">
              <LoaderCircleIcon className="mr-2 inline size-4 animate-spin" />
              Loading history…
            </div>
          ) : (requestsQuery.data?.length ?? 0) === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-200 px-4 py-6 text-sm text-zinc-500">
              No feature requests have been submitted for this project.
            </div>
          ) : (
            requestsQuery.data?.map((request) => (
              <div className="rounded-lg border border-zinc-200 px-4 py-3" key={request.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm font-medium text-zinc-900">{request.label}</div>
                  <span className="rounded-full border border-zinc-200 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-zinc-600">
                    {request.status}
                  </span>
                </div>
                <p className="mt-2 line-clamp-4 text-sm leading-6 text-zinc-600">
                  {request.summary}
                </p>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
