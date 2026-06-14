# SAN-502 · EVT-043 — Patricia admin queue (event requests) — page UI slice

**Date:** 2026-06-10
**Branch:** `ai/san-502-evt-043-admin-queue-page`
**Layer:** UI (the `/admin/event-bookings` page; calls the SAN-502 backend route from #171)

## What

The page Patricia uses to review event proposals. Server-gated to admins; lists
the requests, opens a detail drawer, and approves / declines / asks for more info.

| File | Note |
| --- | --- |
| `src/app/admin/event-bookings/page.tsx` | server component — gate (auth + `is_admin()`) → queue or "admin access required" |
| `src/components/admin/event-bookings-queue.tsx` | client: fetch list, rows, detail drawer, decision actions |
| `src/components/admin/event-bookings-status.tsx` | pure `eventBookingStatus` + `EventBookingStatusChip` |
| `src/components/admin/__tests__/event-bookings-status.test.tsx` | 6 tests (status mapping + chip render) |

## Matches wireframe VEB-W05 / SAN-514 · EVT-055 — Wire: Admin event booking queue

| Element | testid |
| --- | --- |
| Page | `admin-event-bookings-page` |
| Queue row | `event-booking-row` |
| Status chip | `event-booking-status` |
| Detail drawer | `event-booking-drawer` |
| Approve / Decline / Request info | `event-booking-approve` / `-decline` / `-needs-info` |

- **Status mapping:** confirmed (`bookings.status`) > approved/declined (`partner_status`) > needs-info (`metadata.needs_info`) > pending — matches the SAN-502 schema-truth table.
- **Defense in depth:** the page server-gates with `is_admin()`, and the API route (#171) re-checks — a non-admin sees "Admin access required" and the data/actions 403 regardless.
- **Lint note:** initial load sets state inside a `.then` callback (not synchronously in the effect) to satisfy the React-compiler `set-state-in-effect` rule, mirroring the repo's existing effect patterns.

## Verification

| Gate | Result |
| --- | --- |
| `npm run floor` (lint → typecheck → build → test → audit) | ✅ **PASS** (exit 0) |
| Vitest — status chip | ✅ 6/6 (pending/approved/declined/needs-info/confirmed + chip render) |
| Full suite | ✅ 803 passed / 11 skipped |
| `next build` | ✅ `/admin/event-bookings` route registered |

### Not run here (no browser / empty Infisical env in container)
- Live admin login → see a seeded pending request → click Approve. Needs a
  browser + real Supabase; Vercel preview covers the deploy, interactive
  Playwright is the follow-up once #171 + this page are on `main`.

## Dependency
Calls `GET`/`POST /api/admin/event-bookings` from **PR #171** (the backend). Merge
#171 first (or together); both compile independently.
