# SAN-1094 · D-12 — RE-DES-003 — Broker Listings + Map — RESULTS

**Date:** 2026-06-16  
**Branch:** `ai/san-1094-re-des-003-broker-listings`  
**Route:** `/host/rentals/listings`

## Verdict

Implementation complete for broker inventory UI (grid default, split-map toggle, drawer, publish FSM wiring). **Ready for human review** after authenticated broker localhost + mobile screenshots.

## Automated checks

| Check | Result |
|-------|--------|
| `npm test -- --run src/lib/rentals` | **23/23 pass** (8 files) |
| `npm run lint` (rentals paths) | **pass** |
| `npm run typecheck` | Pre-existing e2e helper failures only; new `/host/rentals/*` routes need `next dev` route-type regen (`.next/dev` vs `.next/types` mismatch) |
| Unauthenticated `curl :3001/host/rentals/listings` | **307** → login (expected) |

## Broker RLS proof

| Item | Evidence |
|------|----------|
| Server loader | `fetchBrokerListings()` queries `landlord_profiles` for `user_id`, then `filterOwnedBrokerListings()` keeps only `landlord_id ∈ profile ids` |
| PTR-P0 backend | [PTR-RENTALS-P0-RESULTS.md](./PTR-RENTALS-P0-RESULTS.md) — migrations + 9/9 local RLS smoke |
| Publish API | `POST /api/host/rentals/listings/publish` uses `runPublishRpc()` → `request_listing_publish` / `publish_listing` / `pause_listing` + `mapPublishTransitionFromRpc()` |

## Publish workflow proof

| Status | RPC | UI CTA |
|--------|-----|--------|
| `draft` | `request_listing_publish` | Submit for review |
| `ready_for_review` | `publish_listing` | Approve & publish (HITL ack required) |
| `published` | `pause_listing` | Pause listing |
| `paused` | `publish_listing` | Resume listing (HITL ack required) |

`data-testid`: `listings-publish-ack` · `lx-publish`

## UI states

| State | `data-testid` | Notes |
|-------|---------------|-------|
| Loading | `rentals-listings-loading` | Suspense skeleton |
| Empty | `rentals-listings-empty` | → onboarding CTA |
| Error | `rentals-listings-error` | Retry chip |
| Grid | `rentals-listings-grid` | Default view |
| Split map | `le-view-map` | `rentals-listings-map` |
| Drawer | `listings-drawer` | Tabs + completeness |

## Screenshots

| Viewport | File | Status |
|----------|------|--------|
| Desktop ≥1360px | `RE-DES-003-desktop.png` | **Pending** — requires logged-in broker with `landlord_profiles` row |
| Mobile 390px | `RE-DES-003-mobile.png` | **Pending** — same |

## Remaining gaps

1. **Class U browser proof** — Camila/Roberto persona N/A; broker must sign in locally with landlord profile + owned apartments.
2. **SAN-1109 · D-09** — full onboarding gate redirect is minimal (`/host/rentals/onboarding` placeholder); listings page redirects when no profile.
3. **RE-DES-004 dashboard** / **RE-DES-002 concierge** — placeholder pages only.
4. **Performance tab** — shows `Data pending.` (no fake metrics).
5. **Description edit / photo upload** — read-only in drawer (editor ships later).

## Files touched (summary)

- `src/app/host/rentals/**` — layout, listings page, nav stubs
- `src/app/api/host/rentals/listings/**` — publish + detail APIs
- `src/components/host/rentals/**` — shell, grid, map, drawer, nav
- `src/lib/rentals/**` — loader, filters, publish RPC, completeness
