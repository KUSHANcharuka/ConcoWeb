CREATE TYPE "public"."billing_artifact_document_role" AS ENUM('primary_invoice', 'terms_and_conditions');--> statement-breakpoint
CREATE TABLE "billing_artifact_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"artifact_id" uuid NOT NULL,
	"role" "billing_artifact_document_role" NOT NULL,
	"title" text NOT NULL,
	"source_asset_id" uuid,
	"template_id" uuid,
	"docuseal_template_id" text,
	"docuseal_template_slug" text,
	"docuseal_submission_id" text,
	"docuseal_submission_status" text,
	"docuseal_submitter_id" text,
	"docuseal_submitter_slug" text,
	"docuseal_submitter_embed_url" text,
	"is_signable" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "billing_artifact_documents" ADD CONSTRAINT "billing_artifact_documents_artifact_id_project_billing_artifacts_id_fk" FOREIGN KEY ("artifact_id") REFERENCES "public"."project_billing_artifacts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing_artifact_documents" ADD CONSTRAINT "billing_artifact_documents_template_id_billing_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."billing_templates"("id") ON DELETE set null ON UPDATE no action;
