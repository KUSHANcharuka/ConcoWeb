DO $$
BEGIN
  CREATE TYPE "public"."webhook_delivery_status" AS ENUM('pending', 'success', 'failed');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint

ALTER TABLE "billing_templates"
  ADD COLUMN IF NOT EXISTS "docuseal_template_id" text,
  ADD COLUMN IF NOT EXISTS "docuseal_template_slug" text;
--> statement-breakpoint

ALTER TABLE "payment_method_configs"
  ADD COLUMN IF NOT EXISTS "image_object_key" text;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "product_webhook_delivery_logs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "product_id" uuid NOT NULL,
  "config_id" uuid,
  "event_type" text NOT NULL,
  "endpoint_url" text,
  "delivery_status" "webhook_delivery_status" DEFAULT 'pending' NOT NULL,
  "http_status" integer,
  "response_summary" text,
  "response_body" text,
  "occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

DO $$
BEGIN
  ALTER TABLE "product_webhook_delivery_logs"
    ADD CONSTRAINT "product_webhook_delivery_logs_product_id_products_id_fk"
    FOREIGN KEY ("product_id")
    REFERENCES "public"."products"("id")
    ON DELETE cascade
    ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  ALTER TABLE "product_webhook_delivery_logs"
    ADD CONSTRAINT "product_webhook_delivery_logs_config_id_product_webhook_configs_id_fk"
    FOREIGN KEY ("config_id")
    REFERENCES "public"."product_webhook_configs"("id")
    ON DELETE set null
    ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "product_webhook_delivery_logs_product_id_idx"
  ON "product_webhook_delivery_logs" ("product_id");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "product_webhook_delivery_logs_occurred_at_idx"
  ON "product_webhook_delivery_logs" ("occurred_at");
