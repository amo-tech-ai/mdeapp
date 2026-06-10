---
title: Venues tasks forensic audit (VEN-009…043 + VEB-001…012)
auditor: task-verifier + disk/MCP probes
date: 2026-06-02
method: CLAUDE.md → prd-venues → task specs → mdeapp/src → Supabase MCP → vitest/scripts
overall_mvp_readiness: 48/100
overall_event_booking_readiness: 8/100
---

# Venues tasks audit — forensic report

> **You asked:** verify every MVP + event-booking task, grade each, list corrections, flag blockers.  
> **We did:** re-probed disk (not status fields), Supabase live schema, vitest, cache audit script, Playwright drift scan.

## Executive summary

| Track | Tasks | 🟢 Shipped | 🟡 Partial | 🔴 Missing / wrong | Pack score |
|-------|------:|-----------:|-----------:|-------------------:|-----------:|
| **VEN MVP** (009–043) | 35 | 6 | 9 | 20 | **48%** |
| **VEB event booking** (001–012) | 12 | 0 | 1 | 11 | **8%** |
| **Data layer** (DATA-007/008) | 2 | 1 | 1 | 0 | **55%** |

**Real-world impact:** Sarah can browse Italian restaurants in chat and open a booking form — but Carlos asking for "rooftop cocktails Provenza" still lands on **café UI** (bug). Roberto cannot book Mamacita for a birthday event at all (VEB track empty). Patricia has no admin queue. Places phone/hours on detail panels are empty because cache is **2.7%** filled and Google API returns 403 on backfill.

### Top 5 blockers (fix before prod)

| # | Blocker | Who feels it | Fix |
|---|---------|--------------|-----|
| 🔴 1 | **VEN-012 bug** — all grounded results forced `kind: "cafe"` | Tourist / Carlos nightlife | Split render path; `openNightlifeDetail` |
| 🔴 2 | **Google Places 403** — backfill fails | Sarah (no hours/phone on panel) | Enable Places API (New) + billing on server key |
| 🔴 3 | **Status field drift** — VEN-009/010/017/018/021 shipped but specs say Not Started | Sofía (planning lies) | Sync frontmatter + mvp-index |
| 🔴 4 | **Playwright drift** — SCREEN-021 still expects "Booking stub" | Lucía CI false red/green | Update assertions to sign-in gate / form |
| 🔴 5 | **VEB-001 schema missing** — no event offerings table | Roberto / Carlos B2B | Migration before any VEB UI |

### Tests run (2026-06-02)

| Probe | Result |
|-------|--------|
| `npm test -- request-venue-booking place-details-cache restaurant-card cafe-result` | ✅ 13/13 pass |
| `npm test -- mastra-tool-action-names` | ✅ 3/3 pass |
| `node scripts/audit-place-details-cache.mjs` | ✅ 2/74 cached (2.7%) |
| Supabase MCP — RLS on `venue_booking_requests`, `venue_anchors`, `place_details_cache` | ✅ enabled |
| Supabase MCP — `venue_anchors` counts | ✅ 17 café, 13 nightclub |
| Supabase MCP — `venue_event_offerings` | ❌ table does not exist |
| `POST /api/venue-booking/request` `{}` | ✅ 400 validation (route loads) |
| Playwright SCREEN-023 (prior session) | 🟡 2/6 pass — AI card timeout flakiness |
| Playwright SCREEN-021 | 🔴 stale assertions vs VEN-021 |

---

## Grading system

| Dot | Meaning | % band | Production |
|-----|---------|--------|------------|
| 🟢 | Verified on disk + tests | 85–100% | Safe to ship slice |
| 🟡 | Partial / spec drift / missing e2e | 50–84% | Staging only |
| 🔴 | Not started or active bug | 0–49% | Do not ship |

**Percent correct** = weighted: spec accuracy (25%) + disk match (35%) + verification evidence (25%) + dependency hygiene (15%).

---

## Task catalog — plain English (all tasks)

One-line “what is this for?” — read this first, then drill into sections below.

### Data (underpins venues)

| ID | In plain English | Dot |
|----|------------------|-----|
| DATA-007 | Count how many venue Place IDs already have cached Google details (saves API money). | 🟢 |
| DATA-008 | Fill that cache in bulk so detail panels can show phone and hours. | 🟡 |
| DATA-035 | Seed verified café pins in the database so chat can show real Medellín cafés. | 🟢 |

### VEN MVP — UI & search (009–013)

| ID | In plain English | Dot |
|----|------------------|-----|
| VEN-009 | Show **restaurant** search results as cards in chat + on the map. | 🟡 |
| VEN-010 | When you tap a restaurant card, open a **detail panel** (menu vibe, price, book CTA). | 🟡 |
| VEN-011 | Teach the AI to recognize **bar / nightclub** questions vs café or restaurant. | 🟡 |
| VEN-012 | Route grounded search results to the **right card type** (café vs club — today broken). | 🔴 |
| VEN-013 | **Nightclub detail panel** — same idea as restaurant, for bars and rooftops. | 🔴 |

### VEN MVP — Places & booking (014–024)

| ID | In plain English | Dot |
|----|------------------|-----|
| VEN-014 | Cache Google Place details cheaply and always send a **field mask** on API calls. | 🟡 |
| VEN-015 | Database table + security rules for **table booking requests**. | 🟡 |
| VEN-016 | AI tool that **saves a booking request** when the user asks in chat (signed in). | 🟢 |
| VEN-017 | **Booking form sheet** — date, party size, contact (shared UI component). | 🟡 |
| VEN-018 | Keep CopilotKit tool names in sync with Mastra so tools don’t 404 silently. | 🟢 |
| VEN-019 | Let the AI **open the booking sheet and wait** for the user to submit (HITL). | 🔴 |
| VEN-020 | Show **pending / confirmed** status on the venue detail after booking. | 🔴 |
| VEN-021 | When the user submits the sheet, **actually save** to the database (not a stub). | 🟡 |
| VEN-022 | AI drafts a **WhatsApp message** to the venue — text only, no auto-send. | 🔴 |
| VEN-023 | Patricia **reviews and approves** WhatsApp before it goes out. | 🔴 |
| VEN-024 | Patricia’s **admin screen** to see and update booking requests. | 🔴 |

### VEN MVP — hardening & tests (025–031)

| ID | In plain English | Dot |
|----|------------------|-----|
| VEN-025 | Prove users **cannot see each other’s** booking rows (security test). | 🔴 |
| VEN-026 | Double-click submit → **one row**, not duplicates. | 🟡 |
| VEN-027 | **Opt-in / consent** before any WhatsApp to the user or venue. | 🔴 |
| VEN-028 | If save fails, show error + **retry** — never a fake “success” chip. | 🔴 |
| VEN-029 | CI fails if someone adds a Mastra tool but forgets the CopilotKit name. | 🟡 |
| VEN-030 | Log when Patricia approves or changes a booking (audit trail). | 🔴 |
| VEN-031 | Automated browser tests for café, nightclub, and restaurant screens. | 🟡 |

### VEN MVP — coffee farm tours (032–043, optional)

| ID | In plain English | Dot |
|----|------------------|-----|
| VEN-032 | DB tables for **coffee tour** products (not cafés in the city). | 🔴 |
| VEN-033 | TypeScript types for tour cards and search results. | 🔴 |
| VEN-034 | Seed real tour listings in Supabase. | 🔴 |
| VEN-035 | Rank tours by fit (price, distance, theme). | 🔴 |
| VEN-036 | AI tool: “find coffee tours near Medellín”. | 🔴 |
| VEN-037 | Enrich tours with Google Place facts (masked API). | 🔴 |
| VEN-038 | Tour **cards** in chat results. | 🔴 |
| VEN-039 | Tour **pins** on the map. | 🔴 |
| VEN-040 | One command smoke test for the tour pipeline. | 🔴 |
| VEN-041 | Log tour searches for ops and caching. | 🔴 |
| VEN-042 | Evidence doc that Phase A tours are shippable. | 🔴 |
| VEN-043 | Public **tour detail page** you can share in a link. | 🔴 |

### VEB — event space booking (Roberto / Carlos B2B)

| ID | In plain English | Dot |
|----|------------------|-----|
| VEB-001 | DB for **event packages** (capacity, price tiers) — not dinner tables. | 🔴 |
| VEB-002 | Seed venues like Mamacita that host **private events**. | 🔴 |
| VEB-003 | **“Hosts events”** badge on restaurant cards. | 🔴 |
| VEB-004 | Panel listing **birthday / corporate packages** from the DB. | 🔴 |
| VEB-005 | Modal: Roberto requests a **proposal** (date, guests, budget). | 🔴 |
| VEB-006 | AI agent that **finds and ranks** event-suitable venues. | 🔴 |
| VEB-007 | UI showing **why** the AI picked each venue (match score). | 🔴 |
| VEB-008 | **Compare 2–3 venues** side by side before choosing. | 🔴 |
| VEB-009 | Roberto picks a venue inside **host event wizard**. | 🟡 |
| VEB-010 | Mastra **workflow**: proposal → save → draft WhatsApp. | 🔴 |
| VEB-011 | Patricia’s queue for **event** requests (not table bookings). | 🔴 |
| VEB-012 | Add a confirmed event booking to the user’s **trip itinerary**. | 🔴 |

---

## Phase 2 — Restaurant + nightlife UI (VEN-009…013)

### VEN-009 — Restaurant result card

**In plain English:** When someone asks the concierge for restaurants, show clickable cards with name, neighborhood, and price — and highlight the matching pin on the map.

| Field | Value |
|-------|-------|
| Dot | 🟡 |
| **% correct** | **88%** |
| Spec status | 🔴 `Not Started` (stale) |
| Grade | **A- / 90** |

**What it is:** Cards in chat when Camila asks "Italian restaurants El Poblado" — map pins sync on hover.

**Verified:** `restaurant-card.tsx`, `domain-results.tsx`, SCREEN-023 Playwright (when agent responds).

**Corrections:**
1. Flip `status: In Review` or `Done`; check acceptance boxes.
2. Document `/restaurants` catalog grid still separate from chat cards.
3. Add dedicated `VEN-009-verify-2026-06-02.md` (copy SCREEN-023 evidence).

**Example:** User types "best pizza Laureles" → `RestaurantCard` rows in results column with `data-testid="restaurant-card"`.

---

### VEN-010 — Restaurant detail panel

**In plain English:** Tap a restaurant card → see photos, cuisine, price tier, and a button to request a table (opens the booking sheet).

| Field | Value |
|-------|-------|
| Dot | 🟡 |
| **% correct** | **90%** |
| Spec status | 🔴 `Not Started` (stale) |
| Grade | **A- / 92** |

**Verified:** `restaurant-detail-panel.tsx`, mobile sheet, booking CTA opens sheet.

**Corrections:**
1. Sync status to **In Review/Done**.
2. Wire detail panel to `/api/places/detail` for phone/hours (blocked on DATA-008).
3. Update matrix line "booking CTA opens stub" → live form (VEN-021).

**Example:** Click "Details" on Oci.Mde card → right column shows cuisine, price tier, "Request a table" CTA.

---

### VEN-011 — Nightlife grounding intent

**In plain English:** When Carlos asks for cocktails or a club, the system should know that’s “nightlife,” not café or sit-down restaurant — before showing any cards.

| Field | Value |
|-------|-------|
| Dot | 🟡 |
| **% correct** | **35%** |
| Spec status | `Not Started` ✓ |
| Grade | **D+ / 58** |

**Verified partial:** `search-grounded-places.ts` has `isNightlifeGroundingQuery` / query normalization only.

**Missing:** Concierge prompt routing, tool output `venue_kind`, UI branch.

**Corrections:**
1. Add intent metadata to grounded tool result.
2. Concierge instructions: nightlife queries must not use café render.
3. Fallback to `venue_anchors` kind=nightclub when grounding thin.

**Example:** "rooftop cocktails Provenza" should set `venue_kind: nightlife` — today it still renders café cards (VEN-012 bug).

---

### VEN-012 — Grounded kind split

**In plain English:** Split Google-grounded search results so bars show bar UI and cafés show café UI — one pipeline, two correct destinations (today everything looks like a café).

| Field | Value |
|-------|-------|
| Dot | 🔴 |
| **% correct** | **15%** |
| Spec status | `Not Started` ✓ |
| Grade | **F / 25** — **active bug** |

**Red flag:** `search-tool-renders.tsx` L67 hardcodes `kind: "cafe"` in `toCafeVenueDetail`; all grounded rows use `GroundedCafeResults`.

**Corrections:**
1. Add `toNightlifeVenueDetail` + `GroundedNightlifeResults`.
2. Branch on tool result kind or query classifier.
3. Vitest: nightclub query must not call `openCafeDetail`.

**Example:** Carlos searches "salsa bar Envigado" — today opens café detail panel with wrong copy; should open nightlife panel (VEN-013).

---

### VEN-013 — Nightlife detail panel

**In plain English:** Same as the restaurant detail panel, but for nightclubs and rooftops — vibe, hours signal, and “request booking” for going out at night.

| Field | Value |
|-------|-------|
| Dot | 🔴 |
| **% correct** | **5%** |
| Grade | **F / 10** |

**Missing:** No `NightlifeDetailPanel`, no testids, no booking sheet for `venue_kind: nightclub`.

**Corrections:** Mirror VEN-010 file set; reuse `VenueBookingForm` with `venueKind="nightlife"`.

---

## Phase 3 — Places (VEN-014)

### VEN-014 — Places cache + field mask

**In plain English:** Store Google place phone, hours, and address once in our DB and reuse them — and only ask Google for the fields we need (lower cost, faster panels).

| Field | Value |
|-------|-------|
| Dot | 🟡 |
| **% correct** | **62%** |
| Grade | **C+ / 72** |

**Verified:** `place-details-cache.ts`, `/api/places/detail`, `validatePlacesFieldMask`, migration `place_details_cache`.

**Gap:** Detail panels don't call cache route; DATA-007 audit **2.7%** hit rate; backfill 403.

**Corrections:**
1. Hydrate café/restaurant panels from `/api/places/detail?placeId=`.
2. Fix GCP key → rerun backfill (DATA-008).
3. CI grep gate for FieldMask on all Places fetchers.

**Example:** Sarah opens café detail — should show today's hours from cache; today shows only `openNow` boolean from grounding.

---

## Phase 4 — Booking (VEN-015…024)

### VEN-015 — Booking schema + RLS

**In plain English:** The `venue_booking_requests` table exists so “I want a table Friday” becomes a saved row — only you can see your own requests (Postgres RLS).

| Field | Value |
|-------|-------|
| Dot | 🟡 |
| **% correct** | **85%** |
| Spec status | `In Review` ✓ |
| Grade | **B+ / 85** |

**MCP verified:** RLS on; policies `select_own`, `insert_own`, `service`; 17+13 anchors live.

**Corrections:**
1. Add authenticated UPDATE (user cancel) before prod.
2. Patricia admin SELECT/UPDATE policies (VEN-024).
3. VEN-025 penetration tests.

---

### VEN-016 — requestVenueBooking tool

**In plain English:** The concierge AI can call a tool to save your booking when you chat — “book me Oci.Mde at 8pm” — if you’re logged in.

| Field | Value |
|-------|-------|
| Dot | 🟢 |
| **% correct** | **88%** |
| Spec status | `Done` ✓ |
| Grade | **B+ / 88** |

**Verified:** Tool registered on `conciergeAgent`, vitest 5/5, CopilotKit confirmation chip.

**Corrections:**
1. Signed-in live insert proof (Playwright auth fixture).
2. Update matrix: UI path now exists via VEN-021 API (not tool-only).

---

### VEN-017 — VenueBookingSheet component

**In plain English:** One shared slide-over form for café, restaurant, or club: pick date, time, how many people, and how to reach you on WhatsApp.

| Field | Value |
|-------|-------|
| Dot | 🟡 |
| **% correct** | **75%** |
| Spec status | 🔴 `Not Started` (stale — form shipped) |
| Grade | **B / 80** |

**Verified:** `VenueBookingForm` shared; café + restaurant sheets.

**Corrections:**
1. Mark **In Review**; note nightlife sheet missing.
2. Add vitest for form validation schema.

---

### VEN-018 — Mastra tool action names

**In plain English:** Wire the same tool name in Mastra, CopilotKit, and the UI — if they drift, the chat shows a spinner forever with no error.

| Field | Value |
|-------|-------|
| Dot | 🟢 |
| **% correct** | **82%** |
| Spec status | 🔴 `Not Started` (stale) |
| Grade | **B / 78** |

**Verified:** `mastra-tool-action-names.test.ts` 3/3; `venueBooking` dual render.

**Corrections:** Flip to **Done**; extend VEN-029 CI guard.

---

### VEN-019 — Booking CopilotKit HITL

**In plain English:** The AI pauses, opens the booking form for you to fill, then continues only after you submit — like Roberto’s event wizard approve step.

| Field | Value |
|-------|-------|
| Dot | 🔴 |
| **% correct** | **25%** |
| Grade | **D / 45** |

**Partial:** Passive `venueBookingToolRender` chip only — no `renderAndWaitForResponse` opening sheet.

**Corrections:** Mirror `host-event-copilot-bridge.tsx` pattern; agent opens sheet, user fills, `respond()`.

---

### VEN-020 — Booking status chips

**In plain English:** On the venue detail, show a small label: “Pending,” “Confirmed,” or “Declined” — driven by the database, not invented by the AI.

| Field | Value |
|-------|-------|
| Dot | 🔴 |
| **% correct** | **10%** |
| Grade | **F / 15** |

**Missing:** Detail panels don't reflect DB `status` changes.

---

### VEN-021 — Booking sheet persist

**In plain English:** Press “Send request” on the sheet → row saved in Supabase → chat shows “Request received, pending WhatsApp” (not “confirmed”).

| Field | Value |
|-------|-------|
| Dot | 🟡 |
| **% correct** | **86%** |
| Spec status | `In Review` ✓ |
| Grade | **B+ / 86** |

**Verified:** `POST /api/venue-booking/request`, `venue-booking-core.ts`, confirmation banner, stub copy removed.

**Corrections:**
1. Signed-in e2e insert + MCP row select.
2. Nightlife sheet (same form).
3. Update VEN-VERIFY-MATRIX row (still says ⚪ pending).

**Example:** Sarah signs in, requests table at Oci.Mde for Friday 8pm → row in `venue_booking_requests` with `source: web`, banner "Booking request received".

---

### VEN-022 — draftVenueWhatsApp

**In plain English:** AI writes the first WhatsApp to the venue (“Hi, we have a party of 4 on Friday…”) — humans edit and send later.

| Field | Value |
|-------|-------|
| Dot | 🔴 |
| **% correct** | **0%** |
| Grade | **— / 0** |

**Example:** After Sarah’s booking is saved, ops get a draft message to paste or send — not generated ad hoc in chat.

---

### VEN-023 — WA approval outbox

**In plain English:** Patricia sees outbound WhatsApp drafts in a queue, approves or edits, then send — no bot fires messages without a human OK.

| Field | Value |
|-------|-------|
| Dot | 🔴 |
| **% correct** | **0%** |
| Grade | **— / 0** |

**Blocks:** Patricia cannot approve WhatsApp before send (golden rule).

**Example:** Draft sits in `wa_outbox` with status `pending_approval` until Patricia clicks Approve.

---

### VEN-024 — Admin booking queue

**In plain English:** Patricia’s `/admin` view: filter pending table bookings, update status, assign to ops — the control room for place bookings.

| Field | Value |
|-------|-------|
| Dot | 🔴 |
| **% correct** | **0%** |
| Grade | **— / 0** |

**MCP gap:** No admin SELECT policy on `venue_booking_requests` yet.

**Example:** Three pending café requests from today → Patricia marks one “confirmed” after calling the venue.

---

## Phase 5 — Hardening (VEN-025…030)

| VEN | Title | In plain English | Dot | % | Grade | Critical correction |
|-----|-------|------------------|-----|---|-------|---------------------|
| 025 | RLS penetration | Hack-test: User A must never read User B’s bookings. | 🔴 | 5% | F/10 | Script: user A cannot read user B rows |
| 026 | Idempotency | Tap Submit twice → still one booking row. | 🟡 | 40% | C/65 | Web route has key; no UI duplicate UX (409) |
| 027 | WA consent | Don’t WhatsApp someone who didn’t agree to be contacted. | 🔴 | 0% | — | Required before VEN-023 prod |
| 028 | Retry UX | Network failed? Show error + Try again, not a green success. | 🔴 | 10% | F/20 | Sheet shows error; no retry button |
| 029 | Registry CI | CI catches renamed AI tools before merge. | 🟡 | 55% | C+/70 | Vitest exists; not in `npm run floor` |
| 030 | Admin audit log | Who changed this booking and when — for compliance. | 🔴 | 0% | — | — |

---

## Phase 6 — E2E (VEN-031)

### VEN-031 — Playwright venue screens

**In plain English:** Robot browser tests that walk `/chat` like Lucía: search → cards → detail → booking sheet, for café (021), club (022), restaurant (023).

| Field | Value |
|-------|-------|
| Dot | 🟡 |
| **% correct** | **55%** |
| Grade | **C+ / 68** |

**Verified:** SCREEN-021 + SCREEN-023 exist; 023 updated for booking form.

**Corrections:**
1. Fix SCREEN-021 stub assertions → sign-in gate / form fields.
2. Add SCREEN-022 nightlife spec (blocked on VEN-012/013).
3. Auth fixture for booking persist e2e.

---

## Phase 7 — Coffee tours (VEN-032…043) — optional

| VEN | Title | In plain English | Dot | % | Note |
|-----|-------|------------------|-----|---|------|
| 032 | Core schema | DB tables for farm tour products (separate from city cafés). | 🔴 | 0% | No migration |
| 033 | Types | Shared TypeScript shapes for tour search and cards. | 🔴 | 0% | — |
| 034 | Seed | Load 5+ real tours into Supabase for demos. | 🔴 | 0% | — |
| 035 | rankCoffeeTours | Sort tours by price, distance, and theme fit. | 🔴 | 0% | — |
| 036 | searchCoffeeTours tool | AI tool: “coffee tours near Medellín this weekend”. | 🔴 | 0% | — |
| 037 | Places enrich | Attach Google facts to tour stops (masked API). | 🔴 | 0% | — |
| 038 | Card UI | Tour cards in chat (duration, price from, book CTA). | 🔴 | 0% | — |
| 039 | Map pins | Show tour meeting points on the map column. | 🔴 | 0% | — |
| 040 | smoke script | `npm run smoke:coffee-tours` one-shot health check. | 🔴 | 0% | — |
| 041 | Logs cache | Log tour searches for ops and cost control. | 🔴 | 0% | — |
| 042 | Phase A evidence | task-verifier doc proving tours are demo-ready. | 🔴 | 0% | — |
| 043 | Tour detail page | Shareable URL `/tours/...` for a single tour (like a mini landing page). | 🔴 | 0% | — |

**Pack average:** **0%** — correctly scoped as optional; specs OK to stay Open.

---

## Event booking track (VEB-001…012)

> **Separate product:** Roberto books a **physical event space** (80-person founder dinner), not a dinner table row in `venue_booking_requests`.

| VEB | Title | In plain English | Dot | % | Grade | Corrections |
|-----|-------|------------------|-----|---|-------|-------------|
| 001 | Event offerings schema | DB for **private event packages** (80 guests, DJ, catering) — not a dinner table. | 🔴 | 0% | F/0 | Create `venue_event_offerings` + RLS; MCP confirms missing |
| 002 | Seed partners | Load Mamacita + rooftops that accept **corporate / birthday** events. | 🔴 | 5% | F/10 | Seed Mamacita + 5 partners with `accepts_event_bookings` |
| 003 | Event Venue CTA | On a restaurant card: badge **“Hosts private events”** → opens offerings. | 🔴 | 0% | F/0 | Badge on `RestaurantCard` when flag true |
| 004 | Offerings panel | Show packages, max capacity, amenities — **from DB**, not AI invention. | 🔴 | 0% | F/0 | Capacity/packages from DB not LLM |
| 005 | Request proposal modal | Roberto: date, guest count, budget → **proposal request** saved (HITL). | 🔴 | 0% | F/0 | HITL; depends VEN-017 form patterns |
| 006 | eventVenueAgent | AI that finds venues good for **events** (not just dinner reservations). | 🔴 | 0% | F/0 | New agent + search/rank tools; blocked VEN-011 |
| 007 | Venue match panel | “Why this venue fits your 80-person founder dinner” with scores. | 🔴 | 0% | F/0 | — |
| 008 | Compare venues UI | Pick 2–3 venues side by side before sending proposals. | 🔴 | 0% | F/0 | — |
| 009 | Host wizard venue step | Roberto chooses event venue inside **/host/event/new** wizard. | 🟡 | 20% | D/40 | Generic `set_venue` text field only — no offerings/match |
| 010 | event booking workflow | Automated steps: validate → save proposal → draft WhatsApp. | 🔴 | 0% | F/0 | Mastra workflow; blocked VEN-022/023 |
| 011 | Admin event queue | Patricia manages **event** proposals (separate from table bookings). | 🔴 | 0% | F/0 | Patricia queue — blocked VEN-024 |
| 012 | Trip itinerary | Tourist adds confirmed event to **My trip** day plan. | 🔴 | 0% | F/0 | — |

**VEB pack score:** **8%** (only generic host venue field exists).

**Example (blocked):** Carlos at Mamacita wants "private birthday for 40" → should see **Event Venue** → packages → proposal → Patricia WA approve. **Nothing on disk.**

**Prerequisite chain:** Complete VEN-015…024 spine before VEB-010 prod (stated in INDEX — still correct).

---

## Spec hygiene — status drift (🟡 audit finding)

| Task | Spec says | Disk says | Action |
|------|-----------|-----------|--------|
| VEN-009 | Not Started | Shipped | → In Review/Done |
| VEN-010 | Not Started | Shipped | → In Review/Done |
| VEN-017 | Not Started | Partial shipped | → In Review |
| VEN-018 | Not Started | Shipped | → Done |
| VEN-016 | Done | Shipped | ✓ |
| VEN-021 | In Review | Shipped | ✓ keep until e2e |
| VEN-VERIFY-MATRIX | VEN-021 ⚪ | Shipped | Update matrix |

**Rule:** Never trust `status:` without disk probe (task-verifier §2).

---

## Dependency graph violations

| Issue | Severity |
|-------|----------|
| VEB-003 depends VEN-009/010 — OK, UI exists | 🟢 |
| VEB-006 depends VEN-011 — nightlife intent incomplete | 🔴 |
| VEB-005 depends VEN-017 — form exists, HITL missing | 🟡 |
| VEB-010 depends VEN-016 — tool OK; VEN-022/023 missing | 🔴 |
| INT-008 gate after VEN-012 — 012 not started | 🔴 |

---

## Best practices checklist

| Practice | State |
|----------|-------|
| Gemini-only production AI | 🟢 concierge uses `gemini-3.5-flash` |
| CopilotKit 1.55.2 v1 only | 🟢 no v2 mix found |
| FieldMask on Places calls | 🟢 server routes masked |
| RLS on new tables | 🟢 booking + anchors + cache |
| Honest booking copy (no fake confirm) | 🟢 form + chip say pending |
| Mastra agent name = useCoAgent key | 🟢 `conciergeAgent` |
| Service role not in client bundle | 🟢 fixed VEN-021 mastra leak → `venue-booking-core` |
| Playwright evidence per screen | 🟡 023 partial; 021 stale |
| Admin ops path | 🔴 missing |
| WhatsApp human-in-the-loop | 🔴 missing |

---

## Recommended fix order (next 2 weeks)

```text
1. VEN-012 + VEN-013 + VEN-011  (nightlife — Carlos unblocked)
2. GCP Places key → DATA-008 backfill  (Sarah hours/phone)
3. Spec status sync 009/010/017/018 + matrix + SCREEN-021
4. VEN-021 Done gate — auth Playwright insert
5. VEN-025 RLS penetration
6. VEN-019 HITL + VEN-022/023/024  (Patricia path)
7. VEB-001 → VEB-005  (Roberto event proposals — after 4–6)
```

---

## Summary scorecard

| Area | Score | Dot |
|------|------:|-----|
| Restaurant chat UI (009–010) | 89% | 🟡 |
| Nightlife UI (011–013) | 18% | 🔴 |
| Places cache (014 + DATA-008) | 55% | 🟡 |
| Booking spine (015–021) | 72% | 🟡 |
| Ops / WA / admin (022–024) | 0% | 🔴 |
| Hardening (025–030) | 18% | 🔴 |
| E2E (031) | 55% | 🟡 |
| Coffee tours (032–043) | 0% | 🔴 (optional) |
| Event booking (VEB-001–012) | 8% | 🔴 |
| **Overall venues MVP** | **48%** | 🟡 |
| **Overall event booking** | **8%** | 🔴 |

---

## Evidence index

| Doc | Path |
|-----|------|
| Verify standard | [`../mvp/VEN-VERIFY-STANDARD.md`](../mvp/VEN-VERIFY-STANDARD.md) |
| Matrix (needs refresh) | [`../evidence/VEN-VERIFY-MATRIX.md`](../evidence/VEN-VERIFY-MATRIX.md) |
| VEN-016 | [`../evidence/VEN-016-verify-2026-06-02.md`](../evidence/VEN-016-verify-2026-06-02.md) |
| VEN-021 | [`../evidence/VEN-021-verify-2026-06-02.md`](../evidence/VEN-021-verify-2026-06-02.md) |
| SCREEN-023 | [`../../../testing/evidence/2026-06-02/SCREEN-023-RESULTS.md`](../../../testing/evidence/2026-06-02/SCREEN-023-RESULTS.md) |
| DATA-007 audit | [`../../../testing/evidence/DATA-007-cache-audit.md`](../../../testing/evidence/DATA-007-cache-audit.md) |
| DATA-035 cafés | [`../../../testing/evidence/DATA-035-venue-anchors-cafe.md`](../../../testing/evidence/DATA-035-venue-anchors-cafe.md) |

---

*Audit complete. Re-run after VEN-012 fix or any Done flip — probe disk, don't trust status fields.*

---

## Spec corrections applied (2026-06-02)

Task files updated to match disk:

| Task | New status | Key correction |
|------|------------|----------------|
| VEN-009, 010 | In Review | Acceptance checked; stub → VEN-021 form |
| VEN-011, 012, 014, 026, 031 | In Progress | Partial shipped + blockers documented |
| VEN-017, 021 | In Review | Form/API on disk; nightlife + e2e pending |
| VEN-018 | Done | Registry + vitest verified |
| VEB-009 | In Progress | Host wizard partial only |
| VEB-001–012 | Not Started (+ disk blocks) | MCP: no event offerings schema |
| mvp-index, wireframes README, VEN-VERIFY-MATRIX | — | Status column + stale text fixed |

**Still not 100% on disk** until implementation completes — specs now **accurately describe** what is shipped vs pending.
