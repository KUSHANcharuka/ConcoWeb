import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { env } from "~/env";

type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicBaseUrl?: string;
};

function getR2Config(): R2Config {
  const accountId = env.R2_ACCOUNT_ID;
  const accessKeyId = env.R2_ACCESS_KEY_ID;
  const secretAccessKey = env.R2_SECRET_ACCESS_KEY;
  const bucket = env.R2_BUCKET;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
    throw new Error("R2 is not configured.");
  }

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucket,
    publicBaseUrl: env.R2_PUBLIC_BASE_URL,
  };
}

function createR2Client(config: R2Config) {
  return new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}

function sanitizeFileName(fileName: string) {
  return fileName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-");
}

function isBrowserSafePublicBaseUrl(value: string) {
  try {
    const url = new URL(value);
    return !url.hostname.endsWith(".r2.cloudflarestorage.com");
  } catch {
    return false;
  }
}

export function buildProjectCoverObjectKey(assetId: string, clientId: string, fileName: string) {
  return `clients/${clientId}/project-covers/${assetId}-${sanitizeFileName(fileName)}`;
}

export function buildClientCoverObjectKey(assetId: string, clientId: string, fileName: string) {
  return `clients/${clientId}/cover/${assetId}-${sanitizeFileName(fileName)}`;
}

export function buildClientLogoObjectKey(assetId: string, clientId: string, fileName: string) {
  return `clients/${clientId}/logo/${assetId}-${sanitizeFileName(fileName)}`;
}

export function buildProjectFileObjectKey(input: {
  assetId: string;
  clientId: string;
  projectId: string;
  fileName: string;
}) {
  return `clients/${input.clientId}/projects/${input.projectId}/files/${input.assetId}-${sanitizeFileName(input.fileName)}`;
}

export function buildProposalSourceObjectKey(input: {
  assetId: string;
  clientId: string;
  projectId: string;
  fileName: string;
}) {
  return `clients/${input.clientId}/projects/${input.projectId}/proposals/${input.assetId}-${sanitizeFileName(input.fileName)}`;
}

export function buildBillingProofObjectKey(
  assetId: string,
  clientId: string,
  projectId: string,
  artifactId: string,
  fileName: string,
) {
  return `clients/${clientId}/projects/${projectId}/billing/${artifactId}/${assetId}-${sanitizeFileName(fileName)}`;
}

export function buildBillingDocumentObjectKey(input: {
  assetId: string;
  clientId: string;
  projectId: string;
  artifactId: string;
  role: "primary_invoice" | "terms_and_conditions";
  fileName: string;
}) {
  return `clients/${input.clientId}/projects/${input.projectId}/billing/${input.artifactId}/documents/${input.role}/${input.assetId}-${sanitizeFileName(input.fileName)}`;
}

export function buildPaymentMethodImageObjectKey(assetId: string, fileName: string) {
  return `settings/payment-methods/${assetId}-${sanitizeFileName(fileName)}`;
}

export function buildGuestPortalIntakeAttachmentObjectKey(input: {
  attachmentId: string;
  fileName: string;
}) {
  return `guest-portal/intake/${input.attachmentId}-${sanitizeFileName(input.fileName)}`;
}

export function buildBillingTemplateObjectKey(templateId: string, fileName: string) {
  return `settings/payment-templates/${templateId}/${sanitizeFileName(fileName)}`;
}

export async function createPresignedUploadUrl(input: {
  objectKey: string;
  contentType: string;
}) {
  const config = getR2Config();
  const client = createR2Client(config);
  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: input.objectKey,
    ContentType: input.contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 900 });

  return {
    bucket: config.bucket,
    uploadUrl,
  };
}

export async function createAssetReadUrl(input: {
  objectKey: string;
  preferPublic?: boolean;
}) {
  const config = getR2Config();

  if (
    input.preferPublic &&
    config.publicBaseUrl &&
    isBrowserSafePublicBaseUrl(config.publicBaseUrl)
  ) {
    return `${config.publicBaseUrl.replace(/\/$/, "")}/${input.objectKey}`;
  }

  const client = createR2Client(config);
  const command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: input.objectKey,
  });

  return getSignedUrl(client, command, { expiresIn: 3600 });
}

export async function assertR2ObjectExists(input: {
  objectKey: string;
}) {
  const config = getR2Config();
  const client = createR2Client(config);
  const command = new HeadObjectCommand({
    Bucket: config.bucket,
    Key: input.objectKey,
  });

  await client.send(command);

  return {
    bucket: config.bucket,
    objectKey: input.objectKey,
  };
}
