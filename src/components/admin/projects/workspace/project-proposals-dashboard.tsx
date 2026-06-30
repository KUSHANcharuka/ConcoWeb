"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { MoreHorizontalIcon, PlusIcon, CopyIcon, ArrowUpRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "~/trpc/react";

type ProjectProposalsDashboardProps = {
  mode: "admin" | "client-preview" | "client";
  projectId: string;
};

export function ProjectProposalsDashboard({
  mode,
  projectId,
}: ProjectProposalsDashboardProps) {
  const utils = api.useUtils();
  const router = useRouter();
  const adminProposalsQuery = api.admin.proposals.list.useQuery(
    { projectId },
    { enabled: mode !== "client" },
  );
  const clientProposalsQuery = api.clientPortal.proposals.list.useQuery(
    { projectId },
    { enabled: mode === "client" },
  );
  const createProposalMutation = api.admin.proposals.create.useMutation();
  const duplicateProposalMutation = api.admin.proposals.duplicate.useMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [version, setVersion] = useState("v1");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const proposals = useMemo(
    () => (mode === "client" ? clientProposalsQuery.data : adminProposalsQuery.data) ?? [],
    [adminProposalsQuery.data, clientProposalsQuery.data, mode],
  );
  const basePath =
    mode === "admin"
      ? `/admin/projects/${projectId}/proposals`
      : mode === "client-preview"
        ? `/admin/projects/${projectId}/client-view/proposals`
        : `/client-portal/projects/${projectId}/proposals`;

  async function refresh() {
    if (mode === "client") {
      await utils.clientPortal.proposals.list.invalidate({ projectId });
      await utils.clientPortal.projectWorkspace.overview.invalidate({ projectId });
      return;
    }

    await utils.admin.proposals.list.invalidate({ projectId });
    await utils.admin.projectWorkspace.overview.invalidate({ projectId });
  }

  async function handleCreateProposal() {
    setErrorMessage(null);
    try {
      const created = await createProposalMutation.mutateAsync({
        projectId,
        title: title.trim(),
        version: version.trim() || "v1",
      });

      await refresh();
      setDialogOpen(false);
      setTitle("");
      setVersion("v1");
      router.push(`${basePath}/${created.id}`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to create proposal.");
    }
  }

  async function handleDuplicateProposal(proposalId: string) {
    try {
      const duplicated = await duplicateProposalMutation.mutateAsync({
        projectId,
        proposalId,
      });
      await refresh();
      router.push(`${basePath}/${duplicated.id}`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to duplicate proposal.");
    }
  }

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="text-sm text-zinc-500">
              Review drafts, sent proposals, signed records, and revision branches from one place.
            </div>
          </div>
          {mode === "admin" ? (
            <Button onClick={() => setDialogOpen(true)} type="button">
              <PlusIcon className="size-4" />
              New proposal
            </Button>
          ) : null}
        </div>

        {errorMessage ? (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {proposals.length === 0 ? (
          <div className="border border-dashed border-black/10 bg-white px-6 py-10 text-sm text-zinc-500">
            No proposals created yet.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {proposals.map((proposal) => (
              <article className="border border-black/5 bg-white p-5 shadow-sm" key={proposal.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="inline-flex border border-black/10 px-2 py-1 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                      {proposal.status}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-zinc-950">{proposal.title}</h2>
                      <div className="mt-1 text-sm text-zinc-500">{proposal.version}</div>
                    </div>
                  </div>
                  {mode === "admin" ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon-sm" type="button" variant="outline">
                          <MoreHorizontalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`${basePath}/${proposal.id}`}>
                            <ArrowUpRightIcon className="size-4" />
                            Open proposal
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => void handleDuplicateProposal(proposal.id)}>
                          <CopyIcon className="size-4" />
                          Duplicate draft
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : null}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <DashboardMetric label="Created" value={formatDate(proposal.createdAt)} />
                  <DashboardMetric label="Comments" value={String(Number(proposal.commentCount ?? 0))} />
                  <DashboardMetric
                    label="Sent"
                    value={proposal.sentAt ? formatDate(proposal.sentAt) : "Not sent"}
                  />
                  <DashboardMetric label="Updated" value={formatDate(proposal.updatedAt)} />
                </div>

                <p className="mt-5 text-sm leading-6 text-zinc-600">
                  {buildProposalSummary(proposal.status, proposal.sentAt, proposal.signedAt, proposal.declinedAt)}
                </p>

                <div className="mt-5">
                  <Button asChild type="button" variant="outline">
                    <Link href={`${basePath}/${proposal.id}`}>
                      Open proposal
                      <ArrowUpRightIcon className="size-4" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Create proposal</DialogTitle>
            <DialogDescription>
              Start a new draft. The draft remains editable until it is sent to client recipients.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="proposal-title">Title</Label>
              <Input
                id="proposal-title"
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Website redesign proposal"
                value={title}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="proposal-version">Version</Label>
              <Input
                id="proposal-version"
                onChange={(event) => setVersion(event.target.value)}
                placeholder="v1"
                value={version}
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)} type="button" variant="outline">
              Cancel
            </Button>
            <Button
              disabled={!title.trim() || createProposalMutation.isPending}
              onClick={() => void handleCreateProposal()}
              type="button"
            >
              Create draft
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function DashboardMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-black/5 bg-[#faf8f4] px-3 py-3">
      <div className="text-xs uppercase tracking-[0.14em] text-zinc-500">{label}</div>
      <div className="mt-2 text-sm font-medium text-zinc-950">{value}</div>
    </div>
  );
}

function formatDate(value: string | Date | null) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString();
}

function buildProposalSummary(
  status: string,
  sentAt: string | Date | null,
  signedAt: string | Date | null,
  declinedAt: string | Date | null,
) {
  if (status === "draft") {
    return "Draft proposal. Upload a source file, prepare it in DocuSeal, and send it when the document is ready.";
  }
  if (status === "signed") {
    return `Signed on ${formatDate(signedAt)}. This proposal is now locked as a historical record.`;
  }
  if (status === "declined") {
    return `Declined on ${formatDate(declinedAt)}. Duplicate it to prepare a revised draft.`;
  }
  return `Sent on ${formatDate(sentAt)}. Comments and signer activity now live on the proposal detail page.`;
}
