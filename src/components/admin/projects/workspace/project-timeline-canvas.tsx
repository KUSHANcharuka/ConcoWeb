"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  CircleDashedIcon,
  Clock3Icon,
  FlagIcon,
  MilestoneIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  TriangleAlertIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "~/trpc/react";

type TimelineItem = {
  id: string;
  title: string;
  description: string | null;
  itemType:
    | "milestone"
    | "payment_due"
    | "proposal_sent"
    | "delivery"
    | "review"
    | "change_request"
    | "custom";
  status: "planned" | "current" | "completed" | "delayed" | "cancelled";
  startsAt: string | Date | null;
  dueAt: string | Date | null;
  completedAt: string | Date | null;
  sortOrder: number;
  visibleToClient: boolean;
  layoutX: number;
  layoutY: number;
};

type TimelineFormState = {
  title: string;
  description: string;
  itemType: TimelineItem["itemType"];
  status: TimelineItem["status"];
  startsAt: string;
  dueAt: string;
  completedAt: string;
  visibleToClient: boolean;
  layoutX: number;
  layoutY: number;
};

export function ProjectTimelineCanvas({
  projectId,
  mode,
}: {
  projectId: string;
  mode: "admin" | "client-preview" | "client";
}) {
  const utils = api.useUtils();
  const timelineQuery = api.admin.timeline.list.useQuery(
    { projectId },
    { enabled: mode !== "client" },
  );
  const clientTimelineQuery = api.clientPortal.timeline.list.useQuery(
    { projectId },
    { enabled: mode === "client" },
  );
  const projectContextQuery = api.admin.projectWorkspace.context.useQuery(
    { projectId },
    { enabled: mode !== "client" },
  );
  const clientProjectContextQuery = api.clientPortal.projectWorkspace.context.useQuery(
    { projectId },
    { enabled: mode === "client" },
  );
  const createMutation = api.admin.timeline.create.useMutation();
  const updateMutation = api.admin.timeline.update.useMutation();
  const deleteMutation = api.admin.timeline.delete.useMutation();

  const [draft, setDraft] = useState<TimelineFormState | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [railProgress, setRailProgress] = useState<{
    startOffset: number;
    todayOffset: number;
  } | null>(null);
  const timelineBodyRef = useRef<HTMLDivElement | null>(null);
  const startMarkerRef = useRef<HTMLDivElement | null>(null);
  const todayMarkerRef = useRef<HTMLDivElement | null>(null);

  const items = useMemo(() => {
    const baseItems =
      mode === "client" ? clientTimelineQuery.data ?? [] : timelineQuery.data ?? [];
    return [...baseItems].sort((left, right) => {
      const leftTimestamp = resolveTimelineTimestamp(left);
      const rightTimestamp = resolveTimelineTimestamp(right);
      if (leftTimestamp !== rightTimestamp) {
        return rightTimestamp - leftTimestamp;
      }
      if (left.sortOrder !== right.sortOrder) {
        return right.sortOrder - left.sortOrder;
      }
      return left.title.localeCompare(right.title);
    });
  }, [clientTimelineQuery.data, mode, timelineQuery.data]);

  const visibleItems =
    mode === "admin" ? items : items.filter((item) => item.visibleToClient);
  const currentItem = visibleItems.find((item) => item.status === "current") ?? null;
  const now = new Date();
  const projectStartDate = useMemo(() => {
    const rawStartDate =
      mode === "client"
        ? clientProjectContextQuery.data?.startDate
        : projectContextQuery.data?.startDate;
    if (rawStartDate) {
      const parsed = new Date(rawStartDate);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }

    const earliestItem = [...visibleItems].reverse().find((item) => resolveTimelineTimestamp(item) !== Number.MAX_SAFE_INTEGER);
    if (!earliestItem) {
      return null;
    }

    const fallback = earliestItem.startsAt ?? earliestItem.dueAt ?? earliestItem.completedAt;
    if (!fallback) return null;
    const parsed = fallback instanceof Date ? fallback : new Date(fallback);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }, [
    clientProjectContextQuery.data?.startDate,
    mode,
    projectContextQuery.data?.startDate,
    visibleItems,
  ]);

  const todayMarkerIndex = visibleItems.findIndex(
    (item) => resolveTimelineTimestamp(item) <= now.getTime(),
  );
  const startMarkerIndex =
    projectStartDate === null
      ? -1
      : visibleItems.findIndex(
          (item) => resolveTimelineTimestamp(item) <= projectStartDate.getTime(),
        );

  const timelineEntries = useMemo(() => {
    const entries: Array<
      { type: "item"; item: TimelineItem } | { type: "today" } | { type: "start" }
    > = [];

    visibleItems.forEach((item, index) => {
      if (index === todayMarkerIndex) {
        entries.push({ type: "today" });
      }
      if (index === startMarkerIndex) {
        entries.push({ type: "start" });
      }
      entries.push({ type: "item", item });
    });

    if (visibleItems.length === 0 || todayMarkerIndex === -1) {
      entries.push({ type: "today" });
    }

    if (projectStartDate && (visibleItems.length === 0 || startMarkerIndex === -1)) {
      entries.push({ type: "start" });
    }

    return entries;
  }, [projectStartDate, startMarkerIndex, todayMarkerIndex, visibleItems]);

  useEffect(() => {
    if (!timelineBodyRef.current || !startMarkerRef.current || !todayMarkerRef.current) {
      setRailProgress(null);
      return;
    }

    const updateOffsets = () => {
      const containerRect = timelineBodyRef.current?.getBoundingClientRect();
      const startRect = startMarkerRef.current?.getBoundingClientRect();
      const todayRect = todayMarkerRef.current?.getBoundingClientRect();

      if (!containerRect || !startRect || !todayRect) {
        setRailProgress(null);
        return;
      }

      const nextStartOffset = startRect.top - containerRect.top + startRect.height / 2;
      const nextTodayOffset = todayRect.top - containerRect.top + todayRect.height / 2;

      setRailProgress((current) => {
        if (
          current &&
          Math.abs(current.startOffset - nextStartOffset) < 0.5 &&
          Math.abs(current.todayOffset - nextTodayOffset) < 0.5
        ) {
          return current;
        }

        return {
          startOffset: nextStartOffset,
          todayOffset: nextTodayOffset,
        };
      });
    };

    updateOffsets();

    const resizeObserver = new ResizeObserver(updateOffsets);
    resizeObserver.observe(timelineBodyRef.current);
    resizeObserver.observe(startMarkerRef.current);
    resizeObserver.observe(todayMarkerRef.current);
    window.addEventListener("resize", updateOffsets);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateOffsets);
    };
  }, [timelineEntries]);

  async function refresh() {
    if (mode === "client") return;
    await utils.admin.timeline.list.invalidate({ projectId });
    await utils.admin.projectWorkspace.overview.invalidate({ projectId });
  }

  async function handleDelete(itemId: string) {
    await deleteMutation.mutateAsync({ projectId, itemId });
    await refresh();
  }

  async function handleSave() {
    if (!draft) return;

    const payload = {
      projectId,
      title: draft.title.trim(),
      description: draft.description.trim() || null,
      itemType: draft.itemType,
      status: draft.status,
      startsAt: draft.startsAt || null,
      dueAt: draft.dueAt || null,
      completedAt: draft.completedAt || null,
      visibleToClient: draft.visibleToClient,
      layoutX: draft.layoutX,
      layoutY: draft.layoutY,
    };

    if (editingItemId) {
      await updateMutation.mutateAsync({
        projectId,
        itemId: editingItemId,
        title: payload.title,
        description: payload.description,
        itemType: payload.itemType,
        status: payload.status,
        startsAt: payload.startsAt,
        dueAt: payload.dueAt,
        completedAt: payload.completedAt,
        visibleToClient: payload.visibleToClient,
      });
    } else {
      await createMutation.mutateAsync(payload);
    }

    setDraft(null);
    setEditingItemId(null);
    await refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="border-zinc-200 bg-zinc-50 px-3 py-1 text-zinc-700" variant="outline">
            <CalendarDaysIcon className="size-3.5" />
            {visibleItems.length} timeline {visibleItems.length === 1 ? "item" : "items"}
          </Badge>
          {currentItem ? (
            <Badge className="border-yellow-300 bg-yellow-100 px-3 py-1 text-zinc-900" variant="outline">
              Today: {currentItem.title}
            </Badge>
          ) : null}
        </div>
        {mode === "admin" ? (
          <Button
            onClick={() => {
              setEditingItemId(null);
              setDraft({
                title: "",
                description: "",
                itemType: "milestone",
                status: "planned",
                startsAt: "",
                dueAt: "",
                completedAt: "",
                visibleToClient: true,
                layoutX: 0,
                layoutY: 0,
              });
            }}
            type="button"
          >
            <PlusIcon className="size-4" />
            Add timeline item
          </Button>
        ) : null}
      </div>

      {(mode === "client" ? clientTimelineQuery.isLoading : timelineQuery.isLoading) ? (
        <div className="border border-black/5 bg-white p-8 text-sm text-zinc-500 shadow-sm">
          Loading timeline…
        </div>
      ) : (mode === "client" ? clientTimelineQuery.isError : timelineQuery.isError) ? (
        <div className="border border-red-200 bg-red-50 p-8 text-sm text-red-700 shadow-sm">
          {(mode === "client" ? clientTimelineQuery.error : timelineQuery.error)?.message}
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="border border-black/5 bg-white p-8 shadow-sm">
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold text-zinc-950">No timeline items yet</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-600">
              Add the first milestone, payment reminder, proposal handoff, or delivery note.
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-black/5 bg-[#f5f2ea] p-6 shadow-sm sm:p-8">
          <div className="relative mx-auto max-w-5xl" ref={timelineBodyRef}>
            <div className="absolute bottom-0 left-[19px] top-0 w-px bg-zinc-300 sm:left-1/2 sm:-ml-px" />
            {railProgress ? (
              <div
                className="absolute left-[19px] w-px bg-yellow-300 sm:left-1/2 sm:-ml-px"
                style={{
                  top: Math.min(railProgress.startOffset, railProgress.todayOffset),
                  height: Math.abs(railProgress.startOffset - railProgress.todayOffset),
                }}
              />
            ) : null}

            <div className="space-y-10">
              {timelineEntries.map((entry, index) => {
                const isTodayEntry = entry.type === "today";
                const isStartEntry = entry.type === "start";
                const item = entry.type === "item" ? entry.item : null;
                const itemIndex = item ? visibleItems.findIndex((candidate) => candidate.id === item.id) : -1;
                const side = itemIndex >= 0 && itemIndex % 2 !== 0 ? "right" : "left";
                const markerStyle = item ? getMarkerStyle(item.status) : null;
                const MarkerIcon = markerStyle?.icon;

                return (
                  <article
                    className="relative sm:grid sm:grid-cols-[minmax(0,1fr)_40px_minmax(0,1fr)] sm:gap-6"
                    key={
                      item?.id ??
                      (isTodayEntry ? `today-marker-${index}` : `start-marker-${index}`)
                    }
                  >
                    {item ? (
                      <div
                        className={[
                          "pl-14 sm:pl-0",
                          side === "left"
                            ? "sm:col-start-1 sm:row-start-1 sm:pr-8"
                            : "sm:col-start-3 sm:row-start-1 sm:pl-8",
                        ].join(" ")}
                      >
                        <div className="border border-black/5 bg-white p-5 shadow-[0_18px_40px_rgba(17,24,39,0.08)]">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge
                                  className={markerStyle!.badgeClassName}
                                  variant="outline"
                                >
                                  {markerStyle!.label}
                                </Badge>
                                <Badge className="border-zinc-200 px-2 py-0.5 text-zinc-600" variant="outline">
                                  {labelize(item.itemType)}
                                </Badge>
                                {!item.visibleToClient && mode === "admin" ? (
                                  <Badge className="border-zinc-300 px-2 py-0.5 text-zinc-500" variant="outline">
                                    Hidden from client
                                  </Badge>
                                ) : null}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-zinc-950">{item.title}</h3>
                                <p className="mt-1 text-sm leading-6 text-zinc-600">
                                  {item.description || "No additional note for this timeline item."}
                                </p>
                              </div>
                            </div>

                            {mode === "admin" ? (
                              <div className="flex items-center gap-1">
                                <button
                                  className="p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
                                  onClick={() => {
                                    setEditingItemId(item.id);
                                    setDraft(toFormState(item));
                                  }}
                                  type="button"
                                >
                                  <PencilIcon className="size-4" />
                                </button>
                                <button
                                  className="p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-red-600"
                                  onClick={() => void handleDelete(item.id)}
                                  type="button"
                                >
                                  <Trash2Icon className="size-4" />
                                </button>
                              </div>
                            ) : null}
                          </div>

                          <div className="mt-4 grid gap-3 text-sm text-zinc-600 sm:grid-cols-3">
                            <TimelineMeta label="Date" value={formatTimelineDate(item)} />
                            <TimelineMeta label="Status" value={labelize(item.status)} />
                            <TimelineMeta
                              label="Visibility"
                              value={item.visibleToClient ? "Client visible" : "Admin only"}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="pl-14 sm:col-span-3 sm:pl-0">
                        <div className="sm:grid sm:grid-cols-[minmax(0,1fr)_40px_minmax(0,1fr)] sm:gap-6">
                          {isTodayEntry ? (
                            <>
                              <div className="hidden sm:block" />
                              <div className="hidden sm:block" />
                              <div className="sm:col-start-1 sm:row-start-1 sm:justify-self-end sm:pr-8">
                                <Badge className="border-black bg-zinc-950 px-3 py-1 text-white" variant="outline">
                                  {formatTodayLabel(now)}
                                </Badge>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="hidden sm:block" />
                              <div className="hidden sm:block" />
                              <div className="sm:col-start-3 sm:row-start-1 sm:justify-self-start sm:pl-8">
                                <Badge className="border-zinc-300 bg-white px-3 py-1 text-zinc-700" variant="outline">
                                  Project started {formatTodayLabel(projectStartDate ?? now)}
                                </Badge>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 top-0 flex w-10 items-stretch justify-center sm:static sm:col-start-2 sm:row-start-1 sm:w-auto">
                      <div className="relative flex h-full w-full items-center justify-center">
                        {item ? (
                          <div
                            className={[
                              "relative z-10 flex h-10 w-10 items-center justify-center border text-zinc-950 shadow-sm",
                              markerStyle!.markerClassName,
                            ].join(" ")}
                          >
                            {MarkerIcon ? <MarkerIcon className="size-4" /> : null}
                          </div>
                        ) : isTodayEntry ? (
                          <div className="relative z-10 flex items-center justify-center">
                            <div className="absolute h-8 w-8 rounded-full bg-yellow-300/25 animate-pulse" />
                            <div
                              className="h-5 w-5 rounded-full border-4 border-zinc-950 bg-yellow-300 shadow-sm"
                              ref={todayMarkerRef}
                            />
                          </div>
                        ) : (
                          <div
                            className="relative z-10 flex h-10 w-10 items-center justify-center border border-zinc-300 bg-white text-zinc-950 shadow-sm"
                            ref={startMarkerRef}
                          >
                            <div className="absolute h-8 w-8 rounded-full bg-zinc-950/5 animate-pulse" />
                            <FlagIcon className="size-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            setDraft(null);
            setEditingItemId(null);
          }
        }}
        open={mode === "admin" && draft !== null}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItemId ? "Edit timeline item" : "Add timeline item"}</DialogTitle>
            <DialogDescription>
              This date-driven timeline is shared by the admin view and the client preview.
            </DialogDescription>
          </DialogHeader>

          {draft ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-medium text-zinc-800">Title</span>
                <Input
                  onChange={(event) =>
                    setDraft((current) =>
                      current ? { ...current, title: event.target.value } : current,
                    )
                  }
                  value={draft.title}
                />
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-medium text-zinc-800">Description</span>
                <Textarea
                  onChange={(event) =>
                    setDraft((current) =>
                      current ? { ...current, description: event.target.value } : current,
                    )
                  }
                  rows={4}
                  value={draft.description}
                />
              </label>

              <SimpleSelect
                label="Type"
                onChange={(value) =>
                  setDraft((current) =>
                    current
                      ? { ...current, itemType: value as TimelineFormState["itemType"] }
                      : current,
                  )
                }
                options={[
                  ["milestone", "Milestone"],
                  ["payment_due", "Payment due"],
                  ["proposal_sent", "Proposal sent"],
                  ["delivery", "Delivery"],
                  ["review", "Review"],
                  ["change_request", "Feature request"],
                  ["custom", "Custom"],
                ]}
                value={draft.itemType}
              />

              <SimpleSelect
                label="Status"
                onChange={(value) =>
                  setDraft((current) =>
                    current
                      ? { ...current, status: value as TimelineFormState["status"] }
                      : current,
                  )
                }
                options={[
                  ["planned", "Planned"],
                  ["current", "Current"],
                  ["completed", "Completed"],
                  ["delayed", "Delayed"],
                  ["cancelled", "Cancelled"],
                ]}
                value={draft.status}
              />

              <SimpleDateField
                label="Starts at"
                onChange={(value) =>
                  setDraft((current) => (current ? { ...current, startsAt: value } : current))
                }
                value={draft.startsAt}
              />
              <SimpleDateField
                label="Due at"
                onChange={(value) =>
                  setDraft((current) => (current ? { ...current, dueAt: value } : current))
                }
                value={draft.dueAt}
              />
              <SimpleDateField
                label="Completed at"
                onChange={(value) =>
                  setDraft((current) =>
                    current ? { ...current, completedAt: value } : current,
                  )
                }
                value={draft.completedAt}
              />

              <label className="flex items-center gap-3 border border-black/10 px-3 py-3 text-sm text-zinc-700 sm:col-span-2">
                <Checkbox
                  checked={draft.visibleToClient}
                  onCheckedChange={(checked) =>
                    setDraft((current) =>
                      current ? { ...current, visibleToClient: checked === true } : current,
                    )
                  }
                />
                Visible in client preview
              </label>
            </div>
          ) : null}

          <DialogFooter>
            <Button
              onClick={() => {
                setDraft(null);
                setEditingItemId(null);
              }}
              type="button"
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              disabled={
                !draft?.title.trim() ||
                createMutation.isPending ||
                updateMutation.isPending
              }
              onClick={() => void handleSave()}
              type="button"
            >
              {editingItemId ? "Save changes" : "Create item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TimelineMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">{label}</div>
      <div className="text-sm text-zinc-700">{value}</div>
    </div>
  );
}

function resolveTimelineTimestamp(item: TimelineItem) {
  const value = item.startsAt ?? item.dueAt ?? item.completedAt;
  if (!value) return Number.MAX_SAFE_INTEGER;
  const date = value instanceof Date ? value : new Date(value);
  const time = date.getTime();
  return Number.isNaN(time) ? Number.MAX_SAFE_INTEGER : time;
}

function getMarkerStyle(status: TimelineItem["status"]) {
  switch (status) {
    case "current":
      return {
        badgeClassName: "border-yellow-300 bg-yellow-100 text-zinc-900",
        markerClassName: "border-yellow-300 bg-yellow-300",
        label: "Current",
        icon: Clock3Icon,
      };
    case "completed":
      return {
        badgeClassName: "border-emerald-300 bg-emerald-100 text-emerald-900",
        markerClassName: "border-emerald-300 bg-emerald-200",
        label: "Completed",
        icon: CheckCircle2Icon,
      };
    case "delayed":
      return {
        badgeClassName: "border-amber-300 bg-amber-100 text-amber-900",
        markerClassName: "border-amber-300 bg-amber-200",
        label: "Delayed",
        icon: TriangleAlertIcon,
      };
    case "cancelled":
      return {
        badgeClassName: "border-zinc-300 bg-zinc-100 text-zinc-700",
        markerClassName: "border-zinc-300 bg-zinc-200",
        label: "Cancelled",
        icon: CircleDashedIcon,
      };
    default:
      return {
        badgeClassName: "border-sky-300 bg-sky-100 text-sky-900",
        markerClassName: "border-sky-300 bg-white",
        label: "Planned",
        icon: MilestoneIcon,
      };
  }
}

function toFormState(item: TimelineItem): TimelineFormState {
  return {
    title: item.title,
    description: item.description ?? "",
    itemType: item.itemType,
    status: item.status,
    startsAt: toDateInput(item.startsAt),
    dueAt: toDateInput(item.dueAt),
    completedAt: toDateInput(item.completedAt),
    visibleToClient: item.visibleToClient,
    layoutX: item.layoutX,
    layoutY: item.layoutY,
  };
}

function toDateInput(value: string | Date | null) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function formatTimelineDate(item: TimelineItem) {
  const primary = item.startsAt ?? item.dueAt ?? item.completedAt;
  const formatted = formatShortDate(primary);
  return formatted ?? "Undated";
}

function formatTodayLabel(value: Date) {
  return value.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatShortDate(value: string | Date | null) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function labelize(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function SimpleSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-zinc-800">{label}</span>
      <select
        className="flex h-10 w-full border border-black/10 bg-white px-3 text-sm"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function SimpleDateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-zinc-800">{label}</span>
      <Input onChange={(event) => onChange(event.target.value)} type="date" value={value} />
    </label>
  );
}
