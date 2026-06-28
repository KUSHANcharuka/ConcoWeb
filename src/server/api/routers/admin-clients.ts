import { and, asc, desc, eq, ilike, inArray, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { env } from "~/env";
import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";
import { getClerkAdminClient, toClerkClientRole } from "~/server/clients/clerk";
import {
  markMembershipRemoved,
  syncOrganizationInvitation,
} from "~/server/clients/sync";
import type { Database } from "~/server/db";
import {
  assets,
  clientInvitations,
  clientMemberships,
  clients,
  proposals,
  projects,
  users,
} from "~/server/db/schema";
import { createAssetReadUrl } from "~/server/r2";

const clientStatusValues = ["lead", "active", "suspended", "archived"] as const;
const roleValues = ["admin", "member"] as const;

const listClientsSchema = z.object({
  search: z.string().trim().max(120).default(""),
  statuses: z.array(z.enum(clientStatusValues)).default([]),
});

const clientScopeSchema = z.object({
  clientId: z.string().uuid(),
});

const inviteInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  jobTitle: z.string().trim().max(120).nullable().optional(),
  phone: z.string().trim().max(32).nullable().optional(),
  role: z.enum(roleValues),
});

const createClientSchema = z.object({
  name: z.string().trim().min(2).max(120),
  primaryContactEmail: z.string().trim().email(),
  primaryContactPhone: z.string().trim().max(32).nullable().optional(),
  country: z.string().trim().max(120).nullable().optional(),
  baseCurrency: z.string().trim().min(3).max(8),
  internalNotes: z.string().trim().max(2000).nullable().optional(),
  firstInvite: inviteInputSchema.partial({ name: true }).nullable().optional(),
});

const updateClientProfileSchema = clientScopeSchema.extend({
  name: z.string().trim().min(2).max(120),
  primaryContactEmail: z.string().trim().email(),
  primaryContactPhone: z.string().trim().max(32).nullable().optional(),
  country: z.string().trim().max(120).nullable().optional(),
  baseCurrency: z.string().trim().min(3).max(8),
  internalNotes: z.string().trim().max(2000).nullable().optional(),
  status: z.enum(clientStatusValues),
});

const inviteClientMemberSchema = clientScopeSchema.merge(inviteInputSchema);

const changeRoleSchema = clientScopeSchema.extend({
  membershipId: z.string().uuid(),
  role: z.enum(roleValues),
});

const removeMemberSchema = clientScopeSchema.extend({
  membershipId: z.string().uuid().nullable().optional(),
  invitationId: z.string().uuid().nullable().optional(),
});

const resendInviteSchema = clientScopeSchema.extend({
  invitationId: z.string().uuid(),
});

function formatMoney(cents: number | null, currency: string) {
  if (cents == null) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

async function resolveClientLogoUrl(input: {
  logoAssetId: string | null;
  logoObjectKey: string | null;
}) {
  if (!input.logoAssetId || !input.logoObjectKey) {
    return null;
  }

  try {
    return await createAssetReadUrl({ objectKey: input.logoObjectKey });
  } catch {
    return null;
  }
}

async function ensureClientDetails(
  db: Database,
  clientId: string,
) {
  const [client] = await db
    .select({
      id: clients.id,
      name: clients.name,
      clerkOrgId: clients.clerkOrgId,
      primaryContactEmail: clients.primaryContactEmail,
      primaryContactPhone: clients.primaryContactPhone,
      country: clients.country,
      baseCurrency: clients.baseCurrency,
      status: clients.status,
      internalNotes: clients.internalNotes,
      logoAssetId: clients.logoAssetId,
      logoObjectKey: assets.objectKey,
      createdAt: clients.createdAt,
      updatedAt: clients.updatedAt,
    })
    .from(clients)
    .leftJoin(assets, eq(clients.logoAssetId, assets.id))
    .where(eq(clients.id, clientId))
    .limit(1);

  if (!client) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Client not found." });
  }

  return client;
}

async function assertInviteAllowed(input: {
  db: Database;
  clientId: string;
  email: string;
}) {
  const [existingMembership] = await input.db
    .select({
      id: clientMemberships.id,
    })
    .from(clientMemberships)
    .where(
      and(
        eq(clientMemberships.clientId, input.clientId),
        eq(clientMemberships.email, input.email),
        eq(clientMemberships.status, "active"),
      ),
    )
    .limit(1);

  if (existingMembership) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "That user is already an active member of this client.",
    });
  }

  const [existingInvite] = await input.db
    .select({
      id: clientInvitations.id,
    })
    .from(clientInvitations)
    .where(
      and(
        eq(clientInvitations.clientId, input.clientId),
        eq(clientInvitations.email, input.email),
        eq(clientInvitations.status, "pending"),
      ),
    )
    .limit(1);

  if (existingInvite) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "There is already a pending invite for that email.",
    });
  }
}

async function createClientInvitation(input: {
  db: Database;
  clientId: string;
  clerkOrgId: string;
  invitedByUserId: string;
  invite: z.infer<typeof inviteInputSchema>;
}) {
  await assertInviteAllowed({
    db: input.db,
    clientId: input.clientId,
    email: input.invite.email,
  });

  const clerk = await getClerkAdminClient();
  const invitation = await clerk.organizations.createOrganizationInvitation({
    organizationId: input.clerkOrgId,
    emailAddress: input.invite.email,
    role: toClerkClientRole(input.invite.role),
    inviterUserId: input.invitedByUserId,
    redirectUrl: `${env.APP_URL}/sign-in`,
  });

  await syncOrganizationInvitation(input.db, {
    clientId: input.clientId,
    clerkInvitationId: invitation.id,
    email: invitation.emailAddress,
    name: input.invite.name ?? null,
    jobTitle: input.invite.jobTitle ?? null,
    phone: input.invite.phone ?? null,
    role: input.invite.role,
    status: invitation.status ?? "pending",
    invitedByUserId: input.invitedByUserId,
    invitedAt: invitation.createdAt,
  });
}

async function buildBillingSummary(
  db: Database,
  clientId: string,
  currency: string,
) {
  const proposalRows = await db
    .select({
      totalAmountCents: proposals.totalAmountCents,
      status: proposals.status,
    })
    .from(proposals)
    .where(eq(proposals.clientId, clientId));

  const bookedValueCents = proposalRows.reduce((sum, row) => {
    if (row.totalAmountCents == null) return sum;
    if (row.status === "accepted" || row.status === "signed") {
      return sum + row.totalAmountCents;
    }
    return sum;
  }, 0);

  return {
    currency,
    totalRevenueCents: 0,
    remainingDueCents: 0,
    overdueCount: 0,
    completedCount: 0,
    bookedValueCents,
    totalRevenueLabel: formatMoney(0, currency),
    remainingDueLabel: formatMoney(0, currency),
    bookedValueLabel: formatMoney(bookedValueCents, currency),
    deferred: true,
  };
}

export const adminClientsRouter = createTRPCRouter({
  options: adminProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        id: clients.id,
        name: clients.name,
        baseCurrency: clients.baseCurrency,
        primaryContactEmail: clients.primaryContactEmail,
      })
      .from(clients)
      .orderBy(asc(clients.name));
  }),

  context: adminProcedure.input(clientScopeSchema).query(async ({ ctx, input }) => {
    const client = await ensureClientDetails(ctx.db, input.clientId);
    const [projectCountRow, memberCountRow, inviteCountRow] = await Promise.all([
      ctx.db
        .select({ clientId: projects.clientId })
        .from(projects)
        .where(eq(projects.clientId, input.clientId)),
      ctx.db
        .select({ clientId: clientMemberships.clientId })
        .from(clientMemberships)
        .where(
          and(
            eq(clientMemberships.clientId, input.clientId),
            eq(clientMemberships.status, "active"),
          ),
        ),
      ctx.db
        .select({ clientId: clientInvitations.clientId })
        .from(clientInvitations)
        .where(
          and(
            eq(clientInvitations.clientId, input.clientId),
            eq(clientInvitations.status, "pending"),
          ),
        ),
    ]);

    return {
      id: client.id,
      name: client.name,
      status: client.status,
      primaryContactEmail: client.primaryContactEmail,
      primaryContactPhone: client.primaryContactPhone,
      baseCurrency: client.baseCurrency,
      projectCount: projectCountRow.length,
      activeMemberCount: memberCountRow.length,
      pendingInviteCount: inviteCountRow.length,
      logoUrl: await resolveClientLogoUrl(client),
    };
  }),

  list: adminProcedure.input(listClientsSchema).query(async ({ ctx, input }) => {
    const filters = [];
    if (input.search.length > 0) {
      filters.push(
        or(
          ilike(clients.name, `%${input.search}%`),
          ilike(clients.primaryContactEmail, `%${input.search}%`),
          ilike(clients.primaryContactPhone, `%${input.search}%`),
        ),
      );
    }

    if (input.statuses.length > 0) {
      filters.push(inArray(clients.status, input.statuses));
    }

    const rows = await ctx.db
      .select({
        id: clients.id,
        name: clients.name,
        primaryContactEmail: clients.primaryContactEmail,
        primaryContactPhone: clients.primaryContactPhone,
        baseCurrency: clients.baseCurrency,
        status: clients.status,
        country: clients.country,
        clerkOrgId: clients.clerkOrgId,
        logoAssetId: clients.logoAssetId,
        logoObjectKey: assets.objectKey,
        createdAt: clients.createdAt,
      })
      .from(clients)
      .leftJoin(assets, eq(clients.logoAssetId, assets.id))
      .where(filters.length > 0 ? and(...filters) : undefined)
      .orderBy(desc(clients.createdAt));

    const clientIds = rows.map((row) => row.id);
    const [membershipRows, invitationRows, projectRows] = clientIds.length
      ? await Promise.all([
          ctx.db
            .select({
              clientId: clientMemberships.clientId,
            })
            .from(clientMemberships)
            .where(
              and(
                inArray(clientMemberships.clientId, clientIds),
                eq(clientMemberships.status, "active"),
              ),
            ),
          ctx.db
            .select({
              clientId: clientInvitations.clientId,
            })
            .from(clientInvitations)
            .where(
              and(
                inArray(clientInvitations.clientId, clientIds),
                eq(clientInvitations.status, "pending"),
              ),
            ),
          ctx.db
            .select({
              clientId: projects.clientId,
            })
            .from(projects)
            .where(inArray(projects.clientId, clientIds)),
        ])
      : [[], [], []];

    const activeMemberCount = new Map<string, number>();
    const pendingInviteCount = new Map<string, number>();
    const projectCount = new Map<string, number>();

    for (const row of membershipRows) {
      activeMemberCount.set(row.clientId, (activeMemberCount.get(row.clientId) ?? 0) + 1);
    }

    for (const row of invitationRows) {
      pendingInviteCount.set(row.clientId, (pendingInviteCount.get(row.clientId) ?? 0) + 1);
    }

    for (const row of projectRows) {
      projectCount.set(row.clientId, (projectCount.get(row.clientId) ?? 0) + 1);
    }

    return Promise.all(
      rows.map(async (row) => ({
        id: row.id,
        name: row.name,
        primaryContactEmail: row.primaryContactEmail,
        primaryContactPhone: row.primaryContactPhone,
        baseCurrency: row.baseCurrency,
        status: row.status,
        country: row.country,
        activeMemberCount: activeMemberCount.get(row.id) ?? 0,
        pendingInviteCount: pendingInviteCount.get(row.id) ?? 0,
        projectCount: projectCount.get(row.id) ?? 0,
        billingSummary: {
          totalRevenueCents: 0,
          remainingDueCents: 0,
          overdueCount: 0,
          deferred: true,
        },
        logoUrl: await resolveClientLogoUrl(row),
      })),
    );
  }),

  create: adminProcedure.input(createClientSchema).mutation(async ({ ctx, input }) => {
    const clerk = await getClerkAdminClient();
    const organization = await clerk.organizations.createOrganization({
      name: input.name,
    });

    const [client] = await ctx.db
      .insert(clients)
      .values({
        name: input.name,
        clerkOrgId: organization.id,
        primaryContactEmail: input.primaryContactEmail,
        primaryContactPhone: input.primaryContactPhone ?? null,
        country: input.country ?? null,
        baseCurrency: input.baseCurrency,
        internalNotes: input.internalNotes ?? null,
        status: "active",
      })
      .returning({
        id: clients.id,
        clerkOrgId: clients.clerkOrgId,
      });

    if (!client) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create client.",
      });
    }

    if (input.firstInvite?.email) {
      await createClientInvitation({
        db: ctx.db,
        clientId: client.id,
        clerkOrgId: client.clerkOrgId,
        invitedByUserId: ctx.session.userId,
        invite: {
          name: input.firstInvite.name ?? input.name,
          email: input.firstInvite.email,
          jobTitle: input.firstInvite.jobTitle ?? null,
          phone: input.firstInvite.phone ?? null,
          role: input.firstInvite.role ?? "admin",
        },
      });
    }

    return { clientId: client.id };
  }),

  getById: adminProcedure.input(clientScopeSchema).query(async ({ ctx, input }) => {
    const client = await ensureClientDetails(ctx.db, input.clientId);

    const [membershipRows, invitationRows, projectRows, billingSummary] = await Promise.all([
      ctx.db
        .select({
          id: clientMemberships.id,
          userId: clientMemberships.userId,
          email: clientMemberships.email,
          jobTitle: clientMemberships.jobTitle,
          role: clientMemberships.role,
          status: clientMemberships.status,
          joinedAt: clientMemberships.joinedAt,
          removedAt: clientMemberships.removedAt,
          name: users.name,
          phone: users.phone,
          imageUrl: users.imageUrl,
        })
        .from(clientMemberships)
        .leftJoin(users, eq(clientMemberships.userId, users.id))
        .where(eq(clientMemberships.clientId, input.clientId))
        .orderBy(
          asc(clientMemberships.status),
          asc(clientMemberships.email),
        ),
      ctx.db
        .select({
          id: clientInvitations.id,
          email: clientInvitations.email,
          name: clientInvitations.name,
          jobTitle: clientInvitations.jobTitle,
          phone: clientInvitations.phone,
          role: clientInvitations.role,
          status: clientInvitations.status,
          invitedAt: clientInvitations.invitedAt,
          acceptedAt: clientInvitations.acceptedAt,
          revokedAt: clientInvitations.revokedAt,
        })
        .from(clientInvitations)
        .where(eq(clientInvitations.clientId, input.clientId))
        .orderBy(desc(clientInvitations.createdAt)),
      ctx.db
        .select({
          id: projects.id,
          name: projects.name,
          description: projects.description,
          projectType: projects.projectType,
          status: projects.status,
          currency: projects.currency,
          targetLaunchDate: projects.targetLaunchDate,
          coverAssetId: projects.coverAssetId,
          coverObjectKey: assets.objectKey,
        })
        .from(projects)
        .leftJoin(assets, eq(projects.coverAssetId, assets.id))
        .where(eq(projects.clientId, input.clientId))
        .orderBy(desc(projects.createdAt)),
      buildBillingSummary(ctx.db, input.clientId, client.baseCurrency),
    ]);

    const coverUrls = new Map<string, string>();
    await Promise.all(
      projectRows.map(async (project) => {
        if (!project.coverAssetId || !project.coverObjectKey) return;
        const url = await resolveClientLogoUrl({
          logoAssetId: project.coverAssetId,
          logoObjectKey: project.coverObjectKey,
        });
        if (url) {
          coverUrls.set(project.coverAssetId, url);
        }
      }),
    );

    const activeMembers = membershipRows.filter((row) => row.status === "active");
    const pendingInvites = invitationRows.filter((row) => row.status === "pending");

    return {
      id: client.id,
      name: client.name,
      primaryContactEmail: client.primaryContactEmail,
      primaryContactPhone: client.primaryContactPhone,
      country: client.country,
      baseCurrency: client.baseCurrency,
      status: client.status,
      internalNotes: client.internalNotes,
      logoUrl: await resolveClientLogoUrl(client),
      counts: {
        activeMembers: activeMembers.length,
        pendingInvites: pendingInvites.length,
        totalProjects: projectRows.length,
      },
      recentActivity: [
        ...pendingInvites.slice(0, 2).map((invite) => ({
          id: `invite-${invite.id}`,
          label: `Invitation sent to ${invite.email}`,
          occurredAt: invite.invitedAt,
        })),
        ...projectRows.slice(0, 2).map((project) => ({
          id: `project-${project.id}`,
          label: `Project workspace ${project.name} is linked to this client`,
          occurredAt: client.updatedAt,
        })),
      ].sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime()),
      members: activeMembers,
      invitations: invitationRows,
      projects: projectRows.map((project) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        projectType: project.projectType,
        status: project.status,
        currency: project.currency,
        coverUrl: project.coverAssetId
          ? coverUrls.get(project.coverAssetId) ?? null
          : null,
        targetLaunchDate: project.targetLaunchDate,
      })),
      billingSummary,
    };
  }),

  updateProfile: adminProcedure
    .input(updateClientProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const client = await ensureClientDetails(ctx.db, input.clientId);
      const clerk = await getClerkAdminClient();

      await clerk.organizations.updateOrganization(client.clerkOrgId, {
        name: input.name,
      });

      await ctx.db
        .update(clients)
        .set({
          name: input.name,
          primaryContactEmail: input.primaryContactEmail,
          primaryContactPhone: input.primaryContactPhone ?? null,
          country: input.country ?? null,
          baseCurrency: input.baseCurrency,
          internalNotes: input.internalNotes ?? null,
          status: input.status,
          updatedAt: new Date(),
        })
        .where(eq(clients.id, input.clientId));

      return { success: true };
    }),

  billing: createTRPCRouter({
    summary: adminProcedure.input(clientScopeSchema).query(async ({ ctx, input }) => {
      const client = await ensureClientDetails(ctx.db, input.clientId);
      return buildBillingSummary(ctx.db, input.clientId, client.baseCurrency);
    }),
  }),

  members: createTRPCRouter({
    invite: adminProcedure.input(inviteClientMemberSchema).mutation(async ({ ctx, input }) => {
      const client = await ensureClientDetails(ctx.db, input.clientId);

      await createClientInvitation({
        db: ctx.db,
        clientId: client.id,
        clerkOrgId: client.clerkOrgId,
        invitedByUserId: ctx.session.userId,
        invite: {
          name: input.name,
          email: input.email,
          jobTitle: input.jobTitle ?? null,
          phone: input.phone ?? null,
          role: input.role,
        },
      });

      return { success: true };
    }),

    changeRole: adminProcedure.input(changeRoleSchema).mutation(async ({ ctx, input }) => {
      const client = await ensureClientDetails(ctx.db, input.clientId);
      const [membership] = await ctx.db
        .select({
          id: clientMemberships.id,
          userId: clientMemberships.userId,
          clerkMembershipId: clientMemberships.clerkMembershipId,
        })
        .from(clientMemberships)
        .where(
          and(
            eq(clientMemberships.id, input.membershipId),
            eq(clientMemberships.clientId, input.clientId),
          ),
        )
        .limit(1);

      if (!membership) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Membership not found." });
      }

      const clerk = await getClerkAdminClient();
      await clerk.organizations.updateOrganizationMembership({
        organizationId: client.clerkOrgId,
        userId: membership.userId,
        role: toClerkClientRole(input.role),
      });

      await ctx.db
        .update(clientMemberships)
        .set({
          role: input.role,
          updatedAt: new Date(),
        })
        .where(eq(clientMemberships.id, input.membershipId));

      return { success: true };
    }),

    remove: adminProcedure.input(removeMemberSchema).mutation(async ({ ctx, input }) => {
      const client = await ensureClientDetails(ctx.db, input.clientId);
      const clerk = await getClerkAdminClient();

      if (input.membershipId) {
        const [membership] = await ctx.db
          .select({
            id: clientMemberships.id,
            userId: clientMemberships.userId,
          })
          .from(clientMemberships)
          .where(
            and(
              eq(clientMemberships.id, input.membershipId),
              eq(clientMemberships.clientId, input.clientId),
            ),
          )
          .limit(1);

        if (!membership) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Membership not found." });
        }

        await clerk.organizations.deleteOrganizationMembership({
          organizationId: client.clerkOrgId,
          userId: membership.userId,
        });

        await markMembershipRemoved(ctx.db, {
          clientId: input.clientId,
          userId: membership.userId,
          removedByUserId: ctx.session.userId,
        });

        return { success: true };
      }

      if (input.invitationId) {
        const [invitation] = await ctx.db
          .select({
            id: clientInvitations.id,
            clerkInvitationId: clientInvitations.clerkInvitationId,
          })
          .from(clientInvitations)
          .where(
            and(
              eq(clientInvitations.id, input.invitationId),
              eq(clientInvitations.clientId, input.clientId),
            ),
          )
          .limit(1);

        if (!invitation) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Invitation not found." });
        }

        await clerk.organizations.revokeOrganizationInvitation({
          organizationId: client.clerkOrgId,
          invitationId: invitation.clerkInvitationId,
          requestingUserId: ctx.session.userId,
        });

        await ctx.db
          .update(clientInvitations)
          .set({
            status: "revoked",
            revokedAt: new Date(),
            revokedByUserId: ctx.session.userId,
            updatedAt: new Date(),
          })
          .where(eq(clientInvitations.id, input.invitationId));

        return { success: true };
      }

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Choose a membership or invitation to remove.",
      });
    }),

    resendInvite: adminProcedure.input(resendInviteSchema).mutation(async ({ ctx, input }) => {
      const client = await ensureClientDetails(ctx.db, input.clientId);
      const [existingInvitation] = await ctx.db
        .select({
          id: clientInvitations.id,
          email: clientInvitations.email,
          name: clientInvitations.name,
          jobTitle: clientInvitations.jobTitle,
          phone: clientInvitations.phone,
          role: clientInvitations.role,
          clerkInvitationId: clientInvitations.clerkInvitationId,
          status: clientInvitations.status,
        })
        .from(clientInvitations)
        .where(
          and(
            eq(clientInvitations.id, input.invitationId),
            eq(clientInvitations.clientId, input.clientId),
          ),
        )
        .limit(1);

      if (!existingInvitation) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invitation not found." });
      }

      const clerk = await getClerkAdminClient();
      if (existingInvitation.status === "pending") {
        await clerk.organizations.revokeOrganizationInvitation({
          organizationId: client.clerkOrgId,
          invitationId: existingInvitation.clerkInvitationId,
          requestingUserId: ctx.session.userId,
        });

        await ctx.db
          .update(clientInvitations)
          .set({
            status: "revoked",
            revokedAt: new Date(),
            revokedByUserId: ctx.session.userId,
            updatedAt: new Date(),
          })
          .where(eq(clientInvitations.id, existingInvitation.id));
      }

      await createClientInvitation({
        db: ctx.db,
        clientId: client.id,
        clerkOrgId: client.clerkOrgId,
        invitedByUserId: ctx.session.userId,
        invite: {
          name: existingInvitation.name ?? existingInvitation.email,
          email: existingInvitation.email,
          jobTitle: existingInvitation.jobTitle ?? null,
          phone: existingInvitation.phone ?? null,
          role: existingInvitation.role,
        },
      });

      return { success: true };
    }),
  }),
});
