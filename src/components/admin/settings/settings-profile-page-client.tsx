"use client";

import { useMemo, useState } from "react";
import { LoaderCircleIcon, MailIcon, PlusIcon, ShieldCheckIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "~/trpc/react";

function InviteStaffDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const utils = api.useUtils();
  const inviteMutation = api.admin.settingsProfile.inviteMember.useMutation({
    onSuccess: async () => {
      await utils.admin.settingsProfile.page.invalidate();
      toast.success("Invitation sent.");
      onOpenChange(false);
    },
    onError: (error) => toast.error(error.message),
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "member" as "admin" | "member",
  });

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Invite Concolabs member</DialogTitle>
          <DialogDescription>
            This sends a Clerk organization invitation for the internal Concolabs staff org.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Name</label>
            <Input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Email</label>
            <Input
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Role</label>
            <Select
              value={form.role}
              onValueChange={(value) =>
                setForm((current) => ({ ...current, role: value as "admin" | "member" }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={inviteMutation.isPending}
            onClick={() => inviteMutation.mutate(form)}
          >
            {inviteMutation.isPending ? "Sending..." : "Send invite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SettingsProfilePageClient() {
  const utils = api.useUtils();
  const [inviteOpen, setInviteOpen] = useState(false);
  const pageQuery = api.admin.settingsProfile.page.useQuery();
  const changeRoleMutation = api.admin.settingsProfile.changeRole.useMutation({
    onSuccess: async () => {
      await utils.admin.settingsProfile.page.invalidate();
      toast.success("Role updated.");
    },
    onError: (error) => toast.error(error.message),
  });
  const removeMutation = api.admin.settingsProfile.removeMember.useMutation({
    onSuccess: async () => {
      await utils.admin.settingsProfile.page.invalidate();
      toast.success("Member access updated.");
    },
    onError: (error) => toast.error(error.message),
  });
  const resendMutation = api.admin.settingsProfile.resendInvite.useMutation({
    onSuccess: async () => {
      await utils.admin.settingsProfile.page.invalidate();
      toast.success("Invitation resent.");
    },
    onError: (error) => toast.error(error.message),
  });

  const pendingInvites = useMemo(
    () => pageQuery.data?.invitations.filter((invite) => invite.status === "pending") ?? [],
    [pageQuery.data?.invitations],
  );

  if (pageQuery.isLoading) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-xl border border-zinc-200 bg-white">
        <LoaderCircleIcon className="size-5 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (pageQuery.isError || !pageQuery.data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        Failed to load Concolabs profile.
      </div>
    );
  }

  const { company, members } = pageQuery.data;

  return (
    <>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <div className="space-y-5">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-zinc-900">Company profile</div>
                <div className="mt-1 text-sm text-zinc-600">
                  Shared identity data used across the admin workspace.
                </div>
              </div>
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
                {company.imageUrl ? (
                  <img alt={company.name} className="h-full w-full object-cover" src={company.imageUrl} />
                ) : (
                  <ShieldCheckIcon className="size-7 text-zinc-500" />
                )}
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Company</div>
                <div className="text-base font-semibold text-zinc-900">{company.name}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                  Company email
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-700">
                  <MailIcon className="size-4 text-zinc-400" />
                  {company.email}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-zinc-900">Members</div>
                <div className="mt-1 text-sm text-zinc-600">
                  Manage internal Concolabs staff access and roles.
                </div>
              </div>
              <Button onClick={() => setInviteOpen(true)}>
                <PlusIcon className="size-4" />
                Add Member
              </Button>
            </div>

            <div className="space-y-3">
              {members.map((member) => (
                <div
                  className="grid gap-3 rounded-lg border border-zinc-200 p-4 lg:grid-cols-[minmax(0,1fr)_160px_auto]"
                  key={member.id}
                >
                  <div className="min-w-0">
                    <div className="font-medium text-zinc-900">{member.name}</div>
                    <div className="mt-1 text-sm text-zinc-600">{member.email}</div>
                  </div>
                  <Select
                    disabled={changeRoleMutation.isPending}
                    value={member.role}
                    onValueChange={(value) =>
                      changeRoleMutation.mutate({
                        userId: member.userId,
                        role: value as "admin" | "member",
                      })
                    }
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
                    variant="outline"
                    onClick={() => {
                      if (!window.confirm(`Remove ${member.email} from Concolabs staff?`)) return;
                      removeMutation.mutate({ userId: member.userId });
                    }}
                  >
                    <Trash2Icon className="size-4" />
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Active members</div>
              <div className="mt-2 text-3xl font-semibold text-zinc-950">{members.length}</div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Pending invites</div>
              <div className="mt-2 text-3xl font-semibold text-zinc-950">{pendingInvites.length}</div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-zinc-900">Pending invitations</div>
            <div className="mt-4 space-y-3">
              {pendingInvites.length === 0 ? (
                <div className="text-sm text-zinc-500">No pending invitations.</div>
              ) : (
                pendingInvites.map((invite) => (
                  <div className="rounded-lg border border-zinc-200 p-4" key={invite.id}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-medium text-zinc-900">{invite.email}</div>
                        <div className="mt-1 text-sm text-zinc-600">
                          Sent {new Date(invite.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant="outline">{invite.role}</Badge>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          resendMutation.mutate({
                            invitationId: invite.id,
                            email: invite.email,
                            role: invite.role,
                            name: null,
                          })
                        }
                      >
                        Resend
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeMutation.mutate({ invitationId: invite.id })}
                      >
                        Revoke
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <InviteStaffDialog onOpenChange={setInviteOpen} open={inviteOpen} />
    </>
  );
}
