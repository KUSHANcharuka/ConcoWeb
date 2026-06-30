CREATE TYPE "public"."billing_access_status" AS ENUM('inactive', 'active', 'grace', 'manual_override', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."billing_artifact_status" AS ENUM('draft', 'sent', 'pending_payment', 'proof_submitted', 'paid', 'overdue', 'void');--> statement-breakpoint
CREATE TYPE "public"."billing_artifact_type" AS ENUM('invoice', 'payment_request');--> statement-breakpoint
CREATE TYPE "public"."billing_payment_method_type" AS ENUM('stripe_payment_link', 'us_wire_transfer', 'lk_bank_transfer', 'manual');--> statement-breakpoint
CREATE TYPE "public"."billing_plan_kind" AS ENUM('subscription', 'prepaid_term', 'milestone', 'manual');--> statement-breakpoint
CREATE TYPE "public"."billing_template_type" AS ENUM('invoice', 'agreement');--> statement-breakpoint
CREATE TYPE "public"."product_account_status" AS ENUM('pending', 'active', 'suspended', 'disconnected');--> statement-breakpoint
CREATE TYPE "public"."webhook_reconcile_mode" AS ENUM('none', 'manual', 'periodic_pull', 'push');--> statement-breakpoint
ALTER TYPE "public"."asset_scope_type" ADD VALUE 'billing_artifact' BEFORE 'payment_proof';--> statement-breakpoint
CREATE TABLE "billing_artifact_payment_methods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"artifact_id" uuid NOT NULL,
	"config_id" uuid,
	"method_type" "billing_payment_method_type" NOT NULL,
	"label" text NOT NULL,
	"instructions" text,
	"payment_url" text,
	"account_name" text,
	"account_number_mask" text,
	"routing_number_mask" text,
	"bank_name" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "billing_line_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"artifact_id" uuid NOT NULL,
	"label" text NOT NULL,
	"description" text,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_amount" integer DEFAULT 0 NOT NULL,
	"total_amount" integer DEFAULT 0 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "billing_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"template_type" "billing_template_type" NOT NULL,
	"description" text,
	"content" text NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_by_admin_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_method_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"method_type" "billing_payment_method_type" NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"currency" text,
	"instructions" text,
	"payment_url" text,
	"account_name" text,
	"account_number_mask" text,
	"routing_number_mask" text,
	"bank_name" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_webhook_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"webhook_url" text,
	"webhook_secret" text,
	"payload_template" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"reconcile_url" text,
	"reconcile_mode" "webhook_reconcile_mode" DEFAULT 'manual' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_webhook_configs_productId_unique" UNIQUE("product_id")
);
--> statement-breakpoint
CREATE TABLE "project_billing_access_states" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"source_artifact_id" uuid,
	"status" "billing_access_status" DEFAULT 'inactive' NOT NULL,
	"next_due_at" timestamp with time zone,
	"access_expires_at" timestamp with time zone,
	"last_paid_at" timestamp with time zone,
	"override_reason" text,
	"updated_by_admin_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_billing_access_states_projectId_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "project_billing_artifacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"product_id" uuid,
	"artifact_type" "billing_artifact_type" DEFAULT 'invoice' NOT NULL,
	"plan_kind" "billing_plan_kind" DEFAULT 'manual' NOT NULL,
	"status" "billing_artifact_status" DEFAULT 'draft' NOT NULL,
	"invoice_number" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"currency" text DEFAULT 'USD' NOT NULL,
	"subtotal_amount" integer DEFAULT 0 NOT NULL,
	"tax_amount" integer DEFAULT 0 NOT NULL,
	"discount_amount" integer DEFAULT 0 NOT NULL,
	"total_amount" integer DEFAULT 0 NOT NULL,
	"issued_at" timestamp with time zone,
	"due_at" timestamp with time zone,
	"next_due_at" timestamp with time zone,
	"access_starts_at" timestamp with time zone,
	"access_expires_at" timestamp with time zone,
	"terms" text,
	"notes" text,
	"sent_at" timestamp with time zone,
	"paid_at" timestamp with time zone,
	"created_by_admin_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_billing_artifacts_invoiceNumber_unique" UNIQUE("invoice_number")
);
--> statement-breakpoint
CREATE TABLE "project_product_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"status" "product_account_status" DEFAULT 'pending' NOT NULL,
	"external_account_id" text,
	"external_workspace_id" text,
	"account_url" text,
	"stats_summary" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"last_synced_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_product_accounts_projectId_unique" UNIQUE("project_id")
);
--> statement-breakpoint
ALTER TABLE "billing_artifact_payment_methods" ADD CONSTRAINT "billing_artifact_payment_methods_artifact_id_project_billing_artifacts_id_fk" FOREIGN KEY ("artifact_id") REFERENCES "public"."project_billing_artifacts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing_artifact_payment_methods" ADD CONSTRAINT "billing_artifact_payment_methods_config_id_payment_method_configs_id_fk" FOREIGN KEY ("config_id") REFERENCES "public"."payment_method_configs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing_line_items" ADD CONSTRAINT "billing_line_items_artifact_id_project_billing_artifacts_id_fk" FOREIGN KEY ("artifact_id") REFERENCES "public"."project_billing_artifacts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_webhook_configs" ADD CONSTRAINT "product_webhook_configs_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_billing_access_states" ADD CONSTRAINT "project_billing_access_states_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_billing_access_states" ADD CONSTRAINT "project_billing_access_states_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_billing_access_states" ADD CONSTRAINT "project_billing_access_states_source_artifact_id_project_billing_artifacts_id_fk" FOREIGN KEY ("source_artifact_id") REFERENCES "public"."project_billing_artifacts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_billing_artifacts" ADD CONSTRAINT "project_billing_artifacts_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_billing_artifacts" ADD CONSTRAINT "project_billing_artifacts_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_billing_artifacts" ADD CONSTRAINT "project_billing_artifacts_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_product_accounts" ADD CONSTRAINT "project_product_accounts_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_product_accounts" ADD CONSTRAINT "project_product_accounts_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_product_accounts" ADD CONSTRAINT "project_product_accounts_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;