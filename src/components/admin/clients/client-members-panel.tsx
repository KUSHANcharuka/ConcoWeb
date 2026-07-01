"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ClientWorkspaceEmpty } from "~/components/admin/clients/client-workspace-shell";
import { api } from "~/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const inviteMemberSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  jobTitle: z.string().trim().max(120).nullable(),
  phone: z.string().trim().max(32).nullable(),
  role: z.enum(["admin", "member"]),
});

function InviteMemberDialog({
  clientId,
  open,
  onOpenChange,
}: {
  clientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const utils = api.useUtils();
  const inviteMutation = api.admin.clients.members.invite.useMutation();
  const form = useForm<z.infer<typeof inviteMemberSchema>>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      name: "",
      email: "",
      jobTitle: null,
      phone: null,
      role: "member",
    },
  });

  async function handleSubmit(values: z.infer<typeof inviteMemberSchema>) {
    try {
      await inviteMutation.mutateAsync({
        clientId,
        ...values,
      });
      await utils.admin.clients.getById.invalidate({ clientId });
      await utils.admin.clients.context.invalidate({ clientId });
      toast.success("Invitation sent.");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send invitation.");
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="border-zinc-200 bg-white p-6 sm:max-w-2xl">
        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="text-2xl font-semibold text-zinc-900">
                Invite client member
              </DialogTitle>
              <DialogDescription className="text-zinc-600">
                Members are added to this client company through Clerk organization invitations only.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Member Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Managing Director"
                        value={field.value ?? ""}
                        onChange={(event) => field.onChange(event.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        onChange={(event) => field.onChange(event.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button onClick={() => onOpenChange(false)} type="button" variant="outline">
                Cancel
              </Button>
              <Button disabled={inviteMutation.isPending} type="submit">
                {inviteMutation.isPending ? "Sending..." : "Send invite"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function ClientMembersPanel({ clientId }: { clientId: string }) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const utils = api.useUtils();
  const clientQuery = api.admin.clients.getById.useQuery({ clientId });
  const changeRoleMutation = api.admin.clients.members.changeRole.useMutation();
  const removeMutation = api.admin.clients.members.remove.useMutation();
  const resendInviteMutation = api.admin.clients.members.resendInvite.useMutation();

  async function refresh() {
    await Promise.all([
      utils.admin.clients.getById.invalidate({ clientId }),
      utils.admin.clients.context.invalidate({ clientId }),
    ]);
  }

  if (clientQuery.isLoading) {
    return <div className="border border-zinc-200 bg-white p-6 text-sm text-zinc-500">Loading members…</div>;
  }

  if (clientQuery.isError || !clientQuery.data) {
    return (
      <ClientWorkspaceEmpty
        description={clientQuery.error?.message ?? "Member details could not be loaded."}
        title="Members unavailable"
      />
    );
  }

  const client = clientQuery.data;

  return (
    <>
      <div className="space-y-5">
        <div className="flex justify-end">
          <Button onClick={() => setInviteOpen(true)} type="button">
            Invite Member
          </Button>
        </div>

        <div className="border border-zinc-200 bg-white p-5">
          <div className="text-sm font-semibold text-zinc-900">Active members</div>
          <div className="mt-4 space-y-3">
            {client.members.length === 0 ? (
              <div className="text-sm text-zinc-500">No active members yet.</div>
            ) : (
              client.members.map((member) => (
                <div className="grid gap-3 border border-zinc-200 p-4 lg:grid-cols-[minmax(0,1fr)_160px_auto] lg:items-center" key={member.id}>
                  <div className="min-w-0">
                    <div className="font-medium text-zinc-900">{member.name ?? member.email}</div>
                    <div className="mt-1 text-sm text-zinc-600">
                      {member.jobTitle ? `${member.jobTitle} · ` : ""}
                      {member.email}
                      {member.phone ? ` · ${member.phone}` : ""}
                    </div>
                  </div>
                  <Select
                    disabled={changeRoleMutation.isPending}
                    onValueChange={async (value) => {
                      try {
                        await changeRoleMutation.mutateAsync({
                          clientId,
                          membershipId: member.id,
                          role: value as "admin" | "member",
                        });
                        await refresh();
                        toast.success("Role updated.");
                      } catch (error) {
                        toast.error(
                          error instanceof Error ? error.message : "Failed to update role.",
                        );
                      }
                    }}
                    value={member.role}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={async () => {
                      if (!window.confirm(`Remove ${member.email} from this client?`)) return;
                      try {
                        await removeMutation.mutateAsync({
                          clientId,
                          membershipId: member.id,
                        });
                        await refresh();
                        toast.success("Member removed.");
                      } catch (error) {
                        toast.error(
                          error instanceof Error ? error.message : "Failed to remove member.",
                        );
                      }
                    }}
                    type="button"
                    variant="outline"
                  >
                    Remove
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border border-zinc-200 bg-white p-5">
          <div className="text-sm font-semibold text-zinc-900">Pending invitations</div>
          <div className="mt-4 space-y-3">
            {client.invitations.filter((item) => item.status === "pending").length === 0 ? (
              <div className="text-sm text-zinc-500">No pending invitations.</div>
            ) : (
              client.invitations
                .filter((item) => item.status === "pending")
                .map((invite) => (
                  <div className="grid gap-3 border border-zinc-200 p-4 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center" key={invite.id}>
                    <div>
                      <div className="font-medium text-zinc-900">{invite.name ?? invite.email}</div>
                      <div className="mt-1 text-sm text-zinc-600">
                        {invite.jobTitle ? `${invite.jobTitle} · ` : ""}
                        {invite.email} · {invite.role}
                      </div>
                    </div>
                    <Button
                      onClick={async () => {
                        try {
                          await resendInviteMutation.mutateAsync({
                            clientId,
                            invitationId: invite.id,
                          });
                          await refresh();
                          toast.success("Invitation resent.");
                        } catch (error) {
                          toast.error(
                            error instanceof Error ? error.message : "Failed to resend invite.",
                          );
                        }
                      }}
                      type="button"
                      variant="outline"
                    >
                      Resend
                    </Button>
                    <Button
                      onClick={async () => {
                        if (!window.confirm(`Revoke the invite for ${invite.email}?`)) return;
                        try {
                          await removeMutation.mutateAsync({
                            clientId,
                            invitationId: invite.id,
                          });
                          await refresh();
                          toast.success("Invitation revoked.");
                        } catch (error) {
                          toast.error(
                            error instanceof Error ? error.message : "Failed to revoke invite.",
                          );
                        }
                      }}
                      type="button"
                      variant="outline"
                    >
                      Revoke
                    </Button>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      <InviteMemberDialog clientId={clientId} onOpenChange={setInviteOpen} open={inviteOpen} />
    </>
  );
}
