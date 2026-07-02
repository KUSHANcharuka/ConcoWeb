"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2Icon,
  DownloadIcon,
  LoaderCircleIcon,
  SearchIcon,
  XCircleIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "~/trpc/react";

const requestKinds = [
  { key: "project", label: "Project Requests" },
  { key: "change", label: "Feature Requests" },
  { key: "guest", label: "Guest Intake" },
] as const;

type RequestKind = (typeof requestKinds)[number]["key"];
type RequestStatus = "all" | "pending" | "approved" | "rejected";

type AdminRequestsPageClientProps = {
  initialKind?: RequestKind;
  lockedKind?: RequestKind;
  projectId?: string;
  hideHeader?: boolean;
  hideKindSwitcher?: boolean;
};

type ListItem = {
  id: string;
  clientName: string;
  label: string;
  summary: string | null;
  status: "pending" | "approved" | "rejected";
  requestedByName: string | null;
  requestedByEmail: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
  projectId?: string | null;
  projectName?: string | null;
};

type AssetAttachment = {
  id: string;
  assetId: string;
  fileName: string;
  displayName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: Date;
};

type GuestAttachment = {
  id: string;
  fileName: string;
  displayName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: Date;
};

export function AdminRequestsPageClient({
  initialKind = "project",
  lockedKind,
  projectId,
  hideHeader = false,
  hideKindSwitcher = false,
}: AdminRequestsPageClientProps) {
  const utils = api.useUtils();
  const [kind, setKind] = useState<RequestKind>(lockedKind ?? initialKind);
  const [status, setStatus] = useState<RequestStatus>("pending");
  const [search, setSearch] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const statuses = status === "all" ? [] : [status];

  const projectRequestsQuery = api.admin.requests.listProjectRequests.useQuery(
    { search, statuses, projectId },
    { enabled: kind === "project" },
  );
  const changeRequestsQuery = api.admin.requests.listChangeRequests.useQuery(
    { search, statuses, projectId },
    { enabled: kind === "change" },
  );
  const guestRequestsQuery = api.admin.requests.listGuestPortalIntakes.useQuery(
    { search, statuses },
    { enabled: kind === "guest" },
  );

  const projectDetailQuery = api.admin.requests.getProjectRequest.useQuery(
    { requestId: selectedRequestId ?? "" },
    { enabled: kind === "project" && !!selectedRequestId },
  );
  const changeDetailQuery = api.admin.requests.getChangeRequest.useQuery(
    { requestId: selectedRequestId ?? "" },
    { enabled: kind === "change" && !!selectedRequestId },
  );
  const guestDetailQuery = api.admin.requests.getGuestPortalIntake.useQuery(
    { requestId: selectedRequestId ?? "" },
    { enabled: kind === "guest" && !!selectedRequestId },
  );

  const reviewProjectRequest = api.admin.requests.reviewProjectRequest.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.admin.requests.listProjectRequests.invalidate(),
        selectedRequestId
          ? utils.admin.requests.getProjectRequest.invalidate({ requestId: selectedRequestId })
          : Promise.resolve(),
      ]);
    },
  });
  const reviewChangeRequest = api.admin.requests.reviewChangeRequest.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.admin.requests.listChangeRequests.invalidate(),
        selectedRequestId
          ? utils.admin.requests.getChangeRequest.invalidate({ requestId: selectedRequestId })
          : Promise.resolve(),
      ]);
    },
  });
  const reviewGuestIntake = api.admin.requests.reviewGuestPortalIntake.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.admin.requests.listGuestPortalIntakes.invalidate(),
        selectedRequestId
          ? utils.admin.requests.getGuestPortalIntake.invalidate({ requestId: selectedRequestId })
          : Promise.resolve(),
      ]);
    },
  });
  const getAttachmentReadUrl = api.admin.requests.getAttachmentReadUrl.useMutation();

  const list = useMemo<ListItem[]>(() => {
    if (kind === "project") return (projectRequestsQuery.data ?? []) as ListItem[];
    if (kind === "change") return (changeRequestsQuery.data ?? []) as ListItem[];
    return (guestRequestsQuery.data ?? []) as ListItem[];
  }, [changeRequestsQuery.data, guestRequestsQuery.data, kind, projectRequestsQuery.data]);

  const activeListQuery =
    kind === "project"
      ? projectRequestsQuery
      : kind === "change"
        ? changeRequestsQuery
        : guestRequestsQuery;

  const activeDetail =
    kind === "project"
      ? projectDetailQuery.data
      : kind === "change"
        ? changeDetailQuery.data
        : guestDetailQuery.data;

  const activeRequest = (activeDetail?.request ?? null) as ListItem | null;
  const attachments = (activeDetail?.attachments ?? []) as Array<AssetAttachment | GuestAttachment>;

  useEffect(() => {
    if (!lockedKind) return;
    setKind(lockedKind);
  }, [lockedKind]);

  useEffect(() => {
    if (selectedRequestId) {
      const exists = list.some((request) => request.id === selectedRequestId);
      if (exists) return;
    }

    setSelectedRequestId(list[0]?.id ?? null);
  }, [list, selectedRequestId]);

  function handleKindChange(nextKind: RequestKind) {
    if (lockedKind) return;
    setKind(nextKind);
    setSelectedRequestId(null);
  }

  async function handleReview(nextStatus: "approved" | "rejected") {
    if (!selectedRequestId) return;
    if (kind === "project") {
      await reviewProjectRequest.mutateAsync({ requestId: selectedRequestId, status: nextStatus });
      return;
    }
    if (kind === "change") {
      await reviewChangeRequest.mutateAsync({ requestId: selectedRequestId, status: nextStatus });
      return;
    }
    await reviewGuestIntake.mutateAsync({ requestId: selectedRequestId, status: nextStatus });
  }

  async function handleOpenAttachment(attachment: AssetAttachment | GuestAttachment) {
    if (!selectedRequestId) return;
    const result = await getAttachmentReadUrl.mutateAsync(
      kind === "guest"
        ? {
            requestKind: "guest",
            requestId: selectedRequestId,
            attachmentId: attachment.id,
          }
        : {
            requestKind: kind,
            requestId: selectedRequestId,
            assetId: (attachment as AssetAttachment).assetId,
          },
    );
    window.open(result.url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="space-y-8">
      {!hideHeader ? (
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">Requests</p>
            <h1 className="mt-2 font-serif text-4xl leading-tight text-zinc-950">
              Client intake and feature review.
            </h1>
            <p className="mt-3 text-base leading-7 text-zinc-600">
              Review existing client requests and new guest onboarding submissions in one admin queue.
            </p>
          </div>
        </div>
      ) : null}

      {!hideKindSwitcher ? (
        <div className="flex flex-wrap items-center gap-2">
          {requestKinds.map((item) => (
            <Button
              disabled={!!lockedKind && lockedKind !== item.key}
              key={item.key}
              onClick={() => handleKindChange(item.key)}
              type="button"
              variant={kind === item.key ? "default" : "outline"}
            >
              {item.label}
            </Button>
          ))}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <section className="space-y-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-4">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px]">
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  className="pl-9"
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search requests, guests, or clients"
                  value={search}
                />
              </div>
              <Select onValueChange={(value) => setStatus(value as RequestStatus)} value={status}>
                <SelectTrigger>
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white">
            {activeListQuery.isLoading ? (
              <div className="flex min-h-[220px] items-center justify-center text-sm text-zinc-500">
                <LoaderCircleIcon className="mr-2 size-4 animate-spin" />
                Loading requests…
              </div>
            ) : activeListQuery.isError ? (
              <div className="p-6 text-sm text-red-700">{activeListQuery.error.message}</div>
            ) : list.length === 0 ? (
              <div className="p-6 text-sm text-zinc-500">No requests matched the current filters.</div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {list.map((request) => (
                  <button
                    className={[
                      "w-full px-5 py-4 text-left transition-colors",
                      selectedRequestId === request.id ? "bg-[#faf8f4]" : "hover:bg-zinc-50",
                    ].join(" ")}
                    key={request.id}
                    onClick={() => setSelectedRequestId(request.id)}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-zinc-950">
                          {request.label}
                        </div>
                        <div className="mt-1 text-xs uppercase tracking-[0.16em] text-zinc-400">
                          {request.clientName}
                          {request.projectName ? ` • ${request.projectName}` : ""}
                        </div>
                      </div>
                      <span className="rounded-full border border-zinc-200 px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-zinc-600">
                        {request.status}
                      </span>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-600">
                      {request.summary ?? "No summary provided."}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-6">
          {!selectedRequestId ? (
            <div className="flex min-h-[320px] items-center justify-center text-sm text-zinc-500">
              Select a request to review the detail surface.
            </div>
          ) : (kind === "project" && projectDetailQuery.isLoading) ||
            (kind === "change" && changeDetailQuery.isLoading) ||
            (kind === "guest" && guestDetailQuery.isLoading) ? (
            <div className="flex min-h-[320px] items-center justify-center text-sm text-zinc-500">
              <LoaderCircleIcon className="mr-2 size-4 animate-spin" />
              Loading request detail…
            </div>
          ) : !activeRequest ? (
            <div className="text-sm text-zinc-500">Request detail is unavailable.</div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                    {activeRequest.clientName}
                    {activeRequest.projectName ? ` • ${activeRequest.projectName}` : ""}
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold text-zinc-950">{activeRequest.label}</h2>
                  <div className="mt-2 text-sm text-zinc-500">
                    Submitted by {activeRequest.requestedByName ?? activeRequest.requestedByEmail ?? "Unknown contact"}
                    {activeRequest.requestedByEmail ? ` • ${activeRequest.requestedByEmail}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs uppercase tracking-[0.14em] text-zinc-600">
                    {activeRequest.status}
                  </span>
                  {activeRequest.projectId ? (
                    <Button asChild type="button" variant="outline">
                      <Link href={`/admin/projects/${activeRequest.projectId}/overview`}>Open project</Link>
                    </Button>
                  ) : null}
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-[#faf8f4] p-5 text-sm leading-7 text-zinc-700">
                {activeRequest.summary ?? "No summary provided."}
              </div>

              <div className="space-y-3">
                <div className="text-sm font-medium text-zinc-900">Attachments</div>
                {attachments.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-zinc-200 px-4 py-6 text-sm text-zinc-500">
                    No attachments were included with this request.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {attachments.map((attachment) => (
                      <div
                        className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 px-4 py-3"
                        key={attachment.id}
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-zinc-900">
                            {attachment.displayName || attachment.fileName}
                          </div>
                          <div className="mt-1 text-xs uppercase tracking-[0.12em] text-zinc-400">
                            {attachment.mimeType}
                          </div>
                        </div>
                        <Button
                          onClick={() => void handleOpenAttachment(attachment)}
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          <DownloadIcon className="size-4" />
                          Open
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-4">
                <Button
                  disabled={
                    activeRequest.status !== "pending" ||
                    reviewProjectRequest.isPending ||
                    reviewChangeRequest.isPending ||
                    reviewGuestIntake.isPending
                  }
                  onClick={() => void handleReview("approved")}
                  type="button"
                >
                  <CheckCircle2Icon className="size-4" />
                  Approve
                </Button>
                <Button
                  disabled={
                    activeRequest.status !== "pending" ||
                    reviewProjectRequest.isPending ||
                    reviewChangeRequest.isPending ||
                    reviewGuestIntake.isPending
                  }
                  onClick={() => void handleReview("rejected")}
                  type="button"
                  variant="outline"
                >
                  <XCircleIcon className="size-4" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
