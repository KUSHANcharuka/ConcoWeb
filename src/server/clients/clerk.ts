import { clerkClient } from "@clerk/nextjs/server";

export const clientRoleValues = ["admin", "member"] as const;

export type ClientRole = (typeof clientRoleValues)[number];
export type ClerkClientRole = "org:admin" | "org:member";

export function toClerkClientRole(role: ClientRole): ClerkClientRole {
  return role === "admin" ? "org:admin" : "org:member";
}

export function fromClerkClientRole(role: string | null | undefined): ClientRole {
  return role === "org:admin" ? "admin" : "member";
}

export async function getClerkAdminClient() {
  return clerkClient();
}
