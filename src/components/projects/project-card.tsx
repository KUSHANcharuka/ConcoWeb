import Link from "next/link";
import { CalendarClock, FolderKanban, Wallet } from "lucide-react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProjectCover } from "~/components/projects/project-cover";
import {
  getProjectTypeLabel,
  type ProjectTypeValue,
} from "~/components/projects/project-options";
import { ProjectStatusBadge } from "~/components/projects/project-status-badge";

export type ProjectCardData = {
  id: string;
  name: string;
  description: string;
  projectType: ProjectTypeValue;
  status: "pending" | "active" | "paused" | "completed" | "archived";
  currency: string;
  coverUrl: string | null;
  client: {
    id: string;
    name: string;
  };
  targetLaunchDate: string | null;
};

export function ProjectCard({
  project,
  href,
}: {
  project: ProjectCardData;
  href?: string;
}) {
  return (
    <Link href={href ?? `/admin/projects/${project.id}/overview`}>
      <Card className="gap-0 overflow-hidden rounded-lg border-zinc-200 bg-white py-0 shadow-none transition-shadow hover:shadow-lg hover:shadow-black/5">
        <AspectRatio ratio={4 / 3}>
          <ProjectCover
            clientName={project.client.name}
            coverUrl={project.coverUrl}
            projectName={project.name}
          />
        </AspectRatio>
        <CardHeader className="gap-3 px-5 pt-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <div className="truncate text-sm font-medium text-zinc-500">
                {project.client.name}
              </div>
              <CardTitle className="line-clamp-2 text-xl font-semibold leading-tight text-zinc-900">
                {project.name}
              </CardTitle>
            </div>
            <ProjectStatusBadge status={project.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-5 pb-4 pt-3">
          <p className="line-clamp-3 min-h-[60px] text-sm leading-5 text-zinc-600">
            {project.description}
          </p>
          <div className="grid gap-2 text-sm text-zinc-600">
            <div className="flex items-center gap-2">
              <FolderKanban className="size-4 text-zinc-400" />
              <span>{getProjectTypeLabel(project.projectType)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="size-4 text-zinc-400" />
              <span>{project.currency}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarClock className="size-4 text-zinc-400" />
              <span>{project.targetLaunchDate ?? "Target date not set"}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-zinc-100 px-5 py-3 text-xs text-zinc-500">
          Visible in client portal
        </CardFooter>
      </Card>
    </Link>
  );
}
