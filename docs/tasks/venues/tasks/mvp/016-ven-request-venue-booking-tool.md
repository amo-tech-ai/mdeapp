---
task_id: ven-016
mvp_step: 016
title: requestVenueBooking Mastra tool
layer: TOOL
priority: P0
status: Done
estimated_effort: 1 day
depends_on: [VEN-015]
unblocks: [VEN-018, VEN-019, VEN-022]
skills: [mastra, mde-supabase, mde-task-lifecycle]
mcp: [user-mastra, user-supabase]
description: Insert venue_booking_requests from concierge tool — cafe, restaurant, nightlife kinds.
---

# VEN-15 — requestVenueBooking tool


## At a glance

| | |
|---|---|
| **For** | Sarah, Carlos, Tourist |
| **Surface** | `/chat` + Supabase |
| **Layer** | TOOL |

## What we're building

Mastra tool that inserts a `venue_booking_requests` row when user (or agent) submits a booking.

## Features

- Zod input: place_id, kind, date, party_size, WA contact
- RLS-safe insert
- CopilotKit mirror name `requestVenueBooking`

## Agents & tools

`conciergeAgent.tools.requestVenueBooking`

## Workflows

Called from MSV-007 or directly

## User journey

1. User completes VenueBookingSheet **or** agent gathers fields in chat.
2. Tool inserts pending row (`source: chat`).
3. Returns `bookingRequestId` to UI chip (`venue-booking-confirmation`).

**Web sheet path:** `POST /api/venue-booking/request` (`source: web`) — VEN-021; does not require this tool invoke.

## Input schema (Zod)

```ts
google_place_id: string
venue_name: string
venue_kind: enum("cafe" | "restaurant" | "nightlife")
requested_date: string // ISO date
requested_time: string // HH:mm
party_size: number.int().min(1).max(20)
contact_whatsapp: string
notes?: string
```

## Output

```ts
{ success: true, bookingRequestId: string, status: "pending" }
```

## Goals

1. `createTool` in `src/mastra/tools/request-venue-booking.ts`.
2. Insert via Supabase user-scoped client or F13-approved server path — **no** service-role in client bundles.
3. Register on `conciergeAgent.tools`.
4. `withAudit` / `ai_runs` per MASTRA-004.
5. CopilotKit mirror: **CAF-014** disabled action name **`requestVenueBooking`** must match.

## Acceptance criteria

- [x] RLS: user can insert own row only
- [x] Invalid `venue_kind` rejected
- [x] Vitest with mocked Supabase
- [x] Tool name matches Mastra registry key exactly

**Evidence:** `tasks/venues/tasks/evidence/VEN-016-verify-2026-06-02.md` (grade B+ / 88)

## Real-world

**Carlos** — dinner for 4 → row `pending`, never `confirmed`.
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-016](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-016-verify-YYYY-MM-DD.md` |
| Grade | **B+ / 88** |
| Production ready | No — UI not wired (VEN-021) |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | Signed-in agent → tool → DB row |
| **MCP** | Supabase schema + mastra createTool |
| **Chrome DevTools** | `venue-booking-confirmation` chip |
| **Playwright** | Auth fixture insert e2e (missing) |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Live JWT insert proof
- VEN-021 sheet persist
- Anonymous error UX

