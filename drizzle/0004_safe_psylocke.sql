CREATE TYPE "public"."email_delivery_event_type" AS ENUM('queued', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained', 'failed');--> statement-breakpoint
CREATE TYPE "public"."email_draft_source" AS ENUM('manual', 'suggested');--> statement-breakpoint
CREATE TYPE "public"."email_draft_status" AS ENUM('draft', 'suggested', 'ready', 'sending', 'sent', 'failed', 'discarded');--> statement-breakpoint
CREATE TYPE "public"."email_generation_run_status" AS ENUM('running', 'completed', 'failed', 'partial');--> statement-breakpoint
CREATE TYPE "public"."email_recipient_mode" AS ENUM('selected_member', 'client_default_contact', 'external');--> statement-breakpoint
CREATE TYPE "public"."email_template_status" AS ENUM('draft', 'active', 'archived');--> statement-breakpoint
CREATE TYPE "public"."email_template_type" AS ENUM('welcome', 'proposal', 'payment_reminder', 'invoice', 'general_outreach');--> statement-breakpoint
CREATE TYPE "public"."sent_email_status" AS ENUM('pending', 'sent', 'failed');--> statement-breakpoint
CREATE TABLE "email_delivery_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sent_email_id" uuid NOT NULL,
	"sent_email_recipient_id" uuid,
	"event_type" "email_delivery_event_type" NOT NULL,
	"provider" text DEFAULT 'resend' NOT NULL,
	"provider_event_id" text,
	"payload_json" jsonb,
	"error_message" text,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_draft_recipients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"draft_id" uuid NOT NULL,
	"recipient_mode" "email_recipient_mode" NOT NULL,
	"client_membership_id" uuid,
	"email" text NOT NULL,
	"name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_drafts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" "email_draft_source" DEFAULT 'manual' NOT NULL,
	"status" "email_draft_status" DEFAULT 'draft' NOT NULL,
	"template_type" "email_template_type" NOT NULL,
	"template_id" uuid,
	"client_id" uuid,
	"project_id" uuid,
	"subject" text NOT NULL,
	"builder_source_json" jsonb NOT NULL,
	"rendered_html" text,
	"rendered_text" text,
	"trigger_type" text,
	"related_entity_type" text,
	"related_entity_id" text,
	"dedupe_key" text,
	"error_message" text,
	"created_by_admin_id" text,
	"updated_by_admin_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_generation_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "email_generation_run_status" DEFAULT 'running' NOT NULL,
	"cadence_hours" integer DEFAULT 24 NOT NULL,
	"created_draft_count" integer DEFAULT 0 NOT NULL,
	"skipped_duplicate_count" integer DEFAULT 0 NOT NULL,
	"error_message" text,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_name" text DEFAULT 'Concolabs' NOT NULL,
	"from_email" text DEFAULT 'hello@concolabs.com' NOT NULL,
	"reply_to_email" text DEFAULT 'hello@concolabs.com' NOT NULL,
	"starter_layout_json" jsonb NOT NULL,
	"footer_company_name" text DEFAULT 'Concolabs' NOT NULL,
	"footer_address" text,
	"footer_contact_email" text DEFAULT 'hello@concolabs.com' NOT NULL,
	"logo_url" text,
	"cron_cadence_hours" integer DEFAULT 24 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_template_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_type" "email_template_type" NOT NULL,
	"template_id" uuid NOT NULL,
	"client_id" uuid,
	"project_id" uuid,
	"created_by_admin_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_type" "email_template_type" NOT NULL,
	"status" "email_template_status" DEFAULT 'draft' NOT NULL,
	"name" text NOT NULL,
	"subject" text NOT NULL,
	"builder_source_json" jsonb NOT NULL,
	"rendered_html" text,
	"rendered_text" text,
	"created_by_admin_id" text NOT NULL,
	"updated_by_admin_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sent_email_recipients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sent_email_id" uuid NOT NULL,
	"recipient_mode" "email_recipient_mode" NOT NULL,
	"client_membership_id" uuid,
	"email" text NOT NULL,
	"name" text,
	"status" "sent_email_status" DEFAULT 'pending' NOT NULL,
	"provider_recipient_id" text,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sent_emails" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"draft_id" uuid,
	"template_id" uuid,
	"template_type" "email_template_type" NOT NULL,
	"client_id" uuid,
	"project_id" uuid,
	"subject" text NOT NULL,
	"rendered_html" text NOT NULL,
	"rendered_text" text NOT NULL,
	"from_name" text NOT NULL,
	"from_email" text NOT NULL,
	"reply_to_email" text,
	"status" "sent_email_status" DEFAULT 'pending' NOT NULL,
	"provider" text DEFAULT 'resend' NOT NULL,
	"provider_message_id" text,
	"error_message" text,
	"sent_by_admin_id" text,
	"sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "email_delivery_events" ADD CONSTRAINT "email_delivery_events_sent_email_id_sent_emails_id_fk" FOREIGN KEY ("sent_email_id") REFERENCES "public"."sent_emails"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_delivery_events" ADD CONSTRAINT "email_delivery_events_sent_email_recipient_id_sent_email_recipients_id_fk" FOREIGN KEY ("sent_email_recipient_id") REFERENCES "public"."sent_email_recipients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_draft_recipients" ADD CONSTRAINT "email_draft_recipients_draft_id_email_drafts_id_fk" FOREIGN KEY ("draft_id") REFERENCES "public"."email_drafts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_draft_recipients" ADD CONSTRAINT "email_draft_recipients_client_membership_id_client_memberships_id_fk" FOREIGN KEY ("client_membership_id") REFERENCES "public"."client_memberships"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_drafts" ADD CONSTRAINT "email_drafts_template_id_email_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."email_templates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_drafts" ADD CONSTRAINT "email_drafts_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_drafts" ADD CONSTRAINT "email_drafts_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_drafts" ADD CONSTRAINT "email_drafts_created_by_admin_id_users_id_fk" FOREIGN KEY ("created_by_admin_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_drafts" ADD CONSTRAINT "email_drafts_updated_by_admin_id_users_id_fk" FOREIGN KEY ("updated_by_admin_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_template_assignments" ADD CONSTRAINT "email_template_assignments_template_id_email_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."email_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_template_assignments" ADD CONSTRAINT "email_template_assignments_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_template_assignments" ADD CONSTRAINT "email_template_assignments_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_template_assignments" ADD CONSTRAINT "email_template_assignments_created_by_admin_id_users_id_fk" FOREIGN KEY ("created_by_admin_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_templates" ADD CONSTRAINT "email_templates_created_by_admin_id_users_id_fk" FOREIGN KEY ("created_by_admin_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_templates" ADD CONSTRAINT "email_templates_updated_by_admin_id_users_id_fk" FOREIGN KEY ("updated_by_admin_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sent_email_recipients" ADD CONSTRAINT "sent_email_recipients_sent_email_id_sent_emails_id_fk" FOREIGN KEY ("sent_email_id") REFERENCES "public"."sent_emails"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sent_email_recipients" ADD CONSTRAINT "sent_email_recipients_client_membership_id_client_memberships_id_fk" FOREIGN KEY ("client_membership_id") REFERENCES "public"."client_memberships"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sent_emails" ADD CONSTRAINT "sent_emails_draft_id_email_drafts_id_fk" FOREIGN KEY ("draft_id") REFERENCES "public"."email_drafts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sent_emails" ADD CONSTRAINT "sent_emails_template_id_email_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."email_templates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sent_emails" ADD CONSTRAINT "sent_emails_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sent_emails" ADD CONSTRAINT "sent_emails_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sent_emails" ADD CONSTRAINT "sent_emails_sent_by_admin_id_users_id_fk" FOREIGN KEY ("sent_by_admin_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "email_draft_dedupe_idx" ON "email_drafts" USING btree ("dedupe_key");--> statement-breakpoint
CREATE UNIQUE INDEX "email_template_assignment_scope_idx" ON "email_template_assignments" USING btree ("template_type","client_id","project_id");