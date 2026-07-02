DO $$
BEGIN
  CREATE TYPE "public"."guest_portal_intake_status" AS ENUM('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "guest_portal_intakes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "company" text NOT NULL,
  "summary" text NOT NULL,
  "status" "guest_portal_intake_status" DEFAULT 'pending' NOT NULL,
  "reviewed_by_admin_id" text,
  "reviewed_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "guest_portal_intake_attachments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "intake_id" uuid,
  "bucket" text NOT NULL,
  "object_key" text NOT NULL,
  "file_name" text NOT NULL,
  "display_name" text NOT NULL,
  "mime_type" text NOT NULL,
  "size_bytes" bigint NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

DO $$
BEGIN
  ALTER TABLE "guest_portal_intakes"
    ADD CONSTRAINT "guest_portal_intakes_reviewed_by_admin_id_users_id_fk"
    FOREIGN KEY ("reviewed_by_admin_id")
    REFERENCES "public"."users"("id")
    ON DELETE set null
    ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  ALTER TABLE "guest_portal_intake_attachments"
    ADD CONSTRAINT "guest_portal_intake_attachments_intake_id_guest_portal_intakes_id_fk"
    FOREIGN KEY ("intake_id")
    REFERENCES "public"."guest_portal_intakes"("id")
    ON DELETE cascade
    ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "guest_portal_intake_attachments_object_key_idx"
  ON "guest_portal_intake_attachments" ("object_key");
