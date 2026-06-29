import { createHmac, timingSafeEqual } from "node:crypto";

import { and, desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { Database } from "~/server/db";
import {
  productWebhookConfigs,
  productWebhookDeliveryLogs,
  projectProductAccessEvents,
  projectProductAccessStates,
  projectProductAccounts,
  type ProjectProductAccessState,
} from "~/server/db/schema/billing";
import { clients } from "~/server/db/schema/clients";
import { products } from "~/server/db/schema/products";
import { projects } from "~/server/db/schema/projects";

const MAX_RESPONSE_BODY_LENGTH = 4000;
const MAX_RESPONSE_SUMMARY_LENGTH = 500;
const SIGNATURE_VERSION = "v1";

export const productAccessCallbackSchema = z.object({
  projectId: z.string().uuid(),
  status: z.enum(["active", "revoked"]),
  effectiveAt: z.string().datetime().nullable().optional(),
  accessExpiresAt: z.string().datetime().nullable().optional(),
  reason: z.string().trim().max(500).nullable().optional(),
  externalAccountId: z.string().trim().max(255).nullable().optional(),
  externalWorkspaceId: z.string().trim().max(255).nullable().optional(),
  accountUrl: z.string().url().nullable().optional(),
  statsSummary: z.record(z.string(), z.unknown()).default({}),
});

type ProductAccessCallbackPayload = z.infer<typeof productAccessCallbackSchema>;

type LinkedProductScope = {
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  productId: string | null;
  productName: string | null;
  productSlug: string | null;
};

type ProductWebhookConfig = {
  configId: string | null;
  productId: string;
  productName: string;
  productSlug: string;
  webhookUrl: string | null;
  webhookSecret: string | null;
  isActive: boolean | null;
  payloadTemplate: Record<string, unknown> | null;
};

type DeliveryResult = {
  success: boolean;
  deliveryStatus: "success" | "failed";
  httpStatus: number | null;
  responseSummary: string | null;
  responseBody: string | null;
  occurredAt: Date;
  payload: Record<string, unknown>;
};

type AdminAction = "grant" | "extend" | "revoke";

export function buildProductAccessSignature(payload: string, timestamp: string, secret: string) {
  return createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");
}

export function verifyProductAccessSignature(input: {
  payload: string;
  signatureHeader: string | null;
  secret: string;
}) {
  if (!input.signatureHeader) {
    return false;
  }

  const parsed = parseSignatureHeader(input.signatureHeader);
  if (!parsed.timestamp || !parsed.signature) {
    return false;
  }

  const expected = buildProductAccessSignature(
    input.payload,
    parsed.timestamp,
    input.secret,
  );

  const expectedBuffer = Buffer.from(expected, "hex");
  const providedBuffer = Buffer.from(parsed.signature, "hex");

  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, providedBuffer);
}

export function renderProductAccessTemplate(
  template: Record<string, unknown>,
  context: Record<string, unknown>,
) {
  if (Object.keys(template).length === 0) {
    return context;
  }

  return resolveTemplateValue(template, context) as Record<string, unknown>;
}

export function getEffectiveProductAccessState(state: {
  accessState: ProjectProductAccessState["accessState"];
  accessExpiresAt: Date | null;
}) {
  if (
    state.accessState === "active" &&
    state.accessExpiresAt &&
    state.accessExpiresAt.getTime() < Date.now()
  ) {
    return "expired" as const;
  }

  return state.accessState;
}

export async function getProductAccessContext(db: Database, projectId: string) {
  const scope = await getLinkedProductScope(db, projectId);

  if (!scope.productId || !scope.productName || !scope.productSlug) {
    return {
      project: {
        id: scope.projectId,
        name: scope.projectName,
        clientName: scope.clientName,
        productId: null,
        productName: null,
        productSlug: null,
      },
      account: null,
      accessState: null,
      webhook: null,
      history: [],
      deliveries: [],
    };
  }

  const [account, accessState, webhook, history, deliveries] = await Promise.all([
    ensureProjectProductAccount(db, scope),
    ensureProjectProductAccessState(db, scope),
    getProductWebhookConfigByProductId(db, scope.productId),
    db
      .select()
      .from(projectProductAccessEvents)
      .where(eq(projectProductAccessEvents.projectId, scope.projectId))
      .orderBy(desc(projectProductAccessEvents.occurredAt))
      .limit(10),
    db
      .select()
      .from(productWebhookDeliveryLogs)
      .where(eq(productWebhookDeliveryLogs.projectId, scope.projectId))
      .orderBy(desc(productWebhookDeliveryLogs.occurredAt))
      .limit(10),
  ]);

  return {
    project: {
      id: scope.projectId,
      name: scope.projectName,
      clientName: scope.clientName,
      productId: scope.productId,
      productName: scope.productName,
      productSlug: scope.productSlug,
    },
    account,
    accessState: {
      ...accessState,
      effectiveAccessState: getEffectiveProductAccessState(accessState),
    },
    webhook: webhook
      ? {
          productId: webhook.productId,
          productName: webhook.productName,
          productSlug: webhook.productSlug,
          configId: webhook.configId,
          webhookUrl: webhook.webhookUrl,
          isConfigured: Boolean(webhook.configId),
          isReady: Boolean(
            webhook.configId &&
              webhook.webhookUrl &&
              webhook.webhookSecret &&
              webhook.isActive,
          ),
          isActive: webhook.isActive ?? false,
        }
      : null,
    history,
    deliveries,
  };
}

export async function grantProjectProductAccess(
  db: Database,
  input: {
    projectId: string;
    actorUserId: string;
    accessExpiresAt: Date;
  },
) {
  return applyAdminAccessAction(db, {
    projectId: input.projectId,
    actorUserId: input.actorUserId,
    action: "grant",
    accessExpiresAt: input.accessExpiresAt,
  });
}

export async function extendProjectProductAccess(
  db: Database,
  input: {
    projectId: string;
    actorUserId: string;
    accessExpiresAt: Date;
  },
) {
  return applyAdminAccessAction(db, {
    projectId: input.projectId,
    actorUserId: input.actorUserId,
    action: "extend",
    accessExpiresAt: input.accessExpiresAt,
  });
}

export async function revokeProjectProductAccess(
  db: Database,
  input: {
    projectId: string;
    actorUserId: string;
    reason?: string | null;
  },
) {
  return applyAdminAccessAction(db, {
    projectId: input.projectId,
    actorUserId: input.actorUserId,
    action: "revoke",
    reason: input.reason ?? null,
  });
}

export async function getProductWebhookConfigBySlug(db: Database, productSlug: string) {
  const [webhook] = await db
    .select({
      configId: productWebhookConfigs.id,
      productId: products.id,
      productName: products.name,
      productSlug: products.slug,
      webhookUrl: productWebhookConfigs.webhookUrl,
      webhookSecret: productWebhookConfigs.webhookSecret,
      isActive: productWebhookConfigs.isActive,
      payloadTemplate: productWebhookConfigs.payloadTemplate,
    })
    .from(products)
    .leftJoin(productWebhookConfigs, eq(productWebhookConfigs.productId, products.id))
    .where(eq(products.slug, productSlug))
    .limit(1);

  if (!webhook) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Product webhook configuration was not found.",
    });
  }

  return webhook;
}

export async function applyProductAccessCallback(
  db: Database,
  input: {
    productSlug: string;
    payload: ProductAccessCallbackPayload;
  },
) {
  const webhook = await getProductWebhookConfigBySlug(db, input.productSlug);
  const scope = await getLinkedProductScope(db, input.payload.projectId);

  if (!scope.productId || scope.productSlug !== input.productSlug) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Project is not linked to the requested product.",
    });
  }

  const account = await ensureProjectProductAccount(db, scope);
  const state = await ensureProjectProductAccessState(db, scope);
  const now = new Date();
  const effectiveAt = parseDateOrNull(input.payload.effectiveAt) ?? now;
  const nextExpiry = parseDateOrNull(input.payload.accessExpiresAt);

  const [updatedState] = await db
    .update(projectProductAccessStates)
    .set({
      accessState: input.payload.status === "revoked" ? "revoked" : "active",
      syncStatus: "synced",
      grantedAt:
        input.payload.status === "active"
          ? state.grantedAt ?? effectiveAt
          : state.grantedAt,
      accessExpiresAt:
        nextExpiry ?? (input.payload.status === "active" ? state.accessExpiresAt : null),
      revokedAt: input.payload.status === "revoked" ? effectiveAt : null,
      revokedReason:
        input.payload.status === "revoked" ? input.payload.reason ?? null : null,
      lastSource: "product_callback",
      lastWebhookError: null,
      updatedAt: now,
    })
    .where(eq(projectProductAccessStates.id, state.id))
    .returning();

  await db
    .update(projectProductAccounts)
    .set({
      status: input.payload.status === "revoked" ? "suspended" : "active",
      externalAccountId: input.payload.externalAccountId ?? account.externalAccountId,
      externalWorkspaceId:
        input.payload.externalWorkspaceId ?? account.externalWorkspaceId,
      accountUrl: input.payload.accountUrl ?? account.accountUrl,
      statsSummary: input.payload.statsSummary,
      lastSyncedAt: now,
      updatedAt: now,
    })
    .where(eq(projectProductAccounts.id, account.id));

  await db.insert(projectProductAccessEvents).values({
    accessStateId: state.id,
    projectId: scope.projectId,
    clientId: scope.clientId,
    productId: scope.productId,
    eventType: "callback_update",
    source: "product_callback",
    actorUserId: null,
    accessState: updatedState?.accessState ?? state.accessState,
    syncStatus: updatedState?.syncStatus ?? state.syncStatus,
    payload: {
      ...input.payload,
      productSlug: input.productSlug,
    },
    occurredAt: effectiveAt,
  });

  return {
    ok: true as const,
    productId: scope.productId,
    projectId: scope.projectId,
  };
}

async function applyAdminAccessAction(
  db: Database,
  input: {
    projectId: string;
    actorUserId: string;
    action: AdminAction;
    accessExpiresAt?: Date;
    reason?: string | null;
  },
) {
  const scope = await getLinkedProductScope(db, input.projectId);

  if (!scope.productId || !scope.productName || !scope.productSlug) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "This project is not linked to a product.",
    });
  }

  const account = await ensureProjectProductAccount(db, scope);
  const currentState = await ensureProjectProductAccessState(db, scope);
  const webhook = await getProductWebhookConfigByProductId(db, scope.productId);

  assertWebhookReady(webhook);
  validateAdminAction(input, currentState);

  const now = new Date();
  const nextAccessState =
    input.action === "revoke"
      ? "revoked"
      : input.accessExpiresAt && input.accessExpiresAt.getTime() < now.getTime()
        ? "expired"
        : "active";
  const nextEventType =
    input.action === "revoke" ? "access.revoked" : "access.granted";

  const [updatedState] = await db
    .update(projectProductAccessStates)
    .set({
      accessState: nextAccessState,
      syncStatus: "pending",
      grantedAt:
        input.action === "grant"
          ? now
          : input.action === "extend"
            ? currentState.grantedAt ?? now
            : currentState.grantedAt,
      accessExpiresAt:
        input.action === "revoke"
          ? currentState.accessExpiresAt
          : input.accessExpiresAt ?? currentState.accessExpiresAt,
      revokedAt: input.action === "revoke" ? now : null,
      revokedReason: input.action === "revoke" ? input.reason ?? null : null,
      lastSource: "admin_action",
      lastWebhookEventType: nextEventType,
      lastWebhookSentAt: now,
      lastWebhookDeliveredAt: null,
      lastWebhookError: null,
      updatedAt: now,
    })
    .where(eq(projectProductAccessStates.id, currentState.id))
    .returning();

  if (!updatedState) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to update product access state.",
    });
  }

  await db
    .update(projectProductAccounts)
    .set({
      status: input.action === "revoke" ? "suspended" : "active",
      updatedAt: now,
    })
    .where(eq(projectProductAccounts.id, account.id));

  const payloadContext = buildPayloadContext({
    action: input.action,
    occurredAt: now,
    project: scope,
    account: {
      externalAccountId: account.externalAccountId,
      externalWorkspaceId: account.externalWorkspaceId,
      accountUrl: account.accountUrl,
      statsSummary: account.statsSummary,
    },
    accessState: updatedState,
    reason: input.reason ?? null,
  });
  const payload = buildProductAccessPayload(webhook.payloadTemplate ?? {}, payloadContext);

  const delivery = await deliverProductAccessWebhook(db, {
    webhook,
    projectId: scope.projectId,
    eventType: nextEventType,
    payload,
  });

  const [syncedState] = await db
    .update(projectProductAccessStates)
    .set({
      syncStatus: delivery.success ? "synced" : "failed",
      lastWebhookDeliveredAt: delivery.success ? delivery.occurredAt : null,
      lastWebhookError: delivery.success ? null : delivery.responseSummary,
      updatedAt: new Date(),
    })
    .where(eq(projectProductAccessStates.id, updatedState.id))
    .returning();

  await db
    .update(projectProductAccounts)
    .set({
      lastSyncedAt: delivery.success ? delivery.occurredAt : account.lastSyncedAt,
      updatedAt: new Date(),
    })
    .where(eq(projectProductAccounts.id, account.id));

  await db.insert(projectProductAccessEvents).values({
    accessStateId: updatedState.id,
    projectId: scope.projectId,
    clientId: scope.clientId,
    productId: scope.productId,
    eventType:
      input.action === "grant"
        ? "grant"
        : input.action === "extend"
          ? "extend"
          : "revoke",
    source: "admin_action",
    actorUserId: input.actorUserId,
    accessState: syncedState?.accessState ?? updatedState.accessState,
    syncStatus: syncedState?.syncStatus ?? updatedState.syncStatus,
    payload: {
      ...payload,
      delivery: {
        deliveryStatus: delivery.deliveryStatus,
        httpStatus: delivery.httpStatus,
        responseSummary: delivery.responseSummary,
      },
    },
    occurredAt: now,
  });

  return getProductAccessContext(db, scope.projectId);
}

async function deliverProductAccessWebhook(
  db: Database,
  input: {
    webhook: ProductWebhookConfig;
    projectId: string;
    eventType: string;
    payload: Record<string, unknown>;
  },
): Promise<DeliveryResult> {
  const occurredAt = new Date();
  const rawPayload = JSON.stringify(input.payload);
  const timestamp = String(Math.floor(occurredAt.getTime() / 1000));
  const signature = buildProductAccessSignature(
    rawPayload,
    timestamp,
    input.webhook.webhookSecret ?? "",
  );

  let success = false;
  let httpStatus: number | null = null;
  let responseSummary: string | null = null;
  let responseBody: string | null = null;

  try {
    const response = await fetch(input.webhook.webhookUrl!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Concolabs-Signature": `t=${timestamp},${SIGNATURE_VERSION}=${signature}`,
      },
      body: rawPayload,
    });

    httpStatus = response.status;
    responseBody = trimText(await response.text());
    responseSummary = trimText(`${response.status} ${response.statusText}`.trim(), MAX_RESPONSE_SUMMARY_LENGTH);
    success = response.ok;
  } catch (error) {
    responseSummary = trimText(
      error instanceof Error ? error.message : "Webhook delivery failed.",
      MAX_RESPONSE_SUMMARY_LENGTH,
    );
  }

  await db.insert(productWebhookDeliveryLogs).values({
    productId: input.webhook.productId,
    projectId: input.projectId,
    configId: input.webhook.configId,
    eventType: input.eventType,
    endpointUrl: input.webhook.webhookUrl,
    deliveryStatus: success ? "success" : "failed",
    httpStatus,
    responseSummary,
    responseBody,
    occurredAt,
  });

  return {
    success,
    deliveryStatus: success ? "success" : "failed",
    httpStatus,
    responseSummary,
    responseBody,
    occurredAt,
    payload: input.payload,
  };
}

async function getLinkedProductScope(db: Database, projectId: string): Promise<LinkedProductScope> {
  const [scope] = await db
    .select({
      projectId: projects.id,
      projectName: projects.name,
      clientId: clients.id,
      clientName: clients.name,
      productId: products.id,
      productName: products.name,
      productSlug: products.slug,
    })
    .from(projects)
    .innerJoin(clients, eq(projects.clientId, clients.id))
    .leftJoin(products, eq(projects.productId, products.id))
    .where(eq(projects.id, projectId))
    .limit(1);

  if (!scope) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Project not found.",
    });
  }

  return scope;
}

async function ensureProjectProductAccount(db: Database, scope: LinkedProductScope) {
  if (!scope.productId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Project is not linked to a product account.",
    });
  }

  const [existing] = await db
    .select()
    .from(projectProductAccounts)
    .where(eq(projectProductAccounts.projectId, scope.projectId))
    .limit(1);

  if (existing) {
    return existing;
  }

  const [created] = await db
    .insert(projectProductAccounts)
    .values({
      projectId: scope.projectId,
      clientId: scope.clientId,
      productId: scope.productId,
      status: "pending",
    })
    .returning();

  if (!created) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to initialize product account context.",
    });
  }

  return created;
}

export async function ensureProjectProductAccessState(
  db: Database,
  scope: LinkedProductScope,
) {
  if (!scope.productId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Project is not linked to a product.",
    });
  }

  const [existing] = await db
    .select()
    .from(projectProductAccessStates)
    .where(eq(projectProductAccessStates.projectId, scope.projectId))
    .limit(1);

  if (existing) {
    return existing;
  }

  const [created] = await db
    .insert(projectProductAccessStates)
    .values({
      projectId: scope.projectId,
      clientId: scope.clientId,
      productId: scope.productId,
      accessState: "pending",
      syncStatus: "pending",
      lastSource: "admin_action",
    })
    .returning();

  if (!created) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to initialize product access state.",
    });
  }

  return created;
}

async function getProductWebhookConfigByProductId(db: Database, productId: string) {
  const [webhook] = await db
    .select({
      configId: productWebhookConfigs.id,
      productId: products.id,
      productName: products.name,
      productSlug: products.slug,
      webhookUrl: productWebhookConfigs.webhookUrl,
      webhookSecret: productWebhookConfigs.webhookSecret,
      isActive: productWebhookConfigs.isActive,
      payloadTemplate: productWebhookConfigs.payloadTemplate,
    })
    .from(products)
    .leftJoin(productWebhookConfigs, eq(productWebhookConfigs.productId, products.id))
    .where(eq(products.id, productId))
    .limit(1);

  if (!webhook) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Product webhook configuration was not found.",
    });
  }

  return webhook;
}

function assertWebhookReady(webhook: ProductWebhookConfig) {
  if (!webhook.configId || !webhook.webhookUrl || !webhook.webhookSecret) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Configure the product webhook before managing product access.",
    });
  }

  if (!webhook.isActive) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "The product webhook is inactive. Activate it before managing access.",
    });
  }
}

function validateAdminAction(
  input: {
    action: AdminAction;
    accessExpiresAt?: Date;
    reason?: string | null;
  },
  currentState: ProjectProductAccessState,
) {
  const now = Date.now();

  if (input.action === "grant" || input.action === "extend") {
    if (!input.accessExpiresAt || Number.isNaN(input.accessExpiresAt.getTime())) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Access expiry is required.",
      });
    }

    if (input.accessExpiresAt.getTime() <= now) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Access expiry must be in the future.",
      });
    }
  }

  if (
    input.action === "extend" &&
    currentState.accessExpiresAt &&
    input.accessExpiresAt &&
    input.accessExpiresAt.getTime() <= currentState.accessExpiresAt.getTime()
  ) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Extensions must move the expiry forward.",
    });
  }

  if (input.action === "revoke" && !currentState.grantedAt) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Grant access before attempting to revoke it.",
    });
  }
}

function buildProductAccessPayload(
  template: Record<string, unknown>,
  context: ReturnType<typeof buildPayloadContext>,
) {
  if (Object.keys(template).length === 0) {
    return {
      eventType: context.eventType,
      action: context.action,
      occurredAt: context.occurredAt,
      project: context.project,
      client: context.client,
      product: context.product,
      access: context.access,
      external: context.external,
      reason: context.reason,
    };
  }

  return renderProductAccessTemplate(template, context);
}

function buildPayloadContext(input: {
  action: AdminAction;
  occurredAt: Date;
  project: LinkedProductScope;
  account: {
    externalAccountId: string | null;
    externalWorkspaceId: string | null;
    accountUrl: string | null;
    statsSummary: Record<string, unknown>;
  };
  accessState: ProjectProductAccessState;
  reason: string | null;
}) {
  const eventType = input.action === "revoke" ? "access.revoked" : "access.granted";

  return {
    eventType,
    action: input.action,
    occurredAt: input.occurredAt.toISOString(),
    project: {
      id: input.project.projectId,
      name: input.project.projectName,
    },
    client: {
      id: input.project.clientId,
      name: input.project.clientName,
    },
    product: {
      id: input.project.productId,
      name: input.project.productName,
      slug: input.project.productSlug,
    },
    access: {
      state: input.accessState.accessState,
      effectiveState: getEffectiveProductAccessState(input.accessState),
      grantedAt: input.accessState.grantedAt?.toISOString() ?? null,
      accessExpiresAt: input.accessState.accessExpiresAt?.toISOString() ?? null,
      revokedAt: input.accessState.revokedAt?.toISOString() ?? null,
      revokedReason: input.accessState.revokedReason ?? null,
      syncStatus: input.accessState.syncStatus,
    },
    external: {
      accountId: input.account.externalAccountId,
      workspaceId: input.account.externalWorkspaceId,
      accountUrl: input.account.accountUrl,
      statsSummary: input.account.statsSummary,
    },
    reason: input.reason,
  };
}

function resolveTemplateValue(value: unknown, context: Record<string, unknown>): unknown {
  if (typeof value === "string") {
    return value.replace(/{{\s*([^}]+?)\s*}}/g, (_, path: string) => {
      const resolved = getValueAtPath(context, path.trim());
      if (resolved === null || resolved === undefined) return "";
      if (typeof resolved === "string") return resolved;
      if (typeof resolved === "number" || typeof resolved === "boolean") {
        return String(resolved);
      }
      return JSON.stringify(resolved);
    });
  }

  if (Array.isArray(value)) {
    return value.map((entry) => resolveTemplateValue(entry, context));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        resolveTemplateValue(entry, context),
      ]),
    );
  }

  return value;
}

function getValueAtPath(context: Record<string, unknown>, path: string) {
  return path.split(".").reduce<unknown>((current, segment) => {
    if (!current || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[segment];
  }, context);
}

function parseSignatureHeader(header: string) {
  const parts = header.split(",").map((part) => part.trim());
  const result: { timestamp: string | null; signature: string | null } = {
    timestamp: null,
    signature: null,
  };

  for (const part of parts) {
    const [key, ...rest] = part.split("=");
    const value = rest.join("=");
    if (key === "t") result.timestamp = value;
    if (key === SIGNATURE_VERSION) result.signature = value;
  }

  return result;
}

function trimText(value: string | null | undefined, max = MAX_RESPONSE_BODY_LENGTH) {
  if (!value) return null;
  return value.length > max ? `${value.slice(0, max)}…` : value;
}

function parseDateOrNull(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
