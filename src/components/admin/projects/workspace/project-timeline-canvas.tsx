"use client";

import "@xyflow/react/dist/style.css";

import { useMemo, useState } from "react";
import {
  addEdge,
  Background,
  BaseEdge,
  Controls,
  getStraightPath,
  type Edge,
  type Node,
  type NodeProps,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import {
  CalendarDaysIcon,
  GripVerticalIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";

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

export function ProjectTimelineCanvas({
  projectId,
  mode,
}: {
  projectId: string;
  mode: "admin" | "client-preview";
}) {
  return (
    <ReactFlowProvider>
      <ProjectTimelineCanvasInner mode={mode} projectId={projectId} />
    </ReactFlowProvider>
  );
}

function ProjectTimelineCanvasInner({
  projectId,
  mode,
}: {
  projectId: string;
  mode: "admin" | "client-preview";
}) {
  const utils = api.useUtils();
  const reactFlow = useReactFlow();
  const timelineQuery = api.admin.timeline.list.useQuery({ projectId });
  const createMutation = api.admin.timeline.create.useMutation();
  const updateMutation = api.admin.timeline.update.useMutation();
  const repositionMutation = api.admin.timeline.reposition.useMutation();
  const deleteMutation = api.admin.timeline.delete.useMutation();

  const [draft, setDraft] = useState<TimelineFormState | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const items = timelineQuery.data ?? [];

  const nodes = useMemo<Node<TimelineNodeData>[]>(() => {
    return items.map((item) => ({
      id: item.id,
      type: "timeline-card",
      position: { x: item.layoutX, y: item.layoutY },
      data: {
        item,
        canEdit: mode === "admin",
        onEdit: () => {
          setEditingItemId(item.id);
          setDraft(toFormState(item));
        },
        onDelete: () => void handleDelete(item.id),
      },
      draggable: mode === "admin",
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }));
  }, [items, mode]);

  const edges = useMemo<Edge[]>(() => {
    return items
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .slice(1)
      .map((item, index) => {
        const previous = items
          .slice()
          .sort((a, b) => a.sortOrder - b.sortOrder)[index];
        return {
          id: `${previous.id}-${item.id}`,
          source: previous.id,
          target: item.id,
          type: "timeline-edge",
        };
      });
  }, [items]);

  async function refresh() {
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
      title: draft.title,
      description: draft.description || null,
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
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-zinc-600"
            onClick={() => {
              const focusItem =
                items.find((item) => item.status === "current") ??
                items.find((item) => item.status === "planned") ??
                items[0];
              if (!focusItem) return;
              reactFlow.setCenter(focusItem.layoutX + 115, focusItem.layoutY + 60, {
                zoom: 1,
                duration: 400,
              });
            }}
            type="button"
          >
            <CalendarDaysIcon className="size-4" />
            Jump to today
          </button>
        </div>
        <div className="flex items-center gap-2">
          {mode === "admin" ? (
            <Button
              className="rounded-full"
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
                  layoutX: 120 + items.length * 220,
                  layoutY: items.length % 2 === 0 ? 80 : 240,
                });
              }}
              type="button"
            >
              <PlusIcon className="size-4" />
              Add timeline item
            </Button>
          ) : null}
        </div>
      </div>

      {timelineQuery.isLoading ? (
        <div className="rounded-[28px] border border-black/5 bg-white p-8 text-sm text-zinc-500 shadow-sm">
          Loading timeline canvas…
        </div>
      ) : timelineQuery.isError ? (
        <div className="rounded-[28px] border border-red-200 bg-red-50 p-8 text-sm text-red-700 shadow-sm">
          {timelineQuery.error.message}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-[28px] border border-black/5 bg-white p-8 shadow-sm">
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold text-zinc-950">No timeline items yet</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-600">
              Create the first milestone, delivery point, or review checkpoint. The same
              data will render in the client preview without edit controls.
            </p>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-sm">
          <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[linear-gradient(90deg,rgba(0,0,0,0.05),rgba(0,0,0,0.18),rgba(0,0,0,0.05))]" />
          <div className="h-[620px]">
            <ReactFlow
              defaultEdgeOptions={{ type: "timeline-edge" }}
              edges={edges}
              edgeTypes={{ "timeline-edge": TimelineEdge }}
              fitView
              fitViewOptions={{ padding: 0.18 }}
              nodeTypes={{ "timeline-card": TimelineNode }}
              nodes={nodes}
              nodesDraggable={mode === "admin"}
              onConnect={(connection) => addEdge(connection, edges)}
              onNodeDragStop={(_, node) => {
                if (mode !== "admin") return;
                void repositionMutation
                  .mutateAsync({
                    projectId,
                    itemId: node.id,
                    layoutX: Math.round(node.position.x),
                    layoutY: Math.round(node.position.y),
                  })
                  .then(refresh);
              }}
              panOnDrag
              proOptions={{ hideAttribution: true }}
            >
              <Background color="rgba(0,0,0,0.05)" gap={32} />
              <Controls showInteractive={false} />
            </ReactFlow>
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
        open={draft !== null}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItemId ? "Edit timeline item" : "Add timeline item"}</DialogTitle>
            <DialogDescription>
              This data drives both the admin canvas and the client preview.
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
                    current ? { ...current, itemType: value as TimelineFormState["itemType"] } : current,
                  )
                }
                options={[
                  ["milestone", "Milestone"],
                  ["payment_due", "Payment due"],
                  ["proposal_sent", "Proposal sent"],
                  ["delivery", "Delivery"],
                  ["review", "Review"],
                  ["change_request", "Change request"],
                  ["custom", "Custom"],
                ]}
                value={draft.itemType}
              />
              <SimpleSelect
                label="Status"
                onChange={(value) =>
                  setDraft((current) =>
                    current ? { ...current, status: value as TimelineFormState["status"] } : current,
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

              <label className="flex items-center gap-3 rounded-xl border border-black/10 px-3 py-2 text-sm text-zinc-700">
                <input
                  checked={draft.visibleToClient}
                  onChange={(event) =>
                    setDraft((current) =>
                      current
                        ? { ...current, visibleToClient: event.target.checked }
                        : current,
                    )
                  }
                  type="checkbox"
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

type TimelineNodeData = {
  item: TimelineItem;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

function TimelineNode({ data }: NodeProps<Node<TimelineNodeData>>) {
  return (
    <div className="w-[230px] rounded-[22px] border border-black/5 bg-white p-4 shadow-[0_18px_40px_rgba(17,24,39,0.08)]">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            {labelize(data.item.itemType)}
          </div>
          <div className="text-lg font-semibold text-zinc-950">{data.item.title}</div>
        </div>
        {data.canEdit ? (
          <div className="flex items-center gap-1">
            <button
              className="rounded-full p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
              onClick={data.onEdit}
              type="button"
            >
              <PencilIcon className="size-4" />
            </button>
            <button
              className="rounded-full p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-red-600"
              onClick={data.onDelete}
              type="button"
            >
              <Trash2Icon className="size-4" />
            </button>
          </div>
        ) : null}
      </div>
      <div className="mt-3 text-sm leading-6 text-zinc-600">
        {data.item.description || "No extra note for this milestone yet."}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-zinc-500">
        <span>{labelize(data.item.status)}</span>
        <span>{formatShortDate(data.item.dueAt) ?? "No due date"}</span>
      </div>
      {data.canEdit ? (
        <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-zinc-400">
          <GripVerticalIcon className="size-4" />
          Drag to reposition
        </div>
      ) : null}
    </div>
  );
}

function TimelineEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
}: {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}) {
  const [path] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return <BaseEdge path={path} style={{ stroke: "rgba(24,24,27,0.16)", strokeWidth: 2 }} />;
}

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

function formatShortDate(value: string | Date | null) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString();
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
        className="flex h-10 w-full rounded-md border border-black/10 bg-white px-3 text-sm"
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
