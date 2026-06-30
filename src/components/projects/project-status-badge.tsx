import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  getProjectStatusLabel,
  type ProjectStatusValue,
} from "~/components/projects/project-options";

const statusStyles: Record<ProjectStatusValue, string> = {
  pending:
    "border-zinc-300 bg-zinc-100 text-zinc-700",
  active:
    "border-emerald-200 bg-emerald-50 text-emerald-700",
  paused:
    "border-amber-200 bg-amber-50 text-amber-700",
  completed:
    "border-sky-200 bg-sky-50 text-sky-700",
  archived:
    "border-zinc-300 bg-zinc-50 text-zinc-500",
};

export function ProjectStatusBadge({
  status,
  className,
}: {
  status: ProjectStatusValue;
  className?: string;
}) {
  return (
    <Badge
      className={cn("border font-medium", statusStyles[status], className)}
      variant="outline"
    >
      {getProjectStatusLabel(status)}
    </Badge>
  );
}
