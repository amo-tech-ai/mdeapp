---
title: mdeai — Task queue (implementation order)
updated: 2026-06-04
prod_sha: bf40ef9
prod_url: https://www.mdeai.co
companion: plan.md
wireframes: docs/tasks/wireframes/screens/INDEX.md
venues: docs/tasks/venues/docs/tasks/INDEX-VENUE.md
trips: docs/tasks/trips/docs/tasks/INDEX.md
linear: https://linear.app/sanjiovani/view/mvp-48ab105e7f0a
audit: docs/tasks/notes/1/audit-01-tasks.md
linear_audit: docs/tasks/notes/1/audit-linear.md
playbook: docs/tasks/notes/1/improve.md
---

# Task queue — do in this order

**Read this first.** Top → bottom within each section. **%** = disk + prod @ `bf40ef9` (2026-06-03).

**Use case column:** who does what on mdeai.co — concrete Medellín example, not generic product copy.

## Release tracks (read before arguing with `plan.md`)

| Track | Scope | Operator queue | Exit when |
|-------|--------|----------------|-----------|
| **Discovery Beta** | **Active** — chat, venues, maps, auth soak | Rows **1–52** below | SAN-462 3/3 + AUTH-011 + MAP-002B/008B + venues stop (VEN-031) + prod journey J05–J20 |
| **Commerce MVP Exit** | **Deferred** — Stripe + ledger | Rows **D1–D5** only | PAY-001 → PAY-003 → EVT-002 → EVT-001 (`plan.md` Sequence 1A) |

> **Conflict resolver:** `plan.md` Tier 1A lists commerce first for **full MVP exit**. While Discovery Beta is active, **ignore D1–D5 ordering** until commerce track is explicitly reopened.

| Dot | Meaning |
|-----|---------|
| 🟢 | Done (100%) |
| 🟡 | In progress |
| 🟥 | Blocked / critical bug |
| ⏸ | Deferred (Stripe / Phase 2 trips) |
| ⚪ | Not started |

**Hubs:** Screens [`wireframes/screens/INDEX.md`](docs/tasks/wireframes/screens/INDEX.md) · Venues [`venues/docs/tasks/INDEX-VENUE.md`](docs/tasks/venues/docs/tasks/INDEX-VENUE.md) · Trips [`trips/docs/tasks/INDEX.md`](docs/tasks/trips/docs/tasks/INDEX.md) · Mobile [`wireframes/mobile/index-mobile.md`](docs/tasks/wireframes/mobile/index-mobile.md) · UX [`wireframes/ux/README.md`](docs/tasks/wireframes/ux/README.md)

Deep audit → [`plan.md`](plan.md) · Routes → [`sitemap.md`](sitemap.md) · Forensic audit → [`notes/audit-01-tasks.md`](docs/tasks/notes/1/audit-01-tasks.md) · **Playbook** → [`notes/improve.md`](docs/tasks/notes/1/improve.md)

---

## Lean execution approach

One operator, shipping serially. Keep the floor, drop the ceremony.

1. **One task → ship → next.** One worktree, one PR per task (`ai/san-NNN-…`).
2. **Floor scoped to what you touched** — full floor before release gates (SAN-462, VEN-031), not every edit.
3. **PR + Linear = record** — paste runtime proof in PR body; durable evidence file for persona/prod gates only.
4. **Linear wins on Done** — this file owns order; patch when Linear diverges.
5. **Don't re-queue Done work** · **Don't touch D1–D5** until Commerce track reopens.
6. **Gates:** rows 1–10 parallel; UX 11–16 wait on SAN-462 3/3 only.

---

## Platform & data — Discovery Beta (rows 1–10)

Commerce deferred → [D1–D5](#deferred--commerce-mvp-exit).

| # | Task | Feature | Use case (real world) | % | Dot | Linear |
|--:|------|---------|------------------------|--:|:---:|--------|
| 1 | **SAN-462** | Prod chat synthetic smoke | **Sofía:** 3 nights in a row, prod answers *"1BR Laureles under $80"* + *"salsa this weekend"* without 5xx — merge chat PRs safely | 33 | 🟡 | [SAN-462](https://linear.app/sanjiovani/issue/SAN-462) |
| 2 | **AUTH-011** | Prod auth checklist | **Camila** signs up on iPhone at mdeai.co, logs in, session persists after refresh — not localhost-only | 100 | 🟢 | [SAN-367](https://linear.app/sanjiovani/issue/SAN-367) |
| 3 | **DATA-041** | `venue_signals` seed | **Carlos:** *"quiet rooftop Provenza"* ranks Relato / O.C.I. above generic Google placeholders | 100 | 🟢 | [SAN-379](https://linear.app/sanjiovani/issue/SAN-379) |
| 4 | **DATA-008** | Places backfill cron | **Sarah** opens café Details and sees **hours + phone** for Pergamino, not empty panel while agent waits on Google | 40 | 🟡 | [SAN-338](https://linear.app/sanjiovani/issue/SAN-338) |
| 5 | **PR-16** | Branch protection + Floor | **Sofía:** broken lint/test can't merge to `main` — Camila never hits a red deploy | 70 | 🟡 | [SAN-458](https://linear.app/sanjiovani/issue/SAN-458) |
| 6 | **MAP-008B** | Map ID on prod | **Tourist** searches restaurants — pins appear on map at Provenza, not blank *"No pins yet"* / DEMO_MAP_ID | 100 | 🟢 | [SAN-369](https://linear.app/sanjiovani/issue/SAN-369) |
| 7 | **MAP-002B** | ADK on prod | **Tourist** on prod chat: *"specialty coffee Laureles"* returns grounded café cards (Cloud Run sidecar live on Vercel) | 30 | 🟡 | [SAN-368](https://linear.app/sanjiovani/issue/SAN-368) |
| 8 | **F13** | Thread / `ai_runs` persistence | **Camila** turn 11 still remembers Laureles budget from turn 1 after Vercel cold-start | 50 | 🟡 | [SAN-548](https://linear.app/sanjiovani/issue/SAN-548) |
| 9 | **DATA-EMBED** | Embed API 403 fix | **Camila:** *"2BR near Estadio"* uses full hybrid semantic + keyword fusion, not keyword-only fallback | 30 | 🟡 | [SAN-545](https://linear.app/sanjiovani/issue/SAN-545) |
| 10 | **OPS-JOURNEY** | Prod journey J05–J20 | **Lucía** runs Carlos nightlife + Sarah brunch prompts on **mdeai.co** and logs PASS before venues stop | 25 | 🟡 | [SAN-546](https://linear.app/sanjiovani/issue/SAN-546) |

*Row 9:* embed 403 → `hybridUsed=false`; signal path OK. *Row 10:* [`09-prod-live-journey-matrix.md`](docs/tasks/testing/09-prod-live-journey-matrix.md).

---

## After soak — chat UX (rows 11–16)

Blocked until **SAN-462** 3/3 (row 1).

| # | Task | Feature | Use case (real world) | % | Dot | Linear |
|--:|------|---------|------------------------|--:|:---:|--------|
| 11 | **SEARCH-002** | Event hybrid UI | **Andrés:** *"salsa events this weekend"* shows ticketed **event cards in chat** (PR #38), not tool-only backend | 60 | 🟡 | [SAN-387](https://linear.app/sanjiovani/issue/SAN-387) |
| 12 | **UX-023** | `ResultCardShell` | **Camila** sees rental, event, restaurant, café cards with same layout — rating row, CTA strip, photo aspect | 10 | ⚪ | [SAN-437](https://linear.app/sanjiovani/issue/SAN-437) |
| 13 | **UX-024** | Hover → pin parity | **Camila** hovers Laureles rental card — matching pin pulses on map (desktop) | 0 | ⚪ | [SAN-438](https://linear.app/sanjiovani/issue/SAN-438) |
| 14 | **UX-029** | Retire `GroundedPlaceCard` | **Tourist** gets one café card component, not duplicate legacy + new card for same place | 0 | ⚪ | [SAN-443](https://linear.app/sanjiovani/issue/SAN-443) |
| 15 | **UX-033** | Stale marker cleanup | **Camila** searches events then rentals — old event pins disappear, no ghost markers in El Poblado | 0 | ⚪ | [SAN-323](https://linear.app/sanjiovani/issue/SAN-323) |
| 16 | **PR-18** | SHA-pin Actions | **Sofía:** CI uses pinned GitHub Action SHAs — supply-chain safe for merge automation | 0 | ⚪ | [SAN-460](https://linear.app/sanjiovani/issue/SAN-460) |

---

## Venues — implementation order (rows 17–37)

**Canonical spec:** [`INDEX-VENUE.md`](docs/tasks/venues/docs/tasks/INDEX-VENUE.md) · **Rules:** AUTH-009 before VEN-019 · VEN-031 = release gate

### Phase 2 — Restaurant + nightlife UI

| # | Task | Screen | Feature | Use case (real world) | % | Dot | Linear |
|--:|------|--------|---------|------------------------|--:|:---:|--------|
| 17 | **VEN-009** | in-chat | Restaurant result cards | **Carlos:** *"Italian dinner El Poblado"* → cards show cuisine, rating, price — not generic PlaceCard | 88 | 🟡 | [SAN-292](https://linear.app/sanjiovani/issue/SAN-292) |
| 18 | **VEN-010** | panel | Restaurant detail panel | **Carlos** taps O.C.I. → slide panel with photos, hours, **Book table** CTA | 90 | 🟡 | [SAN-293](https://linear.app/sanjiovani/issue/SAN-293) |
| 19 | **VEN-011** | routing | Nightlife grounding intent | Agent routes *"rooftop cocktails Provenza"* to nightlife search, not café tool | 70 | 🟡 | [SAN-294](https://linear.app/sanjiovani/issue/SAN-294) |
| 20 | **VEN-013** | panel | Nightlife detail panel | **Carlos** opens rooftop bar → safety copy, sibling venues, book CTA — mirror restaurant panel | 75 | 🟡 | [SAN-296](https://linear.app/sanjiovani/issue/SAN-296) |
| 21 | **SCREEN-023** | `/restaurants` | Restaurant browse page | **Tourist** browses `/restaurants` with filters — no chat required; PR merge pending prod | 95 | 🟡 | [SAN-490](https://linear.app/sanjiovani/issue/SAN-490) |
| 22 | **SCREEN-022** | `/nightlife` | Nightlife browse page | **Carlos** browses `/nightlife` — placeholder shell today; full browse after VEN-013 | 20 | 🟡 | [SAN-491](https://linear.app/sanjiovani/issue/SAN-491) |

*VEN-012 Done (#48): *"reggaeton club El Poblado"* opens nightlife panel, not café tabs.*

### Phase 3 — Places cache

| # | Task | Feature | Use case (real world) | % | Dot | Linear |
|--:|------|---------|------------------------|--:|:---:|--------|
| 23 | **VEN-014** | Places cache + field mask | **Sarah** sees Pergamino **opening hours** on panel — one masked Google call, cached 24h | 62 | 🟡 | [SAN-297](https://linear.app/sanjiovani/issue/SAN-297) |

### Phase 4 — Booking (persist ✅ — HITL next)

| # | Task | Feature | Use case (real world) | % | Dot | Spec |
|--:|------|---------|------------------------|--:|:---:|------|
| 24 | **VEN-015** | Booking schema + RLS | **Sarah's** booking row visible only to her + Patricia ops — anon can't read `venue_booking_requests` | 85 | 🟡 | [SAN-298](https://linear.app/sanjiovani/issue/SAN-298) |
| 25 | **VEN-017** | Shared booking sheet | **Carlos** picks date/party size for Mamacita — same RHF form for café, restaurant, nightlife | 80 | 🟡 | [SAN-300](https://linear.app/sanjiovani/issue/SAN-300) |
| 26 | **AUTH-009** | JWT → Mastra context | **Camila's** booking tool runs as *her* user — not anonymous server identity | 0 | ⚪ | [SAN-547](https://linear.app/sanjiovani/issue/SAN-547) |
| 27 | **VEN-019** | CopilotKit HITL booking | **Sarah:** agent shows booking form → *"Confirm send request?"* → she approves before DB write | 0 | ⚪ | [SAN-302](https://linear.app/sanjiovani/issue/SAN-302) |

*VEN-021 Done: form POST persists. VEN-020 Done: **Pending** chip on panel after submit.*

### Phase 5 — Booking ops

| # | Task | Feature | Use case (real world) | % | Dot | Spec |
|--:|------|---------|------------------------|--:|:---:|------|
| 28 | **VEN-022** | Draft WhatsApp to venue | **Host** gets WA draft: *"Hola, reserva para 4 el viernes en Relato…"* to paste/send | 0 | ⚪ | [SAN-308](https://linear.app/sanjiovani/issue/SAN-308) |
| 29 | **VEN-023** | Patricia WA outbox | **Patricia** reviews draft, approves, sends to venue — HITL before WhatsApp | 0 | ⚪ | [SAN-310](https://linear.app/sanjiovani/issue/SAN-310) |
| 30 | **VEN-024** | Admin booking queue | **Patricia** at `/admin/bookings` sees pending Provenza requests, marks confirmed | 0 | ⚪ | [SAN-311](https://linear.app/sanjiovani/issue/SAN-311) |

### Phase 6 — Hardening

| # | Task | Feature | Use case (real world) | % | Dot | Spec |
|--:|------|---------|------------------------|--:|:---:|------|
| 31 | **VEN-025** | RLS penetration tests | **User B** cannot fetch **User A's** Mamacita booking via API fuzz — proven in CI | 0 | ⚪ | [SAN-313](https://linear.app/sanjiovani/issue/SAN-313) |
| 32 | **VEN-026** | Idempotency + duplicate UX | **Sarah** double-taps Book — one row in DB, UI shows existing request not twins | 55 | 🟡 | [SAN-305](https://linear.app/sanjiovani/issue/SAN-305) |
| 33 | **VEN-027** | WhatsApp consent | **Sarah** opts in before venue gets WA — legal gate for Colombia outreach | 0 | ⚪ | [SAN-309](https://linear.app/sanjiovani/issue/SAN-309) |
| 34 | **VEN-028** | Retry + error recovery | **Carlos** sees *"Could not save — retry"* not silent fail when Supabase down | 0 | ⚪ | [SAN-306](https://linear.app/sanjiovani/issue/SAN-306) |
| 35 | **VEN-029** | Tool/action registry CI | **Sofía:** `requestVenueBooking` Mastra key = CopilotKit action name — no prod 404 on HITL | 70 | 🟡 | [SAN-303](https://linear.app/sanjiovani/issue/SAN-303) |
| 36 | **VEN-030** | Admin audit log | **Patricia** sees who changed booking from pending → confirmed and when | 0 | ⚪ | [SAN-312](https://linear.app/sanjiovani/issue/SAN-312) |

### Phase 7 — E2E release gate

| # | Task | Feature | Use case (real world) | % | Dot | Spec |
|--:|------|---------|------------------------|--:|:---:|------|
| 37 | **VEN-031** | Playwright venue suite | **Lucía:** signed-in flow — chat → book café → chip pending → `/restaurants` browse — green on CI | 40 | 🟡 | [SAN-314](https://linear.app/sanjiovani/issue/SAN-314) |

**Venues MVP stop:** VEN-031 + VEN-025 + OPS-JOURNEY J05–J08 on prod.

### Venues — done

| Task | Feature | Use case (real world) | % |
|------|---------|------------------------|--:|
| **VEN-012** | Café vs nightlife split | **Carlos** *"rooftop cocktails"* → `NightlifeDetailPanel`, not café tabs | 100 |
| **VEN-021** | Booking persist API | **Sarah** submits form → row in `venue_booking_requests` with her `user_id` | 100 |
| **VEN-020** | Status chips | **Sarah** sees **Pending** on Relato panel after booking | 100 |
| **SEARCH-003** | Hybrid restaurant search | **Carlos** Provenza query ranks signal-boosted venues from `venue_signals` | 100 |
| **DATA-003–007, 009, 035** | Seeds + golden queries | Ops can replay GQ-S01–S04 in CI | 100 |
| **SCREEN-021** | Café browse + book | **Tourist** at `/cafes` map + book quiet workspace | 100 |
| **SCREEN-007** | Event venue sheet | **Roberto** picks event space from map sheet | 100 |
| **VEN-016/018** | Mastra booking tool + registry | Agent can call `requestVenueBooking` with UI mirror | 100 |
| **VEN-031b** | Café e2e ask-prompt | Playwright café booking path stable | 100 |
| **VEN-014b** | Places retry guard | Panel doesn't hammer Google on 403 storm | 100 |

### Venues — deferred (Phase 8+)

| Track | Use case (real world) | Index |
|-------|------------------------|-------|
| **VEB-001…012** | **Roberto** books Mamacita for birthday private event — proposal + deposit | [`event-booking/INDEX.md`](docs/tasks/venues/docs/tasks/event-booking/INDEX.md) |
| **VEN-032…043** | Coffee tour product for **Tourist** (Phase 2 optional) | [`mvp-index.md`](docs/tasks/venues/docs/tasks/mvp/mvp-index.md) |
| **INT-008** | Café intelligence wrapper after J07 prod proof | [`intelligence/`](docs/tasks/intelligence/) |

---

## Other screens (rows 38–41)

| # | Task | Route | Feature | Use case (real world) | % | Dot | Linear |
|--:|------|-------|---------|------------------------|--:|:---:|--------|
| 38 | **SCREEN-005** + **SEARCH-001** | `/rentals` | Rental browse + hybrid | **Camila** opens `/rentals` — browse Laureles 1BR cards + map (**today: redirect to chat**) | 25 | 🟥 | [SAN-242](https://linear.app/sanjiovani/issue/SAN-242) · [SAN-386](https://linear.app/sanjiovani/issue/SAN-386) |
| 39 | **SCREEN-017** | `/login`, `/signup` | Auth polish | **Andrés** logs in from Stripe checkout return URL lands on `/me/tickets`, not broken redirect | 90 | 🟡 | [SAN-112](https://linear.app/sanjiovani/issue/SAN-112) |
| 40 | **EVP-014** | `/host/events` | Host event list | **Roberto** sees *Medellín Tech Meetup* + draft events on `/host/events` | 0 | ⚪ | [SAN-118](https://linear.app/sanjiovani/issue/SAN-118) |
| 41 | **SCREEN-010** | `/` map column | Map exploration panel | **Tourist** drills into map column place list without new chat turn | 0 | ⚪ | [SAN-111](https://linear.app/sanjiovani/issue/SAN-111) |

Platform shell **SCREEN-001/002/004/006/015/019/020** → [Done below](#screens--platform-done).

---

## Mobile (rows 42–48)

| # | Task | Feature | Use case (real world) | % | Dot | Linear |
|--:|------|---------|------------------------|--:|:---:|--------|
| 42 | **SCREEN-018** | Mobile 3-panel shell | **Camila** on iPhone: chat drawer + map + FAB — usable `dvh`, not clipped header | 100 | 🟢 | [SAN-489](https://linear.app/sanjiovani/issue/SAN-489) |
| 43 | **MOB-CK-001** | CK mobile baseline | **Camila** hits 44px Send target with thumb — safe-area on notch iPhones | 60 | 🟡 | [SAN-521](https://linear.app/sanjiovani/issue/SAN-521) |
| 44 | **MOB-CHAT-001** | Composer + keyboard | **Camila** types rental query — Send stays visible above iOS keyboard | 0 | ⚪ | [SAN-522](https://linear.app/sanjiovani/issue/SAN-522) |
| 45 | **MAP-011-M** | Single mobile map | **Tourist** switches chat ↔ map — one map instance, no duplicate loaders | 0 | ⚪ | [SAN-524](https://linear.app/sanjiovani/issue/SAN-524) |
| 46 | **MOB-CARD-001** | Card carousel | **Camila** swipes rental cards horizontally — Book / Details tappable | 0 | ⚪ | [SAN-525](https://linear.app/sanjiovani/issue/SAN-525) |
| 47 | **AIM-010** | Mobile AI UX | **Tourist** taps *Events* / *Rentals* chips — skeleton while agent streams | 0 | ⚪ | [SAN-523](https://linear.app/sanjiovani/issue/SAN-523) |
| 48 | **AUTH-006** | Mobile OAuth Safari | **Camila** Google login in Mobile Safari completes without cookie loop | 0 | ⚪ | [SAN-527](https://linear.app/sanjiovani/issue/SAN-527) |

---

## Intelligence agents (rows 49–50)

| # | Task | Feature | Use case (real world) | % | Dot | Linear |
|--:|------|---------|------------------------|--:|:---:|--------|
| 49 | **INT-003** | Smart rental clarify | **Camila:** *"when can I view?"* after Laureles search → agent asks neighborhood/budget, not generic form | 15 | ⚪ | [SAN-406](https://linear.app/sanjiovani/issue/SAN-406) |
| 50 | **INT-004** | No canned clarify bypass | **Camila:** *"2BR Poblado"* partial query → real agent clarify, not hardcoded shortcut | 0 | ⚪ | [SAN-407](https://linear.app/sanjiovani/issue/SAN-407) |

*AUTH-009 → row 26.*

---

## Deferred — Commerce MVP Exit (rows D1–D5)

**Inactive while Discovery Beta is active.**

| # | Task | Feature | Use case (real world) | % | Dot | Linear |
|--:|------|---------|------------------------|--:|:---:|--------|
| D1 | **PAY-001** | Live ticket purchase | **Andrés** buys salsa night ticket on mdeai.co → Stripe paid → QR in `/me/tickets` | 70 | ⏸ | [SAN-178](https://linear.app/sanjiovani/issue/SAN-178) |
| D2 | **PAY-003** | Webhook isolation | Sponsor payment webhook can't mark **Andrés's** ticket paid — separate secrets | 40 | ⏸ | [SAN-116](https://linear.app/sanjiovani/issue/SAN-116) |
| D3 | **EVT-002** | Roberto publish prod | **Roberto** publishes *Tech Meetup* on prod — live row in Supabase, public slug | 85 | ⏸ | [SAN-366](https://linear.app/sanjiovani/issue/SAN-366) |
| D4 | **EVT-001** | MVP ledger | **Patricia** signs MVP proof ledger after commerce + host green | 0 | ⏸ | [SAN-115](https://linear.app/sanjiovani/issue/SAN-115) |
| D5 | **PAY-005** | Mobile checkout | **Andrés** completes ticket buy on phone Safari — Stripe mobile flow | 0 | ⏸ | [SAN-526](https://linear.app/sanjiovani/issue/SAN-526) |

*TRIP-010 blocked on D1.*

---

## Phase 2 — Trips (rows T1–T19)

**Start after:** venues stop (17–37) + AUTH-011 + MAP-008B.

| # | Task | Route / screen | Feature | Use case (real world) | % | Dot | Spec |
|--:|------|----------------|---------|------------------------|--:|:---:|------|
| T1 | **TRIP-001** | data | Supabase audit | **Sofía** proves `trips` / `trip_items` RLS ready — evidence before UI ship | 25 | ⚪ | [`TRIP-001`](docs/tasks/trips/docs/tasks/TRIP-001-trips-supabase-audit-evidence.md) |
| T2 | **TRIP-002** | `/trips` | Dashboard polish | **Camila** sees *"Move to Laureles Jan 2026"* card + empty state for first trip | 35 | 🟡 | [`TRIP-002`](docs/tasks/trips/docs/tasks/TRIP-002-trips-dashboard-polish.md) |
| T3 | **TRIP-003** | modal | Create trip modal | **Camila** sets dates + budget — *"2 weeks remote work Poblado"* | 0 | ⚪ | [`TRIP-003`](docs/tasks/trips/docs/tasks/TRIP-003-create-trip-modal.md) |
| T4 | **TRIP-004** | `/trips/[id]` | Workspace shell | **Camila** opens trip → tabs: Itinerary / Map / chat context | 30 | 🟡 | [`TRIP-004`](docs/tasks/trips/docs/tasks/TRIP-004-trip-workspace-shell.md) |
| T5 | **TRIP-005** | panel | Itinerary tab | **Camila** sees Mon brunch + Tue viewing grouped — overlap warning baseline | 25 | 🟡 | [`TRIP-005`](docs/tasks/trips/docs/tasks/TRIP-005-itinerary-tab-hardening.md) |
| T6 | **TRIP-006** | `/saved` | Saved collections | **Camila** hearts rentals/events — `/saved` grid of collections | 40 | 🟡 | [`TRIP-006`](docs/tasks/trips/docs/tasks/TRIP-006-saved-collections-page.md) |
| T7 | **TRIP-007** | cards | Add-to-trip | **Camila** *Add to trip* on rental card → `trip_items` row + rollback on fail | 0 | ⚪ | [`TRIP-007`](docs/tasks/trips/docs/tasks/TRIP-007-add-to-trip-from-cards.md) |
| T8 | **TRIP-008** | map tab | Trip map pins | **Camila** trip map shows saved café + rental pins clustered in Laureles | 0 | ⚪ | [`TRIP-008`](docs/tasks/trips/docs/tasks/TRIP-008-trip-map-google-pins.md) |
| T9 | **TRIP-009** | HITL | Conflict approval | **Camila** adds viewing same time as brunch — overlap warning + approve/reschedule | 0 | ⚪ | [`TRIP-009`](docs/tasks/trips/docs/tasks/TRIP-009-conflict-persist-hitl.md) |
| T10 | **TRIP-010** | checkout | Ticket → trip | **Andrés's** paid salsa ticket auto-appears on *Medellín Weekend* itinerary | 0 | ⏸ | [`TRIP-010`](docs/tasks/trips/docs/tasks/TRIP-010-booking-trip-item-sync.md) |
| T11 | **TRIP-013** | worker | Reconciliation | Paid ticket missing from itinerary repaired overnight — **Andrés** still sees event | 0 | ⚪ | [`TRIP-013`](docs/tasks/trips/docs/tasks/TRIP-013-booking-reconciliation-worker.md) |
| T12 | **TRIP-014** | RLS pen tests | **User B** cannot read **Camila's** trip workspace | 0 | ⚪ | [`TRIP-014`](docs/tasks/trips/docs/tasks/TRIP-014-rls-penetration-verification.md) |
| T13 | **TRIP-015** | Places hydration | Itinerary shows venue hours from cache — no browser Places key leak | 0 | ⚪ | [`TRIP-015`](docs/tasks/trips/docs/tasks/TRIP-015-places-cache-hydration.md) |
| T14 | **TRIP-016** | Mobile workspace | **Camila** on phone: bottom-sheet map + sticky add-to-trip | 0 | ⚪ | [`TRIP-016`](docs/tasks/trips/docs/tasks/TRIP-016-mobile-workspace-hardening.md) |
| T15 | **TRIP-017** | Observability | **Patricia** traces why Andrés ticket didn't land on trip — sync logs | 0 | ⚪ | [`TRIP-017`](docs/tasks/trips/docs/tasks/TRIP-017-observability-sync-logs.md) |
| T16 | **TRIP-018** | Lifecycle states | **Camila** marks trip *completed* — archived from active dashboard | 0 | ⚪ | [`TRIP-018`](docs/tasks/trips/docs/tasks/TRIP-018-trip-lifecycle-states.md) |
| T17 | **TRIP-019** | Retry + optimistic UI | Failed add-to-trip rolls back card state — no phantom itinerary row | 0 | ⚪ | [`TRIP-019`](docs/tasks/trips/docs/tasks/TRIP-019-retry-optimistic-ui-recovery.md) |
| T18 | **TRIP-011** | Playwright suite | **Lucía:** `/trips`, `/trips/[id]`, `/saved` green on CI | 0 | ⚪ | [`TRIP-011`](docs/tasks/trips/docs/tasks/TRIP-011-playwright-suite.md) |
| T19 | **TRIP-012** | Prod smoke | Trips stop verified on **mdeai.co** after deploy | 0 | ⚪ | [`TRIP-012`](docs/tasks/trips/docs/tasks/TRIP-012-production-smoke-floor.md) |

**Trips stop:** T1–T9 + T11, T12, T15, T17, T18, T19 (T10 if D1 reopened).

### Trips — data layer done

| Task | Feature | Use case (real world) | % |
|------|---------|------------------------|--:|
| **DATA-026** | Schema inventory | Trips tables documented for TRIP-001 audit | 100 |
| **DATA-027** | `trip_items` RPC | Valid insert types for rental/event/venue/booking | 100 |
| **DATA-029** | `trip_id` on commerce | Ticket order can link to Camila's trip when T10 ships | 100 |
| **DATA-030** | Golden queries | CI replays trip item queries | 100 |

---

## Screens — platform done

| Task | Route | Feature | Use case (real world) | % |
|------|-------|---------|------------------------|--:|
| **SCREEN-001** | `/` | Home chat chrome | **Camila** lands on concierge + map split | 100 |
| **SCREEN-002** | `/` | Nav rail + threads | **Camila** switches past Laureles search threads | 100 |
| **SCREEN-004** | `/host/event/new` | Host wizard | **Roberto** AI-fills event + HITL publish | 100 |
| **SCREEN-006** | `/` | Event cards | **Andrés** sees salsa cards in chat | 100 |
| **SCREEN-015** | `/me/tickets` | Ticket wallet | **Andrés** QR for purchased event | 100 |
| **SCREEN-019/020** | cross-cutting | Loading/error + a11y | Skeleton + error boundaries on slow Places | 100 |
| **G2** | `/` overlay | Schedule viewing | **Camila** books apartment viewing from rental card | 100 |

---

## Quick rules

1. **Discovery Beta active** — rows 1–50; **Commerce Exit deferred** — D1–D5 only when reopened.
2. **Rows 1, 10** — SAN-462 soak + prod journey matrix gate UX rows 11–16.
3. **Rows 17–22** — venues UI; **SCREEN-022** blocked on **VEN-013**.
4. **Row 26 → 27** — **AUTH-009 before VEN-019 HITL**.
5. **Row 37** — VEN-031 after booking spine + prod J05–J08.
6. **T1–T19** — Phase 2 trips; after venues MVP + AUTH-011 + MAP-008B.

*Verified 2026-06-04 · prod `bf40ef9` · vitest **485/486** (1 smoke fail) · MVP board: [`phase:mvp` view](https://linear.app/sanjiovani/view/mvp-48ab105e7f0a) · tracker: [`docs/tasks/progres.md`](docs/tasks/progres.md)*
