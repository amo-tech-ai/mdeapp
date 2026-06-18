# SAN-1202 · RE-DES-007 — Consumer rental detail page — RESULTS

> Class U localhost runtime proof. Date: 2026-06-18 · Branch: `ai/san-1202-re-des-007-rental-detail` (off `main` @ `bef9c1d9`).

## Routes / files

| Kind | Path |
|---|---|
| Route (new) | `src/app/rentals/[id]/page.tsx` + `not-found.tsx` |
| Loader (new) | `src/lib/rentals/get-rental-detail.ts` (reads `apartments` + images; mock fallback; **no new tables**) |
| View (new) | `src/components/rentals/rental-detail-view.tsx` |
| Calendar (new) | `src/components/rentals/rental-availability-calendar.tsx` |
| Card link | `src/components/rentals/rental-browse-card.tsx` → title links to `/rentals/[id]` |
| Tests | `src/lib/rentals/__tests__/get-rental-detail.test.ts` · `e2e/san-1202-rental-detail.spec.ts` |

## Data source

`apartments` (existing, RLS-scoped to `status='active'` for anon) + embedded columns (amenities/pricing/availability) + `rental_listing_images`. Unknown fields → `Data pending` (never faked). Dev-without-DB falls back to the search tool's mock list.

## States implemented

Default · Loading (server) · **Not-found / unpublished** (`not-found.tsx`) · **Error** (try/catch in page) · `Data pending` for every blank field · availability calendar with legend (booked/pending/blocked = `Data pending`, no fake availability) · **mobile** sticky bottom CTA (≤lg).

## Verification (commands + results)

| Check | Result |
|---|---|
| `npx tsc --noEmit` | **exit 0** |
| `eslint` (6 changed files) | **exit 0** |
| `vitest get-rental-detail.test.ts` | **3 passed** |
| `playwright e2e/san-1202-rental-detail.spec.ts` | **2 passed (5.8s)** — results→detail→drawer + not-found |
| Playwright console errors | **0** (asserted in spec) |
| chrome-devtools MCP console (`/rentals/[id]`) | only `Lit is in dev mode` warning — **no app errors** |
| Curl `/rentals/<id>` | HTTP 200, renders `rental-detail` + calendar + CTA + "Request only" + "Data pending" |
| Curl `/rentals/does-not-exist-zzz` | renders `rental-detail-not-found` |

## Screenshots (this dir)

- `desktop-rental-detail.png` — full detail (gallery, specs, calendar, location, sidebar CTAs)
- `mobile-rental-detail.png` — 390×844, sticky bottom "Request viewing"
- `availability-calendar.png` — legend + "Minimum stay: 30 nights"
- `schedule-viewing-drawer.png` — request-viewing drawer open (reuses existing modal)
- `not-found-state.png` — unknown id

## Verdict

**PASS.** `/rentals/[id]` boots clean, renders the detail with honest `Data pending`, opens the request-viewing drawer (reusing the existing modal — no new bridge), and 404s cleanly. No payment, no new tables, HITL preserved (viewing request is consumer-initiated).

## Scope notes / follow-ups

- Schedule-viewing **non-happy states** (missing date/time, success/approved/rejected) → **SAN-1203 · RE-DES-008**.
- Embedded interactive Google map with `mapId`/`AdvancedMarker` deferred — detail uses a lightweight Location section + "View on map" deep link to avoid the maps-rule surface; full map embed can follow.
- Host-side surfacing of the created lead → **SAN-1204 · RE-DES-009**; full loop E2E → **SAN-1205 · RE-WIRE-004**.
