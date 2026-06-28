import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isClientPortalRoute = createRouteMatcher(["/client-portal(.*)"]);
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const isPublicApiRoute = createRouteMatcher(["/api/webhooks/(.*)"]);

type SessionMetadata = { role?: "admin" };

export default clerkMiddleware(async (auth, req) => {
  if (isAuthRoute(req) || isPublicApiRoute(req)) return;

  if (isAdminRoute(req)) {
    const { userId, sessionClaims, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn({ returnBackUrl: req.url });

    const role = (sessionClaims?.metadata as SessionMetadata | undefined)?.role;
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/forbidden", req.url));
    }
    return;
  }

  if (isClientPortalRoute(req)) {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn({ returnBackUrl: req.url });
  }
});

export const config = {
  matcher: [
    // Skip Next internals and static files.
    "/((?!_next|.*\\..*).*)",
    // Always run for API routes.
    "/(api|trpc)(.*)",
  ],
};
