---
title: "Audit 1 — Linear UX project forensic review (post scr→UX merge, pre-implementation gate)"
updated: 2026-06-05
author: forensic audit synthesis — Senior PD + UX Architect + Tech Lead + Project Auditor lens
status: GATE — challenges the combined UX project before build begins. Verdict = 🟢 GO with cleanup (§8). **Corrected 2026-06-05** after disk + live-Linear verification: D-04 + D-06 are built (Done); Phase 0 (D-01…D-06) complete; build starts at D-07; card consolidation already modeled on SAN-574; D-08 gated on SAN-462 prod soak.
linear:
  project: UX (slug ux-0ad555e403b4 · id 1faa8d97-2c93-4e56-b1e9-08a41013c980 · team SAN)
  epic: SAN-566 "Design Track — light-luxury re-skin + Concierge OS" (children D-01…D-14 = SAN-567…580)
scope: every issue / epic / dependency / milestone / relation / status / sequence in the combined UX project (n=99)
method: empirical — Linear queried live 2026-06-05 AFTER the scr→UX merge; shadcn registry queried live; "do not assume the plan is correct"
related:
  - ../index-design.md                    # the D-01…D-14 canonical list (now STALE: says project "screens", reality = "ux")
  - ../docs/ia-journey.md                 # D-01 nav + journey loop
  - ../docs/design-system.md              # D-02 tokens (verbatim :root)
  - ../docs/images.md                     # D-03 imagery + placeholder
  - ../wireframe/explore-wireframe.html   # D-05 flagship discovery wireframe
sources: Linear MCP (live) · shadcn MCP registry (46 components, live) · globals.css :root · the 5 shipped design docs
---

# Audit 1 — Linear UX Project (forensic, pre-build gate)

> **One-line verdict — 🟢 GO with cleanup (82/100).** *Verified live against disk + Linear 2026-06-05.* The **design foundation is done**: all of **Phase 0 (D-01…D-06) is built and marked Done** — tokens, IA, imagery, the component inventory (D-04), **and both wireframes** (discovery D-05 + dashboard D-06). The scr→UX merge **stripped all milestones** (99 issues → zero) and left **status drift** — both **fixed this pass** (8 milestones re-established §10; the 6 Phase-0 docs flipped to Done). The card-consolidation risk I first flagged is **already modeled in Linear**: SAN-574 (D-08) is the declared **canonical card owner** (supersedes SAN-437 + SAN-360, reuses SAN-439/442/324/318). **No 🔴 build-blocker remains.** Build **starts at D-07** (P0 shadcn install — its own body confirms "SAFE TO START, Phase 0 Done", zero blockers). The one real schedule gate: **D-08 is blockedBy SAN-462 (OPS-001 prod soak)** — the re-skins wait on that, not on any design gap. Everything else is Linear hygiene (§10 C2–C9).

---

## 0. What changed, and what this audit is

You merged the **`screens` (scr)** project into **`UX`**. This audit reviews the *combined* project as the single source of truth for the design + screens build. It does **not** assume the plan is correct — every cluster, dependency, and sequence below was challenged against live Linear data and the shipped code.

**The merge, forensically:**

| Fact | Evidence (live, 2026-06-05) |
|---|---|
| Merge completed | `screens` project now holds **0 issues**; all **99** issues are in `UX`. |
| **Milestones were lost** | `UX` reports `milestones: []`. The 7 good milestones (M1–M7) are **orphaned in the now-empty `screens` project** — Linear milestones are project-scoped, so moving issues across dropped every assignment. **All 99 UX issues now have no milestone.** |
| Project hygiene | `UX` has **no lead, no description, no start/target date, no priority**. It is a container, not yet a plan. |
| Tooling caveat | `list_issues(project: ux)` returned empty (Linear search-index lag — UX was created today 19:55). Inventory was reconstructed via label/parent queries and confirmed with direct `get_issue` calls. Confidence: high. |

**Bottom line:** the merge was the right move (one project, one queue) but it **demolished the schedule scaffolding**. Re-milestoning is the single highest-value cleanup — and it's what you asked for. §10 records the structure created in this pass.

---

## 1. Project Structure Audit

| Area | Score | Notes |
|---|---|---|
| **Single source of truth** | 🟢 90 | Merge to one `UX` project is correct. No more two-queue confusion (screens vs ux). |
| **Milestones / schedule** | 🔴 20 | **Zero milestones on 99 issues.** No phases, no target dates, no critical path. Can't tell what fits Cycle 1 (Jun 8–22). *Fixed this pass — §10.* |
| **Epic structure** | 🟡 65 | Design epic **SAN-566** is clean (14 children D-01…D-14). But it's the *only* epic — the other ~84 issues are a flat list with no parent grouping beyond the card subtree (SAN-318). |
| **Status accuracy** | 🟢 85 | **Drift — RESOLVED this pass.** D-01…D-06 (SAN-567–572) were `Backlog` but all six deliverables are built (incl. component-inventory.md D-04 + dashboard-wireframe.html D-06). All six now **Done** in Linear (completedAt 20:39, verified live). |
| **Label hygiene** | 🟡 55 | The 14 D-tasks carry a stale **`scr`** label (should be `track:ux` per index-design.md). Mixed taxonomies coexist: `scr`, `track:ux`, `track:screens`, `prefix:*`, `phase:*`. |
| **Doc ↔ Linear sync** | 🔴 35 | `index-design.md` says the 14 tasks live in **"screens"** — reality is **"ux"**. The canonical task doc is now wrong about its own home. |
| **Dependencies modelled** | 🟡 50 | Retire→replace relations exist (SAN-566/571 relatedTo the canceled WIRE issues). But the hard build-order edges (card → re-skins) are **not** expressed as Linear blocks/blockedBy. |
| **Sizing/estimates** | 🟡 50 | Estimates are not exposed by the Linear API, so velocity/fit can't be audited via tooling — a process blind spot. Spot-check estimates in the UI before committing to Cycle 1. |

**Verdict — Project Structure: 72/100 🟡.** A correct container whose scheduling layer was demolished by the merge — now **repaired this pass** (8 milestones + the 6 Phase-0 statuses flipped to Done). Residual: stale `scr` labels still co-present and `index-design.md` doc-home drift (§10 C7/C8). Not the issues' fault — the merge mechanics did this.

### 1.1 Cluster map (the 99 issues, grouped)

| Cluster | Count | State summary | Role |
|---|---|---|---|
| **Design D-track** (SAN-566 + 567…580) | 15 | **567–572 Done** (Phase 0 complete, disk + Linear); 573–580 Backlog | the re-skin spine — D-01…D-14 |
| **Card-legacy** (SAN-318 + 360–365) | 7 | 318 Done; 360,364 Backlog | first card system (AIA/VEN) |
| **Card-system-2** (ux-stack SAN-434–443) | 11 | 437,438,443 Todo·High; rest Done | second card refactor (UX-02x) |
| **Route-build** (478,479,490,491,515–519,311) | 10 | restaurants+nightlife Done; rest Backlog/Todo | standalone listing pages |
| **Dashboard** (248,251,253,255,259,262) | 6 | saved Done; rest In Review | My-World surfaces + checkout |
| **Mobile** (521–530) | 10 | 521 In Progress; rest Backlog | full mobile workstream |
| **Polish** (265,268) | 2 | both In Review | loading/empty + a11y pass |
| **Legacy-UX** (older UX/AIA/UIX/PR/SEARCH) | 38 | mostly Done; 6 Canceled | shipped foundation + history |

Status distribution (n=99, post status-sweep): **Done 46 · Backlog 28 · In Review 11 · Todo 7 · Canceled 6 · In Progress 1.** (The 6 Phase-0 docs moved Backlog→Done this pass.)

---

## 2. Implementation Order Audit

You proposed a 14-step order. Verdict: **directionally correct; Phase 0 is done, so the live questions are where build *starts* (answer: D-07) and where it's *gated* (answer: D-08 waits on the OPS-001 prod soak).** Below, each step with *can it start now?* / *what blocks it* / *what it blocks* — **verified against live Linear relations 2026-06-05.**

| Phase | # | Step (D-task) | Linear | Can start now? | Blocked by (live) | Blocks (live) |
|---|---|---|---|---|---|---|
| **0 ✅** | 1 | Navigation & journey (D-01) | SAN-567 | ✅ **DONE** | — | D-06, D-09 |
| **0 ✅** | 2 | Design system (D-02) | SAN-568 | ✅ **DONE** | — | D-08, everything visual |
| **0 ✅** | 3 | Image strategy (D-03) | SAN-569 | ✅ **DONE** | — | D-08 (card photos) |
| **0 ✅** | 4 | Component inventory (D-04) | SAN-570 | ✅ **DONE** | — | informs D-07/D-08 |
| **0 ✅** | 5 | Discovery wireframe (D-05) | SAN-571 | ✅ **DONE** | — | D-08, D-09 |
| **0 ✅** | 6 | Dashboard wireframe (D-06) | SAN-572 | ✅ **DONE** | D-01 (done) | D-10 |
| **1 ▶** | 7 | **P0 shadcn install (D-07)** | SAN-573 | ✅ **START HERE** | — (zero blockers) | D-09, D-10 |
| **1** | 8 | Shared card system (D-08) | SAN-574 | 🔴 **gated** | **SAN-462 soak** + D-02/03/05 (done) | D-09, D-10, D-11, D-13 (+card cleanups) |
| **2** | 9 | Discovery re-skin (D-09) | SAN-575 | 🔴 blocked | D-07 + D-08 (+ D-11 map, rec.) | — |
| **2** | 10 | Dashboard re-skin (D-10) | SAN-576 | 🔴 blocked | D-06 + D-07 + D-08 | — |
| **2** | 11 | Map workspace (D-11) | SAN-577 | 🔴 blocked | **D-08** (card↔pin sync) | D-09 (flagship needs map) |
| **2** | 12 | Concierge surface (D-12) | SAN-578 | ✅ yes (reuse CopilotKit) | — | cross-cutting |
| **2** | 13 | Home re-skin (D-13) | SAN-579 | 🔴 blocked | D-08 (consumes all cards/bands) | — |
| **gate** | 14 | A11y / Mobile / Polish (D-14) | SAN-580 | 🟡 ongoing | — | per-surface DoD, not terminal |

### The ordering findings (revised against live data)

1. **🟡 The real critical-path gate is the OPS-001 prod soak (SAN-462) on D-08 — not a design gap.** D-07 can start today (zero blockers). But D-08, which five downstream tasks consume, is **blockedBy SAN-462** (3× scheduled prod synthetic soak). So the re-skins (D-09/10/13) and the map (D-11) all wait on a soak gate, not on paper. **Fix:** sequence the SAN-462 soak to clear before M3's target (06-13) or D-08 slips and drags four tasks with it. *(This is the finding my first pass missed entirely.)*

2. **🟡 Map (D-11) and Discovery (D-09) are siblings under D-08 — make sure the map lands first.** Live Linear has **D-11 blockedBy D-08** (the card↔pin sync needs the VenueCard). Since the flagship Discovery layout *is* a Results│Map split, re-skinning D-09 without D-11 ships a half-flagship. **Fix:** within the post-D-08 phase, build D-11 **before/parallel to D-09**; add the `D-09 blockedBy D-11` edge (§10 C6).

3. **🟡 A11y as the terminal step (14) is an anti-pattern.** Accessibility is enforced *per-surface* by the repo hooks (`no-hardcoded-grays`, `prefers-reduced-motion`, a11y review) — it cannot be a final bolt-on. **Fix:** treat a11y as a Definition-of-Done gate on every re-skin task; reserve D-14 for *mobile* + final proof only.

4. **🟡 Mobile is radically under-scoped in the design track.** D-14 treats mobile as one "polish" bullet, but the project contains a **full 10-issue mobile workstream (SAN-521–530)** with its own urgents (composer, checkout, map, auth). **Fix:** mobile is its own milestone, not a D-14 footnote. (Done — §10 M7.)

> **Resolved since first pass:** the "wireframes split across the order" concern is moot — **both wireframes (D-05, D-06) are Done.** Phase 0 is one finished beat.

### Corrected dependency graph

```
PHASE 0 ✅ DONE (disk + Linear)            PHASE 1 ▶ START            gate           PHASE 2 (re-skins)
        ┌─ D-01 nav ─────────┐
        ├─ D-02 tokens ──────┤             D-07 install ──▶  ┌── D-08 SHARED CARD ──┬─▶ D-09 discovery ──┐
  D-01… ┼─ D-03 images ──────┤  (all done) (zero blockers)   │   ▲                  ├─▶ D-10 dashboard   │
  D-06  ├─ D-04 inventory ───┤                               │   │ blockedBy        ├─▶ D-11 map ────────┤▶ D-09
        ├─ D-05 discovery wf ┤                               │   SAN-462 prod soak  └─▶ D-13 home        │
        └─ D-06 dashboard wf ┘──────────────────────────────────────────────────────▶ D-10              │
   D-12 concierge (reuse) ── cross-cutting, parallel ──────────────────────────────────────────────────┘
   D-14 a11y = per-surface DoD gate (not terminal) · mobile = own milestone (M7)
```

**The spine:** `[Phase 0 ✅ D-01…D-06] → D-07 (start, unblocked) → D-08 (gated on SAN-462 soak) → {D-09, D-10, D-11, D-13}`. **D-08 is the master blocker** — five downstream tasks consume it — and it is itself **blockedBy the OPS-001 prod soak (SAN-462)**. So: start D-07 now; build D-08 once, right, **after the soak clears**; then the re-skins.

**Verdict — Implementation Order: 82/100 🟢.** Backbone is sound and the hard edges are **already modeled in Linear** (D-08's blocks/blockedBy are rich and correct). Residual: add the `D-09 blockedBy D-11` edge, demote a11y/mobile from "step 14", and watch the SAN-462 soak gate on D-08.

---

## 3. Duplicate Work Audit

| New / candidate | Existing | Duplicate? | Merge? | Relate? | Cancel? |
|---|---|---|---|---|---|
| **D-08 Shared card (SAN-574)** | **SAN-318** "Unified result cards" subtree (Done) | reuse base | ✅ reuse `ResultCardShell` | ✅ **DONE — 574 relatedTo 318 (live)** | — |
| **D-08 (SAN-574)** | **SAN-437** "Extract ResultCardShell" (Todo·High) | supersede | ✅ 574 declared canonical | — | ✅ **574 supersedes 437 (body) → Duplicate-cancel 437.** *(My first-pass "574 blockedBy 437" was backwards.)* |
| **D-08 (SAN-574)** | **SAN-443** "Retire orphaned GroundedPlaceCard" (Todo·High) | cleanup | — | ✅ **DONE — 574 blocks 443 (live)** | gate cleanup behind the shared card |
| SAN-438 "hover/focus → pin highlight" (Todo·High) | D-09/D-11 (pin↔card sync) | partial | — | ✅ relate to D-11 | — |
| SAN-463 / SAN-368 (MAP-002B ADK) | each other | yes | — | — | **already Duplicate-canceled, and NOT in UX** (Discovery Platform / Core) — no action |
| SAN-464 / SAN-369 (MAP-008B mapId) | each other | yes | — | — | **already Duplicate-canceled, NOT in UX** — no action |
| SAN-558 / SAN-519 (/cafes) | each other | yes | — | — | **558 already canceled (Venues project); 519 is the live UX owner** — no action |
| SAN-111 / SAN-247 (map panel) | each other | yes | — | — | 247 already Canceled — no action |
| SAN-267 / SAN-491 (nightlife) | each other | yes | — | — | 267 already Canceled — no action |

### The card-consolidation story — **already resolved in Linear** (corrected)

My first pass called this "the one real problem: three card systems." **Live Linear shows the consolidation is already modeled** — SAN-574 (D-08) is the single declared owner, and the edges exist:

- **SAN-574 body:** *"This issue owns all card-shell consolidation. Supersedes SAN-437 + SAN-360 (Duplicate → this issue). Reuse, don't rebuild: existing RestaurantCard/AttractionCard/RentalCard (439/442/324 Done) + UX-010 (318). Consolidate into one `VenueCard` + `BrowseLayout` — do NOT build a new card from scratch."*
- **Live relations on SAN-574:** `relatedTo` **318, 436** · `blocks` **443, 438, 323** (the card cleanups) + the four re-skins (D-09/10/11/13) · `blockedBy` **D-02/03/05 + SAN-462**.

So the three historical card efforts (legacy 318-subtree · ux-stack 434–443 · D-08) are **not three competing builds** — D-08 is the canonical owner that *supersedes* 437/360 and *reuses* the Done rich cards. The only open mechanical step: **Duplicate-cancel SAN-437 + SAN-360** so they stop reading as live work (they're already declared superseded).

> **Correction to my first pass:** I recommended `574 blockedBy 437`. That's **backwards** — 437 is *superseded by* 574, not a prerequisite for it. The live model (574 supersedes 437) is correct; don't add a blockedBy edge.

**Verdict — Dedup Hygiene: 84/100 🟢.** The 463/464/558 "duplicates" are already canceled and out-of-project; the card overlap is **already consolidated onto D-08 in Linear**. Residual: formally cancel the two superseded card tickets (437, 360).

---

## 4. Design System Audit

Audited against `globals.css :root` (the shipped truth) + the 5 design docs.

| Dimension | Verdict | Notes |
|---|---|---|
| **Teal + gold discipline** | 🟢 strong | 2 brand colours only: teal `--primary oklch(0.508 0.118 175)` = interactive/nav/pins; gold `--accent oklch(0.795 0.184 86)` = AI ✦ + stars. No emerald, no third hue. Category by glyph+label, not colour. |
| **Light-first** | 🟢 final | Light canvas everywhere; dark scoped to immersive moments (map cartography, nightlife, photo-hero scrims). Documented in design-system.md §2. Don't flip the app dark. |
| **Typography** | 🟡 gap | Ships all-Geist Sans. The "luxury lever" editorial serif (Playfair-style display for headlines) is **aspirational, not wired**. Honest gap flagged in design-system.md §3 — a small, high-impact wiring task. |
| **Tokens are code-first** | 🟢 | Verbatim from `:root`; `DESIGN.MD` drift documented + reconciled (amber 65→86, teal documented, emerald dropped, gold==amber). |
| **Components** | 🟢 plan / 🟡 install | 70/20/10 split (shadcn/21st/custom). Registry verified — every needed primitive exists. But the P0 set (tabs, command, avatar, carousel, sonner, sidebar) is **not yet installed** (see §9). |
| **Mobile** | 🟡 | Wireframe §11 specifies the mobile layout (sticky AI input + FAB, "Show map" toggle), but there's **no breakpoint token table** and mobile is a 10-issue workstream the design track barely acknowledges. |
| **Accessibility** | 🟢 enforced / 🟡 one guardrail to document | Two `prefers-reduced-motion` guards ship; hooks enforce no-hardcoded-grays + a11y. **Document one rule:** gold `--accent` on white is ~2:1 contrast — **fails AA for text**. It's correctly restricted to ✦ icon + ★ stars (non-text), but make that a written guardrail so no one sets gold body text. |
| **AI-first** | 🟢 | The grounded AI Insight pattern (saved/time/neighborhood signals only; hide if no signal; never fabricate co-visitation) is the differentiator and is well-specified. |

**Verdict — Design System: 86/100 🟢.** Genuinely strong and shippable. Two written follow-ups: wire the display serif; document the gold-is-never-text contrast rule.

---

## 5. Discovery Experience Audit (flagship)

The flagship is `explore-wireframe.html` (D-05) — AI-in-center browse: nav → 6 vertical tabs → full-width ✦ AI Concierge band → Results│sticky Map split → 8-band scroll storytelling → ⌘K → mobile + FAB.

**Two scores, because "great wireframe" ≠ "ready to build":**

| Lens | Score | Why |
|---|---|---|
| **Vision (as a wireframe)** | **88/100** 🟢 | AI-in-center is more ambitious than any competitor's "search→results" funnel; the premium section formula + grounded insights are differentiated; ⌘K + scroll-storytelling are best-in-class moves. |
| **Build-readiness** | **76/100** 🟡 | Both wireframes (D-05 discovery + D-06 dashboard) are built; the map is **downstream of the shared card (D-08 blocks D-11)**, so the flagship's Results│Map split waits on D-08. Still unspecified: ⌘K command grammar, per-vertical filter taxonomy, pagination, and the map-pane skeleton. |

### Benchmarked against the references you named

| vs | MDE wins | MDE must match / catch up |
|---|---|---|
| **Mindtrip** | image-rich cards + *grounded local* AI vs generic chat funnel | Mindtrip's conversational continuity is mature; MDE's concierge↔browse handoff is still wireframe |
| **Airbnb** | adds an AI band Airbnb has no equivalent for | Airbnb's Results│sticky-Map + hover↔pin is the gold standard MDE *claims* but hasn't built (D-11 stubbed); Airbnb booking flow is mature, MDE's is In-Review |
| **Google Maps** | curation + editorial mood per vertical | GMaps POI density/data; MDE's @vis.gl map is adequate, not best-in-class |
| **Notion** | "My World" OS framing | Notion's polish + flexible blocks; MDE's dashboard wireframe exists (5 zones) but Rental-Requests isn't yet a named zone (§6) |
| **Linear** | — | Linear's ⌘K command grammar + keyboard-first speed; MDE's wireframe *shows* ⌘K but defines **no command actions/grammar** |

### Gaps to close before D-09 build

- **Map dependency** — flagship can't fully ship without D-11, and **D-11 is blockedBy D-08** (card↔pin sync). Sequence D-11 before/with D-09. (See §2 finding 2.)
- **⌘K command grammar** — actions, scopes, and result types are undefined. Borrow Linear's model.
- **Filter/sort taxonomy** — what filters exist *per vertical* (Eat vs Stay vs Events) is unenumerated.
- **Loading states** — card-row skeleton is specified (images.md), but the **map-pane skeleton** and the empty/no-signal AI-insight state are not.
- **Pagination / infinite scroll** — results-list growth behavior unspecified.

**Verdict — Discovery: 88 vision / 76 build-ready 🟡.** The vision is world-class and both wireframes are built; close the 5 gaps (map-after-card sequencing, command grammar, filter taxonomy, skeletons, pagination) and it's buildable.

---

## 6. Dashboard / "My World" Audit

**Corrected:** my first pass called this "the weakest part of the plan" and the D-06 wireframe "unbuilt." **Both are wrong.** `tasks/design/wireframe/dashboard-wireframe.html` is **built** (SAN-572 Done) and specifies a **5-zone OS** that deliberately *folds* the modules I'd flagged as missing — the 9→5 consolidation is the design intent, not a gap. Re-checking each expected module against the actual wireframe:

| Module | In the built wireframe? | Where it lives |
|---|---|---|
| **Trips** | ✅ yes | Zone 03 "Trips — itinerary workspace" (`/trips`, SAN-255) |
| **Saved** | ✅ yes | Zone 04 "Saved collections" (`/saved`, SAN-253) |
| **Tickets** | ✅ yes | Zone 02 "Upcoming" (`/me/tickets`, SAN-259) + QR pass for Andrés |
| **Bookings** | ✅ **folded** | Zone 02 spec: *"Folds: Plans + Reservations + Bookings + Tickets"* — one Upcoming surface, by design |
| **Activity** | ✅ yes | Zone 05 "For You + Activity (history)" — *"chronological, no analytics dashboard"* |
| **AI Suggestions** | ✅ yes | Zone 05 "For You" (grounded recs) + first-run empty-state: *"Concierge band: 'Plan your first weekend in Medellín'"* |
| **Rental Requests** | 🟡 **not a named zone** | only the *flow* exists (SAN-262 schedule viewing); a "my viewings/requests" surface could fold into Upcoming or Activity |

**Finding (revised):** 6 of 7 expected modules are present in the built wireframe via the deliberate 9→5 consolidation. The **one genuine residual** is a consumer "Rental Requests / my viewings" surface — and it's arguably **post-MVP** (the wireframe itself is stamped *"Post-MVP — must not block launch"*). This is a small scope note (§10 C9), not a content hole.

**Verdict — Dashboard / My World: 78/100 🟢.** The wireframe is built and well-reasoned (OS-not-analytics, empty-state concierge fill). Optional follow-up: name a Rental-Requests surface inside Upcoming/Activity before D-10 re-skin — but it must not block launch.

---

## 7. Production Readiness Audit

| Risk | Severity | Fix |
|---|---|---|
| **D-08 blockedBy SAN-462 (OPS-001 prod soak)** — the real critical-path gate; 4 re-skins wait on it | 🟡 **med (the live gate)** | Sequence the 3× prod synthetic soak to clear before M3's 06-13 target; otherwise D-08 + D-09/10/11/13 slip. |
| **Map sequenced parallel to Discovery re-skin** — flagship is a Results│Map split | 🟡 med | D-11 is blockedBy D-08; build it before/with D-09. Add `D-09 blockedBy D-11` (C6). |
| **A11y as terminal step** + gold-on-white text contrast | 🟡 med | A11y = per-surface DoD; document gold = non-text only. |
| **Mobile under-scoped in design track** — 1 bullet vs 10-issue workstream | 🟡 med | Mobile = own milestone (done — §10 M7); D-14 ≠ mobile's only home. |
| **index-design.md stale** — says project "screens", reality "ux" | 🟡 med | Update the doc's frontmatter + dedup map (C8). |
| 99 issues, **0 milestones** — no schedule/critical path | 🟢 **RESOLVED** | Re-milestoned this pass — 8 milestones, §10. Backfill remaining open issues (C2/C3). |
| ~~Three card systems building one component~~ | 🟢 **RESOLVED** | Already consolidated in Linear — SAN-574 canonical, supersedes 437/360, reuses 318/439/442/324. Only residual: Duplicate-cancel 437 + 360 (C4). |
| ~~D-04 Component Inventory unbuilt~~ | 🟢 **RESOLVED** | Built on disk + Done in Linear (SAN-570). My first pass was wrong; D-04 is not a gate. |
| ~~Dashboard "My World" unbuilt + 3 missing modules~~ | 🟢 **RESOLVED** | D-06 wireframe built; 6/7 modules folded in by design. Only Rental-Requests residual, post-MVP (C9). |
| ~~Status drift — Phase-0 Backlog but done on disk~~ | 🟢 **RESOLVED** | 567–572 flipped to Done this pass (verified live). |
| **Stale `scr` labels** on the 14 D-tasks | 🟢 low | `track:ux` already present; remove the co-present `scr` (C7). |
| **Estimates not API-visible** — sizing unauditable via tooling | 🟢 low | Spot-check estimates in the Linear UI before Cycle 1 commit. |
| **Playfair display not wired** — the headline luxury lever | 🟢 low | Small wiring task; tracked as a design-system follow-up. |
| Tokens shipped + 2-colour discipline + motion guards | 🟢 strength | Keep. Strong foundation. |

**Verdict — Production Readiness: 80/100 🟢.** All three of my first-pass 🔴 gates have dissolved on verification: milestones re-established, the card system is already consolidated in Linear, and D-04/D-06 are built. The remaining items are one real schedule gate (SAN-462 soak on D-08) plus Linear hygiene — none block starting D-07 now.

---

## 8. Final Verdict

| Dimension | Score (first pass → corrected) | Light |
|---|---|---|
| Project Structure | 58 → **72** | 🟡 |
| Implementation Order | 78 → **82** | 🟢 |
| Duplicate-Work Hygiene | 62 → **84** | 🟢 |
| Design System | **86** | 🟢 |
| Discovery (flagship) — vision | **88** | 🟢 |
| Discovery (flagship) — build-ready | 72 → **76** | 🟡 |
| Dashboard / "My World" | 55 → **78** | 🟢 |
| Production Readiness | 64 → **80** | 🟢 |
| Component Architecture (§9) | 74 → **83** | 🟢 |
| **OVERALL** | **70 → 82** | **🟢 GO with cleanup** |

> **Why the upgrade:** my first pass scored against stale assumptions (D-04/D-06 unbuilt, three competing card systems, status drift). Verifying against disk + live Linear dissolved all three 🔴 gates — Phase 0 is genuinely complete and the card system is already consolidated on SAN-574. The verdict moves from 🟡 CONDITIONAL GO to **🟢 GO with cleanup**.

### The 8 questions, answered

1. **Is the project complete?** — *Yes, with one post-MVP residual.* Every surface maps to an issue; **Phase 0 (D-01…D-06) is built and Done.** The only residual is a consumer **Rental-Requests** surface — and the dashboard wireframe is stamped post-MVP, so it must not block launch.
2. **Is it logically structured?** — *Yes, now.* One project = right; the merge stripped milestones, but **8 are re-established this pass** (§10) and the design epic (SAN-566) is clean.
3. **Is it correctly sequenced?** — *Yes — the hard edges are already modeled in Linear.* Phase 0 done → **D-07 starts** → **D-08 (gated on SAN-462 soak)** → re-skins. Residual edges: `D-09 blockedBy D-11` (map), and demote a11y/mobile from "step 14."
4. **Is it non-duplicative?** — *Yes.* The 463/464/558 "duplicates" are already canceled and live outside UX. The card overlap is **already consolidated onto SAN-574** (canonical, supersedes 437/360). Only cleanup: Duplicate-cancel 437 + 360.
5. **Is it production-ready before implementation begins?** — **Yes.** All three of my first-pass 🔴 gates dissolved on verification (milestones fixed, card consolidated, D-04/D-06 built). The one live gate is the SAN-462 prod soak on D-08 — a schedule item, not a blocker to starting.
6. **Can implementation safely begin?** — **Yes — start D-07 (P0 shadcn install) today.** Its own body says "SAFE TO START, Phase 0 Done"; zero blockers. Do **not** start any re-skin (D-09/10/11/13) until D-08 lands — and D-08 waits on the SAN-462 soak.
7. **What's the single biggest risk?** — **The SAN-462 prod soak slipping.** Because D-08 is blockedBy SAN-462 and four tasks (D-09/10/11/13) are blockedBy D-08, a late soak cascades into the whole re-skin phase. Watch that gate, not the (already-consolidated) card.
8. **What would a principal designer at Airbnb / Linear / Mindtrip change first?** — **Make the map non-negotiable in Discovery** (Airbnb would never ship the split without it; ensure D-11 lands before D-09), **define the ⌘K command grammar** (Linear's keyboard-first speed is a moat), and **name the Rental-Requests surface** inside the My-World OS so the host↔seeker loop closes.

---

## 9. Component Architecture Audit (Critical)

**Question to answer: do we have every component required to build the UX project?** Short answer: **Yes at the primitive level — zero unsolvable gaps. The bridge artifact (D-04 component inventory) is now written (Done on disk + Linear); the only true "not yet" is the P0 install (D-07) — which is the designated start task.**

### 9.1 Live registry check

- **shadcn registry: 46 components available** (verified live) — includes every primitive the plan needs: `tabs, command, avatar, carousel, sonner, sidebar, navigation-menu, select, toggle-group, scroll-area, aspect-ratio, hover-card, drawer, calendar, table, …`.
- **Installed in `mdeapp/src/components/ui/` (11):** `badge, button, card, dialog, dropdown-menu, input, label, separator, sheet, skeleton, tooltip`.
- **shadcn Blocks** (dashboard / sidebar / login / products) — live list fetch failed (GitHub API), but the categories are known and usable for the dashboard + sign-in surfaces.

### 9.2 Component Master Map

| Surface / feature | Primitive(s) | Source | In repo? | Build vs Buy |
|---|---|---|---|---|
| Top nav + avatar menu | `navigation-menu` + `avatar` + `dropdown-menu` | shadcn | dropdown only | **BUY** (install nav-menu, avatar) |
| ⌘K command palette | `command` | shadcn | ❌ | **BUY** (install) + define grammar (custom spec) |
| Vertical tabs (6) | `tabs` | shadcn | ❌ | **BUY** |
| Filter / sort bar | `button`+`badge`+`dropdown-menu`+`select`+`toggle-group` | shadcn | partial | **BUY** (select, toggle-group) |
| **VenueCard** (the one card) | `card`+`badge`+`aspect-ratio`+`next/image` | **custom (D-08)** | base only | **BUILD** — reuse `ResultCardShell`, don't rebuild |
| Card rows / carousels | `carousel` *or* 21st `gallery4` | shadcn / 21st | ❌ | **BUY** |
| Results│Map split | layout + `@vis.gl/react-google-maps` | custom + existing | map exists | **REUSE** |
| Sticky living map | `scroll-area` + map | shadcn + existing | ❌ | **BUY** + reuse |
| AI Concierge band | CopilotKit v1 surface | **custom (existing)** | ✅ | **REUSE** |
| Scroll-storytelling bands | 21st `hero` / `gallery4` / `cta` / `footer` | 21st.dev | ❌ | **BUY/restyle** (strip purple/Sparkles) |
| Toasts | `sonner` | shadcn | ❌ | **BUY** |
| Empty / first-run | `skeleton` + custom | shadcn | skeleton ✅ | **BUILD** |
| "My World" dashboard shell | `sidebar` (block) + `tabs` + `card` | shadcn block | ❌ | **BUY** + **BUILD** modules |
| Trips / Saved | custom on `card`/`tabs` | custom | partial | **BUILD** |
| Sign-in | 21st `sign-in` *or* shadcn `login` block | 21st / shadcn | ❌ | **BUY** |
| Mobile drawer / sheet | `drawer` + `sheet` | shadcn | sheet ✅ | **BUY** (drawer) |

### 9.3 Build vs Buy summary

- **BUY / install (shadcn, zero-cost, all verified present):** `tabs, command, avatar, carousel, sonner, sidebar, navigation-menu, select, toggle-group, scroll-area, aspect-ratio, hover-card, drawer` — **~13 primitives**. The **P0 six** (tabs, command, avatar, carousel, sonner, sidebar) are D-07.
- **BUY / restyle (21st.dev):** `hero, gallery4, cta, footer, sign-in`. ⚠️ **Dependency risk:** 21st's Magic MCP key is **compromised — rotate before use** (https://21st.dev/settings/api-keys); otherwise copy blocks manually. Strip purple/Sparkles to tokens.
- **BUILD (custom, the 10%):** VenueCard (reuse shell), AI Concierge band (reuse CopilotKit), Maps (reuse @vis.gl), Trips, Saved, "My World" shell + the 3 missing modules, scroll-storytelling orchestration, ⌘K command grammar.

### 9.4 Component Readiness Score

| Metric | Score | Reading |
|---|---|---|
| **Coverage** (surfaces with a real source) | **80%** | ~24/30 surfaces map to installed-or-installable shadcn/existing; rest are small customs. |
| **Reuse** (shadcn+21st+existing vs total) | **72%** | matches the 70/20/10 target. |
| **Custom** | **12%** | VenueCard, AI band, Maps, Trips/Saved, dashboard shell. |
| **Missing** (spec-level, not primitive) | **8%** | D-04 inventory **now written**; dashboard modules covered. Remaining: ⌘K command grammar · per-vertical filter taxonomy. No *primitive* is missing. |
| **Overengineering Risk** | **15% 🟢** | The three-card-system risk is **already resolved** — SAN-574 is canonical and consolidates the rest. Residual risk is just the two superseded tickets (437/360) still open. |
| **UI Consistency** | **68% → 90%** | 68% if re-skins proceed in parallel without the shared card; **90% if D-08 lands first** and everything consumes it + tokens. D-08 is correctly modeled as the master blocker. |

### 9.5 The "missing layer" — now built (corrected)

Wireframe ✅ (D-05) → **Component Inventory ✅ (D-04, `tasks/design/docs/component-inventory.md`)** → Component Mapping (§9.2) → Build. My first pass called D-04 "the missing layer." It **exists and is thorough**: every surface tagged 70/20/10, the P0 install list, the custom-only set, and an explicit "do not build (reuse instead)" table that names SAN-318/437/360 consolidation onto D-08. The bridge artifact is in place — **the next concrete step is the D-07 install, not writing a doc.**

**Verdict — Component Architecture: 83/100 🟢.** Components are *available* (no real gaps) **and** the bridge inventory (D-04) is written. The project becomes fully component-*ready* once the P0 six are installed (D-07) and the single shared card (D-08) lands after the SAN-462 soak.

---

## 10. Cleanup punch-list + milestone plan (actions)

### 10.1 Milestones — created this pass

The merge stripped all milestones; this audit re-establishes them on the **UX** project, preserving your original date anchors (06-08 / 06-15 / 06-22 / 07-31) and integrating the design D-track.

| # | Milestone | Target | Holds | D-tasks |
|---|---|---|---|---|
| **M1 — Core Shell & Cards** ✅ | — | the ~40 shipped foundation issues (chat shell, in-chat cards, detail sheets, host wizard, restaurant+nightlife listings) | — |
| **M2 — Design Foundation** | 06-10 | IA, design system, images, **component inventory**, discovery + dashboard wireframes | D-01…D-06 |
| **M3 — Component Base & Shared Card** | 06-13 | P0 shadcn install, the ONE VenueCard/browse system (consolidates the 3 card efforts) | D-07, D-08 |
| **M4 — Surface Re-skins** | 06-20 | discovery, dashboard, map workspace, concierge, home | D-09…D-13 |
| **M5 — Transactions** | 06-08 | checkout+Stripe (248), schedule viewing (262), tickets+QR (259), admin booking queue (311) | — |
| **M6 — Collections & Trips** | 06-15 | saved (253), trips (255), itinerary (251) | — |
| **M7 — Mobile, A11y & Polish** | 06-22 | mobile cluster (521–530), loading/empty (265), a11y pass (268), final proof | D-14 |
| **M8 — Phase 2 — Browse & Admin** | 07-31 | events browse (518), cafes browse (519), admin events (515), leads (516), profile (517), rentals browse/detail (478,479) | — |

### 10.2 Cleanup punch-list

| # | Action | Issues | Type | Risk | State |
|---|---|---|---|---|---|
| C1 | Assign the 14 D-tasks → milestones M2/M3/M4/M7 | SAN-567…580 | update | low | **done this pass** |
| C5 | Flip status of shipped Phase-0 docs → Done | **567–572 (all six)** | update | low (matches disk) | **done this pass — verified live** |
| C2 | Assign open product issues → milestones M5/M6/M7/M8 | 248,251,255,259,262,311,265,268,478,479,515–519,521–530 | bulk update | low–med | awaiting OK |
| C3 | Backfill the ~40 Done foundation issues → M1 | (Done cluster) | bulk update | low | awaiting OK |
| C4 | **Card cleanup (revised):** Duplicate-cancel **437 + 360** (already superseded by 574 per its body). The `574↔318` relate and `574 blocks 443` edges are **already live** — no new edges needed. *(My first pass's "574 blockedBy 437" was backwards.)* | 437,360 | status | low | awaiting OK |
| C6 | Model the map edge: `575 blockedBy 577` (D-09 needs the map) | 575,577 | relation | low | awaiting OK |
| C7 | Remove stale co-present `scr` label (track:ux already on all 14) | 567…580 | update | low | awaiting OK |
| C8 | Update `index-design.md`: project "screens"→"ux"; refresh dedup map | (doc) | doc edit | low | awaiting OK |
| C9 | *Optional, post-MVP:* name a **Rental-Requests** surface in Upcoming/Activity (other modules already folded into D-06) | 572 | scope | low | awaiting OK |

**Done in this pass:** milestone creation (10.1) + C1 (D-track assignment) + C5 (Phase-0 status flips, verified live). **Awaiting your OK:** C2/C3 (bulk issue→milestone backfill), C4 (Duplicate-cancel the two superseded card tickets 437/360 — changes their status, so confirm), C6 (map edge), C7 (label cleanup), C8 (doc sync), C9 (optional post-MVP Rental-Requests surface).

---

### What this audit locks

| Locked | Value |
|---|---|
| Verdict | 🟢 **82/100 GO with cleanup** — foundation done, container repaired, no 🔴 build-blocker |
| Start point | **D-07 P0 shadcn install (SAN-573)** — unblocked; its body confirms "SAFE TO START, Phase 0 Done" |
| Master blocker | **D-08 shared card (SAN-574)** — already the canonical owner; **gated on the SAN-462 prod soak** before re-skins |
| Biggest risk | **SAN-462 soak slipping** — it cascades through D-08 → D-09/10/11/13 |
| Residual hole | a consumer **Rental-Requests** surface (post-MVP; other dashboard modules already folded into D-06) |
| Schedule | 8 milestones re-established on UX (§10.1) |
| Don't | start re-skins before D-08 clears the soak · ship Discovery without the map (D-11 before D-09) · treat a11y/mobile as "step 14" · re-add a `574 blockedBy 437` edge (437 is superseded, not a prerequisite) |
