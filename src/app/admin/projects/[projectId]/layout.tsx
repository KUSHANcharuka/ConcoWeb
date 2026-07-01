import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { ProjectWorkspaceShell } from "~/components/admin/projects/workspace/project-workspace-shell";
import { api } from "~/trpc/server";

export default async function AdminProjectWorkspaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await loadProjectContext(projectId);

  return (
    <ProjectWorkspaceShell mode="admin" project={project}>
      {children}
    </ProjectWorkspaceShell>
  );
}

async function loadProjectContext(projectId: string) {
  try {
    return await api.admin.projectWorkspace.context({ projectId });
  } catch (error) {
    if (
      error instanceof Error &&
      /Project not found/i.test(error.message)
    ) {
      notFound();
    }
    throw error;
  }
}
