DO $$
BEGIN
  ALTER TYPE "public"."asset_scope_type" ADD VALUE IF NOT EXISTS 'project_request';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint

ALTER TABLE "email_settings"
  ADD COLUMN IF NOT EXISTS "request_notification_emails" jsonb DEFAULT '[]'::jsonb NOT NULL;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "project_change_requests" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "client_id" uuid NOT NULL,
  "project_id" uuid NOT NULL,
  "requested_by_user_id" text NOT NULL,
  "label" text NOT NULL,
  "summary" text,
  "status" "project_request_status" DEFAULT 'pending' NOT NULL,
  "reviewed_by_admin_id" text,
  "reviewed_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "project_request_attachments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "request_id" uuid NOT NULL,
  "asset_id" uuid NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "project_change_request_attachments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "request_id" uuid NOT NULL,
  "asset_id" uuid NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

DO $$
BEGIN
  ALTER TABLE "project_change_requests"
    ADD CONSTRAINT "project_change_requests_client_id_clients_id_fk"
    FOREIGN KEY ("client_id")
    REFERENCES "public"."clients"("id")
    ON DELETE cascade
    ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  ALTER TABLE "project_change_requests"
    ADD CONSTRAINT "project_change_requests_project_id_projects_id_fk"
    FOREIGN KEY ("project_id")
    REFERENCES "public"."projects"("id")
    ON DELETE cascade
    ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  ALTER TABLE "project_change_requests"
    ADD CONSTRAINT "project_change_requests_requested_by_user_id_users_id_fk"
    FOREIGN KEY ("requested_by_user_id")
    REFERENCES "public"."users"("id")
    ON DELETE restrict
    ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  ALTER TABLE "project_change_requests"
    ADD CONSTRAINT "project_change_requests_reviewed_by_admin_id_users_id_fk"
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
  ALTER TABLE "project_request_attachments"
    ADD CONSTRAINT "project_request_attachments_request_id_project_requests_id_fk"
    FOREIGN KEY ("request_id")
    REFERENCES "public"."project_requests"("id")
    ON DELETE cascade
    ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  ALTER TABLE "project_request_attachments"
    ADD CONSTRAINT "project_request_attachments_asset_id_assets_id_fk"
    FOREIGN KEY ("asset_id")
    REFERENCES "public"."assets"("id")
    ON DELETE cascade
    ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  ALTER TABLE "project_change_request_attachments"
    ADD CONSTRAINT "project_change_request_attachments_request_id_project_change_requests_id_fk"
    FOREIGN KEY ("request_id")
    REFERENCES "public"."project_change_requests"("id")
    ON DELETE cascade
    ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  ALTER TABLE "project_change_request_attachments"
    ADD CONSTRAINT "project_change_request_attachments_asset_id_assets_id_fk"
    FOREIGN KEY ("asset_id")
    REFERENCES "public"."assets"("id")
    ON DELETE cascade
    ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "project_request_attachment_request_asset_idx"
  ON "project_request_attachments" ("request_id", "asset_id");
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "project_change_request_attachment_request_asset_idx"
  ON "project_change_request_attachments" ("request_id", "asset_id");
