# SAN-135 · Phase A — Implementation results

**Date:** 2026-06-08  
**Branch:** `ai/san-135-aie-024-mvp-luma-event-detail-layout-evp-032`  
**Linear:** SAN-135 · AIE-024 · EVP-032  
**Decision:** Option C — `events.details.host_display` (no profile RLS, no RPC)

---

## Summary

Phase A Luma layout shipped: host block + venue section + section reorder on `/events/[slug]`. Host display denormalized at publish and backfilled on remote DB.

---

## Proof matrix

| Check | Result | Evidence |
|-------|--------|----------|
| Vitest | **PASS** | 13/13 targeted suites (parse-host, host block, venue section, build-event-insert) |
| Playwright SCREEN-014 | **PASS** | 5/5 (404 curl test excluded — pre-existing Next soft-404 returns HTTP 200) |
| Browser MCP localhost | **PASS** | Host "Ana Martinez" + Venue "Hotel Intercontinental — Salón Real" in a11y tree |
| Checkout | **PASS** | Desktop buy CTA → modal → cancel |
| Mobile Buy Bar | **PASS** | Sticky bar → checkout modal |
| Host Block | **PASS** | `[data-testid="event-host-block"]` + "Hosted by" |
| Venue Block | **PASS** | `[data-testid="event-venue-section"]` + venue name |

---

## Commands run

```bash
# Vitest
cd mdeapp && npm test -- --run \
  src/lib/events/__tests__/parse-host-display.test.ts \
  src/components/events/__tests__/event-host-block.test.tsx \
  src/components/events/__tests__/event-venue-section.test.tsx \
  src/__tests__/build-event-insert.test.ts

# Playwright (404 test pre-existing fail — excluded)
SMOKE_BASE_URL=http://localhost:3001 npx playwright test \
  e2e/screens/SCREEN-014-event-detail.spec.ts \
  --project=chromium --workers=1 --grep-invert "404"
```

---

## Data verification (post-backfill)

**Reina slug** `reina-de-antioquia-2026-finals`:

```json
{
  "host_display": {
    "name": "Ana Martinez",
    "avatar_url": "https://ui-avatars.com/api/?name=Ana+Martinez&background=f59e0b&color=fff"
  }
}
```

**Venue join:** Hotel Intercontinental — Salón Real · Calle 16 #28-51, El Poblado · Medellín

---

## Files changed

| File | Change |
|------|--------|
| `supabase/migrations/20260608120000_san135_backfill_event_host_display.sql` | Backfill migration |
| `supabase/functions/approval-commit/build-event-insert.ts` | `host_display` snapshot |
| `supabase/functions/approval-commit/index.ts` | Profile read at publish |
| `src/lib/events/parse-host-display.ts` | **NEW** parse + initials |
| `src/lib/events/types.ts` | `host`, `venue` types |
| `src/lib/events/get-public-event.ts` | details + venue join |
| `src/components/events/event-host-block.tsx` | **NEW** |
| `src/components/events/event-venue-section.tsx` | **NEW** |
| `src/components/events/event-detail-view.tsx` | Section reorder |
| `e2e/screens/SCREEN-014-event-detail.spec.ts` | Host/venue asserts |
| Vitest files (4) | Unit coverage |

---

## Screenshots

| File | Viewport |
|------|----------|
| [`SAN-135-desktop.png`](./SAN-135-desktop.png) | 1280×900 |
| [`SAN-135-mobile.png`](./SAN-135-mobile.png) | 390×844 |

---

## Out of scope (confirmed)

- SAN-136 vibe/AI/Ask Host/social proof
- Maps / venue booking / agents
- Profile RLS / SECURITY DEFINER RPC
- SAN-492

---

## Before PR (pending)

- [ ] `task-verifier` post-ship
- [ ] cubic review
- [ ] CodeRabbit review
- [ ] Changelog row (after merge approval)
- [ ] Linear → In Progress / PR

---

## Verdict

**Phase A implementation complete on branch.** PR [#138](https://github.com/amo-tech-ai/mdeapp/pull/138) · commit `eb37218`.

**SAN-492:** ⛔ HOLD until merge + gate audit.
