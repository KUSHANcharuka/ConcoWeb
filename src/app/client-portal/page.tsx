import { ClientPortalPlaceholder, ClientPortalSection } from "~/components/client-portal/client-portal-shell";
import { requireClientPortalAccess } from "~/lib/client-portal-auth";

export default async function ClientPortalHomePage() {
  const { client } = await requireClientPortalAccess();

  return (
    <ClientPortalSection
      description="This is the authenticated shell for the real client portal. The shared project and billing workflows will land in follow-up passes, but access is already scoped to the active client organization."
      eyebrow="Client Portal"
      title={`Welcome to ${client.name}`}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="border border-zinc-200 bg-white p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-zinc-400">Organization</div>
          <div className="mt-2 text-lg font-semibold text-zinc-950">{client.name}</div>
        </div>
        <div className="border border-zinc-200 bg-white p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-zinc-400">Base currency</div>
          <div className="mt-2 text-lg font-semibold text-zinc-950">{client.baseCurrency}</div>
        </div>
        <div className="border border-zinc-200 bg-white p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-zinc-400">Portal status</div>
          <div className="mt-2 text-lg font-semibold text-zinc-950">{client.status}</div>
        </div>
      </div>

      <ClientPortalPlaceholder
        description="The portal shell is authenticated and scoped correctly. Projects, requests, billing, and settings will expand from this shared entry point."
        title="Shared client workspace follows next"
      />
    </ClientPortalSection>
  );
}
