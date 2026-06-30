"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ClientWorkspaceEmpty } from "~/components/admin/clients/client-workspace-shell";
import { CreateProjectDialog } from "~/components/admin/projects/create-project-dialog";
import { ProjectCardGrid } from "~/components/projects/project-card-grid";
import { api } from "~/trpc/react";

export function ClientProjectsPanel({ clientId }: { clientId: string }) {
  const [createOpen, setCreateOpen] = useState(false);
  const clientQuery = api.admin.clients.getById.useQuery({ clientId });

  if (clientQuery.isLoading) {
    return <div className="border border-zinc-200 bg-white p-6 text-sm text-zinc-500">Loading projects…</div>;
  }

  if (clientQuery.isError || !clientQuery.data) {
    return (
      <ClientWorkspaceEmpty
        description={clientQuery.error?.message ?? "Client projects could not be loaded."}
        title="Projects unavailable"
      />
    );
  }

  const client = clientQuery.data;

  return (
    <>
      {client.projects.length === 0 ? (
        <ClientWorkspaceEmpty
          action={
            <Button onClick={() => setCreateOpen(true)} type="button">
              New Project
            </Button>
          }
          description="This client does not have any linked project workspaces yet."
          title="No linked projects"
        />
      ) : (
        <div className="space-y-5">
          <div className="flex justify-end">
            <Button onClick={() => setCreateOpen(true)} type="button">
              New Project
            </Button>
          </div>
          <ProjectCardGrid
            projects={client.projects.map((project) => ({
              ...project,
              client: {
                id: client.id,
                name: client.name,
              },
              targetLaunchDate: project.targetLaunchDate
                ? new Date(project.targetLaunchDate).toLocaleDateString()
                : null,
            }))}
          />
        </div>
      )}

      <CreateProjectDialog
        defaultClientId={clientId}
        onOpenChange={setCreateOpen}
        open={createOpen}
      />
    </>
  );
}
