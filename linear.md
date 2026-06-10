---
title: Linear — mdeai system reference
updated: 2026-06-02
plan: Business tier (Insights ✅, Dashboards ✗)
cycle: "Cycle 1: 2026-06-08 → 2026-06-22"
source_of_truth: docs/tasks/ (disk markdown)
linear_hub: docs/tasks/linear/linear.md
---

# Linear — mdeai system reference

> **One rule:** `docs/tasks/**` on disk = source of truth (spec, status, evidence, dependencies).
> Linear (SAN-###) = queue index + PR links.

**North star:** Camila on `/` cards + pins · Andrés paid ticket · Roberto host publish @ https://www.mdeai.co

---

## Quick orientation

| What you need | Where to go |
|---------------|-------------|
| What to work on right now | [MVP EXECUTION view](https://linear.app/sanjiovani/view/mvp-b4f1afdff207) → **`label:phase:mvp`** (Discovery Beta rows 1–50) |
| What is blocking progress | [BLOCKERS view](https://linear.app/sanjiovani/view/mvp-b4f1afdff207) → `has:blocked-by` |
| Current cycle (Jun 8–22) | [Cycle 1](https://linear.app/sanjiovani/team/SAN/cycle/upcoming) |
| P0 dependency chain | [`docs/tasks/linear/mvp-queue.json`](docs/tasks/linear/mvp-queue.json) |
| Full MVP dashboard | [`docs/tasks/MVP-EXECUTION.md`](docs/tasks/MVP-EXECUTION.md) |
| Operator checklist | [`todo.md`](todo.md) |
| Progress audit | [`docs/tasks/progres.md`](docs/tasks/progres.md) |

**Plan tier:** Business — Insights ✅ available (`Ctrl Shift I` in any view) · Dashboards ✗ Enterprise only.

---

## Projects

Six active projects, each with a domain focus and milestone set.

| Project | Focus | Key prefixes | Link |
|---------|-------|--------------|------|
| **Platform Infrastructure** | PAY, OPS, AUTH, DATA, UX core | PAY, OPS, ATH, DATA | [link](https://linear.app/sanjiovani/project/platform-infrastructure-7826f699/issues) |
| **Events Platform** | Event creation, host publish, ticketing | EVT | [link](https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues) |
| **AI & Intelligence** | Gemini routing, clarify, memory, pgvector | INT, SEARCH, VEC | [link](https://linear.app/sanjiovani/project/ai-and-intelligence-fe206edb90b2/issues) |
| **Trips** | Trips dashboard, itinerary, booking sync | TRIP, TRP | [link](https://linear.app/sanjiovani/project/trips-14c2b4268402/issues) |
| **Venues** | Café/restaurant/nightclub search + booking | VEN, DATA | [issues](https://linear.app/sanjiovani/project/venues-b003fe68b767/issues) · [activity](https://linear.app/sanjiovani/project/venues-b003fe68b767/activity) — **In Progress**; SAN-295/296 In Review · [PR #48](https://github.com/amo-tech-ai/mdeapp/pull/48) |
| **Discovery Platform** | Maps, ADK grounding, place search | MAP | [link](https://linear.app/sanjiovani/project/discovery-platform-40fd1312/issues) |
| **Real Estate** | Rental search, Camila cards + chat | REAL, RE | [link](https://linear.app/sanjiovani/project/real-estate-08c5830f/issues) |

### Project → milestone map

| Project | Milestones |
|---------|-----------|
| Platform Infrastructure | 🚨 Launch Critical · 🗺️ Maps — Growth |
| Events Platform | 🚨 Launch Critical · 🎟️ Events — Polish |
| AI & Intelligence | *(initiative-level only)* |
| Trips | *(module phases)* |
| Venues | 🍽️ Venues — Phase 2 |
| Real Estate | 🏠 Rental Cards MVP |

---

## Implementation phases

Tasks must be executed in this order: **Core → MVP (Launch Critical) → MVP (Module) → Post-MVP → Advanced.**

### Phase 1 — CORE (Foundation)
*Status: ~78% complete. Floor: 401 Vitest tests.*

Foundation F-tasks (F01–F13) and intelligence core. These underpin all later work.

| # | Spec | Module | SAN | Status |
|---|------|--------|-----|--------|
| F01–F13 | Core foundation | App setup | Various | ✅ Mostly done |
| INT-001 | Shared intent + slot schema | Intelligence | SAN-404 | ✅ Done |
| INT-002 | Rental parser monthly/date/city | Intelligence | SAN-405 | ✅ Done |
| INT-003 | Gemini smart clarify routing | Intelligence | SAN-406 | 🟢 In Review |
| INT-004 | No canned clarify bypass | Intelligence | SAN-407 | 🟢 In Review |
| INT-005 | Intelligence regression tests | Intelligence | SAN-408 | ✅ Done |

**Core gate:** INT-003/004 must clear In Review before INT-009 (CopilotKit readable state) ships.

---

### Phase 2 — MVP LAUNCH CRITICAL (`phase:launch`)
*These are the 12 P0 issues in Cycle 1 (Jun 8–22). EVT-001 is the exit gate.*

**Dependency chain:**
```
PAY-001 → PAY-003 ─┐
                    ├→ EVT-001 → AUTH-011
EVT-013 ────────────┤           OPS-002
EVT-002 ────────────┘

UX-003 → UX-002 + UX-005   (parallel)
MAP-002B + MAP-008B          (parallel, unblocked)
```

| # | Spec | SAN | Status | Proof required |
|---|------|-----|--------|----------------|
| 1 | **PAY-001** — Live ticket purchase | SAN-178 | ⬜ Todo | Live Stripe → paid + QR on prod |
| 2 | **PAY-003** — Webhook secret isolation | SAN-116 | 🟡 In Progress | Distinct secrets, no cross-replay |
| 3 | **EVT-013** — Event cards in AI chat | SAN-117 | ✅ Done | PR #14 merged |
| 4 | **EVT-002** — Host publish proof | SAN-366 | ⬜ Todo | SQL publish row on prod |
| 5 | **EVT-001** — MVP launch ledger | SAN-115 | ⬜ Todo | All gates 1–4 signed off |
| 6 | **UX-003** — Rental price parser | SAN-316 | ✅ Done | PR #15 merged |
| 7 | **UX-002** — Chat error bubble | SAN-320 | ✅ Done | PR #17 merged |
| 7 | **UX-005** — Chat thinking indicator | SAN-319 | ✅ Done | PR #17 merged |
| 8 | **OPS-002** — Production smoke matrix | SAN-100 | ⬜ Todo | Prod smoke matrix pass |
| 9 | **AUTH-011** — Production auth checklist | SAN-367 | ⬜ Todo | Prod auth + Vercel env |
| 10 | **MAP-002B** — ADK grounding on prod | SAN-368 | ⬜ Todo | ADK live on mdeai.co |
| 10 | **MAP-008B** — Map ID on production | SAN-369 | ⬜ Todo | mapId confirmed prod |

**Filter:** [linear.app/sanjiovani/view/mvp-b4f1afdff207](https://linear.app/sanjiovani/view/mvp-b4f1afdff207) (`label:phase:launch`)

---

### Phase 3 — MVP MODULE WORK (`phase:mvp`)
*Parallel tracks, unblocked after their prerequisites. Pull when Phase 2 P0 queue is green.*

#### Intelligence MVP

| # | Spec | SAN | Status | Depends |
|---|------|-----|--------|---------|
| 9 | INT-006 — Rental availability date filters | SAN-409 | ✅ Done | INT-002 |
| 10 | INT-007 — Event intelligence wrapper | SAN-410 | ✅ Done | INT-001 |
| 11 | INT-008 — Café intelligence wrapper | SAN-411 | ✅ Done | INT-001 |
| 12 | INT-009 — CopilotKit readable UI state | SAN-412 | 🟡 In Progress | INT-003 |
| 13 | INT-010 — Working memory schema update | SAN-413 | 🟡 In Progress | INT-001 |
| 14 | INT-021 — Restaurant & venue wrapper | SAN-424 | 🟡 In Progress | INT-001 |
| 15 | INT-022 — Routing confidence telemetry | SAN-425 | ✅ Done | INT-002 |

#### Trips MVP

| # | Spec | SAN | Status | Depends |
|---|------|-----|--------|---------|
| 1 | TRIP-001 — Supabase audit + evidence | SAN-273 | ⬜ Todo | — |
| 2 | TRIP-002 — `/trips` dashboard polish | SAN-274 | ⬜ Todo | TRIP-001 |
| 3 | TRIP-003 — Create trip modal | SAN-275 | ⬜ Todo | TRIP-002 |
| 4 | TRIP-004 — Trip workspace shell | SAN-276 | ⬜ Todo | TRIP-003 |
| 5 | TRIP-005 — Itinerary tab hardening | SAN-282 | ⬜ Todo | TRIP-004 |
| 6 | TRIP-006 — `/saved` collections | SAN-277 | ⬜ Todo | TRIP-005 |
| 7 | TRIP-007 — Add-to-trip from cards | SAN-278 | ⬜ Todo | TRIP-006 |
| 8 | TRIP-008 — Google Map pins tab | SAN-279 | ⬜ Todo | TRIP-005 |
| 9 | TRIP-009 — Conflict persist + HITL | SAN-280 | ⬜ Todo | TRIP-005 |
| 10 | TRIP-010 — Booking → trip_items sync | SAN-281 | ⬜ Todo | TRIP-007 |
| 11 | TRIP-011 — Playwright suite | SAN-290 | ⬜ Todo | TRIP-002→010 |
| 12 | TRIP-012 — Production smoke + floor | SAN-291 | ⬜ Todo | TRIP-011 |

Full dep graph: [`docs/tasks/trips/tasks/INDEX.md`](docs/tasks/trips/tasks/INDEX.md)

#### Venues MVP

| Order | Spec | Status | Depends |
|-------|------|--------|---------|
| 1 | DATA-001 — Venues inventory | SAN-325 | 🟡 In Progress | — |
| 2 | DATA-002 — Catalog contract | SAN-330 | ⬜ Todo | DATA-001 |
| 2b | DATA-009 — Schema M1–M3 | SAN-331 | ✅ Done (live 2026-05-29) | DATA-002 |
| 3b | DATA-035 — Café anchor seed | SAN-332 | ✅ Done (verified 2026-06-02) | DATA-002, DATA-009 |
| 3 | DATA-003 — Café seed sign-off | SAN-334 | ✅ Done | DATA-035 |
| 4 | DATA-004 — Restaurant catalog verify | SAN-333 | ✅ Done | DATA-002 |
| 5 | DATA-005 — Nightclub seed | SAN-335 | ✅ Done | DATA-002 |
| 6 | DATA-006 — Golden eval queries | SAN-336 | ✅ Done | DATA-003–005 |
| 7 | DATA-007 — Places cache audit | SAN-337 | ✅ Done (2026-06-02) | DATA-001, MAP-005 |
| 8 | DATA-008 — Places backfill cron | SAN-338 | 🟡 Partial | DATA-007 |
| 9 | VEN-009 — Restaurant result card | SAN-292 | ⬜ Todo | DATA-004 |
| 10 | VEN-010 — Restaurant detail panel | SAN-293 | ⬜ Todo | VEN-009 |
| 11 | VEN-011 — Nightlife grounding intent | SAN-294 | ⬜ Todo | DATA-005 |
| 12 | VEN-012 — Grounded kind split | SAN-295 | ⬜ Todo | VEN-011 |
| 13 | VEN-013 — Nightlife detail panel | SAN-296 | ⬜ Todo | VEN-012 |
| 14 | VEN-031 — Places cache + field-mask | SAN-297 | ⬜ Todo | DATA-007–008 |

Full venues order: [`docs/tasks/venues/INDEX.md`](docs/tasks/venues/INDEX.md)

---

### Phase 4 — POST-MVP (`phase:post-mvp`)
*Pull only after EVT-001 signed off (MVP exit).*

| Track | Range | Notes |
|-------|-------|-------|
| Intelligence post-MVP | INT-011→015 (SAN-414→418) | Durable prefs, retrieval, ranking |
| Trips hardening | TRIP-013→019 (SAN-283→289) | RLS tests, retry, mobile UX |
| Venues post-MVP | VEN-025–030 + WA outbox (SAN-308–311) | Concierge, normalizer, booking workflow |
| Coffee tours | TRP-001→008 (SAN-265→272) | Separate from trips; VEN-032→043 |
| Events polish | EVT-014 + discovery (SAN-118→150) | Host events list, post-MVP discovery |

---

### Phase 5 — ADVANCED (`phase:advanced`)
*After MVP is stable. Phase 2+ work.*

| Track | Range | Notes |
|-------|-------|-------|
| Intelligence advanced | INT-016→020 (SAN-419→423) | pgvector, embeddings, cross-domain personalization |
| Venues advanced | VEN-044→051 | Coffee tour embeddings, advanced booking |
| Vector platform | VEC-001→007 | pgvector tables, embedding pipeline |
| Maps advanced | MAP-005→010 | Places proxy, nearby search, autocomplete |

---

## Cycles

**Business plan — Cycles enabled 2026-06-02.**

| Cycle | Dates | Issues |
|-------|-------|--------|
| **Cycle 1** (upcoming) | Jun 8 → Jun 22, 2026 | 12 MVP P0 issues (see Phase 2 table above) |

### Cycle 1 contents

| SAN | Spec | Status |
|-----|------|--------|
| SAN-117 | EVT-013 event cards | ✅ Done |
| SAN-316 | UX-003 price parser | ✅ Done |
| SAN-319 | UX-005 thinking indicator | ✅ Done |
| SAN-320 | UX-002 error bubble | ✅ Done |
| SAN-116 | PAY-003 webhook isolation | 🟡 In Progress |
| SAN-178 | PAY-001 live ticket purchase | ⬜ Todo |
| SAN-366 | EVT-002 host publish | ⬜ Todo |
| SAN-115 | EVT-001 launch ledger | ⬜ Todo |
| SAN-100 | OPS-002 production smoke | ⬜ Todo |
| SAN-367 | AUTH-011 auth checklist | ⬜ Todo |
| SAN-368 | MAP-002B ADK grounding | ⬜ Todo |
| SAN-369 | MAP-008B map ID prod | ⬜ Todo |

**Insights:** Open [Cycle 1 view](https://linear.app/sanjiovani/team/SAN/cycle/upcoming) and look for the chart icon top-right to open the Insights panel (Business plan).

---

## Labels

Labels drive all views. Every issue must have at least one `phase:*` and one `track:*` or `prefix:*`.

### Phase labels (timeline)

| Label | Meaning | Filter |
|-------|---------|--------|
| `phase:launch` | P0 MVP exit gates | [MVP EXECUTION view](https://linear.app/sanjiovani/view/mvp-b4f1afdff207) |
| `phase:mvp` | Module MVP work (trips, venues, intelligence) | `label:phase:mvp` |
| `phase:post-mvp` | After EVT-001 signed off | `label:phase:post-mvp` |
| `phase:advanced` | Phase 2+ deferred | `label:phase:advanced` |
| `phase:intel-conv` | Intelligence conversation CORE | `label:phase:intel-conv` |
| `phase:intel-1` | Intelligence MVP pack | `label:phase:intel-1` |

### Track labels (domain views)

| Label | Domain | View |
|-------|--------|------|
| `track:ux` | UX + chat + concierge | [UX view](https://linear.app/sanjiovani/view/ux-tasks-0e5d9fe91725) |
| `track:data` | Data foundation (DATA-*) | `label:track:data` |
| `track:intelligence` | AI & Intelligence (INT-*) | [Intelligence view](https://linear.app/sanjiovani/view/intelligence-7bbdb829ba23) |
| `track:trips` | Trips module (TRIP-*) | `label:track:trips` |
| `track:venues` | Venues module (VEN-*) | `label:track:venues` |
| `track:real` | Real estate / rentals (REAL-*) | `label:track:real` |
| `track:maps` | Maps module (MAP-*) | `label:track:maps` |
| `track:pr` | PR train remediation | `label:track:pr` |

### Prefix labels (module views)

`prefix:PAY` · `prefix:EVT` · `prefix:MAP` · `prefix:AUTH` · `prefix:OPS` · `prefix:VEN` · `prefix:TRP` · `prefix:REAL` · `prefix:RE` · `prefix:ATH` · `prefix:INT`

### Stack labels (cross-cutting)

`stack:stripe` · `stack:mastra` · `stack:nextjs` · `stack:copilotkit` · `stack:supabase` · `stack:gemini` · `stack:maps` · `stack:pgvector` · `stack:search` · `stack:playwright` · `stack:whatsapp`

Max 3 stack labels per issue.

### Area labels (launch grouping)

`area:launch` · `area:payments` · `area:events` · `area:maps` · `area:rentals` · `area:concierge` · `area:stability`

### Deprecated — do not use in new issues

`surface:venues` · `surface:trips` · `prefix:TRIP` · `track:re` (superseded by `track:real`) · `prefix:RE` · `IMP-*` · `EVP-*` · `SCREEN-*`

---

## Saved views

| View | Filter | Link |
|------|--------|------|
| **MVP EXECUTION** | **`label:phase:mvp`** (Discovery Beta · `tasks.md` rows 1–50) | [link](https://linear.app/sanjiovani/view/mvp-b4f1afdff207) |
| **BLOCKERS** | `has:blocked-by state:Todo,"In Progress","In Review"` | manual |
| **UX** | `label:track:ux` | [link](https://linear.app/sanjiovani/view/ux-tasks-0e5d9fe91725) |
| **DATA** | `label:track:data` | [link](https://linear.app/sanjiovani/view/data-54425dec37b9) |
| **INTELLIGENCE** | `label:track:intelligence` | [link](https://linear.app/sanjiovani/view/intelligence-7bbdb829ba23) |
| **MAPS** | `label:prefix:MAP` | manual |
| **EVENTS** | `label:prefix:EVT` | manual |
| **PAYMENTS** | `label:prefix:PAY` | manual |
| **AUTH** | `label:prefix:ATH OR label:stack:supabase` | manual |
| **POST-MVP** | `label:phase:post-mvp` | manual |
| **DONE THIS WEEK** | `state:Done completed:>-7d` | manual — create in UI |
| **IN REVIEW** | `state:"In Review"` | manual — create in UI |

---

## Board workflow

```
Backlog → Todo → In Progress → In Review → Done
```

| State | Who moves | When |
|-------|-----------|------|
| **Todo** | Agent / you | Next issue off the queue |
| **In Progress** | Agent | Work started (max 3 simultaneous) |
| **In Review** | Agent | Floor passed + evidence committed + PR open |
| **Done** | **You only** | PR merged + proof verified on prod |

**Anti-fake-done rule:** no issue moves to Done without a recorded proof artifact (PR link, `curl` output, or browser screenshot). Agent stays at In Review until you approve.

---

## Three IDs — never mix them

| ID type | Example | Use |
|---------|---------|-----|
| **SPEC-ID** | `PAY-001`, `EVT-013` | Linear title prefix, disk filename |
| **SAN** | `SAN-178` | Immutable Linear URL, branch slug, PR reference |
| **Disk path** | `docs/tasks/events/EVP-001-core-production-proof-gates.md` | Spec + evidence source of truth |

**Title format:** `PAY-001 — Live ticket purchase on production`

**Allowed prefixes:** MAP, EVT, RE, VEN, TRIP, AUTH, DATA, UX, PAY, OPS, TEST, AI, INT, REAL, SEARCH, VEC

---

## GitHub integration

GitHub is connected. Branch naming → Linear auto-links.

```bash
# Branch pattern (always SAN-based)
git checkout -b ai/san-178-pay-001-live-ticket-purchase
```

| PR magic words | Effect |
|----------------|--------|
| `Closes SAN-178` | Issue → Done on merge |
| `Fixes SAN-178` | Same |
| `Part of SAN-178` | Keeps issue open (partial work) |

**Automations** (set in Settings → Team → Automations):
- PR opened → In Review
- PR merged → Done
- PR draft → In Progress

---

## Insights (Business plan)

**Access:** Open any team / project / cycle view → look for chart icon top-right (browser `Ctrl Shift I` opens DevTools, not Linear — use the UI button).

Available metrics: issue count · effort · cycle time · lead time · triage time · issue age · burn-up chart.

Best views for Insights:
- [Cycle 1](https://linear.app/sanjiovani/team/SAN/cycle/upcoming) → velocity + burn-up
- [MVP EXECUTION view](https://linear.app/sanjiovani/view/mvp-b4f1afdff207) → lead time on P0 issues
- Team issues view → cycle time over time

---

## Progress tracking — weekly rhythm

| Cadence | Action |
|---------|--------|
| **Daily** | Open [MVP EXECUTION](https://linear.app/sanjiovani/view/mvp-b4f1afdff207) · pick top unblocked Todo · work through dependency chain |
| **On PR merge** | Verify GitHub auto-closed the issue · confirm Done |
| **Weekly (Friday)** | Post Project Update on MDEAPP: ✅ Shipped / 🟡 In Progress / 🔴 Blocked / 📊 Floor count |
| **Milestone complete** | Mark milestone Done on Initiative · tag release in changelog |

**Weekly update template:**
```
## Week of {date}
### ✅ Shipped
- SAN-### Task (PR #N)
### 🟡 In Progress
- SAN-### — what remains
### 🔴 Blocked
- SAN-### — blocker: reason
### 📊 Floor
- Vitest: N passing · Build: clean
### 🎯 Next week
- Top 3 priorities
```

---

## Bulk scripts

```bash
cd /home/sk/mdeai
export LINEAR_API_KEY="$(grep '^LINEAR_API_KEY=' .env.local | cut -d= -f2- | tr -d '"')"

node scripts/linear-sync-mvp-titles.mjs        # align titles to spec IDs
node scripts/linear-fetch-all-issues.mjs       # snapshot all issues
node scripts/linear-restore-track-labels.mjs   # restore track:ux / track:data
node scripts/linear-apply-stack-labels.mjs     # refresh stack:* from prefix:*
node scripts/linear-sort-todo.mjs              # re-order Todo column
```

Do NOT run: `linear-apply-prefix-catalog.mjs`, `linear-apply-imp-numbers.mjs` (deprecated).

---

## Doc map

| File | Role |
|------|------|
| **This file** (`linear.md`) | Top-level reference — projects, phases, labels, cycles |
| [`docs/tasks/MVP-EXECUTION.md`](docs/tasks/MVP-EXECUTION.md) | Primary MVP operator dashboard (frozen) |
| [`docs/tasks/linear/linear.md`](docs/tasks/linear/linear.md) | Sync hub — scripts, verification, workflow detail |
| [`docs/tasks/linear/mvp-queue.json`](docs/tasks/linear/mvp-queue.json) | Machine-readable P0 queue + dependencies |
| [`docs/tasks/linear/mvp-canonical-titles.json`](docs/tasks/linear/mvp-canonical-titles.json) | SAN → SPEC-ID title map |
| [`todo.md`](todo.md) | Operator checklist |
| [`docs/tasks/progres.md`](docs/tasks/progres.md) | Forensic progress audit |
