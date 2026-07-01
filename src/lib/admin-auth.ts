import "server-only";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { env } from "~/env";

/**
 * Hybrid admin auth:
 * - Source of truth: membership in the Concolabs staff Clerk Organization
 *   (`CLERK_CONCOLABS_ORG_ID`). The Clerk webhook mirrors that fact onto
 *   `publicMetadata.role = "admin"` so the middleware and tRPC gate can read
 *   it cheaply off the session JWT.
 * - Gating is on the role flag, **not** the active org, so admins can switch
 *   their active org (e.g. to preview a client portal) without losing
 *   admin access.
 */

export type AdminRoleClaim = "admin" | undefined;

type ClerkSessionMetadata = {
  role?: AdminRoleClaim;
};

/**
 * Read the admin role flag from the Clerk session claims.
 * Returns null when the user is signed out.
 */
export async function getAdminSession() {
  const session = await auth();
  if (!session.userId) return null;

  const metadata = session.sessionClaims?.metadata as ClerkSessionMetadata | undefined;
  return {
    userId: session.userId,
    role: metadata?.role,
    isAdmin: metadata?.role === "admin",
    session,
  };
}

/**
 * Server Component / Server Action guard. Redirects to sign-in for guests,
 * `/admin/forbidden` for signed-in non-admins. Returns the session payload on
 * success so callers can use `userId` directly.
 *
 * The Clerk middleware already enforces this for navigation, but every Server
 * Component that reads admin-only data should call this too. Defence in depth
 * matters here: the JWT role flag is only as fresh as the user's session, so
 * a freshly-promoted admin who hasn't refreshed could otherwise slip past one
 * layer but not both.
 */
export async function requireAdmin() {
  const result = await getAdminSession();

  if (!result) redirect("/sign-in");
  if (!result.isAdmin) redirect("/forbidden");

  return result;
}

/**
 * Belt-and-suspenders check: query Clerk for the user's membership in the
 * Concolabs staff org. Useful when the JWT might be stale (e.g. right after
 * the webhook fires and the user hasn't refreshed). Not called in the hot
 * path — reserved for routes that must absolutely confirm staff status, like
 * the `/admin/forbidden` recovery flow.
 */
export async function isStaffOrgMember(userId: string) {
  const client = await clerkClient();
  const memberships = await client.users.getOrganizationMembershipList({ userId });
  return memberships.data.some(
    (membership) => membership.organization.id === env.CLERK_CONCOLABS_ORG_ID,
  );
}
