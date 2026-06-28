"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FileSignatureIcon,
  MessageSquareIcon,
  PlusIcon,
  SendHorizonalIcon,
  UploadIcon,
} from "lucide-react";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/kibo-ui/dropzone";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DocusealBuilderEmbed } from "~/components/admin/projects/workspace/docuseal-builder-embed";
import { DocusealFormEmbed } from "~/components/admin/projects/workspace/docuseal-form-embed";
import { api } from "~/trpc/react";

type ProposalListItem = {
  id: string;
  title: string;
  version: string;
  status: string;
  currency: string;
  sourceAssetId: string | null;
  docusealTemplateId: string | null;
  docusealSubmitterEmbedUrl: string | null;
};

export function ProjectProposalsPanel({
  projectId,
  mode,
  currency,
}: {
  projectId: string;
  mode: "admin" | "client-preview";
  currency: string;
}) {
  const utils = api.useUtils();
  const proposalsQuery = api.admin.proposals.list.useQuery({ projectId });
  const contextQuery = api.admin.projectWorkspace.context.useQuery({ projectId });
  const createProposalMutation = api.admin.proposals.create.useMutation();
  const updateProposalMutation = api.admin.proposals.update.useMutation();
  const uploadSourceMutation = api.admin.proposals.createSourceUpload.useMutation();
  const createSubmissionMutation = api.admin.proposals.createSubmission.useMutation();
  const addCommentMutation = api.admin.proposals.addComment.useMutation();

  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>();
  const [commentBody, setCommentBody] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const proposals = (proposalsQuery.data ?? []) as ProposalListItem[];

  useEffect(() => {
    if (!selectedProposalId && proposals[0]) {
      setSelectedProposalId(proposals[0].id);
    }
  }, [proposals, selectedProposalId]);

  const selectedProposal = proposals.find((proposal) => proposal.id === selectedProposalId) ?? null;
  const proposalDetailQuery = api.admin.proposals.get.useQuery(
    { projectId, proposalId: selectedProposalId ?? "" },
    { enabled: !!selectedProposalId },
  );
  const builderEmbedQuery = api.admin.proposals.getBuilderEmbed.useQuery(
    { projectId, proposalId: selectedProposalId ?? "" },
    {
      enabled: !!selectedProposalId && !!selectedProposal?.sourceAssetId,
    },
  );

  async function refresh() {
    await utils.admin.proposals.list.invalidate({ projectId });
    if (selectedProposalId) {
      await utils.admin.proposals.get.invalidate({ projectId, proposalId: selectedProposalId });
      await utils.admin.proposals.getBuilderEmbed.invalidate({
        projectId,
        proposalId: selectedProposalId,
      });
    }
    await utils.admin.projectWorkspace.overview.invalidate({ projectId });
  }

  async function handleCreateProposal() {
    const title = window.prompt("Proposal title");
    if (!title?.trim()) return;
    try {
      const created = await createProposalMutation.mutateAsync({
        projectId,
        title: title.trim(),
        version: "v1",
        status: "draft",
        currency,
      });
      setSelectedProposalId(created.id);
      await refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to create proposal.");
    }
  }

  async function handleUpload(droppedFiles: File[]) {
    const file = droppedFiles[0];
    if (!file || !selectedProposalId) return;
    setUploadingFiles([file]);
    setErrorMessage(null);
    try {
      const uploaded = await uploadSourceMutation.mutateAsync({
        projectId,
        fileName: file.name,
        mimeType: file.type || "application/pdf",
        sizeBytes: file.size,
      });

      const response = await fetch(uploaded.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/pdf" },
        body: file,
      });
      if (!response.ok) {
        throw new Error("Upload failed.");
      }

      await updateProposalMutation.mutateAsync({
        projectId,
        proposalId: selectedProposalId,
        sourceAssetId: uploaded.assetId,
      });
      setUploadingFiles(undefined);
      await refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to upload proposal.");
      setUploadingFiles(undefined);
    }
  }

  async function handleBuilderMetadata(detail: unknown) {
    if (!selectedProposalId || !detail || typeof detail !== "object") return;
    const record = detail as Record<string, unknown>;
    const nextTemplateId =
      typeof record.id === "number" || typeof record.id === "string"
        ? String(record.id)
        : undefined;
    const nextTemplateSlug = typeof record.slug === "string" ? record.slug : undefined;

    if (!nextTemplateId && !nextTemplateSlug) return;

    await updateProposalMutation.mutateAsync({
      projectId,
      proposalId: selectedProposalId,
      docusealTemplateId: nextTemplateId ?? undefined,
      docusealTemplateSlug: nextTemplateSlug ?? undefined,
    });
    await refresh();
  }

  async function handleSendForSignature() {
    if (!selectedProposalId) return;
    const email = window.prompt("Signer email");
    if (!email?.trim()) return;
    try {
      await createSubmissionMutation.mutateAsync({
        projectId,
        proposalId: selectedProposalId,
        submitters: [{ email: email.trim(), role: "Client signer" }],
      });
      await refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create signing request.",
      );
    }
  }

  async function handleCommentSubmit() {
    if (!selectedProposalId || !commentBody.trim()) return;
    try {
      await addCommentMutation.mutateAsync({
        projectId,
        proposalId: selectedProposalId,
        body: commentBody.trim(),
      });
      setCommentBody("");
      await refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to add comment.");
    }
  }

  const clientEmail = useMemo(() => {
    return contextQuery.data?.client?.name ? undefined : undefined;
  }, [contextQuery.data]);

  return (
    <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
      <aside className="rounded-[28px] border border-black/5 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Proposals</div>
            <div className="mt-1 text-lg font-semibold text-zinc-950">Drafts and signatures</div>
          </div>
          {mode === "admin" ? (
            <Button onClick={() => void handleCreateProposal()} size="sm" type="button">
              <PlusIcon className="size-4" />
            </Button>
          ) : null}
        </div>

        <div className="mt-5 space-y-2">
          {proposals.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/10 px-4 py-6 text-sm text-zinc-500">
              No proposals yet
            </div>
          ) : (
            proposals.map((proposal) => (
              <button
                className={`w-full rounded-2xl border px-4 py-3 text-left ${
                  selectedProposalId === proposal.id
                    ? "border-zinc-950 bg-zinc-950 text-white"
                    : "border-black/5 bg-[#faf8f4] text-zinc-800"
                }`}
                key={proposal.id}
                onClick={() => setSelectedProposalId(proposal.id)}
                type="button"
              >
                <div className="text-sm font-semibold">{proposal.title}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.16em] opacity-70">
                  {proposal.version} • {proposal.status}
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      <section className="space-y-5">
        {errorMessage ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {!selectedProposal ? (
          <div className="rounded-[28px] border border-black/5 bg-white p-8 shadow-sm">
            Select a proposal to open the builder.
          </div>
        ) : mode === "admin" ? (
          <>
            <Dropzone
              accept={{
                "application/pdf": [],
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
              }}
              className="min-h-[160px] rounded-[28px] border-dashed bg-white"
              maxFiles={1}
              maxSize={25 * 1024 * 1024}
              onDrop={(droppedFiles) => void handleUpload(droppedFiles)}
              src={uploadingFiles}
            >
              {uploadingFiles ? <DropzoneContent /> : <DropzoneEmptyState />}
            </Dropzone>

            <div className="flex items-center gap-2">
              <Button
                disabled={!selectedProposal.docusealTemplateId}
                onClick={() => void handleSendForSignature()}
                type="button"
                variant="outline"
              >
                <SendHorizonalIcon className="size-4" />
                Create signing request
              </Button>
            </div>

            {builderEmbedQuery.isLoading ? (
              <div className="rounded-[28px] border border-black/5 bg-white p-8 shadow-sm">
                Loading DocuSeal builder…
              </div>
            ) : !selectedProposal.sourceAssetId ? (
              <EmptyProposalSurface
                description="Upload a source PDF or DOCX file to start the proposal builder."
                title="Source document required"
              />
            ) : builderEmbedQuery.data?.configured === false ? (
              <EmptyProposalSurface
                description={builderEmbedQuery.data.message}
                title="DocuSeal configuration required"
              />
            ) : builderEmbedQuery.data?.configured ? (
              <div className="overflow-hidden rounded-[28px] border border-black/5 bg-white p-4 shadow-sm">
                <DocusealBuilderEmbed
                  onSave={(detail) => void handleBuilderMetadata(detail)}
                  onSend={(detail) => void handleBuilderMetadata(detail)}
                  scriptUrl={builderEmbedQuery.data.scriptUrl!}
                  token={builderEmbedQuery.data.token}
                />
              </div>
            ) : (
              <EmptyProposalSurface
                description="Unable to load the proposal builder."
                title="Builder unavailable"
              />
            )}
          </>
        ) : selectedProposal.docusealSubmitterEmbedUrl && builderEmbedQuery.data?.formScriptUrl ? (
          <div className="overflow-hidden rounded-[28px] border border-black/5 bg-white p-4 shadow-sm">
            <DocusealFormEmbed
              email={clientEmail}
              scriptUrl={builderEmbedQuery.data.formScriptUrl}
              src={selectedProposal.docusealSubmitterEmbedUrl}
            />
          </div>
        ) : (
          <EmptyProposalSurface
            description="This proposal is not ready for signing preview yet."
            title="Signing surface unavailable"
          />
        )}
      </section>

      <aside className="rounded-[28px] border border-black/5 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <MessageSquareIcon className="size-4" />
          Proposal comments
        </div>
        <div className="mt-4 space-y-3">
          {(proposalDetailQuery.data?.comments ?? []).length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/10 px-4 py-6 text-sm text-zinc-500">
              No comments yet
            </div>
          ) : (
            proposalDetailQuery.data?.comments.map((comment) => (
              <div className="rounded-2xl border border-black/5 bg-[#faf8f4] px-4 py-3" key={comment.id}>
                <div className="text-sm font-medium text-zinc-950">{comment.body}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.16em] text-zinc-400">
                  {comment.status}
                </div>
              </div>
            ))
          )}
        </div>
        {mode === "admin" ? (
          <div className="mt-4 space-y-3">
            <Textarea
              onChange={(event) => setCommentBody(event.target.value)}
              placeholder="Add a side comment for this proposal"
              rows={5}
              value={commentBody}
            />
            <Button
              disabled={!selectedProposalId || !commentBody.trim()}
              onClick={() => void handleCommentSubmit()}
              type="button"
            >
              <FileSignatureIcon className="size-4" />
              Add comment
            </Button>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

function EmptyProposalSurface({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[28px] border border-black/5 bg-white p-8 shadow-sm">
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <UploadIcon className="size-4" />
        Proposal workspace
      </div>
      <h2 className="mt-4 text-xl font-semibold text-zinc-950">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-zinc-600">{description}</p>
    </div>
  );
}
