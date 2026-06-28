import Link from "next/link";

import { env } from "~/env";
import { getAdminSession, isStaffOrgMember } from "~/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function ForbiddenPage() {
  const session = await getAdminSession();

  let staffOrgMember = false;
  if (session) {
    try {
      staffOrgMember = await isStaffOrgMember(session.userId);
    } catch {
      staffOrgMember = false;
    }
  }

  const staffButStale = session && !session.isAdmin && staffOrgMember;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-10">
      <div className="w-full max-w-xl space-y-4 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          403 · admin only
        </p>
        <h1 className="text-3xl font-semibold">No admin access.</h1>
        <p className="text-muted-foreground">
          {staffButStale
            ? "You're a member of the Concolabs staff org but your session hasn't picked up the admin role yet. Sign out and back in so Clerk reissues your JWT."
            : "This area is restricted to Concolabs staff. If that's you, ask an existing admin to add you to the staff org."}
        </p>

        <details className="rounded-md border border-border bg-card/50 p-4 text-left">
          <summary className="cursor-pointer font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Diagnostic
          </summary>
          <dl className="mt-3 grid grid-cols-[180px_1fr] gap-y-1 font-mono text-xs">
            <dt className="text-muted-foreground">user id</dt>
            <dd>{session?.userId ?? "(signed out)"}</dd>

            <dt className="text-muted-foreground">role claim</dt>
            <dd>{session?.role ?? "(none)"}</dd>

            <dt className="text-muted-foreground">staff org id</dt>
            <dd>{env.CLERK_CONCOLABS_ORG_ID}</dd>

            <dt className="text-muted-foreground">in staff org?</dt>
            <dd>{staffOrgMember ? "yes" : "no"}</dd>
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">
            If <code>in staff org?</code> is <strong>yes</strong> but{" "}
            <code>role claim</code> is <strong>none</strong>, the webhook hasn&apos;t
            fired (or hasn&apos;t been configured) — sign out and back in to refresh,
            or manually set <code>publicMetadata.role = &quot;admin&quot;</code> in
            the Clerk dashboard.
          </p>
        </details>

        <div className="flex justify-center gap-3 pt-2">
          <Link
            href="/"
            className="rounded-md border px-4 py-2 text-sm hover:bg-accent"
          >
            Back to site
          </Link>
        </div>
      </div>
    </main>
  );
}
