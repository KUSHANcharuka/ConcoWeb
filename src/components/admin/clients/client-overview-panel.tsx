"use client";

import { useState } from "react";
import { Building2Icon, MailIcon, PencilIcon, PhoneIcon, UsersIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ClientStatusBadge } from "~/components/clients/client-status-badge";
import { EditClientDialog } from "~/components/admin/clients/edit-client-dialog";
import { ClientWorkspaceEmpty } from "~/components/admin/clients/client-workspace-shell";
import { api } from "~/trpc/react";

export function ClientOverviewPanel({ clientId }: { clientId: string }) {
  const [editOpen, setEditOpen] = useState(false);
  const clientQuery = api.admin.clients.getById.useQuery({ clientId });

  if (clientQuery.isLoading) {
    return <div className="border border-zinc-200 bg-white p-6 text-sm text-zinc-500">Loading overview…</div>;
  }

  if (clientQuery.isError || !clientQuery.data) {
    return (
      <ClientWorkspaceEmpty
        description={clientQuery.error?.message ?? "Client details could not be loaded."}
        title="Overview unavailable"
      />
    );
  }

  const client = clientQuery.data;

  return (
    <>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <div className="space-y-5">
          <div className="border border-zinc-200 bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-zinc-900">Company profile</div>
                <div className="mt-1 text-sm text-zinc-600">
                  Company information synced with the linked Clerk organization.
                </div>
              </div>
              <Button onClick={() => setEditOpen(true)} type="button" variant="outline">
                <PencilIcon className="size-4" />
                Edit
              </Button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Company</div>
                <div className="text-base font-semibold text-zinc-900">{client.name}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Status</div>
                <ClientStatusBadge className="w-fit" status={client.status} />
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Primary email</div>
                <div className="flex items-center gap-2 text-sm text-zinc-700">
                  <MailIcon className="size-4 text-zinc-400" />
                  {client.primaryContactEmail}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Primary phone</div>
                <div className="flex items-center gap-2 text-sm text-zinc-700">
                  <PhoneIcon className="size-4 text-zinc-400" />
                  {client.primaryContactPhone ?? "Not set"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Country</div>
                <div className="flex items-center gap-2 text-sm text-zinc-700">
                  <Building2Icon className="size-4 text-zinc-400" />
                  {client.country ?? "Not set"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Base currency</div>
                <div className="text-sm text-zinc-700">{client.baseCurrency}</div>
              </div>
            </div>
            {client.internalNotes ? (
              <div className="mt-5 border-t border-zinc-100 pt-4">
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Internal notes</div>
                <div className="mt-2 text-sm leading-6 text-zinc-700">{client.internalNotes}</div>
              </div>
            ) : null}
          </div>

          <div className="border border-zinc-200 bg-white p-5">
            <div className="text-sm font-semibold text-zinc-900">Recent activity</div>
            <div className="mt-4 space-y-3">
              {client.recentActivity.length === 0 ? (
                <div className="text-sm text-zinc-500">No recent client activity yet.</div>
              ) : (
                client.recentActivity.map((item) => (
                  <div className="flex items-start gap-3 border-b border-zinc-100 pb-3 last:border-b-0 last:pb-0" key={item.id}>
                    <UsersIcon className="mt-0.5 size-4 text-zinc-400" />
                    <div>
                      <div className="text-sm text-zinc-800">{item.label}</div>
                      <div className="mt-1 text-xs text-zinc-500">
                        {new Date(item.occurredAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="border border-zinc-200 bg-white p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Active members</div>
              <div className="mt-2 text-3xl font-semibold text-zinc-950">{client.counts.activeMembers}</div>
            </div>
            <div className="border border-zinc-200 bg-white p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Pending invites</div>
              <div className="mt-2 text-3xl font-semibold text-zinc-950">{client.counts.pendingInvites}</div>
            </div>
            <div className="border border-zinc-200 bg-white p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Projects</div>
              <div className="mt-2 text-3xl font-semibold text-zinc-950">{client.counts.totalProjects}</div>
            </div>
            <div className="border border-zinc-200 bg-white p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Booked value</div>
              <div className="mt-2 text-2xl font-semibold text-zinc-950">
                {client.billingSummary.bookedValueLabel ?? "—"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditClientDialog client={client} onOpenChange={setEditOpen} open={editOpen} />
    </>
  );
}
