import jwt from "jsonwebtoken";

import { env } from "~/env";

type DocusealConfig = {
  baseUrl: string;
  apiKey: string;
  webhookSecret?: string;
};

export function getDocusealConfig(): DocusealConfig | null {
  if (!env.DOCUSEAL_BASE_URL || !env.DOCUSEAL_API_KEY) {
    return null;
  }

  return {
    baseUrl: env.DOCUSEAL_BASE_URL.replace(/\/$/, ""),
    apiKey: env.DOCUSEAL_API_KEY,
    webhookSecret: env.DOCUSEAL_WEBHOOK_SECRET,
  };
}

export function isDocusealConfigured() {
  return !!getDocusealConfig();
}

export function buildDocusealBuilderScriptUrl() {
  const config = getDocusealConfig();
  return config ? `${config.baseUrl}/js/builder.js` : null;
}

export function buildDocusealFormScriptUrl() {
  const config = getDocusealConfig();
  return config ? `${config.baseUrl}/js/form.js` : null;
}

export function buildDocusealSubmissionUrl(slug: string) {
  const config = getDocusealConfig();
  return config ? `${config.baseUrl}/d/${slug}` : null;
}

export function createDocusealBuilderToken(input: {
  userEmail: string;
  integrationEmail?: string | null;
  externalId: string;
  name: string;
  documentUrls: string[];
  templateId?: number | null;
}) {
  const config = getDocusealConfig();
  if (!config) {
    throw new Error("DocuSeal is not configured.");
  }

  return jwt.sign(
    {
      user_email: input.userEmail,
      integration_email: input.integrationEmail ?? undefined,
      external_id: input.externalId,
      name: input.name,
      document_urls: input.documentUrls,
      template_id: input.templateId ?? undefined,
    },
    config.apiKey,
    {
      algorithm: "HS256",
      expiresIn: "30m",
    },
  );
}

export async function docusealRequest<TResponse>(
  path: string,
  init?: RequestInit,
): Promise<TResponse> {
  const config = getDocusealConfig();
  if (!config) {
    throw new Error("DocuSeal is not configured.");
  }

  const response = await fetch(`${config.baseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `DocuSeal request failed with ${response.status}.`);
  }

  return response.json() as Promise<TResponse>;
}
