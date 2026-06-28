"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  ProjectCreateForm,
  type ProjectCreateValues,
} from "~/components/projects/project-create-form";
import { api } from "~/trpc/react";

export function CreateProjectDialog({
  open,
  onOpenChange,
  defaultClientId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultClientId?: string;
}) {
  const utils = api.useUtils();
  const [submitting, setSubmitting] = useState(false);
  const clientsQuery = api.admin.clients.options.useQuery();
  const productsQuery = api.admin.products.options.useQuery();
  const createProjectMutation = api.admin.projects.create.useMutation();

  async function handleSubmit(values: ProjectCreateValues) {
    setSubmitting(true);

    try {
      await createProjectMutation.mutateAsync(values);
      await utils.admin.projects.list.invalidate();
      toast.success("Project created.");
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create project.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-xl border-zinc-200 bg-white p-6 sm:max-w-4xl">
        <ProjectCreateForm
          clientOptions={clientsQuery.data ?? []}
          isSubmitting={submitting}
          lockedClientId={defaultClientId}
          onCancel={() => onOpenChange(false)}
          onSubmit={handleSubmit}
          productOptions={productsQuery.data ?? []}
        />
      </DialogContent>
    </Dialog>
  );
}
