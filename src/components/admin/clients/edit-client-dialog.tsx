"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  ClientProfileForm,
  type ClientProfileValues,
} from "~/components/admin/clients/client-profile-form";
import { api } from "~/trpc/react";

export function EditClientDialog({
  client,
  open,
  onOpenChange,
}: {
  client: {
    id: string;
    name: string;
    primaryContactEmail: string;
    primaryContactPhone: string | null;
    country: string | null;
    baseCurrency: string;
    internalNotes: string | null;
    status: "lead" | "active" | "suspended" | "archived";
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const utils = api.useUtils();
  const [submitting, setSubmitting] = useState(false);
  const updateProfileMutation = api.admin.clients.updateProfile.useMutation();

  async function handleSubmit(values: ClientProfileValues) {
    setSubmitting(true);

    try {
      await updateProfileMutation.mutateAsync({
        clientId: client.id,
        ...values,
      });
      await Promise.all([
        utils.admin.clients.list.invalidate(),
        utils.admin.clients.getById.invalidate({ clientId: client.id }),
        utils.admin.clients.context.invalidate({ clientId: client.id }),
      ]);
      toast.success("Client updated.");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update client.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-zinc-200 bg-white p-6 sm:max-w-4xl">
        <ClientProfileForm
          defaultValues={{
            name: client.name,
            primaryContactEmail: client.primaryContactEmail,
            primaryContactPhone: client.primaryContactPhone,
            country: client.country,
            baseCurrency: client.baseCurrency,
            internalNotes: client.internalNotes,
            status: client.status,
          }}
          isSubmitting={submitting}
          onCancel={() => onOpenChange(false)}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
