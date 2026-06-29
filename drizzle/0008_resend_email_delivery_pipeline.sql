CREATE TYPE "public"."sent_email_status_v2" AS ENUM('queued', 'accepted', 'delivered', 'opened', 'clicked', 'bounced', 'complained', 'suppressed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."email_delivery_event_type_v2" AS ENUM('queued', 'accepted', 'delivered', 'opened', 'clicked', 'bounced', 'complained', 'suppressed', 'failed');--> statement-breakpoint
ALTER TABLE "sent_emails" ADD COLUMN "provider_idempotency_key" text;--> statement-breakpoint
UPDATE "sent_emails"
SET "provider_idempotency_key" = concat('sent-email/', "id")
WHERE "provider_idempotency_key" IS NULL;--> statement-breakpoint
ALTER TABLE "sent_emails" ALTER COLUMN "provider_idempotency_key" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "sent_emails_provider_idempotency_key_idx" ON "sent_emails" USING btree ("provider_idempotency_key");--> statement-breakpoint
ALTER TABLE "sent_emails" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "sent_email_recipients" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "sent_emails"
ALTER COLUMN "status" TYPE "public"."sent_email_status_v2"
USING (
  CASE "status"::text
    WHEN 'pending' THEN 'queued'::"public"."sent_email_status_v2"
    WHEN 'sent' THEN 'accepted'::"public"."sent_email_status_v2"
    WHEN 'failed' THEN 'failed'::"public"."sent_email_status_v2"
  END
);--> statement-breakpoint
ALTER TABLE "sent_email_recipients"
ALTER COLUMN "status" TYPE "public"."sent_email_status_v2"
USING (
  CASE "status"::text
    WHEN 'pending' THEN 'queued'::"public"."sent_email_status_v2"
    WHEN 'sent' THEN 'accepted'::"public"."sent_email_status_v2"
    WHEN 'failed' THEN 'failed'::"public"."sent_email_status_v2"
  END
);--> statement-breakpoint
ALTER TABLE "email_delivery_events"
ALTER COLUMN "event_type" TYPE "public"."email_delivery_event_type_v2"
USING (
  CASE "event_type"::text
    WHEN 'sent' THEN 'accepted'::"public"."email_delivery_event_type_v2"
    WHEN 'queued' THEN 'queued'::"public"."email_delivery_event_type_v2"
    WHEN 'delivered' THEN 'delivered'::"public"."email_delivery_event_type_v2"
    WHEN 'opened' THEN 'opened'::"public"."email_delivery_event_type_v2"
    WHEN 'clicked' THEN 'clicked'::"public"."email_delivery_event_type_v2"
    WHEN 'bounced' THEN 'bounced'::"public"."email_delivery_event_type_v2"
    WHEN 'complained' THEN 'complained'::"public"."email_delivery_event_type_v2"
    WHEN 'failed' THEN 'failed'::"public"."email_delivery_event_type_v2"
  END
);--> statement-breakpoint
DROP TYPE "public"."sent_email_status";--> statement-breakpoint
ALTER TYPE "public"."sent_email_status_v2" RENAME TO "sent_email_status";--> statement-breakpoint
DROP TYPE "public"."email_delivery_event_type";--> statement-breakpoint
ALTER TYPE "public"."email_delivery_event_type_v2" RENAME TO "email_delivery_event_type";--> statement-breakpoint
ALTER TABLE "sent_emails" ALTER COLUMN "status" SET DEFAULT 'queued';--> statement-breakpoint
ALTER TABLE "sent_email_recipients" ALTER COLUMN "status" SET DEFAULT 'queued';--> statement-breakpoint
