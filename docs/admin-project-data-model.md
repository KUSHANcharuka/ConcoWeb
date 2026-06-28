# Admin Projects Data Model

> Status: Planning. This document captures the intended database shape for the admin Projects and Clients work before implementation. It complements `ADMIN_DASHBOARD_SPEC.md`, `CLIENT_PORTAL_SPEC.md`, and `admin-portal-high-level-initial-planning.md`.

## Core model

The platform is a centralized client portal, admin portal, and billing system for Concolabs projects and products.

- **Clerk owns authentication and organization membership.**
- **Postgres owns business state, reporting, billing, project data, and file authorization.**
- **One client company maps to one Clerk Organization.**
- **One client company can have many users.**
- **One client company can have many projects.**
- **Project data is shared by admin and client portal views, with admin-only affordances layered on top.**

In this document, **client** and **tenant** mean the same thing: the customer company, such as JCC.

## Identity and clients

### `users`

Mirror Clerk users that interact with the platform.

| Column | Notes |
| --- | --- |
| `id` | Clerk user id. Primary key. |
| `email` | Required. |
| `phone` | Optional. |
| `name` | Optional display name. |
| `image_url` | Optional profile image URL from Clerk. |
| `global_role` | `admin` or `client`. Admin access remains Clerk staff-org based. |
| `created_at` | Timestamp. |
| `updated_at` | Timestamp. |

### `clients`

One row per client company / tenant.

| Column | Notes |
| --- | --- |
| `id` | Internal UUID. |
| `clerk_org_id` | Unique Clerk Organization id. |
| `name` | Company name, for example `JCC`. |
| `primary_contact_email` | Required. |
| `primary_contact_phone` | Optional. |
| `logo_asset_id` | Optional asset reference. |
| `country` | Optional. |
| `base_currency` | Default reporting/billing currency for the client. |
| `status` | `lead`, `active`, `suspended`, `archived`. |
| `internal_notes` | Admin-only notes. |
| `created_at` | Timestamp. |
| `updated_at` | Timestamp. |

### `client_invitations`

Local record of invitations sent through Clerk.

| Column | Notes |
| --- | --- |
| `id` | Internal UUID. |
| `client_id` | Tenant scope. |
| `clerk_invitation_id` | Clerk invitation id. |
| `email` | Invited contact email. |
| `phone` | Optional. |
| `name` | Optional invited contact name. |
| `role` | Clerk built-in org role: `org:admin` or `org:member`. |
| `status` | `pending`, `accepted`, `revoked`, `expired`. |
| `invited_by_admin_id` | Admin user who sent the invite. |
| `accepted_at` | Nullable. |
| `expires_at` | Nullable. |
| `created_at` | Timestamp. |
| `updated_at` | Timestamp. |

### `client_memberships`

DB mirror of accepted/current Clerk organization memberships. Clerk is still the source of truth; this table exists for fast UI queries, audit trails, and authorization joins.

| Column | Notes |
| --- | --- |
| `id` | Internal UUID. |
| `client_id` | Tenant scope. |
| `user_id` | Clerk user id, references `users.id`. |
| `clerk_membership_id` | Clerk membership id. |
| `role` | `org:admin` or `org:member`. |
| `status` | `active`, `revoked`, `pending`. |
| `created_at` | Timestamp. |
| `updated_at` | Timestamp. |

## Assets and R2 files

All confidential project files, project images, proposal PDFs, signatures, payment slips, and message attachments should be stored in Cloudflare R2. The application should upload through short-lived presigned URLs and store object metadata in Postgres.

### `assets`

Shared metadata table for every R2-backed file.

| Column | Notes |
| --- | --- |
| `id` | Internal UUID. |
| `client_id` | Required tenant scope. Critical for authorization. |
| `project_id` | Nullable, present for project-scoped assets. |
| `uploaded_by_user_id` | User who uploaded or generated the asset. |
| `bucket` | R2 bucket name. |
| `object_key` | R2 object key. |
| `file_name` | Original filename. |
| `display_name` | Editable UI label. |
| `mime_type` | File MIME type. |
| `size_bytes` | File size. |
| `checksum` | Optional integrity/hash value. |
| `asset_type` | `image`, `document`, `video`, `payment_proof`, `signature`, `other`. |
| `visibility` | `admin_only`, `client_visible`, `private_member`. |
| `scope_type` | Business owner type, for example `project`, `proposal`, `payment_proof`, `change_request`, `message`, `client`. |
| `scope_id` | Id of the scoped entity. |
| `created_at` | Timestamp. |
| `updated_at` | Timestamp. |
| `deleted_at` | Nullable soft-delete timestamp. |

`scope_type` and `scope_id` answer: "What business object does this file belong to?"

Examples:

- Project cover image: `scope_type = project`, `scope_id = projects.id`.
- Proposal PDF: `scope_type = proposal`, `scope_id = proposals.id`.
- Payment slip: `scope_type = payment_proof`, `scope_id = payment_proofs.id`.

Every asset authorization check must validate `client_id`. `scope_type` and `scope_id` are useful for linking files to business objects, but they should not be the only access boundary.

## Products and billing integration

Products represent Concolabs offerings and product backends that the billing system can grant or revoke access to. Examples: Prelim, Build Monitor, Teres, or a custom software engagement.

### `products`

Catalogue of products/services Concolabs sells or integrates with.

| Column | Notes |
| --- | --- |
| `id` | Internal UUID. |
| `slug` | Unique key, for example `prelim`, `build-monitor`, `custom-web-app`. |
| `name` | Display name. |
| `kind` | `saas`, `custom`, `service`. |
| `status` | `active`, `inactive`, `deprecated`. |
| `description` | Optional. |
| `default_currency` | Optional product-level billing default. |
| `billing_mode` | `subscription`, `one_time`, `milestone`, `manual`. |
| `webhook_url` | Product backend webhook endpoint. |
| `webhook_secret` | Secret used to sign outbound events. Store securely. |
| `reconcile_url` | Optional product backend reconciliation endpoint. |
| `created_at` | Timestamp. |
| `updated_at` | Timestamp. |

### `project_product_links`

Links a project to one or more products. A project may have no product at first, and custom builds can still exist without a product integration.

| Column | Notes |
| --- | --- |
| `id` | Internal UUID. |
| `project_id` | Project scope. |
| `product_id` | Product reference. |
| `access_status` | `pending`, `active`, `suspended`, `revoked`. |
| `external_reference_id` | Optional id in the product backend. |
| `feature_flags` | JSONB reserved for future product-specific access. |
| `plan_tier` | Optional. |
| `seat_count` | Optional. |
| `created_at` | Timestamp. |
| `updated_at` | Timestamp. |

Billing strategy:

- Central billing state lives in this application.
- Product backends should not decide billing truth.
- Billing/payment changes emit outbound events to linked product backends.
- Product backends update local access from events and can reconcile against the central platform if an event is missed.

Initial event types:

- `access.granted`
- `access.revoked`
- `payment.succeeded`
- `payment.failed`
- `subscription.updated`

## Projects

Projects are the main workspace shared between the admin portal and client portal.

### `projects`

| Column | Notes |
| --- | --- |
| `id` | Internal UUID. |
| `client_id` | Tenant scope. |
| `product_id` | Optional primary product reference. |
| `name` | Project name. |
| `description` | Short explanation of the project. This replaces the earlier `summary` term. |
| `project_type` | `custom_build`, `saas_setup`, `website`, `mobile_app`, `internal_tool`, `other`. |
| `status` | `pending`, `active`, `paused`, `completed`, `archived`. |
| `visibility` | `visible`, `hidden`. V1 default is `visible`. |
| `currency` | Project default currency. |
| `cover_asset_id` | Optional project image asset. |
| `start_date` | Optional. |
| `target_launch_date` | Optional. |
| `created_by_admin_id` | Admin who created the project. |
| `created_at` | Timestamp. |
| `updated_at` | Timestamp. |

V1 admin project creation requires:

- Client
- Project name
- Project type
- Status
- Description
- Currency

Project image, product link, start date, and target launch date can be optional.

## Project workspace tables

Every project-tab table should include `client_id`, `project_id`, `created_at`, and `updated_at` even when `project_id` implies `client_id`. The duplicated tenant key makes authorization, filtering, and accidental cross-client data checks simpler and safer.

### Timeline

#### `project_timeline_items`

| Column | Notes |
| --- | --- |
| `id` | Internal UUID. |
| `client_id` | Tenant scope. |
| `project_id` | Project scope. |
| `title` | Timeline label. |
| `description` | Optional detail text. |
| `item_type` | `milestone`, `payment_due`, `proposal_sent`, `delivery`, `review`, `change_request`, `custom`. |
| `status` | `planned`, `current`, `completed`, `delayed`, `cancelled`. |
| `starts_at` | Optional. |
| `due_at` | Optional. |
| `completed_at` | Optional. |
| `sort_order` | Manual ordering support. |
| `linked_entity_type` | Optional, for example `proposal`, `invoice`, `change_request`, `asset`. |
| `linked_entity_id` | Optional linked entity id. |
| `visible_to_client` | Boolean. |
| `created_by_user_id` | User who created the item. |
| `created_at` | Timestamp. |
| `updated_at` | Timestamp. |

### Proposals

#### `proposals`

| Column | Notes |
| --- | --- |
| `id` | Internal UUID. |
| `client_id` | Tenant scope. |
| `project_id` | Project scope. |
| `title` | Proposal title. |
| `version` | Version label, for example `v1`, `v2`, `final`. |
| `status` | `draft`, `sent`, `commented`, `accepted`, `signed`, `declined`, `archived`. |
| `currency` | Proposal currency. |
| `total_amount_cents` | Optional. |
| `content_json` | Rich editor document structure. |
| `rendered_asset_id` | Generated PDF asset. |
| `sent_at` | Nullable. |
| `signed_at` | Nullable. |
| `created_by_admin_id` | Admin who created the proposal. |
| `created_at` | Timestamp. |
| `updated_at` | Timestamp. |

#### `proposal_comments`

| Column | Notes |
| --- | --- |
| `id` | Internal UUID. |
| `client_id` | Tenant scope. |
| `project_id` | Project scope. |
| `proposal_id` | Proposal reference. |
| `author_user_id` | Comment author. |
| `selected_text` | Highlighted text, if text-based. |
| `page_number` | Page number, if PDF-based. |
| `anchor_json` | Coordinates or range metadata for the highlight. |
| `body` | Comment body. |
| `status` | `open`, `resolved`. |
| `created_at` | Timestamp. |
| `updated_at` | Timestamp. |

#### `proposal_signatures`

| Column | Notes |
| --- | --- |
| `id` | Internal UUID. |
| `client_id` | Tenant scope. |
| `project_id` | Project scope. |
| `proposal_id` | Proposal reference. |
| `signer_user_id` | User who signed. |
| `signer_name` | Name shown on the signature. |
| `signature_asset_id` | Uploaded/drawn signature asset. |
| `signed_pdf_asset_id` | Final signed PDF asset. |
| `signed_at` | Timestamp. |
| `ip_address` | Optional audit metadata. |
| `created_at` | Timestamp. |

### Payments and invoices

Payments should be modeled as invoice/payment request first, then actual payment records and proof uploads.

#### `invoices`

| Column | Notes |
| --- | --- |
| `id` | Internal UUID. |
| `client_id` | Tenant scope. |
| `project_id` | Project scope. |
| `invoice_number` | Human-facing invoice number. |
| `title` | Payment title. |
| `description` | Optional detail. |
| `amount_cents` | Integer minor units. |
| `currency` | Invoice currency. |
| `status` | `draft`, `sent`, `due`, `overdue`, `paid`, `void`. |
| `due_date` | Due date. |
| `issued_at` | Nullable. |
| `paid_at` | Nullable. |
| `created_by_admin_id` | Admin who created the invoice. |
| `created_at` | Timestamp. |
| `updated_at` | Timestamp. |

#### `invoice_payment_options`

Supported v1 options are Stripe, US bank transfer, and Sri Lankan bank transfer.

| Column | Notes |
| --- | --- |
| `id` | Internal UUID. |
| `invoice_id` | Invoice reference. |
| `method` | `stripe`, `bank_us`, `bank_lk`. |
| `enabled` | Boolean. |
| `stripe_checkout_url` | Nullable. |
| `bank_account_id` | Nullable. |
| `instructions` | Optional override text. |
| `created_at` | Timestamp. |
| `updated_at` | Timestamp. |

#### `bank_accounts`

Admin-configured payment destination details.

| Column | Notes |
| --- | --- |
| `id` | Internal UUID. |
| `label` | For example `US bank` or `Sri Lanka bank`. |
| `country` | Bank country. |
| `currency` | Account currency. |
| `bank_name` | Bank name. |
| `account_name` | Account holder. |
| `account_number_masked` | Masked account number for UI. |
| `routing_number_masked` | Optional masked routing number. |
| `swift_code` | Optional. |
| `instructions` | Payment instructions. |
| `active` | Boolean. |
| `created_at` | Timestamp. |
| `updated_at` | Timestamp. |

#### `payments`

Actual payment attempts/records.

| Column | Notes |
| --- | --- |
| `id` | Internal UUID. |
| `client_id` | Tenant scope. |
| `project_id` | Project scope. |
| `invoice_id` | Invoice reference. |
| `amount_cents` | Integer minor units. |
| `currency` | Payment currency. |
| `method` | `stripe`, `bank_us`, `bank_lk`. |
| `status` | `pending`, `submitted`, `verifying`, `verified`, `failed`, `refunded`. |
| `stripe_payment_intent_id` | Nullable. |
| `recorded_by_user_id` | Nullable user/admin. |
| `recorded_at` | Nullable. |
| `created_at` | Timestamp. |
| `updated_at` | Timestamp. |

#### `payment_proofs`

Bank transfer slip/receipt uploads.

| Column | Notes |
| --- | --- |
| `id` | Internal UUID. |
| `client_id` | Tenant scope. |
| `project_id` | Project scope. |
| `invoice_id` | Invoice reference. |
| `payment_id` | Nullable until admin verifies and links/creates a payment. |
| `uploaded_by_user_id` | Client/admin who uploaded the proof. |
| `asset_id` | Slip/receipt asset. |
| `note` | Optional. |
| `status` | `pending`, `approved`, `rejected`. |
| `reviewed_by_admin_id` | Nullable. |
| `reviewed_at` | Nullable. |
| `created_at` | Timestamp. |
| `updated_at` | Timestamp. |

### Change requests

#### `change_requests`

| Column | Notes |
| --- | --- |
| `id` | Internal UUID. |
| `client_id` | Tenant scope. |
| `project_id` | Project scope. |
| `requested_by_user_id` | Client/admin requester. |
| `title` | Request title. |
| `description` | Request details. |
| `urgency` | `low`, `normal`, `high`. |
| `status` | `submitted`, `reviewing`, `quoted`, `approved`, `rejected`, `in_progress`, `delivered`, `closed`. |
| `budget_cents` | Optional. |
| `currency` | Optional/request currency. |
| `desired_due_date` | Optional. |
| `created_at` | Timestamp. |
| `updated_at` | Timestamp. |

#### `change_request_comments`

| Column | Notes |
| --- | --- |
| `id` | Internal UUID. |
| `client_id` | Tenant scope. |
| `project_id` | Project scope. |
| `change_request_id` | Change request reference. |
| `author_user_id` | Comment author. |
| `body` | Comment text. |
| `created_at` | Timestamp. |
| `updated_at` | Timestamp. |

#### `change_request_assets`

| Column | Notes |
| --- | --- |
| `id` | Internal UUID. |
| `client_id` | Tenant scope. |
| `project_id` | Project scope. |
| `change_request_id` | Change request reference. |
| `asset_id` | Asset reference. |
| `created_at` | Timestamp. |

Approved change requests can later create invoices and timeline items.

### Files tab

The files tab should use `assets` for the actual R2 metadata and project-specific tables for foldering and UI placement.

#### `project_folders`

| Column | Notes |
| --- | --- |
| `id` | Internal UUID. |
| `client_id` | Tenant scope. |
| `project_id` | Project scope. |
| `name` | Folder name. |
| `parent_folder_id` | Nullable for nested folders. |
| `visibility` | `admin_only`, `client_visible`. |
| `created_at` | Timestamp. |
| `updated_at` | Timestamp. |

#### `project_files`

| Column | Notes |
| --- | --- |
| `id` | Internal UUID. |
| `client_id` | Tenant scope. |
| `project_id` | Project scope. |
| `folder_id` | Nullable folder reference. |
| `asset_id` | Asset reference. |
| `title` | Display title. |
| `description` | Optional. |
| `visibility` | `admin_only`, `client_visible`. |
| `uploaded_by_user_id` | User who uploaded the file. |
| `created_at` | Timestamp. |
| `updated_at` | Timestamp. |

### Messages

Messages are not required for the first implementation slice, but the model should reserve the shape now.

#### `message_threads`

| Column | Notes |
| --- | --- |
| `id` | Internal UUID. |
| `client_id` | Tenant scope. |
| `project_id` | Project scope. |
| `title` | Thread title. |
| `thread_type` | `general`, `proposal`, `payment`, `change_request`. |
| `linked_entity_type` | Optional. |
| `linked_entity_id` | Optional. |
| `created_at` | Timestamp. |
| `updated_at` | Timestamp. |

#### `messages`

| Column | Notes |
| --- | --- |
| `id` | Internal UUID. |
| `client_id` | Tenant scope. |
| `project_id` | Project scope. |
| `thread_id` | Thread reference. |
| `author_user_id` | Message author. |
| `body` | Message body. |
| `created_at` | Timestamp. |
| `updated_at` | Timestamp. |

#### `message_assets`

| Column | Notes |
| --- | --- |
| `id` | Internal UUID. |
| `client_id` | Tenant scope. |
| `project_id` | Project scope. |
| `message_id` | Message reference. |
| `asset_id` | Asset reference. |
| `created_at` | Timestamp. |

## Authorization rules

Admin access:

- Admin routes are gated by Clerk staff-org membership mirrored into the Clerk session role claim.
- Admin users can see all clients and projects.

Client access:

- Client users authenticate through Clerk.
- Client users can access a project only if they are active members of the project's `client_id` / Clerk Organization.
- DB mirrors of memberships should be kept in sync from Clerk webhooks.

Asset access:

- Every asset query must validate `assets.client_id`.
- Project assets should also validate `assets.project_id`.
- R2 object keys should not be treated as public authorization boundaries.
- Use short-lived signed read URLs for private files.

## Implementation order

1. Extend schema for users, clients, invitations, memberships, assets, products, project product links, and projects.
2. Add R2 configuration and a small server-side upload service that creates presigned PUT URLs.
3. Build admin client creation: create Clerk Organization, send first contact invitation, write DB rows.
4. Extend Clerk webhook handling to mirror client membership and invitation state into Postgres.
5. Build admin project creation and project card list.
6. Scaffold project detail tabs using the shared data model.
7. Add timeline.
8. Add invoices/payment options/payment proofs.
9. Add proposals/comments/signatures.
10. Add change requests, files, and messages.
