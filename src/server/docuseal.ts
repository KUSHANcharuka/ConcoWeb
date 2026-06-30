import jwt from "jsonwebtoken";

import { env } from "~/env";

type DocusealConfig = {
  apiBaseUrl: string;
  appBaseUrl: string;
  apiKey: string;
  webhookSecret?: string;
};

type DocusealTemplateSummary = {
  id: number;
  slug: string;
  name: string;
  external_id: string | null;
  submitters: Array<{
    name: string;
    uuid: string;
  }>;
};

type DocusealSubmitterSummary = {
  id: number;
  submission_id: number;
  email: string;
  slug: string;
  role: string;
  external_id: string | null;
};

type DocusealSubmissionSummary = {
  id: number;
  status?: string | null;
};

type DocusealCreateSubmissionSubmitter = {
  id: number;
  submission_id: number;
  email?: string | null;
  slug?: string | null;
  role?: string | null;
  embed_src?: string | null;
};

type DocusealCreateSubmissionLegacyResponse = {
  id: number;
  status?: string | null;
  submitters?: DocusealCreateSubmissionSubmitter[];
};

export type DocusealNormalizedSubmission = {
  submissionId: string | null;
  submissionStatus: string | null;
  primarySubmitterId: string | null;
  primarySubmitterSlug: string | null;
  primarySubmitterEmbedUrl: string | null;
};

export type CreateDocusealTemplateSubmissionInput = {
  templateId: number;
  completedRedirectUrl?: string;
  submitters: Array<{
    name?: string;
    email: string;
    role: string;
    external_id?: string;
  }>;
  sendEmail?: boolean;
};

export function getDocusealConfig(): DocusealConfig | null {
  const apiBaseUrl = env.DOCUSEAL_API_BASE_URL ?? env.DOCUSEAL_BASE_URL;
  const appBaseUrl = env.DOCUSEAL_APP_BASE_URL ?? "https://docuseal.com";

  if (!apiBaseUrl || !env.DOCUSEAL_API_KEY) {
    return null;
  }

  return {
    apiBaseUrl: apiBaseUrl.replace(/\/$/, ""),
    appBaseUrl: appBaseUrl.replace(/\/$/, ""),
    apiKey: env.DOCUSEAL_API_KEY,
    webhookSecret: env.DOCUSEAL_WEBHOOK_SECRET,
  };
}

export function isDocusealConfigured() {
  return !!getDocusealConfig();
}

export function getDocusealEmbedHost() {
  const config = getDocusealConfig();
  if (!config) return null;

  const host = new URL(config.appBaseUrl).host;
  return host === "docuseal.com" ? null : host;
}

export function buildDocusealSubmissionUrl(slug: string) {
  const config = getDocusealConfig();
  return config ? `${config.appBaseUrl}/s/${slug}` : null;
}

export function resolveDocusealSubmitterUrl(input: {
  embedUrl?: string | null;
  slug?: string | null;
}) {
  const config = getDocusealConfig();

  if (input.embedUrl) {
    if (config) {
      if (input.embedUrl.startsWith("/")) {
        return `${config.appBaseUrl}${input.embedUrl}`;
      }

      if (input.slug && /\/d\/[^/]+$/.test(input.embedUrl)) {
        return `${config.appBaseUrl}/s/${input.slug}`;
      }
    }

    return input.embedUrl;
  }

  if (!input.slug || !config) {
    return null;
  }

  return `${config.appBaseUrl}/s/${input.slug}`;
}

export function normalizeDocusealCreateSubmissionResponse(
  response: DocusealCreateSubmissionSubmitter[] | DocusealCreateSubmissionLegacyResponse,
): DocusealNormalizedSubmission {
  if (Array.isArray(response)) {
    const primarySubmitter = response[0];
    return {
      submissionId:
        primarySubmitter?.submission_id !== undefined
          ? String(primarySubmitter.submission_id)
          : null,
      submissionStatus: null,
      primarySubmitterId:
        primarySubmitter?.id !== undefined ? String(primarySubmitter.id) : null,
      primarySubmitterSlug: primarySubmitter?.slug ?? null,
      primarySubmitterEmbedUrl: resolveDocusealSubmitterUrl({
        embedUrl: primarySubmitter?.embed_src ?? null,
        slug: primarySubmitter?.slug ?? null,
      }),
    };
  }

  const primarySubmitter = response.submitters?.[0];
  return {
    submissionId: response.id !== undefined ? String(response.id) : null,
    submissionStatus: response.status ?? null,
    primarySubmitterId:
      primarySubmitter?.id !== undefined ? String(primarySubmitter.id) : null,
    primarySubmitterSlug: primarySubmitter?.slug ?? null,
    primarySubmitterEmbedUrl: resolveDocusealSubmitterUrl({
      embedUrl: primarySubmitter?.embed_src ?? null,
      slug: primarySubmitter?.slug ?? null,
    }),
  };
}

export function createDocusealBuilderToken(input: {
  userEmail: string;
  integrationEmail?: string | null;
  externalId: string;
  name: string;
  documentUrls?: string[];
  templateId?: number | null;
}) {
  const config = getDocusealConfig();
  if (!config) {
    throw new Error("DocuSeal is not configured.");
  }

  const payload = {
    user_email: input.userEmail,
    integration_email: input.integrationEmail ?? undefined,
    external_id: input.externalId,
    name: input.name,
    template_id: input.templateId ?? undefined,
    ...(input.templateId ? {} : { document_urls: input.documentUrls ?? [] }),
  };

  return jwt.sign(
    payload,
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

  const normalizedPath = path.startsWith("http://") || path.startsWith("https://")
    ? path
    : path.startsWith("/")
      ? path
      : `/${path}`;

  const requestUrl = normalizedPath.startsWith("http://") || normalizedPath.startsWith("https://")
    ? normalizedPath
    : `${config.apiBaseUrl}${normalizedPath}`;

  const response = await fetch(requestUrl, {
    ...init,
    headers: {
      "X-Auth-Token": config.apiKey,
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

export async function getDocusealTemplate(templateId: number) {
  return docusealRequest<DocusealTemplateSummary>(`/templates/${templateId}`);
}

export async function getDocusealSubmission(submissionId: number) {
  return docusealRequest<DocusealSubmissionSummary>(`/submissions/${submissionId}`);
}

export async function getDocusealSubmitters(submissionId: number) {
  const response = await docusealRequest<{
    data?: DocusealSubmitterSummary[];
  }>(`/submitters?submission_id=${submissionId}`);

  return response.data ?? [];
}

export async function createDocusealTemplateSubmission(
  input: CreateDocusealTemplateSubmissionInput,
): Promise<DocusealNormalizedSubmission> {
  const response = await docusealRequest<
    DocusealCreateSubmissionSubmitter[] | DocusealCreateSubmissionLegacyResponse
  >("/submissions/init", {
    method: "POST",
    body: JSON.stringify({
      template_id: input.templateId,
      send_email: input.sendEmail ?? false,
      completed_redirect_url: input.completedRedirectUrl,
      submitters: input.submitters,
    }),
  });

  const normalized = normalizeDocusealCreateSubmissionResponse(response);
  const submissionIdNumber = normalized.submissionId ? Number(normalized.submissionId) : NaN;

  if (!Number.isNaN(submissionIdNumber)) {
    try {
      const submission = await getDocusealSubmission(submissionIdNumber);
      return {
        ...normalized,
        submissionStatus: submission.status ?? normalized.submissionStatus,
      };
    } catch {
      return normalized;
    }
  }

  return normalized;
}
