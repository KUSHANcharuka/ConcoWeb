import { ClientPortalPlaceholder, ClientPortalSection } from "~/components/client-portal/client-portal-shell";

export default function ClientPortalRequestsPage() {
  return (
    <ClientPortalSection
      description="This route will eventually cover new project requests and request tracking."
      eyebrow="Client Portal"
      title="Requests"
    >
      <ClientPortalPlaceholder
        description="The request submission and tracking flow is not implemented yet, but the authenticated route shell is ready."
        title="Requests shell"
      />
    </ClientPortalSection>
  );
}
