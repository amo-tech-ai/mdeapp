**Verdict: your suggestions are correct.** I applied them in [`tasks/venues/tasks/INDEX-VENUE.md`](tasks/venues/tasks/INDEX-VENUE.md) and synced dependencies.

## What was already right

| Your point | Verdict |
|------------|---------|
| Phase 0 data first | ✅ Unchanged — correct |
| Phase 1 UI shell (SCREEN-021, SCREEN-007) | ✅ Correct |
| VEN-009 → 010 → 011 → **012** → 013 | ✅ Dependency chain correct |
| VEN-014 after UI (cache) | ✅ Correct |
| Booking: 015 → 016 → 017 → 018 | ✅ Correct |
| Hardening 025→030 order | ✅ Strong |
| VEN-031 after hardening | ✅ Correct |
| VEB as separate layer | ✅ Correct |
| Coffee tours deferred | ✅ Already isolated |

## What needed fixing (now done)

### 1. VEN-012 priority
Was listed like normal work. Now **🔥 CRITICAL BLOCKER** in `INDEX-VENUE.md`, `INDEX.md`, and VEN-012 spec.  
Note: routing code landed 2026-06-02 (In Review) — still **Done-gated** on SCREEN-022 e2e.

### 2. VEN-021 before VEN-019 / VEN-020
Old table had HITL (19) and chips (20) **before** persist (21). That’s the fake-ready trap you called out.

**New order:**
```text
015 schema → 016 tool → 017 sheet → 018 registry → 021 persist → 019 HITL → 020 chips
```

Updated:
- `INDEX-VENUE.md` Phase 4 + 5
- `INDEX.md` booking table
- Frontmatter: `019` depends on `021`; `021` unblocks `019`/`020`; `020` depends only on `021`

### 3. VEB gate
Added explicit gate: **no VEB MVP until VEN-012 + VEN-021 Done + VEN-031 green**.

### 4. Nightlife + booking + admin
Separated into phases 2 / 4–5 / 6 / 8 — no mixed sprint in the index.

## Files touched

| File | Change |
|------|--------|
| [`tasks/venues/tasks/INDEX-VENUE.md`](tasks/venues/tasks/INDEX-VENUE.md) | **New** canonical phased index |
| [`tasks/venues/INDEX.md`](tasks/venues/INDEX.md) | Points to INDEX-VENUE; booking order + stop condition |
| `019`, `020`, `021` task specs | `depends_on` / `unblocks` fixed |
| `mvp-index.md`, `012` spec | Links + 🔥 label |

## One nuance

VEN-017 was listed with no deps; it should follow **VEN-016** (form needs tool contract). INDEX-VENUE reflects that; optional follow-up: add `depends_on: [VEN-016]` on the 017 spec.

Use **`tasks/venues/tasks/INDEX-VENUE.md`** for “what’s next”; keep **`tasks/venues/INDEX.md`** for the full 01–75 table + VEB/post-mvp rows.


## Grades

| Task | Grade | Status |
|------|-------|--------|
| **VEN-012** Grounded kind split | **B+ / 88** | In Review |
| **VEN-013** Nightlife detail panel | **B+ / 87** | In Review |

Evidence: [`VEN-012-verify-2026-06-02.md`](tasks/venues/tasks/evidence/VEN-012-verify-2026-06-02.md), [`VEN-013-verify-2026-06-02.md`](tasks/venues/tasks/evidence/VEN-013-verify-2026-06-02.md)

## What changed

**VEN-012 — routing fix**
- `search-grounded-places` now returns `metadata.venueKind: cafe | nightlife | general` on every path
- `GroundedPlaceResults` branches → `GroundedNightlifeResults` vs `GroundedCafeResults`
- Nightlife queries call `openNightlifeDetail` — no more hardcoded `kind: "cafe"`
- Cards: `data-testid="nightlife-card"` + `data-result-kind="nightlife"`
- Nightclub anchor fallback via `searchNightclubVenueAnchors`

**VEN-013 — nightlife UI**
- `NightlifeVenueDetail` + context open/close/booking
- `NightlifeDetailPanel` (cover/music/dress placeholders, session safety notice, booking CTA)
- Mobile sheet + `NightlifeBookingSheet` (`venueKind="nightlife"`)
- Wired: `chat-map-panel`, `chat-canvas`, `geo-chat-shell`
- **SCREEN-022** Playwright spec added; **SCREEN-021** booking assertions updated (real form, not stub)

## Verification

| Check | Result |
|-------|--------|
| Vitest | **455/455 pass** |
| ESLint | **pass** |
| Dev `:3001/` | **200** |
| Full `npm run floor` | Blocked by **pre-existing** TS errors in `venue-booking-form` / `place-details-cache` (not from this diff) |
| Playwright SCREEN-022 | Spec on disk; not re-run (agent/grounding flake) |

## Remaining before Done

1. Run `npx playwright test e2e/screens/SCREEN-022-nightlife-listings.spec.ts` with dev + agent
2. Signed-in booking insert proof for nightlife sheet
3. Optional: add `nightlife` to `MapPinCategory` enum (currently `meta.venueKind` on `grounded` pins)

**Manual smoke:** `/chat` → *"salsa bars in Poblado"* → should get `nightlife-card` → Details opens `nightlife-detail-panel` (not café tabs). Café queries unchanged.

---

## Form stack (locked 2026-06-02)

**Venue table booking:** React Hook Form + Zod + shadcn `Field` / `FieldGroup` — [shadcn forms](https://ui.shadcn.com/docs/forms/react-hook-form).

| Flow | Pattern |
|------|---------|
| VEN-017 | Form UI |
| VEN-021 | Same form → API persist |
| VEN-019 | Same form + HITL `respond()` |
| VEN-020 | Status chips only |
| VEB proposal modal | RHF + Zod (separate schema) |
| Admin filters | Simple inputs, not RHF |

**Fields:** name, email, phone, date, time, party size, occasion, special requests, WhatsApp consent.

**Do not use yet:** TanStack Form, Formisch, `useActionState`, multi-step wizard.

**Disk gap:** `venue-booking-form.tsx` still `useState` — refactor before VEN-017 Done. Add `react-hook-form`, `@hookform/resolvers`, `npx shadcn@latest add field` (and calendar if needed).

**Doc:** [`docs/venues-booking.md` §10.1](../docs/venues-booking.md)