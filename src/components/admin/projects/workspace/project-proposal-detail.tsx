"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FileSignatureIcon,
  MessageSquareIcon,
  SendHorizonalIcon,
  UploadIcon,
} from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { ProposalPdfReviewer } from "~/components/pdf/proposal-pdf-reviewer";
import { uploadWithProgress } from "~/lib/upload-with-progress";
import { useUploadProgress } from "~/components/upload/upload-progress-provider";
import { api } from "~/trpc/react";

type ProjectProposalDetailProps = {
  formEmbedHost: string | null;
  mode: "admin" | "client-preview" | "client";
  projectId: string;
  proposalId: string;
};

export function ProjectProposalDetail({
  formEmbedHost: _formEmbedHost,
  mode,
  projectId,
  proposalId,
}: ProjectProposalDetailProps) {
  const utils = api.useUtils();
  const uploadProgress = useUploadProgress();
  const detailQuery = api.admin.proposals.get.useQuery(
    { projectId, proposalId },
    { enabled: mode !== "client" },
  );
  const clientDetailQuery = api.clientPortal.proposals.get.useQuery(
    { projectId, proposalId },
    { enabled: mode === "client" },
  );
  const recipientsQuery = api.admin.proposals.listRecipients.useQuery(
    { projectId },
    { enabled: mode === "admin" },
  );
  const readUrlMutation = api.admin.proposals.getReadUrl.useMutation();
  const uploadSourceMutation = api.admin.proposals.createSourceUpload.useMutation();
  const updateProposalMutation = api.admin.proposals.update.useMutation();
  const createSubmissionMutation = api.admin.proposals.createSubmission.useMutation();
  const addCommentMutation = api.admin.proposals.addComment.useMutation();
  const clientReadUrlMutation = api.clientPortal.proposals.getReadUrl.useMutation();
  const clientAddCommentMutation = api.clientPortal.proposals.addComment.useMutation();

  const activeDetailQuery = mode === "client" ? clientDetailQuery : detailQuery;
  const proposal = activeDetailQuery.data?.proposal ?? null;
  const comments = activeDetailQuery.data?.comments ?? [];
  const isDraft = proposal?.status === "draft";

  const [uploadingFiles, setUploadingFiles] = useState<File[]>();
  const [commentBody, setCommentBody] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<string[]>([]);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);

  const basePath =
    mode === "admin"
      ? `/admin/projects/${projectId}/proposals`
      : mode === "client-preview"
        ? `/admin/projects/${projectId}/client-view/proposals`
        : `/client-portal/projects/${projectId}/proposals`;

  const recipients = useMemo(() => recipientsQuery.data ?? [], [recipientsQuery.data]);

  async function refresh() {
    if (mode === "client") {
      await Promise.all([
        utils.clientPortal.proposals.list.invalidate({ projectId }),
        utils.clientPortal.proposals.get.invalidate({ projectId, proposalId }),
        utils.clientPortal.projectWorkspace.overview.invalidate({ projectId }),
      ]);
      return;
    }

    await Promise.all([
      utils.admin.proposals.list.invalidate({ projectId }),
      utils.admin.proposals.get.invalidate({ projectId, proposalId }),
      utils.admin.projectWorkspace.overview.invalidate({ projectId }),
    ]);
  }

  useEffect(() => {
    if (!proposal?.sourceAssetId) {
      setSourceUrl(null);
      return;
    }

    let cancelled = false;
    const loadSourceUrl = async () => {
      try {
        const result =
          mode === "client"
            ? await clientReadUrlMutation.mutateAsync({
                projectId,
                proposalId,
                assetType: "source",
              })
            : await readUrlMutation.mutateAsync({
                projectId,
                proposalId,
                assetType: "source",
              });
        if (!cancelled) {
          setSourceUrl(result.url);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error ? error.message : "Failed to load proposal source.",
          );
          setSourceUrl(null);
        }
      }
    };

    void loadSourceUrl();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, projectId, proposal?.sourceAssetId, proposalId]);

  async function handleUpload(droppedFiles: File[]) {
    const file = droppedFiles[0];
    if (!file || !proposal || !isDraft) return;
    setUploadingFiles([file]);
    setErrorMessage(null);

    const tracker = uploadProgress.startUpload({ label: file.name });
    try {
      const uploaded = await uploadSourceMutation.mutateAsync({
        projectId,
        proposalId,
        fileName: file.name,
        mimeType: file.type || "application/pdf",
        sizeBytes: file.size,
      });

      await uploadWithProgress({
        url: uploaded.uploadUrl,
        file,
        contentType: file.type || "application/pdf",
        onProgress: tracker.update,
      });

      await updateProposalMutation.mutateAsync({
        projectId,
        proposalId,
        sourceAssetId: uploaded.assetId,
      });

      await refresh();
      tracker.succeed("Proposal source uploaded");
      setUploadingFiles(undefined);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to upload proposal source.";
      tracker.fail(message);
      setErrorMessage(message);
      setUploadingFiles(undefined);
    }
  }

  async function handleCommentSubmit() {
    if (!proposal || isDraft || !commentBody.trim()) return;
    try {
      if (mode === "client") {
        await clientAddCommentMutation.mutateAsync({
          projectId,
          proposalId,
          body: commentBody.trim(),
        });
      } else {
        await addCommentMutation.mutateAsync({
          projectId,
          proposalId,
          body: commentBody.trim(),
        });
      }
      setCommentBody("");
      await refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to add comment.");
    }
  }

  async function openSourceAsset(assetType: "source") {
    if (!proposal || !sourceUrl) return;
    try {
      window.open(sourceUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to open proposal asset.");
    }
  }

  async function handleAnchoredComment(input: {
    anchorJson: Record<string, unknown>;
    body: string;
    pageNumber: number;
    selectedText: string;
  }) {
    if (!proposal || isDraft) return;

    if (mode === "client") {
      await clientAddCommentMutation.mutateAsync({
        projectId,
        proposalId,
        body: input.body,
        selectedText: input.selectedText,
        pageNumber: input.pageNumber,
        anchorJson: input.anchorJson,
      });
    } else {
      await addCommentMutation.mutateAsync({
        projectId,
        proposalId,
        body: input.body,
        selectedText: input.selectedText,
        pageNumber: input.pageNumber,
        anchorJson: input.anchorJson,
      });
    }

    await refresh();
  }

  async function handleSend() {
    if (!proposal || !isDraft || selectedRecipientIds.length === 0) return;
    try {
      await createSubmissionMutation.mutateAsync({
        projectId,
        proposalId,
        recipientMembershipIds: selectedRecipientIds,
      });
      setSendDialogOpen(false);
      setSelectedRecipientIds([]);
      await refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create signing request.",
      );
    }
  }

  if (activeDetailQuery.isLoading) {
    return <ProposalSurface title="Loading proposal…" description="Fetching proposal workspace." />;
  }

  if (!proposal) {
    return (
      <ProposalSurface
        title="Proposal not found"
        description="The requested proposal could not be loaded."
      />
    );
  }

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-col gap-4 border border-black/5 bg-white p-5 shadow-sm lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-zinc-500">
              <span className="border border-black/10 px-2 py-1">{proposal.status}</span>
              <span>{proposal.version}</span>
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-zinc-950">{proposal.title}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-zinc-600">
                {isDraft
                  ? "Draft proposal workspace. Upload the PDF, review it inline, and send it to the client once it is ready for review."
                  : "Review proposal workspace. This document is now in review and supports inline highlighted feedback and side comments."}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild type="button" variant="outline">
              <Link href={basePath}>Back to proposals</Link>
            </Button>
            {proposal.sourceAssetId ? (
              <Button onClick={() => void openSourceAsset("source")} type="button" variant="outline">
                Open source document
              </Button>
            ) : null}
            {mode === "admin" && isDraft ? (
              <Button
                disabled={!proposal.sourceAssetId}
                onClick={() => setSendDialogOpen(true)}
                type="button"
                variant="default"
              >
                <SendHorizonalIcon className="size-4" />
                Send proposal
              </Button>
            ) : null}
          </div>
        </div>

        {errorMessage ? (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <div className={isDraft ? "space-y-5" : "grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]"}>
          <div className="space-y-5">
            {isDraft ? (
              <>
                <div className="border border-black/5 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <UploadIcon className="size-4" />
                    Source upload
                  </div>
                  <div className="mt-4">
                    <Dropzone
                      accept={{
                        "application/pdf": [".pdf"],
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
                      }}
                      className="min-h-[180px] border-dashed bg-white"
                      maxFiles={1}
                      maxSize={25 * 1024 * 1024}
                      onDrop={(droppedFiles) => void handleUpload(droppedFiles)}
                      src={uploadingFiles}
                    >
                      {uploadingFiles ? <DropzoneContent /> : <DropzoneEmptyState />}
                    </Dropzone>
                  </div>
                </div>

                <ProposalPdfReviewer comments={[]} fileUrl={sourceUrl} readOnly />
              </>
            ) : (
              <ProposalPdfReviewer
                comments={comments.map((comment) => ({
                  id: comment.id,
                  body: comment.body,
                  anchorJson: comment.anchorJson,
                }))}
                fileUrl={sourceUrl}
                onCreateComment={
                  mode === "client-preview" ? undefined : (input) => handleAnchoredComment(input)
                }
                readOnly={mode === "client-preview"}
              />
            )}
          </div>

          {!isDraft ? (
            <aside className="border border-black/5 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <MessageSquareIcon className="size-4" />
                Proposal comments
              </div>
              <div className="mt-4 space-y-3">
                {comments.length === 0 ? (
                  <div className="border border-dashed border-black/10 px-4 py-6 text-sm text-zinc-500">
                    No comments yet
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div className="border border-black/5 bg-[#faf8f4] px-4 py-3" key={comment.id}>
                      {comment.selectedText ? (
                        <div className="mb-2 rounded-lg bg-amber-100/80 px-3 py-2 text-xs leading-5 text-amber-900">
                          "{comment.selectedText}"
                        </div>
                      ) : null}
                      <div className="text-sm font-medium text-zinc-950">{comment.body}</div>
                      <div className="mt-2 text-xs uppercase tracking-[0.16em] text-zinc-400">
                        {comment.pageNumber ? `Page ${comment.pageNumber} • ` : ""}
                        {comment.status}
                      </div>
                    </div>
                  ))
                )}
              </div>
              {mode !== "client-preview" ? (
                <div className="mt-4 space-y-3">
                  <Textarea
                    onChange={(event) => setCommentBody(event.target.value)}
                    placeholder={
                      mode === "client"
                        ? "Highlight feedback or note the changes you want here"
                        : "Add a side comment for this proposal"
                    }
                    rows={5}
                    value={commentBody}
                  />
                  <Button
                    disabled={!commentBody.trim()}
                    onClick={() => void handleCommentSubmit()}
                    type="button"
                  >
                    <FileSignatureIcon className="size-4" />
                    {mode === "client" ? "Submit feedback" : "Add comment"}
                  </Button>
                </div>
              ) : null}
            </aside>
          ) : null}
        </div>
      </div>

      <Dialog onOpenChange={setSendDialogOpen} open={sendDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select proposal recipients</DialogTitle>
            <DialogDescription>
              Sending the proposal locks the current draft and opens it for client review in the
              portal. Any later revision must be created by duplicating this proposal into a new
              draft.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            {recipients.length === 0 ? (
              <div className="border border-dashed border-black/10 px-4 py-6 text-sm text-zinc-500">
                No active client members are available for this proposal.
              </div>
            ) : (
              recipients.map((recipient) => {
                const checked = selectedRecipientIds.includes(recipient.id);
                return (
                  <label
                    className="flex cursor-pointer items-start gap-3 border border-black/5 bg-[#faf8f4] px-4 py-3"
                    key={recipient.id}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(nextChecked) => {
                        setSelectedRecipientIds((current) =>
                          nextChecked
                            ? [...current, recipient.id]
                            : current.filter((value) => value !== recipient.id),
                        );
                      }}
                    />
                    <div>
                      <div className="text-sm font-medium text-zinc-950">{recipient.email}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.14em] text-zinc-500">
                        {recipient.role}
                        {recipient.jobTitle ? ` • ${recipient.jobTitle}` : ""}
                      </div>
                    </div>
                  </label>
                );
              })
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setSendDialogOpen(false)} type="button" variant="outline">
              Cancel
            </Button>
            <Button
              disabled={selectedRecipientIds.length === 0 || createSubmissionMutation.isPending}
              onClick={() => void handleSend()}
              type="button"
            >
              Confirm send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ProposalSurface({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border border-black/5 bg-white p-8 shadow-sm">
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <UploadIcon className="size-4" />
        Proposal workspace
      </div>
      <h3 className="mt-4 text-xl font-semibold text-zinc-950">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-zinc-600">{description}</p>
    </div>
  );
}
