---
title: Supabase plan audit verdict
date: 2026-05-26
reviewed_against:
  - tasks/data/audit-supabase.md
  - tasks/data/supabase-plan.md
  - tasks/data/plan/prompt.md
methodology: MCP re-verify (list_tables, execute_sql, get_advisors, list_edge_functions) + disk read of edge fn source
project_id: zkwcbyxiwklihegjhuql
verdict_plan_score: 84/100
verdict_db_readiness: 76/100
skills: [mde-supabase, mde-task-lifecycle, task-verifier]
---

# Supabase audit verdict — plan review

**Overall: 84/100 correct** (plan quality). Live DB readiness remains **76/100** until migrations ship.

The plan is strong and practical: reuse the existing project, small targeted migrations, no 100-table rebuild, Stripe as payment truth, AI propose-only.

**Canonical live audit:** [`../audit-supabase.md`](../audit-supabase.md)  
**Implementation plan:** [`../supabase-plan.md`](../supabase-plan.md)

---

## MCP verification (2026-05-26)

| Claim | Verified | Source |
|---|---|---|
| 100 public tables, 99 RLS-on | ✅ | `execute_sql` on `pg_class` |
| Only `spatial_ref_sys` RLS off | ✅ | policy count query |
| `venue_booking_requests` absent | ✅ | `information_schema.tables` |
| Duplicate HNSW (3 tables × 2) | ✅ | `pg_indexes` |
| No `apartments(price_daily)` index | ✅ | `pg_indexes` + `search-rentals.ts` |
| `ticket-payment-webhook` uses Stripe sig + idempotency | ✅ | `supabase/functions/ticket-payment-webhook/index.ts` |
| `chat-lead-capture` anon rate limit 20/hr/IP | ✅ | `allowRateDurable` in edge source |
| 80+ `function_search_path_mutable` WARNs | ✅ | Supabase security advisor (no ERROR-level RLS gaps) |
| Restaurants 44/44 with `google_place_id` | ✅ | live count |

---

## What is correct

| Area | Verdict |
|---|---|
| Reuse existing Supabase project | ✅ Correct |
| Keep Stripe as payment truth | ✅ Correct |
| Keep AI propose-only | ✅ Correct |
| No anon writes to `leads` (edge + service_role only) | ✅ Correct |
| Add `venue_booking_requests` (M1) | ✅ Correct — **not yet migrated** |
| Add `venue_anchors` (M2) | ✅ Correct — **not yet migrated** |
| Add `price_daily` rental indexes (M3) | ✅ Correct — **not yet migrated** |
| Drop duplicate HNSW (VEC-001) | ✅ Correct — plan only |
| Defer unified `semantic_embeddings` | ✅ Correct |
| Defer `trip_days` | ✅ Correct for MVP |
| `(SELECT auth.uid())` in new RLS | ✅ Matches mde-supabase skill |

---

## Corrections to prior draft

| Prior claim | Correction |
|---|---|
| 🔴 Stripe webhook "must be verified, not assumed" as **missing** | **Overstated.** `ticket-payment-webhook` already implements `constructEventAsync`, raw body, `idempotency_keys` dedupe. Remaining work is **EVP-003** (secret isolation evidence + dashboard config), not greenfield implementation. |
| 🔴 Guest lead `verify_jwt=false` = critical with no protection | **Partially wrong.** Anon path has **durable rate limit** (`20`/hour/IP). Still add abuse logging + optional Turnstile (P1), not P0 blocker. |
| 🔴 80+ search_path = Critical before MVP data seeds | **Severity high, not launch blocker** for read-heavy MVP with 44 listings. Batch fix in **data-010** before scaling writes / new SECURITY DEFINER RPCs. |
| Plan score 82 vs DB score 76 | **Both valid** — plan scores architecture direction; DB scores current executable readiness. |

---

## Red flags · blockers · failure points

### P0 — ship before venue booking UX

| ID | Severity | Issue | Fix task |
|---|---|---|---|
| DATA-B1 | 🔴 | `venue_booking_requests` missing | [data-009](../tasks/data-009-schema-migrations-m1-m3.md) |
| DATA-B2 | 🔴 | No café/nightclub catalog table | data-009 M2 + [data-003](../tasks/data-003-cafe-seed.md) / [data-005](../tasks/data-005-nightclub-seed.md) |
| DATA-B4 | 🟠 | Missing `price_daily` indexes | data-009 M3 |

### P1 — hardening (parallel, not blocking seeds)

| ID | Severity | Issue | Fix task |
|---|---|---|---|
| DATA-R3 | 🟠 | 80+ mutable `search_path` on functions | [data-010](../tasks/data-010-postgres-search-path-hardening.md) |
| DATA-R5 | 🟠 | Duplicate HNSW indexes | [VEC-001](../../vector/VEC-001-pgvector-inventory-and-duplicate-index-plan.md) |
| EVP-003 | 🟠 | Stripe webhook **secret** audit (implementation exists) | [EVP-003](../../events/EVP-003-core-stripe-webhook-secret-audit.md) |
| DATA-R-ABUSE | 🟡 | Guest lead spam beyond IP rate limit | [data-011](../tasks/data-011-edge-hardening-evidence.md) |

### P2 — product / ops

| Issue | Notes |
|---|---|
| Low inventory (44 rentals/restaurants) | Seed tasks data-003–005; not schema |
| 47 edge functions | Freeze matrix in data-011 |
| Duplicate embedding RLS policy names | Cleanup with VEC-001 |

---

## Webhook trust (verified on disk)

Required controls — **status today:**

```text
raw body verification          ✅ constructEventAsync(body, sig, secret)
Stripe-Signature verification  ✅
idempotency key (event.id)     ✅ idempotency_keys table
order status transition guard  ✅ ticket_payment_finalize RPC (single txn)
event replay protection        ✅ idempotency upsert → 200 no-op
```

**Remaining:** EVP-003 proves ticket vs sponsor secrets are distinct and dashboard endpoints match deployed fns.

Ref: [Supabase Stripe webhooks guide](https://supabase.com/docs/guides/functions/examples/stripe-webhooks)

---

## AI write boundaries

Correct rule:

```text
AI suggests → user approves → edge/server commits
```

Do not let Mastra, CopilotKit, ADK, or OpenClaw directly update:

```text
event_orders, event_attendees, payments, bookings, votes, outreach sends
```

---

## Section scores (plan quality)

| Section | Score |
|---|---:|
| Architecture principles | 92/100 |
| CORE/MVP separation | 90/100 |
| RLS strategy | 86/100 |
| Stripe/payment design | 88/100 (↑ after disk verify) |
| Venue data plan | 88/100 |
| Real estate plan | 82/100 |
| Trips plan | 78/100 |
| AI/Mastra boundaries | 90/100 |
| OpenClaw/WhatsApp safety | 84/100 |
| Production hardening | 74/100 (↑ rate limit found; search_path still open) |

**Final plan score: 84/100**

---

## Critical fix order (updated)

```text
1. data-001 ✅ inventory → audit-supabase.md (mark Done after evidence link)
2. data-002 catalog contract
3. data-009 M1+M2+M3 migrations (venue_booking_requests, venue_anchors, price_daily indexes)
4. VEC-001 drop duplicate HNSW
5. data-003/004/005 seeds (parallel after 002+009 M2)
6. data-007 cache audit → data-008 backfill cron
7. data-010 search_path batch (P1, before new RPCs)
8. EVP-003 webhook secret evidence (P1, not re-implement webhook)
9. data-011 edge freeze matrix + guest-lead abuse audit
10. Evidence SQL in every migration PR
```

---

## Migration checklist (mde-supabase)

Every new table:

```sql
ALTER TABLE ... ENABLE ROW LEVEL SECURITY;
-- policies with (SELECT auth.uid()) not bare auth.uid()
```

Every user-owned table:

```sql
user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL  -- or CASCADE per domain
```

Every payment/order table (already on `event_orders`):

```sql
idempotency_key, stripe_event_id (via idempotency_keys), status, timestamps
```

Every SECURITY DEFINER function:

```sql
SET search_path = public;  -- per supabase-database-functions.md
```

Ref: [Supabase database advisors — search_path](https://supabase.com/docs/guides/database/database-advisors?lint=0011_function_search_path_mutable)

---

## Final recommendation

**Do not** rebuild the database. **Do not** add 100 tables. **Do not** re-implement Stripe webhooks.

**Do** ship:

```text
data-009  M1 + M2 + M3 migrations
VEC-001   duplicate HNSW cleanup
data-010  search_path hardening batch
data-011  edge freeze + abuse evidence
EVP-003   webhook secret proof (events track)
```

Expected readiness: **76 → 88/100** after data-009 + VEC-001.

---

## New tasks created from this review

| ID | Title |
|---|---|
| [data-009](../tasks/data-009-schema-migrations-m1-m3.md) | Schema migrations M1–M3 |
| [data-010](../tasks/data-010-postgres-search-path-hardening.md) | Postgres search_path batch |
| [data-011](../tasks/data-011-edge-hardening-evidence.md) | Edge freeze + guest-lead abuse audit |
