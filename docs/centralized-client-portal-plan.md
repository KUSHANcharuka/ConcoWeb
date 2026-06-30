# Concolabs Centralized Client Portal & Billing Platform — Initial Plan

> Status: **Exploratory / pre-implementation**. Captures direction, decisions locked in so far, open items.

## Context

Concolabs ships multiple products (BuildMonitor, Prelim, Teres, plus bespoke client builds). Today each product handles its own access logic, and billing is ad-hoc. We need **one platform** on `concolabs.com` that owns:

- Client onboarding (1 client → many projects, mix of SaaS + custom)
- Per-client custom pricing (amounts vary client-to-client)
- Multi-method payments: US bank transfer, Sri Lanka bank transfer, Stripe (subscriptions + one-off)
- Admin approval surface for bank-transfer proofs, payment state, access grant/revoke
- Outbound billing webhooks → product backends toggle access, with reconciliation poll as safety net

Current repo (`concolabs-com`) is a T3 marketing site: Next.js 15 App Router, TypeScript, tRPC, shadcn/ui, Tailwind 4, no auth, no DB, no Stripe. Design system already drafted in `DESIGN.md` (chapel / amethyst palette, Geist + Instrument Serif, shadcn-based). Greenfield SaaS layer on top.

## Decisions locked in


| Topic               | Choice                                                                                                                                                                                                               |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hosting shape       | Subpath in same Next.js app: `/onboarding` (onboarding), `/client-portal` (client), `/admin` (admin), normal website stays at `/`. **Top navigation is admin-only**; the client portal uses sidebar navigation only. |
| Auth                | **Clerk** — orgs primitive = client-companies; invite-gated signup                                                                                                                                                   |
| DB + ORM            | **Neon Postgres + Drizzle**                                                                                                                                                                                          |
| Webhook flow        | **Outbound webhooks + reconciliation poll** (both)                                                                                                                                                                   |
| Billing model       | **Stripe subscriptions + manual invoices** (mixed)                                                                                                                                                                   |
| Bank reconcile      | **Client uploads proof → admin approves**                                                                                                                                                                            |
| Access model        | **Binary now, schema designed to extend** to tiers/seats/features later                                                                                                                                              |
| Onboarding          | **Hybrid** — public signup gated by admin invite token                                                                                                                                                               |
| Product integration | **Shared SDK `@concolabs/billing-client`** (TS package)                                                                                                                                                              |
| Notifications       | **Email only via Resend** for v1                                                                                                                                                                                     |
| Clerk orgs          | **1 Clerk Organization ↔ 1 client company** (1:1). Memberships managed by Clerk's built-in UI.                                                                                                                       |
| Project creation    | **Either side can initiate.** Admin can create directly. Client can submit a project request → admin approves/rejects → becomes a real project.                                                                      |
| Multi-currency      | **Allowed end-to-end.** Currency stored per-invoice. FX snapshot captured at issue + at payment received. Reports default to org base currency.                                                                      |


## Architecture overview

```
                 ┌─────────────────────────────────────────┐
                 │  concolabs.com (Next.js 15 app router)  │
                 │                                         │
  marketing  →   │  /                                      │
  client portal  │  /client-portal/...      (Clerk-gated)            │
  admin panel    │  /admin/...    (Clerk role: admin)      │
                 │  /api/webhooks/stripe                   │
                 │  /api/webhooks/inbound/* (proofs etc)   │
                 │  /api/outbound/dispatch (cron worker)   │
                 └────────┬────────────────────────────────┘
                          │
                  Neon Postgres (Drizzle)
                          │
        ┌─────────────────┼──────────────────┐
        │                 │                  │
   Stripe API       Resend (email)      Outbound webhook
   (subs +          invoice issued,     dispatcher (signed
   payment links)   paid, failed,       HMAC, retries)
                    proof uploaded             │
                                               ▼
                                ┌──────────────┴──────────────┐
                                │  Product backends           │
                                │  BuildMonitor / Prelim /    │
                                │  Teres / custom             │
                                │                             │
                                │  install @concolabs/        │
                                │   billing-client            │
                                │   - verify signature        │
                                │   - cache access state      │
                                │   - /reconcile cron pull    │
                                └─────────────────────────────┘
```

## Data model (Drizzle, Postgres)

Schema lives in `src/server/db/schema/`. Tables (binary access now; nullable `plan/seats/features` columns reserved for later):

- **clients** — `id, clerk_org_id (unique), name, primary_contact_email, country, base_currency, created_at`. One per customer company. **1:1 with a Clerk Organization** — `clerk_org_id` is the source of truth for membership; this row carries the billing/profile metadata Clerk can't.
- **users** — mirror of Clerk users we care about: `id (clerk_user_id), email, name, role` (`client` | `admin`). Membership in a client comes from Clerk org membership, not a local table.
- **products** — catalogue: `id, slug, name, kind` (`saas` | `custom`), `webhook_url, webhook_secret`. Rows: buildmonitor, prelim, teres, plus custom per engagement.
- **project_requests** — `id, client_id, requested_by_user_id, label, product_id?, summary, status` (`pending|approved|rejected`), `reviewed_by_admin_id?, reviewed_at?, created_at`. Created by client; admin acts on it. On approve → spawns a `projects` row and links back via `project_id`.
- **projects** — instance of a product for a client: `id, client_id, product_id, label, status` (`active` | `suspended` | `pending`), `origin` (`admin_created|client_requested`), `source_request_id?`, `created_at`. Carries reserved `plan_tier, seat_count, feature_flags jsonb` (null for v1).
- **invoices** — `id, project_id, client_id, amount_cents, currency, fx_to_base_at_issue numeric?, due_date, status` (`draft|issued|paid|overdue|void`), `payment_method` (`stripe|bank_us|bank_lk|check`), `stripe_invoice_id?, notes, created_at`. `currency` is per-invoice; `fx_to_base_at_issue` snapshots client base_currency rate at issue time.
- **payments** — `id, invoice_id, amount_cents, currency, fx_to_base_at_received numeric?, method, status, evidence_url?, stripe_payment_intent_id?, recorded_by_admin_id?, recorded_at`. Payment currency may differ from invoice currency (e.g. USD invoice paid in LKR) — both FX snapshots persisted so reports can reconstruct realised value.
- **payment_proofs** — `id, invoice_id, uploaded_by_user_id, file_url, note, status` (`pending|approved|rejected`), `reviewed_by_admin_id?, reviewed_at?`.
- **stripe_subscriptions** — `id, project_id, stripe_customer_id, stripe_subscription_id, status, current_period_end`.
- **invites** — `id, email, client_id, token, role, expires_at, accepted_at?`.
- **outbound_events** — append-only event log: `id, type, payload jsonb, created_at`. Source of truth.
- **outbound_deliveries** — `id, event_id, product_id, url, attempt, status, last_response_status, next_retry_at`. Idempotent dispatch state.
- **audit_log** — `id, actor_user_id, action, target_type, target_id, meta jsonb, created_at`.

Event types emitted: `payment.succeeded`, `payment.failed`, `payment.refunded`, `invoice.issued`, `invoice.overdue`, `access.granted`, `access.revoked`. Access events are derived (computed from invoice/payment state) but emitted explicitly so products only need to listen to two: `access.granted` / `access.revoked`.

## Route plan

**Client portal (`/client-portal`)** — Clerk-gated, redirects unauth → `/sign-in`. Active Clerk org = client scope.

- `/client-portal` — overview: projects, outstanding invoices, recent payments.
- `/client-portal/projects/new` — submit a new project request (label, summa
- ry, optional product). Creates a `project_requests` row in `pending`.
- `/client-portal/projects/[id]` — project detail, access status, invoices, payment history.
- `/client-portal/requests` — list of submitted project requests + their status.
- `/client-portal/invoices/[id]` — invoice detail: pay-now (Stripe link), bank instructions (US/LK), upload-proof form.
- `/client-portal/billing` — payment methods, invoice history, download PDFs.
- `/client-portal/settings` — org profile + base currency, members (Clerk org UI), accept invites.

**Admin (`/admin`)** — gated by Clerk role `admin` via middleware.

- `/admin` — KPIs: MRR, overdue, pending proofs, pending project requests.
- `/admin/clients` — list + detail. From client detail: create project directly, generate invite. Creating a client provisions a Clerk Organization and links it via `clerk_org_id`.
- `/admin/requests` — queue of client-submitted project requests → approve (spawns project, sets `origin=client_requested`) or reject.
- `/admin/projects` — global list, filter by product/status/origin. Per-row: grant/revoke access button (writes outbound event).
- `/admin/invoices` — list, create invoice (amount, currency, due, method), mark paid, void.
- `/admin/proofs` — queue of pending bank-proof uploads → approve/reject.
- `/admin/products` — catalogue, webhook URL + secret rotation.
- `/admin/webhooks` — outbound delivery log + retry button.

**API**

- `/api/webhooks/stripe` — Stripe event ingestion (sub status, invoice paid, payment_failed).
- `/api/trpc/[trpc]` — all app logic (existing endpoint, extended with new routers).
- `/api/outbound/dispatch` — cron-invoked worker that drains `outbound_deliveries` with backoff.
- `/api/outbound/reconcile` — endpoint products can call to pull current access state (safety net for missed events).

## Shared SDK — `@concolabs/billing-client`

Separate repo, published to npm (or private registry). Each product backend installs it.

Exports:

- `verifyWebhook(req, secret)` — HMAC-SHA256 signature check + replay-window guard (5 min).
- `createHandler({ onAccessGranted, onAccessRevoked, onPaymentSucceeded?, ... })` — typed dispatcher.
- `accessClient({ baseUrl, productSecret })` — `getAccess(projectId)` for the reconciliation poll.
- Zod-typed event payloads matching `outbound_events.type`.

Ship the SDK alongside M1 with BuildMonitor as first consumer to prove the contract.

## Milestone 1 (all-in scope)

1. **Foundation**
  - Add Clerk: `@clerk/nextjs`, env vars, middleware, `<ClerkProvider>` in root layout.
  - Add Drizzle + Neon: `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`. Wire `src/server/db/index.ts`. Add schema files. First migration.
  - Add Stripe SDK + Resend SDK.
  - Extend `src/env.js` with: `DATABASE_URL`, `CLERK`_*, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `OUTBOUND_WEBHOOK_SIGNING_KEY`, `APP_URL`.
2. **Auth + shells + project model**
  - Route groups: `(marketing)`, `(app)`, `(admin)`.
  - Sign-in/sign-up routes with Clerk; signup gated by `?invite=` token validated against `invites` table.
  - Admin gating middleware: check Clerk `publicMetadata.role === 'admin'`.
  - Client list / project list / project detail screens (read-only first).
  - Reuse `src/components/ui/`* shadcn primitives, repainted per `DESIGN.md` tokens.
3. **Invoices + bank-proof flow**
  - Admin: create invoice form (project, amount, currency, due date, method, notes).
  - Client: invoice detail with bank instructions block (per method) + upload-proof form (Vercel Blob or S3).
  - Admin: `/admin/proofs` queue → approve writes a `payments` row, marks invoice paid, emits `payment.succeeded` + (if first paid invoice on project) `access.granted`.
  - Email via Resend on: invoice issued, proof uploaded (admin), invoice paid (client).
4. **Stripe subscriptions + webhook ingestion**
  - Admin can attach a Stripe price/subscription to a project. Creates Stripe customer if absent, subscription on confirm.
  - `/api/webhooks/stripe` verifies signature, handles: `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`, `customer.subscription.updated`. Each writes through to our `invoices/payments/stripe_subscriptions` tables and enqueues outbound events.
5. **Outbound webhooks + BuildMonitor integration**
  - `outbound_events` insert is the *only* way access changes; a single transaction writes the event with the access state change.
  - Dispatcher worker (`/api/outbound/dispatch`) cron every 1 min: pulls due deliveries, POSTs with HMAC header `X-Concolabs-Signature: t=<ts>,v1=<hex>`, exponential backoff up to 24h, dead-letter after N attempts.
  - Build `@concolabs/billing-client` v0.1.
  - BuildMonitor: install SDK, add `POST /webhooks/concolabs` handler, add nightly reconcile job calling `/api/outbound/reconcile`.

## Verification

End-to-end happy paths to walk through before calling M1 done:

1. **Bank-transfer happy path**
  - Admin creates client + project + invoice (method=bank_us, amount=$1234).
  - Client gets invite email, signs up via invite token, lands in `/client-portal`.
  - Client opens invoice, sees US bank instructions, uploads proof PDF.
  - Admin sees proof in queue, approves → invoice goes `paid`, `payment.succeeded` + `access.granted` events written.
  - Dispatcher delivers to BuildMonitor's `/webhooks/concolabs`; BuildMonitor flips access flag locally.
  - Client opens BuildMonitor and is in.
2. **Stripe subscription happy path**
  - Admin attaches Stripe price to a project. Client gets Stripe checkout link.
  - Client pays. Stripe webhook → invoice row + `payment.succeeded` + `access.granted` emitted → product enabled.
  - Simulate `invoice.payment_failed` (Stripe CLI `trigger`) → `payment.failed` + (after grace period) `access.revoked` → product blocks user.
3. **Reconciliation**
  - Kill outbound dispatcher mid-flow, change access state in central, restart product reconcile cron — product converges to central state within one cycle.
4. **Webhook signature**
  - Tamper with payload, ensure SDK `verifyWebhook` rejects. Replay an old event (>5 min) — rejected.
5. **Authorization**
  - Client A cannot read Client B's invoices via direct tRPC call (verify row-level checks in routers).
  - Non-admin user hitting `/admin/`* → redirected.

Run locally with: `pnpm dev` + `stripe listen --forward-to localhost:3000/api/webhooks/stripe` + `pnpm drizzle-kit push` against a Neon dev branch.

## Out of scope for M1 (call out, defer)

- Tiered plans / seats / feature flags (schema reserved, UI deferred).
- In-app + Slack notifications (email only in M1).
- Prelim / Teres integrations (BuildMonitor first to prove SDK).
- Invoice PDF generation (link-based for M1; PDF later).
- Self-serve plan changes by clients.
- Cross-currency reporting rollups beyond the per-invoice FX snapshots (snapshots are stored; consolidated dashboards land later).
- Tax / VAT logic.

## Open items worth deciding before code starts

- File storage for proofs: Vercel Blob vs S3 vs Supabase Storage (Vercel Blob simplest if Vercel-hosted).
- Cron host: Vercel Cron vs external (Upstash QStash / GitHub Actions). Vercel Cron fine for M1 cadence.
- Monorepo for SDK or separate repo: separate repo simpler short-term; pnpm workspace later if churn justifies it.

