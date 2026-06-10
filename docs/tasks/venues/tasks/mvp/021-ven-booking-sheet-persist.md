---
task_id: ven-021
mvp_step: 021
title: VenueBookingSheet + DB persist
layer: UI
priority: P0
status: Done
verified_at: 2026-06-02
evidence: ./evidence/VEN-021-verify-2026-06-02.md
merge_sha: bf2599d
linear: SAN-304
linear_note: Catalog title says VEN-025; repo task ID is VEN-021. SAN-300 is form-only (VEN-017).
depends_on: [VEN-015, VEN-016, VEN-017]
unblocks: [VEN-019, VEN-020, VEN-026, VEN-028, VEB-010]
skills: [shadcn, copilotkit-develop, mde-supabase]
doc: ../docs/02-booking-whatsapp.md
description: Same VenueBookingForm (RHF + Zod) submit → API persist; no second form implementation.
form_stack: react-hook-form + zod + shadcn-field
---

# VEN-21 — Booking sheet persist

**UI:** [`016-ven-booking-sheet.md`](./016-ven-booking-sheet.md)  
**Wire:** [`018-ven-booking-copilot-action.md`](./018-ven-booking-copilot-action.md)


## At a glance

| | |
|---|---|
| **For** | All three booking personas |
| **Surface** | `/chat` right column — VenueBookingSheet |
| **Layer** | UI |

## What we're building

**No new form UI** — reuse `VenueBookingForm` from VEN-017 (React Hook Form + Zod + shadcn Field). This task wires submit → `POST /api/venue-booking/request` → `venue_booking_requests` (`source: web`) for café · restaurant · nightlife.

## Features

- Date, party size, notes, venue_kind
- Opens from detail CTA + CopilotKit HITL (CKV-006)
- Honest pending copy

## Agents & tools

`conciergeAgent` triggers CKV-006 render

## Workflows

MSV-007 on submit

## User journey

1. User clicks 'Request booking' on detail panel.
2. Sheet opens with place pre-filled.
3. Submit → DB row → 'Request received' chip.

## Acceptance

- [x] Submit creates `venue_booking_requests` row (signed-in; `lib/venues/venue-booking-core.ts`)
- [x] Honest copy — pending, not confirmed (form + `venue-booking-confirmation-card`)
- [ ] Works from restaurant detail panel (no `restaurant-booking-sheet.tsx` on disk yet)
- [x] Works from nightlife booking sheet (`venue_kind=nightclub`; VEN-013 detail panel CTA)
- [x] API idempotency key on web submit (VEN-026 partial — duplicate 409 UX pending)
- [x] Failure does not show success chip (throws → `role="alert"` on form)

**Disk:** `app/api/venue-booking/request/route.ts`, `submit-venue-booking.ts`, `venue-booking-form.tsx`

**Not in scope yet:** Agent HITL persist path (VEN-019) — tool path separate via VEN-016.

## Related — event venue booking (VEB pack)

| Pack | Table / path | Relationship |
|------|----------------|--------------|
| **VEN-015…021** (this task) | `venue_booking_requests` | **Place visits** — café / restaurant / nightclub from `/chat` grounded cards |
| **VEB-001…018** (`tasks/venues/tasks/event-booking/`) | Same table + future `venue_event_offerings` | **Event proposals** — private dinners, Roberto host wizard, Mamacita partner CTAs |

VEB-010 workflow **reuses** the insert spine from VEN-021; it adds proposal fields, WhatsApp draft (VEN-022), and Patricia queue (VEB-011). Prerequisite on disk: VEN-015 schema ✅ · VEN-021 web persist 🟡 · VEB-001 offerings schema ❌.

Linear: [SAN-304](https://linear.app/sanjiovani/issue/SAN-304) · VEB-010 [SAN-501](https://linear.app/sanjiovani/issue/SAN-501)

---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-021](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-021-verify-YYYY-MM-DD.md` |
| Grade | **B+ / 86** |
| Production ready | In Review — signed-in Playwright insert + nightlife sheet |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | Sheet submit → venue_booking_requests row |
| **MCP** | Supabase select own row |
| **Chrome DevTools** | Stub copy removed; confirm `venue-booking-confirmation-card` after submit |
| **Playwright** | Signed-in booking e2e |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Signed-in Playwright: submit → MCP `SELECT` own row
- Nightlife sheet + VEN-013
- Surface 409 duplicate message in UI (VEN-026)
- Optional: soft-depend note — VEN-019 HITL is follow-on, not blocker for web persist

