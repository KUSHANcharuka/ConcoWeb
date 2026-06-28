import type { ReactNode } from "react";

import { AdminTopbar } from "~/components/admin/admin-topbar";
import { requireAdmin } from "~/lib/admin-auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Defence in depth: middleware already gates this prefix, but layouts run on
  // every admin request and re-check the JWT role flag. Redirects guests to
  // /sign-in and signed-in non-admins to /forbidden.
  await requireAdmin();

  return (
    <div className="admin-shell min-h-screen bg-[var(--color-bg-app)] text-[var(--color-ink)]">
      <AdminTopbar />
      <div className="flex">
        {/* Contextual sidebar slot — pages that need it render <AdminSidebar/> themselves */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
