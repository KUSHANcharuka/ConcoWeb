import Link from "next/link";
import { Building2Icon, MailIcon, PhoneIcon, UsersIcon } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientStatusBadge } from "~/components/clients/client-status-badge";

export type ClientCardData = {
  id: string;
  name: string;
  primaryContactEmail: string;
  primaryContactPhone: string | null;
  baseCurrency: string;
  status: "lead" | "active" | "suspended" | "archived";
  country: string | null;
  activeMemberCount: number;
  pendingInviteCount: number;
  projectCount: number;
  billingSummary: {
    totalRevenueCents: number;
    remainingDueCents: number;
    overdueCount: number;
    deferred: boolean;
  };
  logoUrl: string | null;
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ClientCard({ client }: { client: ClientCardData }) {
  return (
    <Link href={`/admin/clients/${client.id}`}>
      <Card className="gap-0 overflow-hidden border-zinc-200 bg-white py-0 shadow-none transition-shadow hover:shadow-lg hover:shadow-black/5">
        <div className="flex min-h-44 items-end justify-between bg-[linear-gradient(135deg,rgba(255,245,157,0.95),rgba(255,255,255,0.95))] p-5">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Client</div>
            <div className="font-serif text-3xl leading-tight text-zinc-950">{client.name}</div>
          </div>
          {client.logoUrl ? (
            <img alt={`${client.name} logo`} className="h-14 w-14 border border-black/10 object-cover" src={client.logoUrl} />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center border border-black/10 bg-white text-sm font-semibold text-zinc-900">
              {getInitials(client.name)}
            </div>
          )}
        </div>
        <CardHeader className="gap-3 px-5 pt-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <CardTitle className="line-clamp-2 text-xl font-semibold leading-tight text-zinc-900">
                {client.name}
              </CardTitle>
              <div className="text-sm text-zinc-500">
                {client.country ?? "Country not set"} · {client.baseCurrency}
              </div>
            </div>
            <ClientStatusBadge status={client.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-5 pb-5 pt-3">
          <div className="grid gap-2 text-sm text-zinc-600">
            <div className="flex items-center gap-2">
              <MailIcon className="size-4 text-zinc-400" />
              <span className="truncate">{client.primaryContactEmail}</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneIcon className="size-4 text-zinc-400" />
              <span>{client.primaryContactPhone ?? "No phone set"}</span>
            </div>
            <div className="flex items-center gap-2">
              <UsersIcon className="size-4 text-zinc-400" />
              <span>
                {client.activeMemberCount} active members · {client.pendingInviteCount} pending
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Building2Icon className="size-4 text-zinc-400" />
              <span>{client.projectCount} linked projects</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 border border-zinc-200 p-3 text-xs">
            <div>
              <div className="uppercase tracking-[0.16em] text-zinc-400">Revenue</div>
              <div className="mt-1 text-sm font-semibold text-zinc-900">
                {client.billingSummary.deferred ? "—" : client.billingSummary.totalRevenueCents}
              </div>
            </div>
            <div>
              <div className="uppercase tracking-[0.16em] text-zinc-400">Remaining</div>
              <div className="mt-1 text-sm font-semibold text-zinc-900">
                {client.billingSummary.deferred ? "—" : client.billingSummary.remainingDueCents}
              </div>
            </div>
            <div>
              <div className="uppercase tracking-[0.16em] text-zinc-400">Overdue</div>
              <div className="mt-1 text-sm font-semibold text-zinc-900">
                {client.billingSummary.overdueCount}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-zinc-100 px-5 py-3 text-xs text-zinc-500">
          Open client workspace
        </CardFooter>
      </Card>
    </Link>
  );
}
