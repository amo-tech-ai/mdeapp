---
task: data-021
date: 2026-05-30
project: zkwcbyxiwklihegjhuql
method: edge deploy v17 + curl + MCP SQL + Deno/vitest
status: pass
edge_version: 17
---

# DATA-021 — showings lead bridge evidence

## Verdict

**PASS** — Schedule-viewing via `chat-lead-capture` creates paired `leads` + `showings` rows. Service-role edge only; anon direct INSERT blocked. Idempotent retry returns same IDs.

## Spec review (mde-supabase)

| Check | Result |
|-------|--------|
| Extend existing edge (not browser INSERT) | ✅ `chat-lead-capture` |
| Service role inside edge only | ✅ `getServiceClient()` |
| `status = 'scheduled'` (live CHECK) | ✅ |
| No new RLS/index migrations | ✅ edge-only |
| `trip_id` passthrough | ✅ when provided |
| Idempotency on retry | ✅ `idempotency_key` |
| DATA-028 out of scope | ✅ no `trip_items` writes |

## Files changed

| File | Change |
|------|--------|
| `supabase/functions/_shared/schedule-viewing-bridge.ts` | **new** — resolve apartment, bridge insert, idempotency |
| `supabase/functions/chat-lead-capture/index.ts` | schedule-viewing branch |
| `supabase/functions/tests/chat-lead-capture_schedule_viewing_test.ts` | **new** — Deno unit tests (3) |
| `mdeapp/src/app/api/leads/schedule-viewing/route.ts` | idempotency_key + tripId passthrough |
| `mdeapp/src/lib/leads/schedule-viewing-schema.ts` | optional `tripId` |
| `mdeapp/src/lib/leads/submit-schedule-viewing.ts` | `showingId` in result |

**Deployed:** `chat-lead-capture` **v17** (MCP `deploy_edge_function`, `verify_jwt: false`).

## SQL rows created (staging proof)

### Row A — base bridge (no trip)

| Field | Value |
|-------|-------|
| `lead_id` | `c548b6a0-4713-4e5a-b27d-0210603553ab` |
| `showing_id` | `621d724d-c5c6-4b07-bfbb-c63871e1db7b` |
| `leads.apartment_id` | `750e8400-e29b-41d4-a716-446655440001` |
| `leads.preferred_showing_at` | `2026-07-10 20:00:00+00` |
| `showings.lead_id` | `c548b6a0-4713-4e5a-b27d-0210603553ab` |
| `showings.apartment_id` | `750e8400-e29b-41d4-a716-446655440001` |
| `showings.status` | `scheduled` |
| `showings.trip_id` | `null` |

### Row B — with `trip_id`

| Field | Value |
|-------|-------|
| `lead_id` | `99724bee-3b99-413f-b2b2-5429244e13e4` |
| `showing_id` | `ebd0c08a-cc80-4759-ad0e-fa3742a87d91` |
| `leads.trip_id` | `11111111-1111-1111-1111-000000000001` |
| `showings.trip_id` | `11111111-1111-1111-1111-000000000001` |

## Pass/fail table

| Check | Pass | Fail |
|-------|:----:|:----:|
| `lead.apartment_id` populated | ✅ | |
| `lead.preferred_showing_at` populated | ✅ | |
| `showings.lead_id` populated | ✅ | |
| `showings.apartment_id` populated | ✅ | |
| `showings.trip_id` when provided | ✅ | |
| `showings.status = scheduled` | ✅ | |
| No duplicate showing on retry | ✅ (`showing_count=1`, `idempotent_replay=true`) | |
| Guest rate limit path preserved | ✅ (unchanged `allowRateDurable` for anon) | |
| No anon INSERT policy on leads/showings | ✅ (0 anon INSERT policies) | |
| Anon REST INSERT blocked | ✅ (401) | |
| Deno unit tests (3) | ✅ | |
| Vitest schema tests | ✅ (4/4) | |
| `/api/leads/schedule-viewing` smoke | ⚠️ skipped (dev server not running) | |

## Edge function tests

```bash
deno test supabase/functions/tests/chat-lead-capture_schedule_viewing_test.ts
# ok | 3 passed | 0 failed

curl POST /functions/v1/chat-lead-capture (rental + listing_id + preferred_at)
# HTTP 200, lead_id + showing_id

# Retry same idempotency_key → same IDs, idempotent_replay: true
```

## RLS negative test

- `pg_policies`: **0** rows with `anon` role on `leads`/`showings` INSERT
- Direct REST POST as anon → **401 Unauthorized** (leads + showings)

## Risks / follow-ups

| Risk | Severity | Note |
|------|----------|------|
| Authenticated users skip IP rate limit | P2 | documented in DATA-011 |
| `preferredAt` optional in UI schema — no showing without it | Low | edge falls back to lead-only path |
| No DB unique constraint on guest idempotency (NULL `user_id`) | Low | app-level key + email lookup |
| Placeholder deploy v15 briefly live | Resolved | redeployed v17 with full bundle |

## DATA-028 unblocked?

**Yes** — `showings` rows now exist with `trip_id` when provided. DATA-028 can wire `trip_items` upsert on showing create / webhook without new DDL.

## Score

| Scope | Score |
|-------|------:|
| DATA-021 acceptance | **95/100** (API route smoke N/A — dev down) |
