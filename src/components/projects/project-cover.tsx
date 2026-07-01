import { cn } from "@/lib/utils";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ProjectCover({
  projectName,
  clientName,
  coverUrl,
  className,
}: {
  projectName: string;
  clientName: string;
  coverUrl: string | null;
  className?: string;
}) {
  if (coverUrl) {
    return (
      <div className={cn("relative h-full w-full overflow-hidden", className)}>
        <img
          alt={`${projectName} cover`}
          className="h-full w-full object-cover"
          src={coverUrl}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col justify-between bg-[linear-gradient(135deg,rgba(230,255,125,0.95),rgba(255,255,255,0.9))] p-5 text-zinc-900",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-600">
          {clientName}
        </span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-900/10 bg-white/70 text-sm font-semibold">
          {getInitials(projectName)}
        </span>
      </div>
      <div className="space-y-1">
        <div className="text-lg font-semibold leading-tight">{projectName}</div>
        <div className="max-w-[18ch] text-sm text-zinc-700">
          Internal project workspace
        </div>
      </div>
    </div>
  );
}
