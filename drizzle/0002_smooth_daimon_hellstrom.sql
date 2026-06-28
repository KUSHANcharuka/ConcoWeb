CREATE TYPE "public"."client_invitation_status" AS ENUM('pending', 'accepted', 'revoked', 'expired');--> statement-breakpoint
CREATE TYPE "public"."client_org_role" AS ENUM('admin', 'member');--> statement-breakpoint
CREATE TYPE "public"."client_membership_status" AS ENUM('active', 'removed');--> statement-breakpoint
CREATE TABLE "client_invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"phone" text,
	"role" "client_org_role" DEFAULT 'member' NOT NULL,
	"clerk_invitation_id" text NOT NULL,
	"status" "client_invitation_status" DEFAULT 'pending' NOT NULL,
	"invited_by_user_id" text,
	"accepted_user_id" text,
	"revoked_by_user_id" text,
	"invited_at" timestamp with time zone DEFAULT now() NOT NULL,
	"accepted_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "client_invitations_clerkInvitationId_unique" UNIQUE("clerk_invitation_id")
);
--> statement-breakpoint
CREATE TABLE "client_memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"email" text NOT NULL,
	"role" "client_org_role" DEFAULT 'member' NOT NULL,
	"clerk_membership_id" text NOT NULL,
	"source_invitation_id" uuid,
	"status" "client_membership_status" DEFAULT 'active' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"removed_at" timestamp with time zone,
	"removed_by_user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "client_memberships_clerkMembershipId_unique" UNIQUE("clerk_membership_id")
);
--> statement-breakpoint
ALTER TABLE "client_invitations" ADD CONSTRAINT "client_invitations_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_invitations" ADD CONSTRAINT "client_invitations_invited_by_user_id_users_id_fk" FOREIGN KEY ("invited_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_invitations" ADD CONSTRAINT "client_invitations_accepted_user_id_users_id_fk" FOREIGN KEY ("accepted_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_invitations" ADD CONSTRAINT "client_invitations_revoked_by_user_id_users_id_fk" FOREIGN KEY ("revoked_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_memberships" ADD CONSTRAINT "client_memberships_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_memberships" ADD CONSTRAINT "client_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_memberships" ADD CONSTRAINT "client_memberships_source_invitation_id_client_invitations_id_fk" FOREIGN KEY ("source_invitation_id") REFERENCES "public"."client_invitations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_memberships" ADD CONSTRAINT "client_memberships_removed_by_user_id_users_id_fk" FOREIGN KEY ("removed_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "client_membership_client_user_idx" ON "client_memberships" USING btree ("client_id","user_id");