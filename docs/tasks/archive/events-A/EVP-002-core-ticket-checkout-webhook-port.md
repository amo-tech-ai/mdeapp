---
id: EVP-002-core
legacy_id: EVT-01
title: Port ticket-checkout + ticket-payment-webhook to mdeapp (PR-4)
status: Done
priority: P0
phase: MVP — O1 paid ticket
effort: 4-6h
depends_on: [EVP-003-core, F08]
blocks: [F44]
skill: [mde-stripe, mde-supabase, supabase-edge-functions]
prd_ref: plan/prd/05-events-ticketing.md
index_ref: index.md §7 PR-4 · github/events/Hi.Events (patterns only)
verified_against:
  - /home/sk/mde/supabase/functions/ticket-checkout/
  - /home/sk/mde/supabase/functions/ticket-payment-webhook/
  - /home/sk/mdeai/github/events/Hi.Events/ (UX patterns only — AGPL no copy)
---

# EVP-002-core — Ticketing edge port (MVP O1)

## 1. Purpose

**Andrés** pays one real ticket: `event_orders.status = paid`. Legacy edges exist under `/home/sk/mde/supabase/functions/`; **mdeapp has no `supabase/functions/` tree yet**. Port checkout + webhook with signature verification and idempotency.

## 2. Goals

- `mdeapp/supabase/functions/ticket-checkout/`
- `mdeapp/supabase/functions/ticket-payment-webhook/`
- Stripe test payment → paid row
- **Redirect via Checkout `success_url`** — webhook does NOT redirect user ([`plan/diagrams/05`](../../plan/diagrams/05-camila-buy-ticket.md))
- EVP-003-core separate webhook secrets verified before prod keys

## 3. Pattern sources

| Source | Use |
|--------|-----|
| Legacy edge fns | **Port** implementation |
| `github/events/Hi.Events` | Tier + QR **patterns only** |
| Stripe skill | Webhook signing |

## 4. Acceptance criteria

1. Test checkout session creates pending `event_order`.
2. Webhook with test signature sets `status = paid` idempotently.
3. Duplicate webhook does not double-charge row.
4. Evidence: SQL query + Stripe CLI log in `tasks/notes/EVP-002-core-evidence.md`.
