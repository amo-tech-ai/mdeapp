**4 new Linear issues created; 4 existing issues updated.** The main browse tasks (519/478/518) were already there — the gaps were spec, API, nav-enable tracking, and events design coverage.

## New issues

| Linear | Title | Why it was missing |
|--------|-------|-------------------|
| [SAN-584](https://linear.app/sanjiovani/issue/SAN-584) | **SCR-002b** — Explore sidebar: enable nav links at browse Done | No task tracked flipping `href: null` → real paths when browse ships |
| [SAN-585](https://linear.app/sanjiovani/issue/SAN-585) | **SPEC-027** — Author events browse scr + wire on disk | SAN-518 existed but no disk scr (cafés/rentals have one) |
| [SAN-586](https://linear.app/sanjiovani/issue/SAN-586) | **DATA-036** — Public published-events list API | Chat has `/api/events/search`; browse needs catalog list for SSR |
| [SAN-587](https://linear.app/sanjiovani/issue/SAN-587) | **D-09b** — Re-skin `/events` browse | D-09 (SAN-575) excluded `/events`; child of SAN-566 |

## Updated existing issues

| Linear | Changes |
|--------|---------|
| [SAN-518](https://linear.app/sanjiovani/issue/SAN-518) | Todo · `phase:mvp` · blocked by SAN-585 + SAN-586 · nav + E2E AC |
| [SAN-519](https://linear.app/sanjiovani/issue/SAN-519) | Todo · `phase:mvp` · disk spec link · nav + E2E AC |
| [SAN-478](https://linear.app/sanjiovani/issue/SAN-478) | `phase:mvp` (was phase2) · disk spec · nav + E2E AC · removed stale REAL-004–007 gate |
| [SAN-575](https://linear.app/sanjiovani/issue/SAN-575) | Row 5 `/events` → SAN-587 D-09b |

## Already covered — no new issue needed

| Area | Owner |
|------|--------|
| Cafés browse | SAN-519 + disk scr exists |
| Rentals browse | SAN-478 + SAN-479 detail |
| Events browse build | SAN-518 |
| Chat cards/API | SAN-114, SCREEN-005, SAN-236, SAN-387 |
| Design polish | SAN-574–580 (SAN-587 adds events) |
| Mobile browse | MOB-CARD-001 (generic) |

## Recommended order (events path)

```
SAN-586 (DATA-036) → SAN-585 (SPEC-027) → SAN-518 (build) → SAN-584 (nav flip) → SAN-587 (D-09b skin)
```

Cafés/rentals: **SAN-519** / **SAN-478** → nav flip per **SAN-584** → **SAN-575** skin when D-08 lands.

Want me to write the SPEC-027 disk scr file next (SAN-585 deliverable)?


**Verdict:** Greyed Explore items are **intentional** — `href: null` in `chat-nav-rail.tsx` disables Cafés, Rentals, and Events until catalog browse ships. Chat paths work; browse does not. **Do not enable sidebar links today.**

---

## Why they're greyed out

```36:43:mdeapp/src/components/chat/chat-nav-rail.tsx
// Status mirrors sitemap.md: live verticals link out; SHELL/MVP/POST are placeholders.
const EXPLORE_ITEMS: NavItem[] = [
  { slug: "restaurants", label: "Restaurants", href: "/restaurants", Icon: UtensilsCrossed },
  { slug: "cafes", label: "Cafés", href: null, Icon: Coffee },
  { slug: "nightlife", label: "Nightlife", href: "/nightlife", Icon: Wine },
  { slug: "rentals", label: "Rentals", href: null, Icon: Building2 },
  { slug: "events", label: "Events", href: null, Icon: CalendarDays },
];
```

Disabled rows render `aria-disabled`, 50% opacity, and a **"Coming soon"** tooltip — same pattern as Trips/Profile. Active items (Restaurants, Nightlife) match **SAN-490** and **SAN-491** Done browse pages.

**Reference bar (what “enabled” looks like):**

| Vertical | Sidebar | Browse | Owner |
|----------|---------|--------|-------|
| Restaurants | ✅ `/restaurants` | Full grid + map | SAN-490 Done |
| Nightlife | ✅ `/nightlife` | Full grid + map | SAN-491 shipped |
| Cafés | ⚪ disabled | SHELL placeholder | SAN-519 Backlog |
| Rentals | ⚪ disabled | Redirect → `/chat` | SAN-478 Todo |
| Events | ⚪ disabled | **No `/events` route** | SAN-518 Backlog |

---

## Per-vertical audit table

| Area | Sidebar Exists | Route Exists | Data Exists | Cards Exist | Browse Page Exists | Task Coverage % | Missing Tasks |
|------|----------------|--------------|-------------|-------------|-------------------|-----------------|---------------|
| **Cafés** | ✅ (disabled) | ⚠️ SHELL `/cafes` — EmptyState only | ✅ DATA-035 anchors + chat grounding | ✅ `cafe-result-card` (SAN-114) | ❌ Placeholder | **~55%** | SAN-519, E2E `SCREEN-028-*`, nav-enable AC, optional SAN-574/575 |
| **Rentals** | ✅ (disabled) | ⚠️ `/rentals` → `redirect("/chat")` | ✅ `/api/rentals/search` + Supabase | ✅ `rental-card` (SCREEN-005) | ❌ No catalog | **~45%** | SAN-478, SAN-479 (detail), E2E `REAL-011-*`, nav-enable AC, phase label fix |
| **Events** | ✅ (disabled) | ❌ No `/events` — only `/events/[slug]` | ✅ `hybrid_search_events` + `/api/events/search` | ✅ `event-card` (SCREEN-006) | ❌ Missing entirely | **~40%** | SAN-518, **disk scr for SCREEN-027**, `/events` route, sitemap row, public list API?, E2E |

**Task coverage formula:** tracked work for browse parity (functional SCREEN/REAL + chat cards + data + wireframe + E2E + nav enable) — done ÷ required.

---

## Design track (SAN-566 / D-08→D-14)

| D | Linear | Relevance to greyed items | Status |
|---|--------|---------------------------|--------|
| D-08 | SAN-574 | Shared VenueCard — chat + browse consolidation | Todo — **does not unblock sidebar** |
| D-09 | SAN-575 | Re-skins `/cafes`, `/rentals` only — **not `/events`** | Blocked on D-08 + functional browse |
| D-10–14 | SAN-576–580 | Dashboard, map workspace, home, polish | Blocked downstream |

D-09 is explicitly **skin-only after Track A builds browse** — not a substitute for SAN-519/478/518.

---

## Red flags

1. **Enabling `href` today ships broken UX** — placeholder, redirect, or 404.
2. **Events has no disk scr** — SAN-518 exists in Linear but no `008-scr-events-browse` (cafés/rentals have scr files).
3. **`/events` missing from `sitemap.md`** — only `/events/[slug]` listed; catalog route undocumented.
4. **Phase label drift** — REAL-011 scr = P0/mvp; SAN-478 Linear = `phase:phase2` / POST-MVP; SAN-519/SAN-518 = `phase:post-mvp` while notes say clone SAN-490 for MVP.
5. **No explicit “enable nav href when browse ships” task** — implied in browse ACs but not in SCREEN-002 Done gate.
6. **Zero E2E on disk** for SAN-519/478 — specs reference `SCREEN-028-*` and `REAL-011-*` but files don't exist.
7. **D-09 excludes Events** — browse enable for Events has no design-track skin owner.

---

## Blockers

| Vertical | Primary blocker | Secondary |
|----------|-----------------|-----------|
| **Cafés** | SAN-519 not started (Backlog) | SAN-575 optional polish; MAP/detail wiring per scr |
| **Rentals** | SAN-478 not started; page redirects | SAN-478 gate text says REAL-004–007 — verify vs scr deps (SCREEN-005, MAP-001) |
| **Events** | No `/events` page + SAN-518 Backlog | No wireframe scr; may need public catalog API beyond chat `/api/events/search` |

**Not blockers for functional enable:** SAN-574 (D-08), SAN-575 (D-09), MOB-* (chat-focused), SAN-387 (chat fast-path only).

---

## Missing tasks (by category)

| Category | Gap |
|----------|-----|
| **Implementation** | SAN-519, SAN-478, SAN-518 |
| **Design** | Events browse wireframe/scr; D-09 extension for `/events` (or new D-task) |
| **Route** | `app/events/page.tsx`; remove rentals redirect; upgrade cafes shell |
| **Browse/card** | `CafeBrowseView`, rental browse grid, events catalog grid |
| **Navigation** | AC: flip `href: null` → real paths when browse Done; Playwright for enabled nav links |
| **Data/API** | Events: confirm SSR list query or new `/api/events` public list (today: search tool + per-id public) |
| **Mobile** | MOB-CARD-001 generic — no browse-specific mobile tasks |
| **Acceptance criteria** | Nav-enable + prod smoke per vertical in browse task Done gates |

---

## Critical fixes (before any sidebar flip)

1. **Ship functional browse first** — clone SAN-490 pattern (cafés/events) or REAL-011 scr (rentals).
2. **Add nav-enable AC** to SAN-519/478/518: `EXPLORE_ITEMS` href + remove "Coming soon" + Playwright `nav-{slug}-link` click → 200.
3. **Create SCREEN-027 scr on disk** — parity with `008-scr-cafes-browse-page.md`.
4. **Update `sitemap.md`** — add `/events` browse row with owner SAN-518.
5. **Reconcile phase labels** — SAN-478/519/518 vs P0 notes in `notes-1-next.md`.
6. **Do not enable for D-08/D-09 alone** — design track is polish, not browse.

---

## Recommended task order

```
1. SAN-574 (D-08)     — parallel; shared card shell (doesn't flip nav)
2. SAN-519 (cafés)    — highest spec readiness; clone SAN-490
3. SAN-478 (rentals)  — Camila P0 path; remove redirect
4. SAN-518 (events)   — after scr + sitemap; build /events
5. Nav href flip       — in each browse task's Done gate
6. SAN-575 (D-09)      — skin /cafes + /rentals after functional ship
7. SAN-479             — rental detail (card deep links)
8. SAN-387             — chat events (orthogonal to browse sidebar)
9. D-11/D-14           — map workspace + polish
```

---

## Production readiness score

| Vertical | Chat discovery | Browse catalog | Task/spec completeness | **Enable sidebar today?** | **Score** |
|----------|----------------|----------------|------------------------|---------------------------|-----------|
| Cafés | ✅ Prod-proven | ❌ Placeholder | 🟡 scr + Linear OK | **No** | **35/100** |
| Rentals | ✅ Cards + API | ❌ Redirect | 🟡 scr OK; phase drift | **No** | **30/100** |
| Events | ✅ Cards + detail | ❌ No route | 🔴 No disk scr | **No** | **25/100** |

**Design track overall (SAN-566):** 7/14 Done — on plan; **does not** justify enabling greyed nav items.

---

## Can Cafés, Rentals, and Events be safely enabled today?

**No.** Enabling would send users to a "coming soon" page, a chat redirect, or a 404. Chat remains the correct path today.

### Linear issues required before enabling each section

**Minimum (functional browse + nav flip):**

| Vertical | Must complete before `href` enable |
|----------|----------------------------------|
| **Cafés** | **[SAN-519](https://linear.app/sanjiovani/issue/SAN-519)** (SCREEN-028) — functional `/cafes` browse |
| **Rentals** | **[SAN-478](https://linear.app/sanjiovani/issue/SAN-478)** (REAL-011) — replace redirect with catalog |
| **Events** | **[SAN-518](https://linear.app/sanjiovani/issue/SAN-518)** (SCREEN-027) — create `/events` browse |

**Strongly recommended (same release, not optional for Camila/Andrés parity):**

| Vertical | Also complete |
|----------|---------------|
| Cafés | MAP-001 wiring per scr · E2E `SCREEN-028-cafes-browse.spec.ts` · prod smoke |
| Rentals | **[SAN-479](https://linear.app/sanjiovani/issue/SAN-479)** (REAL-012) if cards link to detail · E2E `REAL-011-rentals-browse.spec.ts` |
| Events | Disk scr for SCREEN-027 · sitemap update · public list API if SSR needs it · E2E |

**Polish (post-enable, not gate):**

- **[SAN-574](https://linear.app/sanjiovani/issue/SAN-574)** (D-08) · **[SAN-575](https://linear.app/sanjiovani/issue/SAN-575)** (D-09 cafés/rentals skin only)
- **[SAN-387](https://linear.app/sanjiovani/issue/SAN-387)** (SEARCH-002) — improves **chat** events, not sidebar `/events`

**Code change at enable time** (no separate Linear issue today — add to browse Done gates):

```ts
// chat-nav-rail.tsx — after browse ships
{ slug: "cafes",   href: "/cafes" },
{ slug: "rentals", href: "/rentals" },
{ slug: "events",  href: "/events" },
```

---

**Bottom line:** Greyed Explore items match backlog intent. Restaurants/Nightlife set the bar. Track A browse tasks (519 → 478 → 518) own activation; design track (574–580) polishes after. Want me to draft the missing SCREEN-027 scr or add nav-enable AC to the three Linear issues?