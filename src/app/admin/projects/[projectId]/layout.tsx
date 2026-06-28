import type { ReactNode } from "react";

import { ProjectWorkspaceShell } from "~/components/admin/projects/project-workspace-shell";

export default async function AdminProjectLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return <ProjectWorkspaceShell projectId={projectId}>{children}</ProjectWorkspaceShell>;
}
