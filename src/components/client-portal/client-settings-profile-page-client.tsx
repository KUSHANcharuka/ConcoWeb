"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PlusIcon } from "lucide-react";
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
import { api } from "~/trpc/react";

const inviteMemberSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  jobTitle: z.string().trim().max(120).nullable(),
  phone: z.string().trim().max(32).nullable(),
  role: z.enum(["admin", "member"]),
});

type MemberRow = {
  id: string;
  userId: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: "admin" | "member";
  status: "active" | "removed";
  joinedAt: Date;
};

type InvitationRow = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: "admin" | "member";
  status: "pending" | "accepted" | "revoked" | "expired";
  invitedAt: Date;
};

function InviteMemberDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const inviteMutation = api.clientPortal.settings.inviteMember.useMutation();
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
      await inviteMutation.mutateAsync(values);
      toast.success("Invitation sent.");
      form.reset();
      onOpenChange(false);
      router.refresh();
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
                Send a Clerk organization invitation for this client portal organization.
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

export function ClientSettingsProfilePageClient({
  client,
  currentUserId,
  canManageMembers,
  memberRows,
  pendingInvites,
}: {
  client: {
    name: string;
    primaryContactEmail: string;
    primaryContactPhone: string | null;
    baseCurrency: string;
    logoUrl?: string | null;
  };
  currentUserId: string;
  canManageMembers: boolean;
  memberRows: MemberRow[];
  pendingInvites: InvitationRow[];
}) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const currentMember = memberRows.find((member) => member.userId === currentUserId) ?? null;

  return (
    <>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <div className="space-y-5">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-zinc-900">Company profile</div>
                <div className="mt-1 text-sm text-zinc-600">
                  Shared organization data currently visible in the client portal.
                </div>
              </div>
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 text-lg font-semibold text-zinc-900">
                {client.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt={`${client.name} logo`}
                    className="h-full w-full object-contain"
                    src={client.logoUrl}
                  />
                ) : (
                  client.name.slice(0, 2).toUpperCase()
                )}
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Company</div>
                <div className="text-base font-semibold text-zinc-900">{client.name}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                  Company email
                </div>
                <div className="text-sm text-zinc-700">{client.primaryContactEmail}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                  Primary phone
                </div>
                <div className="text-sm text-zinc-700">{client.primaryContactPhone ?? "Not set"}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Base currency</div>
                <div className="text-sm text-zinc-700">{client.baseCurrency}</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-zinc-900">Members</div>
                <div className="mt-1 text-sm text-zinc-600">
                  Active members in your client organization.
                </div>
              </div>
              {canManageMembers ? (
                <Button onClick={() => setInviteOpen(true)} type="button">
                  <PlusIcon className="size-4" />
                  Add Member
                </Button>
              ) : null}
            </div>

            <div className="space-y-3">
              {memberRows.length === 0 ? (
                <div className="text-sm text-zinc-500">No active members found.</div>
              ) : (
                memberRows.map((member) => (
                  <div
                    className="grid gap-3 rounded-lg border border-zinc-200 p-4 lg:grid-cols-[minmax(0,1fr)_140px]"
                    key={member.id}
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="font-medium text-zinc-900">
                          {member.name ?? member.email}
                        </div>
                        {member.userId === currentUserId ? <Badge variant="outline">You</Badge> : null}
                      </div>
                      <div className="mt-1 text-sm text-zinc-600">{member.email}</div>
                      <div className="mt-1 text-sm text-zinc-500">
                        {member.phone ?? "No phone number"}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Role</div>
                      <Badge variant="outline">{member.role}</Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Active members</div>
              <div className="mt-2 text-3xl font-semibold text-zinc-950">{memberRows.length}</div>
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
                        <div className="font-medium text-zinc-900">
                          {invite.name ?? invite.email}
                        </div>
                        <div className="mt-1 text-sm text-zinc-600">{invite.email}</div>
                      </div>
                      <Badge variant="outline">{invite.role}</Badge>
                    </div>
                    <div className="mt-3 text-sm text-zinc-500">
                      Sent {new Date(invite.invitedAt).toLocaleDateString()}
                    </div>
                    {invite.phone ? (
                      <div className="mt-1 text-sm text-zinc-500">{invite.phone}</div>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-zinc-900">Current access</div>
            <div className="mt-4 space-y-2 text-sm text-zinc-600">
              <div>
                Signed in as{" "}
                <span className="font-medium text-zinc-900">
                  {currentMember?.name ?? currentMember?.email ?? client.primaryContactEmail}
                </span>
              </div>
              <div>
                Role:{" "}
                <span className="font-medium text-zinc-900">
                  {currentMember?.role ?? "member"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {canManageMembers ? (
        <InviteMemberDialog onOpenChange={setInviteOpen} open={inviteOpen} />
      ) : null}
    </>
  );
}
