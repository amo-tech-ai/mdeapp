---
title: Testing audit summary
date: 2026-05-27
dev: localhost:3001
base_sha: f37291d
---

# TESTING-AUDIT-SUMMARY — 2026-05-27

## Tests created / updated

| Asset | Action |
|-------|--------|
| `tasks/testing/scripts/chat-smoke.mjs` | Extended: rentals API, places detail 400s, unique IDs, timing WARN >2500ms |
| `tasks/testing/scripts/mastra-routing-smoke.mjs` | **New** — vitest classifiers + API fast paths |
| `tasks/testing/scripts/maps-smoke.mjs` | **New** — lat/lng + event geo backing |
| `tasks/testing/02-rental-search-smoke.md` | **New** |
| `tasks/testing/04-rich-card-dedup-smoke.md` | **New** |
| `tasks/testing/05-mastra-copilot-routing-smoke.md` | **New** |
| `tasks/testing/06-map-pin-sync-smoke.md` | **New** |
| `tasks/testing/07-supabase-data-smoke.md` | **New** |
| `tasks/testing/08-response-quality-rubric.md` | **New** |
| `tasks/testing/INDEX.md` | Updated |

No new Playwright specs added — existing SCREEN-005/006/021 + rich-card-dedup exercised.

## Baseline (STEP 1)

| Check | Result |
|-------|--------|
| Dev port | **3001** |
| GET / | **200** (~98ms) |
| chat-smoke | **PASS** (1 WARN: rentals 2674ms) |
| typecheck | **PASS** |
| unit tests | **305/305 PASS** |

Evidence: [`baseline-RESULTS.md`](./baseline-RESULTS.md)

## Pass / fail matrix

| Pack / PR bucket | Automated | Playwright | Browser spot | PR ready? |
|------------------|-----------|------------|--------------|-----------|
| **PR-F C-008** copilotkit | typecheck PASS | n/a | n/a | **YES** |
| **PR-F C-009** dedup | maps PASS | rentals+cafés PASS, **events FAIL** | n/a | **YES** (exclude events e2e) |
| **PR-A rentals** | API PASS (WARN slow) | SCREEN-005 **3/3** | 5 cards, 0 resultsCol | **YES** localhost — **NOT Done** (prod 404) |
| **PR-B cafés** | routing vitest PASS | SCREEN-021 **5/5**, maps-grounding **1/1** | not full CDP | **YES** |
| **PR-C events** | API PASS | SCREEN-006 **FAIL**, dedup events **FAIL** | Show-all → map list only | **NOT READY** |
| **Mastra routing** | mastra-routing **PASS** | — | partial | **YES** (unit level) |
| **Supabase** | MCP: 44 apts, RLS on | — | — | **YES** (read-only) |
| **Prod rentals** | — | — | POST → **404** | **BLOCKED** |

## Broken features

1. **Event fast-path** — no inline `[data-testid="event-card"]`; map side list only → SCREEN-006 + rich-card-dedup events fail.
2. **Prod `/api/rentals/search`** — **404** on https://www.mdeai.co/
3. **Dev hydration overlay** — React hydration warning on `/` (non-blocking for rentals).

## Slow responses

| Endpoint | ms | Limit |
|----------|---:|-------|
| POST `/api/rentals/search` | **2674** | WARN >2500ms |
| POST `/api/events/search` any | 1840 | OK |
| CopilotKit empty POST | 11–623 | OK |

## Agent routing

| Check | Result |
|-------|--------|
| `canFastPathRentalSearch` vitest | **PASS** |
| `canFastPathEventSearch` vitest | **PASS** |
| Café grounding filters vitest | **PASS** |
| Rental → events hijack (PR #7) | **PASS** in unit tests |

## Supabase / data

- **44** `apartments` rows; RLS enabled on `apartments` + `events`.
- Rental API returns `source: supabase`, 5 Laureles rows with valid lat/lng.

## Map / pins

- API: 5/5 rentals geocoded; 10/10 events have mapsUrl/sourceUrl.
- Playwright: rental pin sync **PASS**; café map sync **PASS**.

## Recommended fixes (priority)

1. **C-013** — `EventFastPathPanel` + inline `EventCard` (unblocks SCREEN-006).
2. **Deploy** `mdeapp` so prod `/api/rentals/search` returns 200.
3. **Investigate** rental search latency (~2.7s) — index/query warm-up.
4. **Optional** — fix dev hydration warning in `layout.tsx`.

## PR readiness

| PR | Ready? |
|----|--------|
| PR-F dedup (C-009) | **YES** |
| PR-A rentals (C-010/011) | **YES** (localhost); deploy before Done |
| PR-B cafés (C-012) | **YES** |
| PR-C events (C-013) | **NO** |
| PR-D docs | **YES** (parent repo paths) |

## Evidence index

| File |
|------|
| [baseline-RESULTS.md](./baseline-RESULTS.md) |
| [mastra-routing-RESULTS.md](./mastra-routing-RESULTS.md) |
| [maps-RESULTS.md](./maps-RESULTS.md) |
| [rental-search-RESULTS.md](./rental-search-RESULTS.md) |
| [event-discovery-RESULTS.md](./event-discovery-RESULTS.md) |
| [cafe-detail-RESULTS.md](./cafe-detail-RESULTS.md) |
| [rich-card-dedup-RESULTS.md](./rich-card-dedup-RESULTS.md) |
| [supabase-data-RESULTS.md](./supabase-data-RESULTS.md) |
| [response-quality-RESULTS.md](./response-quality-RESULTS.md) |

## Skills / docs consulted

- `tasks/testing/00-agent-testing-mandate.md`
- `.agents/skills/mde-maps`, `mde-supabase`, `mastra`, `copilotkit-integrations`, `testing`
- `mastra-smoke-test`, `javascript-testing-patterns`
- CopilotKit local example: `CopilotKit/examples/integrations/mastra/`
- Supabase MCP `execute_sql`

**No commits made.**
