import { ClientPortalPlaceholder, ClientPortalSection } from "~/components/client-portal/client-portal-shell";

export default function ClientPortalSettingsPage() {
  return (
    <ClientPortalSection
      description="This route will expose client-side organization settings and membership information."
      eyebrow="Client Portal"
      title="Settings"
    >
      <ClientPortalPlaceholder
        description="Organization settings and member self-service are not implemented yet."
        title="Settings shell"
      />
    </ClientPortalSection>
  );
}
