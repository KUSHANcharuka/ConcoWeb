import { ClientPortalPlaceholder, ClientPortalSection } from "~/components/client-portal/client-portal-shell";

export default function ClientPortalProjectsPage() {
  return (
    <ClientPortalSection
      description="This route will show the authenticated organization’s project workspaces."
      eyebrow="Client Portal"
      title="Projects"
    >
      <ClientPortalPlaceholder
        description="Project cards and the shared project workspace will be connected here in a dedicated client-portal pass."
        title="Projects shell"
      />
    </ClientPortalSection>
  );
}
