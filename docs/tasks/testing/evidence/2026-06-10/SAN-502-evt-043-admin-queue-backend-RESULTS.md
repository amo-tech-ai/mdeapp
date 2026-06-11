# SAN-502 · EVT-043 — Patricia admin queue (event requests) — backend slice

**Date:** 2026-06-10
**Branch:** `ai/san-502-evt-043-admin-event-requests`
**Layer:** Backend (the queue's engine — list + decide + admin-gated route). No page UI in this PR.

## What

The server side of Patricia's admin queue: read the event-venue proposals and
act on them (approve / decline / request more info). This is what the
`/admin/event-bookings` page (next slice) will call.

| File | Note |
| --- | --- |
| `src/lib/events/admin-event-bookings-core.ts` | `listEventBookingRequests` + `decideEventBooking` + row→request mapper |
| `src/app/api/admin/event-bookings/route.ts` | `GET` (list) + `POST` (decision), admin-gated |
| `src/lib/events/__tests__/admin-event-bookings-core.test.ts` | 9 unit tests |
| `src/app/api/admin/event-bookings/route.test.ts` | 6 route tests |

## Decision mapping (per SAN-502 schema truth)

| Action | DB effect |
| --- | --- |
| Approve | `partner_status = 'approved'` |
| Decline | `partner_status = 'declined'` |
| Needs info | keep `partner_status = 'pending'`, set `metadata.needs_info = true`, record `partner_notes` (no invalid CHECK value) |

- Event details (type, contact) are read out of `bookings.metadata`; the list is
  filtered to `booking_type = 'event'`, newest first.
- **Admin gate:** route requires a signed-in user **and** the `is_admin()` RPC
  → 401 signed-out, 403 non-admin. The user-scoped Supabase client is passed
  through, so RLS stays in force (no service-role).

## Verification

| Gate | Result |
| --- | --- |
| `npm run floor` (lint → typecheck → build → test → audit) | ✅ **PASS** (exit 0) |
| Vitest — core | ✅ 9/9 (map, list, list-error 500, approve, decline, needs_info merge, 404, 400) |
| Vitest — route | ✅ 6/6 (401, 403, list, invalid JSON 400, missing fields 400, decision 200) |
| Full suite | ✅ 812 passed / 11 skipped |

### Not run here (no browser / empty Infisical env in container)
- Live admin login + real approve against a seeded pending booking — needs a
  browser + real Supabase. Vercel preview + a follow-up Playwright cover runtime.

## Next slice
**Page UI:** `src/app/admin/event-bookings/page.tsx` — DataTable of requests
(`event-booking-row`), status chips (`event-booking-status`), detail drawer
(`event-booking-drawer`), and approve/decline/needs-info buttons wired to this
route — per wireframe VEB-W05 / SAN-514 · EVT-055 — Wire: Admin event booking queue.
