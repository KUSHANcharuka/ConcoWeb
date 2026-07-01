ALTER TABLE "billing_templates"
  ADD COLUMN IF NOT EXISTS "source_object_key" text,
  ADD COLUMN IF NOT EXISTS "source_file_name" text,
  ADD COLUMN IF NOT EXISTS "source_mime_type" text;
