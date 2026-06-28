import { CalendarDaysIcon, FileIcon, FileTextIcon, MapPinnedIcon } from "lucide-react";

import { ProjectStatusBadge } from "~/components/projects/project-status-badge";

type OverviewData = {
  project: {
    status: "pending" | "active" | "paused" | "completed" | "archived";
    startDate: string | Date | null;
    targetLaunchDate: string | Date | null;
  };
  metrics: {
    fileCount: number;
    timelineCount: number;
    proposalCount: number;
  };
  currentTimelineItem: {
    title: string;
    status: string;
    dueAt: string | Date | null;
  } | null;
  latestProposal: {
    title: string;
    status: string;
    updatedAt: string | Date;
  } | null;
};

export function ProjectOverview({
  data,
  mode,
}: {
  data: OverviewData;
  mode: "admin" | "client-preview";
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <OverviewCard
          icon={<ProjectStatusBadge status={data.project.status} />}
          label="Project status"
          value={capitalize(data.project.status)}
          meta={mode === "admin" ? "Editable from admin surfaces" : "Client-visible status"}
        />
        <OverviewCard
          icon={<CalendarDaysIcon className="size-4 text-zinc-500" />}
          label="Target launch"
          value={formatDate(data.project.targetLaunchDate) ?? "Not scheduled"}
          meta={
            data.project.startDate
              ? `Started ${formatDate(data.project.startDate)}`
              : "Start date not set"
          }
        />
        <OverviewCard
          icon={<MapPinnedIcon className="size-4 text-zinc-500" />}
          label="Current timeline focus"
          value={data.currentTimelineItem?.title ?? "No milestone yet"}
          meta={
            data.currentTimelineItem?.dueAt
              ? `Due ${formatDate(data.currentTimelineItem.dueAt)}`
              : "Create the first milestone in Timeline"
          }
        />
        <OverviewCard
          icon={<FileIcon className="size-4 text-zinc-500" />}
          label="Workspace files"
          value={`${data.metrics.fileCount}`}
          meta={`${data.metrics.timelineCount} timeline items`}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
        <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <MapPinnedIcon className="size-4" />
            Project pulse
          </div>
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl border border-black/5 bg-[#f8f6f1] p-5">
              <div className="text-sm text-zinc-500">Current timeline item</div>
              <div className="mt-2 text-2xl font-semibold text-zinc-950">
                {data.currentTimelineItem?.title ?? "No active milestone"}
              </div>
              <div className="mt-2 text-sm text-zinc-600">
                {data.currentTimelineItem
                  ? `Status: ${capitalize(data.currentTimelineItem.status)}`
                  : "Use the timeline canvas to add the first milestone, review checkpoint, or delivery marker."}
              </div>
            </div>

            <div className="rounded-2xl border border-black/5 p-5">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <FileTextIcon className="size-4" />
                Latest proposal
              </div>
              <div className="mt-3 text-lg font-semibold text-zinc-950">
                {data.latestProposal?.title ?? "No proposal created"}
              </div>
              <div className="mt-2 text-sm text-zinc-600">
                {data.latestProposal
                  ? `${capitalize(data.latestProposal.status)} • updated ${formatDate(data.latestProposal.updatedAt)}`
                  : "Proposal builder and signing live in the Proposals tab."}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-sm">
          <div className="text-sm text-zinc-500">Workspace counts</div>
          <div className="mt-4 space-y-3">
            <MetricRow label="Timeline items" value={data.metrics.timelineCount} />
            <MetricRow label="Proposals" value={data.metrics.proposalCount} />
            <MetricRow label="Files" value={data.metrics.fileCount} />
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewCard({
  icon,
  label,
  value,
  meta,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  meta: string;
}) {
  return (
    <div className="rounded-[24px] border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-sm text-zinc-500">{icon}</div>
      <div className="mt-4 text-sm text-zinc-500">{label}</div>
      <div className="mt-1 text-xl font-semibold text-zinc-950">{value}</div>
      <div className="mt-2 text-sm text-zinc-600">{meta}</div>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-black/5 bg-[#faf8f4] px-4 py-3">
      <span className="text-sm text-zinc-600">{label}</span>
      <span className="text-lg font-semibold text-zinc-950">{value}</span>
    </div>
  );
}

function formatDate(value: string | Date | null) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString();
}

function capitalize(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
}
