import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { ProjectWorkspaceShell } from "~/components/admin/projects/workspace/project-workspace-shell";
import { api } from "~/trpc/server";

export default async function ClientProjectWorkspaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  try {
    const project = await api.clientPortal.projectWorkspace.context({ projectId });
    return (
      <ProjectWorkspaceShell mode="client" project={project}>
        {children}
      </ProjectWorkspaceShell>
    );
  } catch (error) {
    if (error instanceof Error && /Project not found/i.test(error.message)) {
      notFound();
    }
    throw error;
  }
}
