"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  ClientCreateForm,
  type ClientCreateValues,
} from "~/components/admin/clients/client-create-form";
import { api } from "~/trpc/react";

export function CreateClientDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const utils = api.useUtils();
  const [submitting, setSubmitting] = useState(false);
  const createClientMutation = api.admin.clients.create.useMutation();

  async function handleSubmit(values: ClientCreateValues) {
    setSubmitting(true);

    try {
      const result = await createClientMutation.mutateAsync({
        name: values.name,
        primaryContactEmail: values.primaryContactEmail,
        primaryContactPhone: values.primaryContactPhone,
        country: values.country,
        baseCurrency: values.baseCurrency,
        internalNotes: values.internalNotes,
        firstInvite: values.firstInviteEmail
          ? {
              name: values.firstInviteName ?? values.name,
              email: values.firstInviteEmail,
              jobTitle: values.firstInviteJobTitle,
              phone: values.firstInvitePhone,
              role: values.firstInviteRole,
            }
          : null,
      });
      await utils.admin.clients.list.invalidate();
      await utils.admin.clients.options.invalidate();
      toast.success("Client created.");
      onOpenChange(false);
      router.push(`/admin/clients/${result.clientId}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create client.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-zinc-200 bg-white p-6 sm:max-w-4xl">
        <ClientCreateForm isSubmitting={submitting} onCancel={() => onOpenChange(false)} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
