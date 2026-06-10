# Forensic Audit — Trips Tasks + Reliability Hardening

**Date:** 2026-05-28  
**Auditor:** Codex, senior software/forensic review  
**Scope:** `/home/sk/mdeai/tasks/trips`, `/home/sk/mdeai/tasks/trips/tasks`, `mdeapp/src/lib/trips`, `mdeapp/src/components/trips`, `supabase/functions/ticket-payment-webhook`, Supabase project `zkwcbyxiwklihegjhuql`, Mindtrip screenshots under `/home/sk/mdeai/screenshots/mindtrip`.

## Executive verdict

The outside recommendations are **mostly correct in direction, but not 100% correct in facts or MVP sequencing**.

| Area | Score | Verdict |
|---|---:|---|
| Architecture | 91/100 | Strong: Supabase owns state, Stripe owns payments, agent writes stay constrained |
| Schema strategy | 94/100 | Correct no-new-MVP-tables posture; live Trips tables already exist with RLS |
| UI task coverage | 83/100 | Good baseline, but map/mobile/retry details were too thin |
| Agent scope | 86/100 | Good restraint after correction: no new timeline/memory/recommendation agents |
| Payments sync | 68/100 | Biggest production risk: primary sync exists only as a task, no repair backstop yet |
| RLS/security proof | 76/100 | RLS exists, but proof must cover negative CRUD/join/count paths |
| Production readiness | 69/100 | Missing reconciliation, observability, cache proof, mobile proof, lifecycle rules |
| Overall task-pack correctness before patch | 82/100 | Architecturally sound but operationally incomplete |
| Overall task-pack correctness after patch | 90/100 | Safer sequencing with TRIP-013 through TRIP-019 added |

Stop condition: **Not ready to execute as a ship-safe set until TRIP-013, TRIP-014, TRIP-017, and TRIP-019 are accepted into the build order.** The task pack is now safer, but the implementation still does not exist.

## Verification probes

| Probe | Result | Evidence |
|---|---|---|
| `find tasks/trips/tasks -maxdepth 1 -type f` | `TRIP-008-trip-map-google-pins.md` exists | External claim "missing TRIP-008" is false |
| Supabase `list_tables(public, verbose)` | `trips`, `trip_items`, `saved_places`, `collections`, `conflict_resolutions`, `budget_tracking` exist with RLS | Schema reuse is valid |
| Supabase `list_tables(public, verbose)` | `trips.status` CHECK = `planning`, `active`, `completed`, `cancelled` | Suggested `draft`/`archived` values are not live |
| Supabase `list_tables(public, verbose)` | `trip_items.item_type` CHECK = `event`, `restaurant`, `rental`, `poi`, `other` | `showing`, `booking`, `custom_note` still require data-027 |
| Supabase `list_extensions` | `pg_cron` installed | Lightweight reconciliation worker is feasible |
| Supabase security advisors | `spatial_ref_sys` RLS disabled ERROR, many function search_path warnings | Not Trips-specific, but production security report must surface it |
| `rg "trip_items" supabase/functions/ticket-payment-webhook` | no trip item insert in webhook | TRIP-010 and TRIP-013 are valid |
| `npm run test -- src/lib/trips/__tests__/itinerary-logic.test.ts` | passed: 1 file, 3 tests | Current conflict logic has baseline unit proof |
| `npm run typecheck` | passed | Task/doc changes did not expose TS drift |
| `npm run lint` | passed | Existing code still lint-clean |
| `npm run build` | passed with warnings | Next inferred `/home/sk/package-lock.json` as workspace root; middleware convention deprecated |
| `node scripts/verify-scr-wire-pairing.mjs` | failed with 5 pre-existing non-Trips pairing issues | Trips audit did not introduce these; ship gate remains red globally |

## Suggestion-by-suggestion ruling

| Suggestion | Ruling | Correction applied |
|---|---|---|
| Missing TRIP-008 | **Incorrect fact** | TRIP-008 existed; expanded it for clustering, lazy loading, mobile behavior, pin priority, bounds, and cache/proxy behavior |
| Durable booking reconciliation | **Correct risk** | Added TRIP-013 lightweight repair worker; avoided durable queue table for MVP until evidence demands it |
| RLS proof incomplete | **Correct** | Added TRIP-014 for SELECT/UPDATE/DELETE/INSERT/join/count/edge bypass proof |
| Optimistic UI rollback missing | **Correct** | Patched TRIP-007 and added TRIP-019 for pending/rollback/retry/dedupe behavior |
| Conflict system incomplete | **Correct, with scope limit** | Patched TRIP-009 for timezone/cross-midnight/DST-adjacent tests; travel buffer deferred to MAP-011/TRIP-016 |
| No lifecycle state machine | **Correct concept, wrong values** | Added TRIP-018 using live `planning/active/completed/cancelled` plus `deleted_at` archival |
| No caching strategy | **Partly correct** | MAP-005/data-007 already cover cache; added TRIP-015 for Trips-specific cache usage and no browser Places calls |
| Missing observability | **Correct** | Added TRIP-017 for structured logs, repair counts, conflict traceability, and ai_runs/tool-call linkage |
| Mobile UX risk | **Correct** | Added TRIP-016 for bottom sheet/collapse, sticky controls, and mobile Playwright proof |
| Agent scope too broad | **Correct** | Patched TRIP-009 to avoid new `timelineAgent`; MVP stays existing concierge/trip tools |

## Critical findings

### P0 — Paid booking can still desync from itinerary

`ticket-payment-webhook` finalizes orders but does not mirror paid tickets into `trip_items`. TRIP-010 covers the primary path, but a second safety layer is needed because Camila's trust failure is visible immediately: paid ticket in wallet, empty trip timeline.

Fix: TRIP-013 adds `repair_missing_trip_items()` or equivalent edge/scheduled routine every 15 minutes. It repairs paid `event_orders` / confirmed `showings` with a known `trip_id`, inserts idempotently through `unique_trip_item`, and logs skipped rows.

### P0 — RLS proof is not deep enough for production

Live RLS flags are good, but not proof. User B must be unable to read, update, delete, join, count, or attach rows to User A's trips. The current task pack only had shallow notes.

Fix: TRIP-014 adds multi-user JWT tests and Playwright fixture coverage for `/trips`, `/trips/[id]`, `/saved`, nested joins, and edge/server action bypass checks.

### P1 — Map task existed but was underspecified

TRIP-008 was present, so the "missing file" claim was stale. But the actual spec was too small: `mapId` and markers were covered; clustering, lazy loading, pin priority, mobile map behavior, cache/proxy, and invalid coordinate handling were not.

Fix: TRIP-008 now requires lazy loading, cluster proof, snapshot-first pin source priority, bounds fitting, mobile behavior, and no direct browser Places calls.

### P1 — Conflict logic is currently naive

`detectScheduleOverlaps` works for simple absolute overlaps and has unit tests, but it groups by `start_at.slice(0, 10)` and does not model travel time. Dinner in Laureles and an event 15 minutes later in Provenza can be physically impossible without overlapping timestamps.

Fix: TRIP-009 now requires timezone-normalized, cross-midnight, and DST-adjacent fixtures. Travel-buffer scoring remains deferred until route/cache work exists.

### P1 — Mindtrip screenshots reveal UI pressure not yet represented in tasks

Mindtrip's desktop trip workspace uses chat + trip panel + map/calendar/tabs. That is useful as a reference, but risky for mdeai mobile. The current mdeai task plan correctly avoids cloning Mindtrip, but needed explicit mobile constraints.

Fix: TRIP-016 adds mobile workspace modes, collapsible/bottom-sheet map behavior, sticky itinerary controls, conflict card fit, and mobile Playwright proof.

## Mindtrip screenshot review

| Screenshot | Useful pattern | mdeai correction |
|---|---|---|
| `20-trips.png` | Trip dashboard has filters, booked-only toggle, visual trip cards | Good for `/trips`, but mdeai should not need marketing-heavy cards before create/add-to-trip works |
| `11-mindtrip_trip.png` | Workspace exposes trip modules and map side-by-side | Useful desktop inspiration; on mobile this must collapse to mode switch/bottom sheet |
| `04-mindtrip_itinerary.png` | Itinerary panel coexists with chat and add buttons | mdeai should keep this simpler: itinerary first, chat/tool actions only where they unblock Camila |
| `05-mindtrip_calendar.png` | Calendar view is polished but heavy | Keep POST-MVP; current timeline is enough until booking sync is reliable |
| `08a-mindtrip_collections.png` | Saved collections + map is valuable | Supports TRIP-006/TRIP-008/TRIP-015, but cache/proxy and RLS proof matter more than visual parity |

## Task changes made

| File | Change |
|---|---|
| `TRIP-007-add-to-trip-from-cards.md` | Added optimistic rollback, retry toast, duplicate-click lock |
| `TRIP-008-trip-map-google-pins.md` | Added clustering, lazy loading, mobile behavior, pin priority, bounds, cache/proxy constraints |
| `TRIP-009-conflict-persist-hitl.md` | Removed new `timelineAgent`; added timezone/cross-midnight/DST-adjacent proof |
| `TRIP-010-booking-trip-item-sync.md` | Added failure-mode rule: do not cache webhook success if trip mirror failed |
| `TRIP-011-playwright-suite.md` | Added RLS, rollback, mobile proof expectations |
| `TRIP-012-production-smoke-floor.md` | Added repair, cache, observability, and hardening gates |
| `TRIP-013-booking-reconciliation-worker.md` | New P0 repair worker task |
| `TRIP-014-rls-penetration-verification.md` | New P0 RLS penetration task |
| `TRIP-015-places-cache-hydration.md` | New Trips-specific cache/hydration task |
| `TRIP-016-mobile-workspace-hardening.md` | New mobile UX hardening task |
| `TRIP-017-observability-sync-logs.md` | New structured logs/traceability task |
| `TRIP-018-trip-lifecycle-states.md` | New lifecycle/archival task using live status constraint |
| `TRIP-019-retry-optimistic-ui-recovery.md` | New retry/rollback task |
| `tasks/trips/tasks/INDEX.md` | Updated build order to TRIP-001 through TRIP-019 |

## Recommended order

```text
TRIP-001 audit
TRIP-002 dashboard
TRIP-003 create modal
TRIP-004 workspace
TRIP-005 itinerary hardening
TRIP-006 saved
TRIP-007 add-to-trip
TRIP-008 maps
TRIP-009 conflict HITL
TRIP-010 booking sync
TRIP-013 reconciliation worker
TRIP-014 RLS penetration verification
TRIP-015 cache + hydration
TRIP-016 mobile hardening
TRIP-017 observability + sync logs
TRIP-018 lifecycle states
TRIP-019 retry + optimistic UI recovery
TRIP-011 Playwright suite
TRIP-012 production smoke
```

## Remaining red flags

- Older Trips wireframes and prompts had over-agenting/table language; this pass corrected the key references to logical modules and no `trip_days` / `timeline_events` for MVP.
- `scripts/verify-scr-wire-pairing.mjs` fails due to five non-Trips screen/wireframe issues. This blocks a clean global proof gate even though it is outside the Trips changes.
- Supabase advisors still report `public.spatial_ref_sys` with RLS disabled. It is a PostGIS system table, but the advisor classifies it as ERROR; production audit needs an explicit disposition.
- TRIP-013 uses `pg_cron` availability confirmed by extension list, but the exact function body needs schema evidence from TRIP-001 before writing migration SQL.

## Final assessment

The original external review was **about 80-85% correct**. The reliability concerns were real. The incorrect parts were concrete: TRIP-008 already existed, the proposed lifecycle state names did not match the live database, and a durable queue table is premature for MVP.

After patching, the task pack is **about 90% correct as a plan**, but **0% implemented for the new hardening work**. Do not mark Trips production-ready until TRIP-013, TRIP-014, TRIP-017, TRIP-019, Playwright, and production smoke evidence exist.
