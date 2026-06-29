import { and, asc, eq, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { createAssetReadUrl } from "~/server/r2";
import type { Database } from "~/server/db";
import { assets } from "~/server/db/schema/assets";
import { clients } from "~/server/db/schema/clients";
import { projectFiles, projectFolders } from "~/server/db/schema/project-files";
import { projectTimelineItems } from "~/server/db/schema/project-timeline";
import { projects } from "~/server/db/schema/projects";
import { proposals } from "~/server/db/schema/project-proposals";

export async function getProjectWorkspaceContext(db: Database, projectId: string) {
  const [project] = await db
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      status: projects.status,
      projectType: projects.projectType,
      currency: projects.currency,
      visibility: projects.visibility,
      startDate: projects.startDate,
      targetLaunchDate: projects.targetLaunchDate,
      clientId: clients.id,
      clientName: clients.name,
      clientBaseCurrency: clients.baseCurrency,
      coverAssetId: assets.id,
      coverObjectKey: assets.objectKey,
    })
    .from(projects)
    .innerJoin(clients, eq(projects.clientId, clients.id))
    .leftJoin(assets, eq(projects.coverAssetId, assets.id))
    .where(eq(projects.id, projectId))
    .limit(1);

  if (!project) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });
  }

  let coverUrl: string | null = null;
  if (project.coverAssetId && project.coverObjectKey) {
    try {
      coverUrl = await createAssetReadUrl({
        objectKey: project.coverObjectKey,
        preferPublic: true,
      });
    } catch {
      coverUrl = null;
    }
  }

  return {
    id: project.id,
    name: project.name,
    description: project.description,
    status: project.status,
    projectType: project.projectType,
    currency: project.currency,
    visibility: project.visibility,
    startDate: project.startDate,
    targetLaunchDate: project.targetLaunchDate,
    client: {
      id: project.clientId,
      name: project.clientName,
      baseCurrency: project.clientBaseCurrency,
    },
    coverUrl,
  };
}

export async function ensureProjectScope(db: Database, projectId: string) {
  const [project] = await db
    .select({
      id: projects.id,
      clientId: projects.clientId,
      name: projects.name,
    })
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  if (!project) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });
  }

  return project;
}

export async function ensureProposalScope(
  db: Database,
  proposalId: string,
  projectId: string,
) {
  const [proposal] = await db
    .select({
      id: proposals.id,
      title: proposals.title,
      clientId: proposals.clientId,
      projectId: proposals.projectId,
      status: proposals.status,
      sourceAssetId: proposals.sourceAssetId,
      docusealTemplateId: proposals.docusealTemplateId,
      docusealTemplateSlug: proposals.docusealTemplateSlug,
    })
    .from(proposals)
    .where(and(eq(proposals.id, proposalId), eq(proposals.projectId, projectId)))
    .limit(1);

  if (!proposal) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Proposal not found." });
  }

  return proposal;
}

export async function ensureTimelineItemScope(
  db: Database,
  itemId: string,
  projectId: string,
) {
  const [item] = await db
    .select({
      id: projectTimelineItems.id,
      clientId: projectTimelineItems.clientId,
      projectId: projectTimelineItems.projectId,
    })
    .from(projectTimelineItems)
    .where(
      and(
        eq(projectTimelineItems.id, itemId),
        eq(projectTimelineItems.projectId, projectId),
      ),
    )
    .limit(1);

  if (!item) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Timeline item not found." });
  }

  return item;
}

export async function ensureFolderScope(db: Database, folderId: string, projectId: string) {
  const [folder] = await db
    .select({
      id: projectFolders.id,
      clientId: projectFolders.clientId,
      projectId: projectFolders.projectId,
      parentFolderId: projectFolders.parentFolderId,
    })
    .from(projectFolders)
    .where(and(eq(projectFolders.id, folderId), eq(projectFolders.projectId, projectId)))
    .limit(1);

  if (!folder) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Folder not found." });
  }

  return folder;
}

export async function ensureProjectFileScope(
  db: Database,
  fileId: string,
  projectId: string,
) {
  const [file] = await db
    .select({
      id: projectFiles.id,
      clientId: projectFiles.clientId,
      projectId: projectFiles.projectId,
      assetId: projectFiles.assetId,
      folderId: projectFiles.folderId,
    })
    .from(projectFiles)
    .where(and(eq(projectFiles.id, fileId), eq(projectFiles.projectId, projectId)))
    .limit(1);

  if (!file) {
    throw new TRPCError({ code: "NOT_FOUND", message: "File not found." });
  }

  return file;
}

export async function loadProjectFolderTree(db: Database, projectId: string) {
  return db
    .select({
      id: projectFolders.id,
      name: projectFolders.name,
      parentFolderId: projectFolders.parentFolderId,
      visibility: projectFolders.visibility,
      createdAt: projectFolders.createdAt,
      updatedAt: projectFolders.updatedAt,
    })
    .from(projectFolders)
    .where(eq(projectFolders.projectId, projectId))
    .orderBy(asc(projectFolders.name));
}

export async function loadProjectFiles(db: Database, projectId: string) {
  const rows = await db
    .select({
      id: projectFiles.id,
      folderId: projectFiles.folderId,
      title: projectFiles.title,
      description: projectFiles.description,
      visibility: projectFiles.visibility,
      createdAt: projectFiles.createdAt,
      updatedAt: projectFiles.updatedAt,
      assetId: assets.id,
      fileName: assets.fileName,
      mimeType: assets.mimeType,
      sizeBytes: assets.sizeBytes,
      objectKey: assets.objectKey,
      deletedAt: assets.deletedAt,
    })
    .from(projectFiles)
    .innerJoin(assets, eq(projectFiles.assetId, assets.id))
    .where(eq(projectFiles.projectId, projectId))
    .orderBy(asc(projectFiles.title));

  return rows.filter((row) => !row.deletedAt);
}

export async function getDescendantFolderIds(
  db: Database,
  projectId: string,
  rootFolderId: string,
) {
  const folders = await db
    .select({
      id: projectFolders.id,
      parentFolderId: projectFolders.parentFolderId,
    })
    .from(projectFolders)
    .where(eq(projectFolders.projectId, projectId));

  const byParent = new Map<string | null, string[]>();
  for (const folder of folders) {
    const parentId = folder.parentFolderId ?? null;
    const siblings = byParent.get(parentId) ?? [];
    siblings.push(folder.id);
    byParent.set(parentId, siblings);
  }

  const result = new Set<string>();
  const stack = [rootFolderId];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || result.has(current)) continue;
    result.add(current);
    for (const childId of byParent.get(current) ?? []) {
      stack.push(childId);
    }
  }

  return Array.from(result);
}

export function assertValidFolderMove(
  folderId: string,
  nextParentFolderId: string | null,
  descendantFolderIds: string[],
) {
  if (nextParentFolderId === folderId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "A folder cannot be moved into itself.",
    });
  }

  if (nextParentFolderId && descendantFolderIds.includes(nextParentFolderId)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "A folder cannot be moved into its own descendant.",
    });
  }
}

export async function loadFilesByIds(db: Database, fileIds: string[]) {
  if (fileIds.length === 0) return [];

  return db
    .select({
      id: projectFiles.id,
      assetId: projectFiles.assetId,
    })
    .from(projectFiles)
    .where(inArray(projectFiles.id, fileIds));
}
