ALTER TABLE "proposals" DROP CONSTRAINT IF EXISTS "proposals_rendered_asset_id_assets_id_fk";--> statement-breakpoint
ALTER TABLE "proposals"
  DROP COLUMN IF EXISTS "currency",
  DROP COLUMN IF EXISTS "total_amount_cents",
  DROP COLUMN IF EXISTS "rendered_asset_id",
  DROP COLUMN IF EXISTS "last_webhook_event_type",
  DROP COLUMN IF EXISTS "last_webhook_payload";
