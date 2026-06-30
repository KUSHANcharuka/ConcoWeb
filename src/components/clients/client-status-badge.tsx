import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  getClientStatusLabel,
  type ClientStatusValue,
} from "~/components/clients/client-options";

const statusStyles: Record<ClientStatusValue, string> = {
  lead: "border-sky-200 bg-sky-50 text-sky-700",
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  suspended: "border-amber-200 bg-amber-50 text-amber-700",
  archived: "border-zinc-300 bg-zinc-50 text-zinc-500",
};

export function ClientStatusBadge({
  status,
  className,
}: {
  status: ClientStatusValue;
  className?: string;
}) {
  return (
    <Badge className={cn("border font-medium", statusStyles[status], className)} variant="outline">
      {getClientStatusLabel(status)}
    </Badge>
  );
}
