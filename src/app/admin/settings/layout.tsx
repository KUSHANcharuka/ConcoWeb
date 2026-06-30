import type { ReactNode } from "react";

import { SettingsWorkspaceShell } from "~/components/admin/settings/settings-workspace-shell";

export default function AdminSettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <SettingsWorkspaceShell>{children}</SettingsWorkspaceShell>;
}
