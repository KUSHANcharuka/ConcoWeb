CREATE TYPE "public"."product_access_state" AS ENUM('pending', 'active', 'revoked', 'expired');--> statement-breakpoint
CREATE TYPE "public"."product_access_sync_status" AS ENUM('pending', 'synced', 'failed');--> statement-breakpoint
CREATE TYPE "public"."product_access_source" AS ENUM('admin_action', 'product_callback', 'manual_reconcile');--> statement-breakpoint
CREATE TYPE "public"."product_access_event_type" AS ENUM('grant', 'extend', 'revoke', 'callback_update', 'reconcile_update');--> statement-breakpoint
CREATE TABLE "project_product_access_states" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"access_state" "product_access_state" DEFAULT 'pending' NOT NULL,
	"sync_status" "product_access_sync_status" DEFAULT 'pending' NOT NULL,
	"granted_at" timestamp with time zone,
	"access_expires_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"revoked_reason" text,
	"last_source" "product_access_source" DEFAULT 'admin_action' NOT NULL,
	"last_webhook_event_type" text,
	"last_webhook_sent_at" timestamp with time zone,
	"last_webhook_delivered_at" timestamp with time zone,
	"last_webhook_error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_product_access_states_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "project_product_access_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"access_state_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"event_type" "product_access_event_type" NOT NULL,
	"source" "product_access_source" NOT NULL,
	"actor_user_id" text,
	"access_state" "product_access_state" NOT NULL,
	"sync_status" "product_access_sync_status" NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product_webhook_delivery_logs" ADD COLUMN "project_id" uuid;--> statement-breakpoint
ALTER TABLE "project_product_access_states" ADD CONSTRAINT "project_product_access_states_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_product_access_states" ADD CONSTRAINT "project_product_access_states_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_product_access_states" ADD CONSTRAINT "project_product_access_states_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_product_access_events" ADD CONSTRAINT "project_product_access_events_access_state_id_project_product_access_states_id_fk" FOREIGN KEY ("access_state_id") REFERENCES "public"."project_product_access_states"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_product_access_events" ADD CONSTRAINT "project_product_access_events_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_product_access_events" ADD CONSTRAINT "project_product_access_events_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_product_access_events" ADD CONSTRAINT "project_product_access_events_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_webhook_delivery_logs" ADD CONSTRAINT "product_webhook_delivery_logs_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
INSERT INTO "project_product_access_states" (
	"project_id",
	"client_id",
	"product_id",
	"access_state",
	"sync_status",
	"last_source"
)
SELECT
	"projects"."id",
	"projects"."client_id",
	"projects"."product_id",
	'pending',
	'pending',
	'admin_action'
FROM "projects"
WHERE "projects"."product_id" IS NOT NULL
ON CONFLICT ("project_id") DO NOTHING;
