ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "cover_asset_id" uuid;
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'clients_cover_asset_id_assets_id_fk'
  ) THEN
    ALTER TABLE "clients"
      ADD CONSTRAINT "clients_cover_asset_id_assets_id_fk"
      FOREIGN KEY ("cover_asset_id")
      REFERENCES "public"."assets"("id")
      ON DELETE set null
      ON UPDATE no action;
  END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'clients_logo_asset_id_assets_id_fk'
  ) THEN
    ALTER TABLE "clients"
      ADD CONSTRAINT "clients_logo_asset_id_assets_id_fk"
      FOREIGN KEY ("logo_asset_id")
      REFERENCES "public"."assets"("id")
      ON DELETE set null
      ON UPDATE no action;
  END IF;
END $$;
