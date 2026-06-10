# Events focus — what's next (2026-06-04)

> **`/host/events` (SAN-118) is DONE + merged to prod** (`facfc2f`, PR #63). Roberto can now
> *see* his events. The open loop: prove he can *publish* one. Reviewed live: **Events Platform**
> project (44 Todo · 1 Done · 1 In Progress) + **Screens** project.

## Events board reality (verified Linear, 2026-06-04)

- **Only ONE launch-phase event task exists:** **SAN-366 · EVT-002 — Host publish production proof**
  (`phase:launch`, High, Todo). Spec `G3-core-host-publish-proof`: *"Roberto publishes an event
  through the host wizard on production and the live event row appears in Supabase."* This is the
  **G3 North-star** and the direct sequel to `/host/events` — a successful publish populates the
  page I just shipped.
- **Everything else in Events Platform is out of MVP phase:** 12 contest tasks (CTEST-000…011,
  SAN-532–543, `phase:phase2`) + the full discovery/social pack (EVT-001…032, SAN-119–150,
  `phase:post-mvp`). Skip for launch.
- **Done already:** event cards in chat (SAN-117), event detail `/events/[slug]`, host wizard
  `/host/event/new` (SCREEN-016), `/host/events` (SAN-118).
- **Commerce/ticket side is the DEFERRED track** (tasks.md D1–D5): G1 paid ticket (PAY-001/SAN-178),
  webhook (PAY-003/SAN-116) — not active while Discovery Beta runs.

## ⚠️ Conflict to resolve

`tasks.md` files **EVT-002 in the deferred Commerce track** (D3, "after PAY-003"). But host
**publish** doesn't touch Stripe — it's separable from the payment webhook. The publish-proof half
(create → publish → row in Supabase → shows on `/host/events`) can be done **now**, independent of
commerce, and it validates the screen just shipped. Recommend doing that half now; leave ticket
purchase (G1) in the deferred track.

## Recommended next — pick one

| # | Task | What it is | Why now |
|--:|------|-----------|---------|
| **1** | **SAN-366 · EVT-002 host publish proof** | Run Roberto's wizard on **prod** → publish → verify `events` row + it appears on `/host/events`. Mostly a **proof/verification** task (the wizard + commit API are already LIVE), capture evidence. | Closes the G3 North-star loop; directly exercises the page just shipped; I have an authed prod session. |
| 2 | Polish `/host/events` follow-ups | Authenticated e2e for the **populated grid** (needs an auth fixture) + a published-event seed. | Hardens SAN-118 beyond the empty-state proof. |
| 3 | Event venue-booking wireframes | Screens project **VEB-W01–W05** (SAN-510–514, `doc:wireframe`, phase-1) — Roberto books a venue *for* an event. | These are **spec/wireframe** tasks, not builds — design work, not a screen ship. |
| 4 | `/events` browse page | SCREEN-027 (SAN-518) — public event catalog. | `phase:post-mvp` — out of phase, skip. |

**Recommendation:** **#1 (SAN-366)** — it's the only launch-phase event task, needs no new build
(wizard + `/api/approval-commit` are LIVE), and a green publish lands a real card on the
`/host/events` page just shipped. Want me to run the prod publish flow and capture the G3 evidence?

---

# Next — basic screens design (2026-06-03)

> **Focus this session:** stand up the *basic* screens across the app — get every MVP
> route looking right (layout, cards, empty/loading states) **without** wiring every
> backend feature. "Looks done, feature-light" beats "half-wired, looks broken."
>
> Sources: [`tasks.md`](../../../tasks.md) rows 11–41 · [`sitemap.md`](../../../sitemap.md) Critical gaps ·
> Screens hub [`wireframes/screens/INDEX.md`](../../wireframes/screens/INDEX.md) · MVP view
> <https://linear.app/sanjiovani/view/mvp-48ab105e7f0a>

## Reality check (verified on disk + Linear, 2026-06-03)

- **Linear "screens" project** (`screens-c954b41b2344`) is the **canonical screen board — 52 issues**:
  Backlog 20 · Todo 10 · In Progress 1 · In Review 9 · Done 12. (Use `UIX-*` / `SCREEN-*` /
  `VEB-W*` IDs here, not the older `SCREEN-*` rows in `tasks.md` — they overlap but the board wins.)
- `page.tsx` exists for: `/`, `/chat`, `/login`, `/signup`, `/rentals`, `/restaurants`,
  `/cafes`, `/nightlife`, `/saved`, `/trips`, `/trips/[id]`, `/host/event/new`.
- **Missing entirely:** `/host/events`, `/rentals/[id]`, `/restaurants/[slug]`.
- **SHELL / broken (look bad today):** `/rentals` (display broken since 2026-05-27),
  `/cafes` (placeholder), `/nightlife` (placeholder), `/trips` (shell — Phase 2, skip).

### ⚠️ Phase-label discrepancy — reconcile before building

The board's own phase labels **disagree** with `tasks.md` on the rentals work:

| Screen | Board issue | Board phase label | `tasks.md` says |
|--------|-------------|-------------------|-----------------|
| Rental browse `/rentals` | SAN-478 (Todo) + SAN-244 (Backlog) | `phase:phase2` / `phase:post-mvp` | row 38 **P0 broken** 🟥 |
| Rental detail `/rentals/[id]` | SAN-479 (Todo) | `phase:phase2` | new, MVP P1 |
| Cafés browse `/cafes` | SAN-519 (Backlog) | `phase:post-mvp` | sitemap P1 |
| **Note:** SAN-242 (SCREEN-005 *Rental Card Polish*) is **Done** — the *card* is done; the *browse page* is the open work. |

So on the board, the only **`phase:mvp` + not-done** browse/list screens are **Host Events (SAN-118)**
and **Nightlife (SAN-491)**. If `/rentals` browse is truly Camila's P0 path, its board issues
(SAN-478/SAN-479) should be re-labeled `phase:mvp` — flag this with the user.

### What's already Done / In Review (don't rebuild)

- **Done (12):** SCREEN-001 home chrome, SCREEN-002 nav rail, SCREEN-003 query bar, SCREEN-005 rental
  card polish, SCREEN-006 event card, SCREEN-007 detail sheet, SCREEN-014 event detail, SCREEN-016
  host wizard, SCREEN-018 mobile shell, SCREEN-023 restaurant listings, SCREEN-011 saved, CAF-001 café cards.
- **In Review (9):** SCREEN-004 workflow strip, SCREEN-008 schedule modal, SCREEN-009 checkout,
  SCREEN-012 trips dashboard, SCREEN-013 itinerary, SCREEN-015 tickets+QR, SCREEN-019 loading/error,
  SCREEN-020 a11y pass, UX-011 map panel. → **Move these to Done** (review/merge) before building new.

## Do this first — the design primitive

**UX-023 · `ResultCardShell` · SAN-437** (UX board, ~10% — *not* in the screens project) — one
shared card (photo aspect, rating row, price, CTA strip) the browse screens reuse. Note the
per-vertical cards are **already Done** on the screens board: SCREEN-005 rental (SAN-242),
SCREEN-006 event (SAN-236), CAF-001 café (SAN-114) — so this is a **consolidation** (one shell,
retire `GroundedPlaceCard` via UX-029/SAN-443), not a net-new build. Do it before stamping new
browse pages so they don't fork the card markup again.

## Build order — basic screens (ranked: persona value × pure-UI-ness)

Board IDs below are the **live `screens` project** issues (verified 2026-06-03).

| # | Screen | Route | Board issue | Board state | Basic-version scope |
|--:|--------|-------|-------------|-------------|---------------------|
| 1 | **Host event list** | `/host/events` | EVT-014 · [SAN-118](https://linear.app/sanjiovani/issue/SAN-118) | Todo · `phase:mvp` | Pure list screen: Roberto's events + draft/published chips + empty state. No new backend — read events he owns. **Only phase:mvp list screen with no page yet.** |
| 2 | **Rentals browse** | `/rentals` | REAL-011 · [SAN-478](https://linear.app/sanjiovani/issue/SAN-478) | Todo · `phase:phase2`* | Card grid + map placeholder + filter bar. Camila's #1 path — shows nothing today. *Board labels it phase2; re-label to mvp if it's really P0.* Card (SAN-242) already Done. |
| 3 | **Rental detail** | `/rentals/[id]` | REAL-012 · [SAN-479](https://linear.app/sanjiovani/issue/SAN-479) | Todo · `phase:phase2`* | Photo header + specs + map pin + "Schedule viewing" CTA (SCREEN-008/SAN-262 modal already exists). Cards link nowhere today. |
| 4 | **Nightlife browse** | `/nightlife` | SCREEN-022 · [SAN-491](https://linear.app/sanjiovani/issue/SAN-491) | Backlog · `phase:mvp` | Upgrade placeholder to real browse layout. *Data* depth blocked on VEN-013, but the *basic screen* isn't. |
| 5 | **Cafés browse** | `/cafes` | SCREEN-028 · [SAN-519](https://linear.app/sanjiovani/issue/SAN-519) | Backlog · `phase:post-mvp` | Upgrade placeholder to catalog layout. In-chat café cards (CAF-001/SAN-114) already Done — reuse them. |
| 6 | **Restaurants browse** | `/restaurants` | SCREEN-023 · [SAN-490](https://linear.app/sanjiovani/issue/SAN-490) | **Done** | Already shipped on the board; `tasks.md` shows PR pending prod deploy. Just confirm it's live on mdeai.co. |

*Login/signup polish (`tasks.md` SCREEN-017 / SAN-112) is not in the screens project — track it on the UX board.*

**Suggested session arc:** `/host/events` (1, the clean phase:mvp win) → confirm the rentals
phase label with the user → `/rentals` browse (2) → `/rentals/[id]` (3). That's the spine of
Roberto + Camila's visible journey.

## Screen inventory — names + short descriptions

Every MVP-phase screen, by name. ✅ live · ⚠️ shell/placeholder · ⚪ not built · 🔵 in PR.

### Consumer screens

| Screen name | Route | State | What it shows |
|-------------|-------|:-----:|---------------|
| **Home Concierge** | `/` | ✅ | Landing — hero + chat concierge split with map column; entry to every vertical. |
| **Chat** | `/chat` | ✅ | Alias of `/`; canonical concierge surface (kept for bookmarks). |
| **Venue Detail Sheet** | `/chat` overlay | ✅ | Slide-over panel — rental/venue/event details over the chat. |
| **Schedule Viewing Modal** | `/chat` overlay | ✅ | Camila books a rental viewing (HITL lead capture). |
| **Rentals Browse** | `/rentals` | 🟥 | Apartment search results — card grid + map pins + filters. *Broken today.* |
| **Rental Detail** | `/rentals/[id]` | ⚪ | Single apartment — photos, specs, map, "Schedule viewing" CTA. |
| **Restaurants Browse** | `/restaurants` | 🔵 | Restaurant list — cuisine/rating/price cards + filters, no chat needed. |
| **Cafés Browse** | `/cafes` | ⚠️ | Café catalog — quiet-workspace cards + map. Placeholder today. |
| **Nightlife Browse** | `/nightlife` | ⚠️ | Bars/clubs catalog — cards + safety copy + map. Placeholder today. |
| **Event Detail** | `/events/[slug]` | ✅ | Single event — ticket tiers + Buy CTA. |
| **Ticket Checkout** | `/events/[slug]` overlay | ⚠️ | Stripe checkout (session works; webhook finalize missing). |
| **Saved** | `/saved` | ✅ | Hearted places + collections grid. |
| **Ticket Wallet** | `/me/tickets` | ✅ | All purchased tickets (Andrés). |
| **Single Ticket / QR** | `/me/tickets/[id]` | ✅ | One ticket + QR to scan at the door. |
| **Login** | `/login` | ✅ | Email/OAuth sign-in (visual polish pending). |
| **Signup** | `/signup` | ✅ | Account creation (visual polish pending). |

### Host / supply screens

| Screen name | Route | State | What it shows |
|-------------|-------|:-----:|---------------|
| **Host Event Wizard** | `/host/event/new` | ✅ | Roberto AI-fills an event + HITL approve/publish. |
| **Host Event List** | `/host/events` | ⚪ | Roberto's events — draft/published chips, sales, empty state. |

### Out-of-phase (Phase 2 / POST — listed for context, do NOT build now)

| Screen name | Route | What it would show |
|-------------|-------|--------------------|
| **Trips Dashboard** | `/trips` | Camila's trip cards + create-trip entry. |
| **Trip Workspace** | `/trips/[id]` | Itinerary / map / chat tabs for one trip. |
| **AI Profile** | `/me/profile` | View/edit/delete personalization memory. |
| **Onboarding Wizard** | `/onboarding` | Post-signup preferences + neighborhood. |
| **Admin Ops** | `/admin/*` | Patricia's leads CRM, listing/event moderation, cost panel. |
| **Broker Dashboard** | `/broker/*` | Operator leads inbox, listings, payouts. |

## Guardrails for screen work (don't skip)

- **Read [`DESIGN.MD`](../../../DESIGN.MD) first** — oklch tokens only, no hardcoded `gray-*`.
- Use the **`responsive-design`** + **`shadcn`** skills; every screen needs skeletons,
  empty states, error states, `prefers-reduced-motion`, and 44px touch targets.
- Each `<Map>` needs `mapId`; each Places call needs `X-Goog-FieldMask` (if you touch data).
- One worktree, one PR per screen (`ai/san-NNN-…`). Localhost runtime proof required for Done.

## Out of phase — do NOT build now

`/trips` + `/trips/[id]` (Phase 2 · rows T1–T19), `/admin/*`, `/broker/*`, `/me/profile`,
`/about`, `/partners`, `/onboarding`, `/legal/*`, `/notifications` (all ⚫ POST / 💫 Phase 2
in sitemap). Building these is scope creep.

---

## Parallel track (platform/data — not screens, from 06-04 audit)

Kept for reference; not this session's focus.

1. **SAN-462** — wait for 2 more scheduled prod synthetic greens (1/3 now).
2. **SAN-368 MAP-002B** — Vercel ADK env → redeploy → prod café grounded cards.
3. **SAN-458 PR-16** — GitHub branch protection (Floor + review).
4. **SAN-547 AUTH-009** — JWT → Mastra (unblocks VEN-019 HITL).
5. **SAN-545 DATA-EMBED** — fix rental embed 403 / hybrid search.

Full tracker: [`tasks/progres.md`](../../progres.md)
</content>
</invoke>
