CREATE TYPE "public"."asset_scope_type" AS ENUM('project', 'proposal', 'payment_proof', 'change_request', 'message', 'client', 'unscoped');--> statement-breakpoint
CREATE TYPE "public"."asset_type" AS ENUM('image', 'document', 'video', 'payment_proof', 'signature', 'other');--> statement-breakpoint
CREATE TYPE "public"."asset_visibility" AS ENUM('admin_only', 'client_visible', 'private_member');--> statement-breakpoint
CREATE TYPE "public"."client_status" AS ENUM('lead', 'active', 'suspended', 'archived');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('client', 'admin');--> statement-breakpoint
CREATE TYPE "public"."product_billing_mode" AS ENUM('subscription', 'one_time', 'milestone', 'manual');--> statement-breakpoint
CREATE TYPE "public"."product_kind" AS ENUM('saas', 'custom', 'service');--> statement-breakpoint
CREATE TYPE "public"."product_status" AS ENUM('active', 'inactive', 'deprecated');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('pending', 'active', 'paused', 'completed', 'archived');--> statement-breakpoint
CREATE TYPE "public"."project_type" AS ENUM('custom_build', 'saas_setup', 'website', 'mobile_app', 'internal_tool', 'other');--> statement-breakpoint
CREATE TYPE "public"."project_visibility" AS ENUM('visible', 'hidden');--> statement-breakpoint
CREATE TYPE "public"."project_request_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"project_id" uuid,
	"uploaded_by_user_id" text,
	"bucket" text NOT NULL,
	"object_key" text NOT NULL,
	"file_name" text NOT NULL,
	"display_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" bigint NOT NULL,
	"checksum" text,
	"asset_type" "asset_type" DEFAULT 'other' NOT NULL,
	"visibility" "asset_visibility" DEFAULT 'admin_only' NOT NULL,
	"scope_type" "asset_scope_type" DEFAULT 'unscoped' NOT NULL,
	"scope_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "assets_objectKey_unique" UNIQUE("object_key")
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_org_id" text NOT NULL,
	"name" text NOT NULL,
	"primary_contact_email" text NOT NULL,
	"primary_contact_phone" text,
	"logo_asset_id" uuid,
	"country" text,
	"base_currency" text DEFAULT 'USD' NOT NULL,
	"status" "client_status" DEFAULT 'active' NOT NULL,
	"internal_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clients_clerkOrgId_unique" UNIQUE("clerk_org_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"name" text,
	"image_url" text,
	"role" "user_role" DEFAULT 'client' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"kind" "product_kind" NOT NULL,
	"status" "product_status" DEFAULT 'active' NOT NULL,
	"description" text,
	"default_currency" text,
	"billing_mode" "product_billing_mode" DEFAULT 'manual' NOT NULL,
	"webhook_url" text,
	"webhook_secret" text,
	"reconcile_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"product_id" uuid,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"project_type" "project_type" DEFAULT 'custom_build' NOT NULL,
	"status" "project_status" DEFAULT 'pending' NOT NULL,
	"visibility" "project_visibility" DEFAULT 'visible' NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"cover_asset_id" uuid,
	"start_date" date,
	"target_launch_date" date,
	"created_by_admin_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"requested_by_user_id" text NOT NULL,
	"label" text NOT NULL,
	"product_id" uuid,
	"summary" text,
	"status" "project_request_status" DEFAULT 'pending' NOT NULL,
	"reviewed_by_admin_id" text,
	"reviewed_at" timestamp with time zone,
	"project_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_uploaded_by_user_id_users_id_fk" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_cover_asset_id_assets_id_fk" FOREIGN KEY ("cover_asset_id") REFERENCES "public"."assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_requests" ADD CONSTRAINT "project_requests_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_requests" ADD CONSTRAINT "project_requests_requested_by_user_id_users_id_fk" FOREIGN KEY ("requested_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_requests" ADD CONSTRAINT "project_requests_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_requests" ADD CONSTRAINT "project_requests_reviewed_by_admin_id_users_id_fk" FOREIGN KEY ("reviewed_by_admin_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;