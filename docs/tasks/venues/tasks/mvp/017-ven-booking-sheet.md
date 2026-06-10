---
task_id: ven-017
mvp_step: 017
title: VenueBookingSheet component
layer: UI
priority: P0
status: In Review
estimated_effort: 1 day
depends_on: [VEN-016]
unblocks: [VEN-019, VEN-021]
skills: [shadcn, copilotkit-develop]
description: Shared booking form sheet (RHF + Zod + shadcn Field) for café · restaurant · nightclub.
form_stack: react-hook-form + zod + shadcn-field
doc: ../../docs/venues-booking.md#101-venue-booking-forms-locked
---

# VEN-17 — Venue booking sheet


## At a glance

| | |
|---|---|
| **For** | Sarah, Carlos, Tourist |
| **Surface** | `/chat` sheet overlay |
| **Layer** | UI |

## Form stack (required)

```text
shadcn FieldGroup + Field
  → Input / Textarea / Select / Checkbox / Date Picker
  → React Hook Form (useForm)
  → Zod (venueBookingFormSchema + zodResolver)
```

**Do not use:** TanStack Form, Formisch, `useActionState`, or multi-step wizards in Phase 1.

**Reference:** [shadcn React Hook Form](https://ui.shadcn.com/docs/forms/react-hook-form) · project skill `shadcn` → `rules/forms.md`

## What we're building

Shared `VenueBookingForm` for all three `venue_kind` values — honest “we’ll confirm on WhatsApp” copy; same component for detail CTA and VEN-019 HITL.

## Recommended fields

| Field | Maps to schema / DB |
| ----- | ------------------ |
| Name | `contact_name` |
| Email | `contact_email` |
| Phone / WhatsApp | `contact_whatsapp` |
| Date | `requested_date` (YYYY-MM-DD) |
| Time | `requested_time` (HH:mm) |
| Party size | `party_size` |
| Occasion | `notes` prefix or dedicated column (Phase A optional) |
| Special requests | `notes` |
| WhatsApp consent | Checkbox required before submit |

## Features

- `venue_kind` prop (`cafe` \| `restaurant` \| `nightlife`)
- Standalone sheet wrappers: `cafe-booking-sheet`, `restaurant-booking-sheet`, `nightlife-booking-sheet`
- Validation: Zod via RHF (`data-invalid` on `Field`, `aria-invalid` on control)
- Sign-in gate when logged out

## Agents & tools

Opened by user CTA or CopilotKit `renderAndWaitForResponse` (VEN-019)

## Workflows

Submit → VEN-021 `POST /api/venue-booking/request` → `venue_booking_requests`

## User journey

1. User clicks Request booking on detail panel.
2. Sheet opens with place pre-filled.
3. User completes RHF form; Zod blocks invalid submit.
4. Submit → pending row + honest confirmation copy.

## Goals

1. `components/sheets/venue-booking-form.tsx` — **React Hook Form + Zod + Field** (not raw `useState` + `Label`).
2. Install if missing: `react-hook-form`, `@hookform/resolvers`, shadcn `field` (+ `calendar` / date picker as needed).
3. Schema: `src/lib/venues/venue-booking-form-schema.ts` (single source for UI + API).
4. Wrappers pass `venueKind`, `placeId`, `venueName`, `testIdPrefix`.

## Acceptance

- [ ] `VenueBookingForm` uses `useForm` + `zodResolver(venueBookingFormSchema)`
- [ ] All inputs inside `FieldGroup` / `Field` per shadcn rules
- [x] Opens from café detail CTA (`cafe-booking-sheet.tsx`)
- [x] Opens from restaurant detail CTA (`restaurant-booking-sheet.tsx`)
- [ ] Opens from nightlife detail CTA (`nightlife-booking-sheet.tsx` — wire to shared form, not stub-only sheet)
- [ ] WhatsApp consent checkbox required
- [ ] HITL: `renderAndWaitForResponse` reuses same form (VEN-019)

**Disk gap (2026-06-02):** `venue-booking-form.tsx` still uses `useState` + legacy `Label`/`Input` — refactor to RHF + Field before Done.

---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-017](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-017-verify-YYYY-MM-DD.md` |
| Grade | **B / 80** (staging — RHF refactor pending) |
| Production ready | Staging |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | Sheet opens from café · restaurant · nightlife detail CTAs |
| **MCP** | — |
| **Chrome DevTools** | `data-invalid` / `aria-invalid` on failed Zod fields |
| **Playwright** | Required-field + consent validation |
| **Floor** | `cd mdeapp && npm run floor` (after adding `field` + RHF deps) |

### Improvements needed

- Migrate form to React Hook Form + shadcn `Field`
- Nightlife sheet uses `VenueBookingForm` with `venueKind="nightlife"`
- VEN-019 HITL wiring from concierge tool
- Vitest: schema + resolver edge cases
