# SAN-496 · EVT-037 — Request proposal modal (HITL) — split + P1 fixes

**Date:** 2026-06-10
**Branch:** `ai/san-496-evt-037-request-proposal-modal-hitl`
**Scope:** Split the `VenueBookingDirectHitl` provider out of the SAN-495 ·
EVT-036 offerings-panel PR (#164) and fix the 2 P1 bugs reviewers flagged on it.

## What moved here

| File | Source | Note |
| --- | --- | --- |
| `src/components/chat/venue-booking-direct-hitl-context.tsx` | from #164 | provider, with both P1 fixes |
| `src/components/chat/venue-booking-direct-hitl-core.ts` | new | testable submit-and-map core |
| `src/components/chat/venue-booking-direct-hitl-core.test.ts` | new | unit tests (3) |
| `src/components/chat/geo-chat-shell.tsx` | edited | wraps `ConciergeSessionProvider` with the provider |

## P1 bugs fixed (flagged by greptile on #164)

1. **Wrong reset status / clobbered `complete`.** `clearDirectHitl` and
   `openDirectHitl` set `status` to `"executing"` (the submitting state) instead
   of the idle `"inProgress"`. The success path also did `setStatus("complete")`
   then a `finally` `clearDirectHitl()` that overwrote it before any consumer
   could observe it.
   **Fix:** reset to `"inProgress"`; on success clear `args` and leave a terminal
   `"complete"` observable (no `finally` clobber). The confirmation banner remains
   the user-facing success signal.

2. **Swallowed submit errors.** The success IIFE had a `finally` but no `catch`,
   so a failed `submitVenueBooking` left the user with no feedback and a dead
   `"executing"` panel.
   **Fix:** `submitDirectVenueBooking` returns a discriminated
   `{ ok: false, error }` (never throws) and logs via `console.error`; the
   provider resets the panel on failure. `TODO SAN-496` left to surface a
   toast/banner when the modal UI lands.

## Verification

| Gate | Result | Evidence |
| --- | --- | --- |
| `npm run floor` (lint → typecheck → build → test → audit) | ✅ **PASS** | run locally 2026-06-10; reached + passed audit (exit 0) |
| Vitest — new core | ✅ 3/3 | `venue-booking-direct-hitl-core.test.ts` (success, blank-title fallback, no-swallow failure) |
| `next build` | ✅ compiled | provider wiring in `geo-chat-shell` builds clean |
| `npm audit --audit-level=high` | ✅ exit 0 | 9 moderate + 9 low, no high/critical |

### Not run in this environment (will run in CI / Vercel on the PR)

- **Playwright e2e** — no browser binaries installed here, and there is no
  HITL-specific spec yet (the provider is mounted but has no UI trigger path —
  `openDirectHitl` has no caller until the EVT-037 modal is wired). Build-level
  proof stands in for runtime here.
- **Production smoke** — requires `PROD_SMOKE_BASE_URL` + prod egress + the
  Infisical-injected keys, none available in this ephemeral container (`.env.local`
  intentionally empty). Vercel preview deploy on the PR is the runtime check.

## Follow-up

- Wire `openDirectHitl` + render `VenueBookingDirectHitlPanel` into the EVT-037
  proposal modal flow, then add a Playwright spec for the approve→confirm and
  failure→reset paths.
