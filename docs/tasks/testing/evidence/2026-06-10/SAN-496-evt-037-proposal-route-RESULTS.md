# SAN-496 · EVT-037 — Request proposal modal (HITL) — Part 1: server route

**Date:** 2026-06-10
**Branch:** `ai/san-496-evt-037-create-event-proposal-route`
**Layer:** Backend / Wire (server route only — no UI in this PR)

## What

`POST /api/events/proposal` — the server target the proposal modal submits to.
Mirrors the existing `venue-booking/request` route: parses JSON, verifies the
user via `createClient()` + `auth.getUser()` (401 if signed out), then calls the
SAN-865 · VEB-019 core `insertEventProposal(supabase, user.id, body)` and maps
its result to the HTTP response.

- **F13-clean:** the user-scoped Supabase client is passed through, so RLS
  governs the `bookings` insert — no service-role key in this route.
- First real production caller of `insertEventProposal` (was mocked-only under
  SAN-865 · VEB-019).

## Files

| File | Note |
| --- | --- |
| `src/app/api/events/proposal/route.ts` | the route (new) |
| `src/app/api/events/proposal/route.test.ts` | 4 unit tests (new) |

## Verification

| Gate | Result |
| --- | --- |
| `npm run floor` (lint → typecheck → build → test → audit) | ✅ **PASS** (exit 0) |
| Vitest — route | ✅ 4/4 (invalid JSON → 400, signed-out → 401, success → bookingId, core error status passthrough e.g. 409) |
| Full suite | ✅ 801 passed / 11 skipped |
| `next build` | ✅ compiled (route registered) |

### Not run here (no browser / empty Infisical env in container)
- Live POST against a running app + real Supabase — Vercel preview + the
  scheduled prod-synthetic smoke cover runtime; a Playwright path lands with the
  Part 2 modal UI.

## Next part
**Part 2 (UI):** turn the inert `EventProposalShell` into a real form (event
type, date, party size, contact) that POSTs to this route and surfaces the
result — that's the slice that gives the full flow its browser/E2E proof.
