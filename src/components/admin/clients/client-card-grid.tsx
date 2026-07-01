import { ClientCard, type ClientCardData } from "~/components/admin/clients/client-card";

export function ClientCardGrid({ clients }: { clients: ClientCardData[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {clients.map((client) => (
        <ClientCard client={client} key={client.id} />
      ))}
    </div>
  );
}
