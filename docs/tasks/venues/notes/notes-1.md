## Venues backlog review

### Shipped (archived)

| ID | What | Prod |
|----|------|------|
| **SCREEN-021 / CAF-A5** | Café cards + map + detail | [mdeai.co/chat](https://www.mdeai.co/chat) |
| **SCREEN-007** | `VenueDetailSheet` (rentals/events) | same |
| **Backend** | `search-restaurants`, 44-row restaurant catalog (**DATA-004** verify done) | tool live; UI still generic |

### In progress / partial

| ID | Gap |
|----|-----|
| **SCREEN-023 / SAN-490** (`008-scr`) | In Review — tool ✅, **`RestaurantResultCard` / `RestaurantDetailPanel` missing** |
| **Café Phase C booking** | Stub only — no DB persist until **VEN-016+** |
| **DB spine** | `venue_anchors` + `venue_booking_requests` migrations exist; **VEN-015** is verify/RLS, not greenfield |
| **UX-023** | Card shell extraction — spec says ship rich restaurant card **first**, refactor later |

### Not started (big blocks)

- **VEN-011…013** — nightlife vertical  
- **VEN-016…024** — booking tools, HITL sheet, WA draft, Patricia queue  
- **VEB-001…018** — event venue booking pack (Linear **SAN-492…514**)  
- **VEN-032…043** — coffee tours (optional)

---

## Recommended next tasks (priority order)

### Sprint 1 — Close restaurant vertical (~2–3d)

| # | Task | Linear | Why |
|---|------|--------|-----|
| **1** | **VEN-009** — `RestaurantResultCard` | ties to **SAN-490** | Biggest persona-visible gap; **DATA-004 done** (44 restaurants); copy `CafeResultCard` pattern |
| **2** | **VEN-010** — `RestaurantDetailPanel` | same | Completes Mindtrip loop (cards → map → right column); closes **SCREEN-023** |
| **3** | Evidence + archive **008-scr** | SAN-490 → Done | Playwright `SCREEN-023-restaurant-listings.spec.ts` per spec |

**Persona win:** Tourist dinner discovery + Carlos sees real restaurant cards (not `GenericResults`).

---

### Sprint 2 — Booking happy path (~4–5d)

| # | Task | Depends | Why |
|---|------|---------|-----|
| **4** | **VEN-015** — schema + RLS verify | migrations on disk | Unblocks entire booking + **VEB** tracks; likely fast audit, not new SQL |
| **5** | **VEN-016** — `requestVenueBooking` Mastra tool | VEN-015 | First real persist (café “Book table” stops being stub) |
| **6** | **VEN-017 + VEN-019** — booking sheet + CopilotKit HITL | VEN-016 | Sarah/Carlos submit; agent waits for form |
| **7** | **VEN-021** — sheet persist + status | above | Draft → submitted in DB |

Defer **VEN-022…024** (WA + Patricia queue) until happy path works in chat.

---

### Sprint 3 — Nightlife OR event venues (pick one track)

**Track A — Tourist nightlife (parallel after Sprint 1)**

| Task | Notes |
|------|-------|
| **VEN-011** → **VEN-012** → **VEN-013** | Wireframes **007** ready; **DATA-005** seed migration exists |
| **SCREEN-022** evidence | Same pattern as restaurant |

**Track B — Roberto event venue booking (after Sprint 2 step 4)**

| Task | Notes |
|------|-------|
| **VEB-001** → **VEB-002** | Schema + Mamacita seed (data-only, ~1d) |
| **VEB-003** → **VEB-005** | Event Venue CTA → offerings panel → proposal modal (**needs VEN-009/010 + VEN-017**) |
| **VEB-006** → **VEB-008** | `eventVenueAgent` + match/compare (chat) |

**VEB-009** (host wizard step) waits on **EVP-010**.

---

## Defer

| Item | Reason |
|------|--------|
| **VEN-032…043** coffee tours | Optional product; doesn’t unblock booking |
| **VEN-025…030** hardening | After first booking E2E |
| **VEN-031** Playwright bundle | Run per-vertical as each ships (023 now, 022 later) |
| **UX-023 shell refactor** | After VEN-009/010 on `main` |
| **INT-001…008** | Parallel café intelligence — nice, not blocking restaurant/booking |

---

## Critical path (one line)

```text
VEN-009 → VEN-010 → VEN-015 verify → VEN-016…021 → (VEN-011…013 ∥ VEB-001…005)
```

---

## Suggested immediate pick

**Start VEN-009 today.** It’s P0, unblocked (DATA-004 done, café pattern exists, wireframe **008** written), closes **SAN-490**, and unblocks **VEB-003** (Mamacita “Event Venue” CTA on restaurant cards).

If you want one combined slice for a single PR: **VEN-009 + VEN-010 + SCREEN-023 evidence** — one surface, one commit row, tourist-visible on Vercel.

Want this turned into Linear status updates or a `COMMIT-LEDGER` row set?