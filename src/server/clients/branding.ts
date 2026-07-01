import { inArray } from "drizzle-orm";

import type { Database } from "~/server/db";
import { assets } from "~/server/db/schema";
import { createAssetReadUrl } from "~/server/r2";

export async function resolveAssetUrlsById(db: Database, assetIds: string[]) {
  const uniqueAssetIds = [...new Set(assetIds.filter(Boolean))];
  const urlMap = new Map<string, string>();

  if (uniqueAssetIds.length === 0) {
    return urlMap;
  }

  const rows = await db
    .select({
      id: assets.id,
      objectKey: assets.objectKey,
    })
    .from(assets)
    .where(inArray(assets.id, uniqueAssetIds));

  await Promise.all(
    rows.map(async (row) => {
      try {
        const url = await createAssetReadUrl({
          objectKey: row.objectKey,
          preferPublic: true,
        });
        urlMap.set(row.id, url);
      } catch {
        // Asset storage is optional in dev; unresolved assets return null to the UI.
      }
    }),
  );

  return urlMap;
}
