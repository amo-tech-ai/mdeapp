---
id: MAP-005
title: places-proxy edge + places_cache + RLS
status: Not Started
priority: P1
phase: Post-MVP — cost-safe Places at scale
effort: 4-6h
owner: claude
depends_on: [MAP-004]
blocks: [MAP-006, MAP-010]
skill: [mde-maps, mde-supabase, mde-task-lifecycle, testing]
prd_ref: ../../plan/maps/maps-prd.md §8 step 5
draft_sources:
  - ../../drafts/tasks/mastra/maps/tasks/places/025-place-cache-schema-ttl.md
  - ../../drafts/tasks/mastra/maps/tasks/places/020-place-details-enrichment.md
  - ../../drafts/tasks/mastra/maps/tasks/places/027-place-details-cache-enrichment.md
  - ../../drafts/tasks/mastra/maps/diagrams/04-places-api-architecture.md
verified_docs:
  - https://developers.google.com/maps/documentation/places/web-service/usage-and-billing
  - .claude/skills/mde-maps/references/places-api-new.md
verified_against:
  - /home/sk/mdeai/github/maps/google-maps-services-js/
  - /home/sk/mdeai/mdeapp/src/mastra/lib/google-places-client.ts
---

# MAP-005 — Places proxy + cache

## At a glance

**Description:** Put all Places API traffic behind a **Supabase edge function** with a **cache** — same query twice should not bill Google twice.

**Purpose:** At scale, **Camila**’s repeat searches and **Roberto**’s venue lookups need cost control and auditability. The server key stays off the phone; RLS protects cache tables.

**Goals:**
- `places-proxy` edge routes: search, details, nearby, autocomplete (as needed).
- Cache tables with TTL (search ~1–3 days, details ~1–2 weeks).
- RLS: users read where allowed; only edge/service role writes.
- Mastra tools call the edge URL, not Google directly from the browser.

**Features:**
| Who | What they get |
|-----|----------------|
| **Camila** | “Coworking near Laureles” twice in one session → cache hit. |
| **Roberto** | Venue details fetched once, reused in the wizard. |
| **Patricia** | Logs + cache rows to investigate spend spikes. |

> **Draft port:** PLACES-003, PLACES-005–010, PLACES-011–013 (photo edge optional same PR or follow-on).  
> **Roberto / Camila impact:** every Places (New) call goes through Supabase edge with logged field masks — duplicate queries hit cache instead of billing twice.

## 1. Purpose

Server-only **Places API (New)** access for mdeapp: edge function `places-proxy` wraps MAP-004 `google-places-client.ts`, persists responses in Supabase with TTL, and enforces RLS so browsers never hold `GOOGLE_MAPS_API_KEY`.

## 2. Goals

**Cache DDL — already applied (do not re-ship in MAP-005):**

| Table | Migration | Status |
|-------|-----------|--------|
| `places_search_cache` | `20260515043737_places_cache_schema.sql` | ✅ live |
| `place_details_cache` | same + `20260520120000_place_details_cache_map018e.sql` | ✅ live |
| `grounded_places_cache` | Optional write-through from MAP-002 | ❌ defer |

**MAP-005 scope = edge function + mdeapp read-through only** — wire Mastra/API routes to cache; ADK sidecar already writes `place_details_cache`.

Each table: RLS enabled, service_role policies, TTL on `expires_at` — **verify**, do not recreate.

**Deferred to follow-on tasks (do not block MAP-005 Done):**

| Table | Owner task |
|-------|------------|
| `rental_nearby_context` | [**MAP-006**](./MAP-006-nearby-search.md) |
| `restaurant_profiles` | [**MAP-004**](./MAP-004-places-grounding-clients.md) §11 |
| `venue_intelligence` | [**MAP-010**](./MAP-010-place-autocomplete-venue.md) |
| `neighborhood_intelligence` | [**MAP-012**](./MAP-012-neighborhood-intelligence.md) |
| `agent_tool_logs` | Optional — add when Patricia needs spend audit beyond edge logs |

- `supabase/functions/places-proxy/index.ts` — routes: `searchText`, `getPlace`, `searchNearby`, `autocomplete` (subset per call site)
- Every outbound request logs `X-Goog-FieldMask` + endpoint name (structured log or `ai_runs` metadata)
- Migration tables (names may match legacy draft):
  - `places_search_cache` — `query_hash`, `location_key`, `payload` jsonb, `expires_at`
  - `place_details_cache` — `place_id` PK, `payload`, `place_uri`, `expires_at`
- RLS: **SELECT** authenticated where product needs; **INSERT/UPDATE** service role / edge only
- TTL defaults: search/nearby **24–72h**; details **7–14d** (document in migration comment)
- Vitest or Deno smoke: second identical request returns cache hit (mock clock or `expires_at` in future)
- Read path in Mastra tools uses edge URL + user JWT (never raw Places SDK from browser)

## 3. Features (personas)

| Persona | Effect |
|---------|--------|
| **Camila** | Repeated “coworking near Laureles” queries cost one Places bill per TTL window. |
| **Roberto** | Venue details for event wizard fetched via proxy before **MAP-010** autocomplete UI. |
| **Patricia** | Cache tables + logs auditable for spend spikes. |

## 4. Workflows

**Reference:** [`github/maps/google-maps-services-js`](../../github/maps/google-maps-services-js/) — server Places/Routes call patterns for edge `places-proxy` (do not expose keys to browser).

1. **Pre-flight:** Read field-mask checklist [`docs/places-mask-checklist.md`](./docs/places-mask-checklist.md) — wire minimum masks per endpoint.
2. **Verify migration:** `places_search_cache` + `place_details_cache` already exist — confirm RLS + policies (no new DDL unless gap found).
3. **Edge function:**
   - Request schema: `operation`, `query`, `locationBias`, `fieldMask` (**allowlist** — reject unknown masks).
   - Reuse `supabase/functions/_shared/rate-limit.ts` where applicable.
   - JWT verify session; cache key = hash(operation + params + mask).
   - On miss: call MAP-004 client logic (inline or shared module); log mask + endpoint.
   - `mdeapp/src/mastra/lib/places-proxy-client.ts` — server-only caller to edge URL (not browser).
4. **Cache key design:** Hash normalized query + location bias for search; `place_id` for details.
5. **Cleanup:** On-read filter `expires_at < now()` OR weekly cron (document choice in PR).
6. **Optional follow-on:** `place-photo` edge for photo media URLs (**PLACES-012–013**) — same PR only if ≤1 day extra.

**Local test:**

```bash
cd /home/sk/mdeai && supabase functions serve places-proxy --env-file .env.local
curl -X POST "$SUPABASE_URL/functions/v1/places-proxy" \
  -H "Authorization: Bearer $USER_JWT" \
  -H "Content-Type: application/json" \
  -d '{"operation":"searchText","query":"café Laureles","fieldMask":"places.id,places.displayName,places.location"}'
```

## 5. Acceptance criteria

1. `places-proxy` deploys; Deno typecheck clean.
2. RLS policies verified on existing cache tables; negative test documented (anon cannot write cache).
3. Duplicate `searchText` within TTL → no second Google call (prove via log flag or test mock).
4. `mdeapp` reads/writes cache via edge — not direct Google bypass on repeat queries.
5. No `GOOGLE_MAPS_API_KEY` in `mdeapp/src/**/*.tsx` client bundles.
6. Field mask on every code path (grep fails CI if raw client without mask — optional hook).
7. `npm run floor` green (mdeapp); edge verify per `mde-supabase` skill if wired.

## 6. Verification checklist (100% Done gate)

> [`VERIFICATION-CHECKLIST.md`](./VERIFICATION-CHECKLIST.md) · Evidence: [`MAP-005-evidence.md`](../notes/MAP-005-evidence.md).

### Shared gates

- [ ] G1–G8 complete

### Edge + DB

- [ ] `supabase/functions/places-proxy` Deno typecheck / deploy succeeds
- [ ] Migration: `places_search_cache` + `place_details_cache` — **RLS verified** (DDL pre-applied)
- [ ] Policy test: anon **cannot** INSERT cache rows (document SQL or test)
- [ ] Duplicate `searchText` within TTL → cache hit (log flag or test mock — no second Google call)
- [ ] Every proxy route logs endpoint name + field mask used

### Security

- [ ] `rg "GOOGLE_MAPS_API_KEY" mdeapp/src/components mdeapp/src/app` → 0
- [ ] Mastra tools use edge URL + auth — not raw SDK from browser
- [ ] Playwright/e2e: browser never POSTs to `places.googleapis.com` (see `e2e/maps-grounding.spec.ts`)
- [ ] Repeated Place Details within TTL → cache hit (integration test)
- [ ] Anon cannot INSERT into cache tables (RLS negative SQL)

### Field masks

- [ ] Every proxy route logs `X-Goog-FieldMask` header value
- [ ] Vitest: `google-places-client.test.ts` still green after proxy wiring

### Production safety

- [ ] `PLACES_PROXY_DEV_FALLBACK` (or equivalent) **off** on Vercel — prod fails closed if edge down

## 7. Failure points & security (ex-MAIC-006)

| Risk | Mitigation |
|------|------------|
| Service role in `mdeapp/src` | **P0 violation** — edge + migrations only |
| RLS missing on cache tables | Run `get_advisors` after migrate |
| Cache miss storm | Per-user rate limit on edge |
| Public edge without auth | JWT + rate limit required |

## 8. Rollback

Drop tables via down migration; edge returns 503. Dev-only direct MAP-004 fallback behind explicit `PLACES_PROXY_DEV_FALLBACK=1`; **production must fail closed** if edge unavailable.

## 9. Out of scope

- Browser Places SDK
- `generativeSummary` for Colombia
- Neighborhood rollups (**MAP-012** / INTEL-046)
- Host autocomplete UI (**MAP-010**)

## 10. Definition of Done

AC §5 + **§6 verification checklist** + evidence. Commit: `feat(supabase): places-proxy + cache tables (MAP-005)`.
