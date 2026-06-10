---
title: "mdeai — Design Track Index (ordered task list)"
updated: 2026-06-05
owner: sanjiovani
status: READY to execute — Track B (design/re-skin), rides alongside Track A (revenue/North-Star) · 14 tasks in [`tasks/INDEX.md`](tasks/INDEX.md) (epic SAN-566) · 8/14 Done · D-08 in progress (verified vs Linear 2026-06-06)
plan: ./docs/design-process.md          # the process this index executes (§refs below)
ia: ./docs/concierge-os-direction.md    # IA / 5-domain product architecture
system: ../../mdeapp/src/app/globals.css  # shipped oklch tokens = source of truth
related:
  - ./docs/design-plan.md     # 11-platform competitive + design-stack audit (Phase-1 input, done)
  - ./tasks/INDEX.md            # canonical D-01…D-14 task specs (single queue)
  - ./README.md               # per-vertical improvement pack (cafes/restaurants/nightlife)
  - ./wireframe/home-wireframe.html  # proven annotated-wireframe pattern (the model to copy)
---

# mdeai — Design Track Index

> **One line:** execute `design-process.md` as an ordered, flagship-first task list. **Track A (revenue) never pauses for this.** Net-new work = **4 docs + 2 wireframes + 1 install + a re-skin chain** — days of design, then build interleaved with the MVP.

**Locked decisions** (from `design-process.md` §0, don't re-open): LIGHT background — final · **2 brand colors** (teal `--primary` + gold `--accent`); drop emerald, gold==amber · **code-first** (not Figma) · **70 % shadcn / 20 % 21st / 10 % custom**.

**The guardrail:** Track A = Roberto's revenue / North-Star (fix `/rentals` cards → `/rentals/[id]` → checkout finalize → deploy `/restaurants` → `/host/events`). It leads on priority. Everything below is **Track B** and layers on as surfaces free up.

---

## Already done (inputs — do not redo)

`design-plan.md` (audit) · `concierge-os-direction.md` (IA) · `design-process.md` (process, review-integrated) · `README.md` + `pages/{cafes,restaurants,nightlife}.md` · **`docs/component-inventory.md`** · **`wireframe/home-wireframe.html`** (14-band annotated map — the pattern) · `wireframe/explore-wireframe.html` · `wireframe/dashboard-wireframe.html` · `mockups/{cafes,dashboard,explore,venue}.html` (visual targets) · `travelai-links.md` (inspiration).

---

## Ordered task list

> **Canonical task specs:** [`tasks/INDEX.md`](tasks/INDEX.md) — one `D-*.md` per task. This section is the summary; edit specs in `tasks/` first.

Legend — Status: ☐ todo · ◐ partial · ✅ done. Track: **B** = design/re-skin. All 14 tasks live in the **`track:ux`** Linear view (don't pollute the MVP launch queue).

**Linear (created 2026-06-05):** all 14 tasks live under epic **[SAN-566](https://linear.app/sanjiovani/issue/SAN-566)** — *"Design Track — light-luxury re-skin + Concierge OS (D-01–D-14)"* in project **UX**, labels `track:ux` + `scr`. 1:1 map: D-01→**SAN-567** · D-02→**SAN-568** · D-03→**SAN-569** · D-04→**SAN-570** · D-05→**SAN-571** · D-06→**SAN-572** · D-07→**SAN-573** · D-08→**SAN-574** · D-09→**SAN-575** · D-10→**SAN-576** · D-11→**SAN-577** · D-12→**SAN-578** · D-13→**SAN-579** · D-14→**SAN-580**. Priority High = D-05/D-08/D-09; D-09 (SAN-575) `relatedTo` SAN-478/490/491/519. Queue: [**UX project**](https://linear.app/sanjiovani/project/ux-0ad555e403b4) + [`track:ux` view](https://linear.app/sanjiovani/view/ux-tasks-0e5d9fe91725) — **`screens` is route-build folder only, not the design queue.**

### Phase 0 — Foundation docs *(fast; D-02…D-04 run in PARALLEL — they document what's already shipped, they don't gate)*

| # | Task | Output | Dep | §ref | Status |
|---|---|---|---|:--:|:--:|
| **D-01** | **IA + route reconciliation** — consolidate nav + 5-domain model + 8-band scroll order into one page. **Route DECIDED 2026-06-05: re-skin existing routes, no new `/explore`** (`/`, `/rentals`, `/restaurants`, `/nightlife`, `/cafes`). | `docs/ia-journey.md` | — | §3.1 | ✅ |
| **D-02** | **Design system** — transcribe shipped `globals.css :root` oklch tokens; light-final; 2-color; de-drift `DESIGN.MD` (amber 65→86, teal undocumented) | `docs/design-system.md` | — | §4 | ✅ |
| **D-03** | **Image strategy** — per-vertical style + Google Places proxy plan + the one pale-teal `#E1F6F2` placeholder + blur-up | `docs/images.md` | — | §5 | ✅ |
| **D-04** | **Component inventory** — consolidate concierge-os §7 + home-wireframe spec cards into one 70/20/10-tagged list | `docs/component-inventory.md` | — | §1 | ✅ |

### Phase 1 — Wireframes *(flagship-first; annotated component maps, home-wireframe pattern)*

| # | Task | Output | Dep | §ref | Status |
|---|---|---|---|:--:|:--:|
| **D-05** | **Discovery wireframe** *(FLAGSHIP — pattern, not a route commitment)* — AI-in-center band over Cards │ Map split + scroll storytelling; the reusable pattern that lands on `/` + the vertical pages (`/explore` deferred); upgrade `mockups/explore.html` into an annotated map | `wireframe/explore-wireframe.html` | D-01 | §3.3·§3.2 | ✅ |
| **D-06** | **Dashboard wireframe** — the 5 domains ("manage your life" OS view); upgrade `mockups/dashboard.html` | `wireframe/dashboard-wireframe.html` | D-01 | §3.1 | ✅ |

### Phase 2 — Primitives

| # | Task | Output | Dep | §ref | Status |
|---|---|---|---|:--:|:--:|
| **D-07** | **P0 shadcn install** — `npx shadcn@latest add tabs command avatar carousel sonner sidebar` (Explore tabs · ⌘K · shell) | new primitives in `mdeapp/src/components/ui` | — | §8 | ✅ |

### Phase 3 — Build / re-skin *(Track B; order = Discovery (existing routes) → Dashboard → Map → Concierge; interleave w/ Track A; → Linear `track:ux`)*

| # | Task | Output | Dep | §ref | Status |
|---|---|---|---|:--:|:--:|
| **D-08** | **Shared browse system** — `<VenueCard>` + `<BrowseLayout>` (one card/layout, three skins; image · name · rating · 2-line clamp · actions) | `mdeapp/src/components/browse/*` | D-02·D-03·D-05 | README §2A | ◐ |
| **D-09** | **Re-skin discovery surface** — apply D-05 pattern to **existing routes** (skin-only; functional owners Done/in-flight): `/restaurants` (SAN-490) → `/nightlife` (SAN-491) → `/rentals` **after** SAN-478 → `/cafes` **after** SAN-519. No `/explore`. | re-skinned existing routes | D-01·D-05·D-07·D-08 | §3.3 | ✅ |
| **D-10** | **Re-skin Dashboard** — `/saved` (LIVE) · `/trips` (SHELL) · `/me/tickets` to the 5-domain view — **must not block MVP** (post-revenue polish) | dashboard routes | D-06·D-07·D-08 | §3.1 | ☐ |
| **D-11** | **Map workspace** — embedded in Explore + `/chat`; pins synced to cards, hover↔pin; `mapId` + FieldMask (hard rules) | map integration | D-08·D-09 | §3.3 | ☐ |
| **D-12** | **Concierge surface** — full-width AI band reuse (CopilotKit v1); grounded AI-Insight strips (never fabricated) | concierge band | D-09 | §3.2 | ☐ |
| **D-13** | **Re-skin Home** — build from `home-wireframe.html` (14 bands) | `/` | D-08 | §3.2 | ☐ |

### Phase 4 — Polish

| # | Task | Output | Dep | §ref | Status |
|---|---|---|---|:--:|:--:|
| **D-14** | **Polish + proof** — responsive → a11y (WCAG AA, `prefers-reduced-motion`) → loading/empty/error → motion. **Proof required:** mobile screenshots · Playwright e2e · a11y check · loading/empty/error demonstrated. Run §6 Quality Gate per surface | all surfaces + test evidence | D-09…D-13 | §6 | ☐ |

---

## Critical path & parallelism

```
D-01 ─┬─ D-05 (discovery wf) ─┬─ D-08 (VenueCard) ─ D-09 (existing route) ─┬─ D-11 (Map) ─ D-12 (Concierge) ─┐
      └─ D-06 (dashboard wf) ─┘                     │                      └─ D-10 (Dashboard) ──────────────┤
D-02 ┐                                              └─ D-13 (Home /) ────────────────────────────────────────┤
D-03 ┤ (parallel docs — feed D-08, never block)                                                              └─ D-14 (Polish + proof)
D-04 ┘            D-07 (install) ─ feeds D-09/D-10
```

### Agent assignment (Linear `blockedBy` — synced 2026-06-05)

| Issue | Task | Safe to assign? | Blocked by (Linear) |
|-------|------|:---------------:|---------------------|
| **SAN-573** | D-07 shadcn install | **Done** (PR #76 + #78) | — |
| **SAN-574** | D-08 VenueCard | **Yes — start now** | SAN-568✓ · SAN-569✓ · SAN-571✓ · SAN-462✓ |
| **SAN-575** | D-09 re-skin routes | No | SAN-573 · SAN-574 · SAN-567✓ · SAN-571✓ |
| **SAN-576** | D-10 dashboard | No | SAN-572✓ · SAN-573 · SAN-574 |
| **SAN-577** | D-11 map | No | SAN-574 · SAN-575 |
| **SAN-578** | D-12 concierge | No | SAN-575 |
| **SAN-579** | D-13 home | No | SAN-574 |
| **SAN-580** | D-14 polish | No | SAN-575–579 |

✓ = blocker issue **Done**. **Start now:** **D-08 (SAN-574)**. D-07 Done on main; SAN-462 soak signed off 2026-06-05.

## Notes

- **Not a separate sprint.** Phase 0–2 (docs + wireframes + install) are ~days and don't touch prod. Phase 3 re-skins are mostly already-built surfaces, scheduled into Track A's gaps — Roberto's revenue never waits.
- **`/explore` is net-new (verified — not in `sitemap.md`, not on disk). DECIDED 2026-06-05: re-skin existing routes** (`/`, `/rentals`, `/restaurants`, `/nightlife`, `/cafes`) — no new route. A new `/explore` aggregator is deferred (post-MVP, optional).
- **Re-skin work maps to EXISTING Linear issues, don't duplicate:** `/rentals` → SAN-478/479 · `/restaurants` → SAN-490 · `/cafes` → SCREEN-021 · `/nightlife` → SCREEN-022. Design (D-09) is **input to those**, attached as comments/specs — not new issues.
- **Linear (decided 2026-06-05):** all 14 design tasks (D-01…D-14) are now `track:ux` issues under epic **SAN-566** in project **UX** — see the D→SAN map under "Ordered task list". The re-skin issue (D-09 / SAN-575) attaches as **input** to the existing route issues (SAN-478/490/491/519) via `relatedTo`, not as duplicates. This index stays the canonical design spec; Linear tracks execution status.
- **One queue (decided 2026-06-05):** the **[`track:ux` view](https://linear.app/sanjiovani/view/ux-tasks-0e5d9fe91725)** is the single live design queue. Set its filter to **status ≠ Done/Canceled** so it shows active work only (epic SAN-566 + the few legacy `UX-*` still open). The **[UX project](https://linear.app/sanjiovani/project/ux-0ad555e403b4)** is Track B’s home — *not* `screens`. `screens` (project = folder) holds route-build tickets (`scr` without design-track ownership); a project and a view overlap **on purpose**.
- **Hard rules still apply to D-09/D-11:** `mapId` on every `<Map>`, `X-Goog-FieldMask` on every Places call, CopilotKit v1 only, no hardcoded `gray-*`.

---

## Dedup map — design epic ↔ existing issues *(2026-06-05; relations wired in Linear)*

The new epic overlaps existing `scr` / `track:screens` work on the **same surfaces**. These are now `relatedTo`-linked (not duplicated). **Action** says how to treat each: **reuse** (build on shipped work) · **extend** (re-skin on top of an existing build) · **supersede** (old wireframe/spec the epic redoes — now **Canceled**, see below) · **fold/merge** (same work, don't double-track).

| D-task | Existing issue(s) | Status | Action |
|---|---|---|:--|
| **D-08** VenueCard (SAN-574) | SAN-360 shared card shell · SAN-437 ResultCardShell+primitives · SAN-318 unified cards · SAN-436 card types · (+ shipped RestaurantCard/AttractionCard/RentalCard SAN-439/442/324) | Backlog/Todo/**Done** | **REUSE — do not rebuild.** A card system already exists. D-08 = consolidate the 3 rich cards into one `VenueCard` + finish SAN-360/437, not build from zero. |
| **D-05** discovery wf (SAN-571) | SAN-261 Explore Unified · SAN-244 Rentals Browse · SAN-267 Nightlife (old `WIRE-*`) | Backlog | **Supersede** — old wireframes; D-05 redoes them light-luxury. |
| **D-09** re-skin (SAN-575) | SAN-478 `/rentals` · SAN-490 `/restaurants` · SAN-491 `/nightlife` · SAN-519 `/cafes` · SAN-261 | mixed | **Input/extend** — design feeds these route builds (Track A). |
| **D-10** dashboard (SAN-576) | SAN-255 Trips · SAN-259 Tickets · SAN-251 Itinerary · SAN-253 Saved | In Review/Done | **Extend** — re-skin on top of these. |
| **D-11** map (SAN-577) | SAN-247 Map Exploration Panel (`WIRE-008`) · SAN-524 Mobile map | Todo/Backlog | **Supersede/extend** — D-11 is canonical map work. |
| **D-12** concierge (SAN-578) | SAN-523 Mobile concierge UX · SAN-522 Mobile composer | Backlog | **Fold** — mobile concierge ⊂ D-12 responsive. |
| **D-13** home (SAN-579) | SAN-232 Home Chat Chrome | Done | **Reuse** — build on shipped chrome. |
| **D-14** polish (SAN-580) | SAN-265 Loading/Empty/Error · SAN-268 A11y Pass | **Done** | **Extend** — D-14 applies SCREEN-019/020 to re-skinned surfaces only; MVP polish closed. |

**Both dedup decisions RESOLVED 2026-06-05:** (1) **D-08 reframed** — SAN-574 now reads "consolidate existing RestaurantCard/AttractionCard/RentalCard into one shared `VenueCard`, completing SAN-360/437" (absorbs them); *not* a rebuild. (2) **Stale `WIRE-*` Canceled** — SAN-244 (Rentals Browse), SAN-247 (Map Exploration, was `/explore` Phase-2), SAN-261 (Explore Unified — `/explore` deferred), SAN-267 (Nightlife Explorer, already built as SAN-491) set to **Canceled** with a supersede comment pointing to their D-task replacement.

---

## Partners track *(added 2026-06-06 — separate program, not Track B)*

A **second design program** now lives alongside the D-track: the **partner ecosystem** (supply + B2B + marketplace). It is **not** part of D-01…D-14 — it has its own folder, Linear project, and labels.

- **Blueprint:** [`partners/00-INDEX.md`](partners/00-INDEX.md) (12 parts) · **PRD:** [`partners/prd-partners.md`](partners/prd-partners.md) · **plan/cycle:** [`partners/index-partners.md`](partners/index-partners.md) (7-stage lifecycle + Gantt) · **revenue:** [`partners/revenue/00-INDEX.md`](partners/revenue/00-INDEX.md) (8 docs) · **audit:** [`partners/audit/06-june-partners-audit.md`](partners/audit/06-june-partners-audit.md).
- **Diagrams:** `partners/diagrams/` — **38 mermaid `.svg`** (journeys ×10, revenue, lifecycle, ERD, gantt) rendered via mermaid-cli.
- **Wireframes:** `partners/wireframes/` (partner-signup · venues · host) + `wireframe/home-mindtrip-style-wireframe.html`.
- **Linear:** project **Partners** (`partners-032df556f9f9`), epic **SAN-667**, labels **`PTR`** + **`ptr:<type>`** (host/restaurant/cafe/nightclub/venue/broker/sponsor/agency/…) + **`MKT`**/**`UX`**.
  - Pages: 660 `/host` · 661 `/venues` · 662 `/about` · 663 `/business/ai` · 664 `/sponsors` · 691 `/partners/rentals`
  - Platform: 683 schema · 665 signup · 690 dashboard · 668 revenue · 684 lead-gen · 685 copilot · 686 booking · 687 assets/social · 688 data · 689 comms · 669 AI services · 670 automation · 671 contests · 672 marketplace · 673 concierge
  - Verticals (e2e): 675 host · 676 nightclub · 677 broker · 678 restaurant · 679 café · 680 venue · 681 sponsor · 682 agency
- **Task format:** each partner issue carries Feature · Goal · Success criteria · Testing · Production-ready checklist · mermaid (where a flow) · **`Skills:`** (build + verify; every task verified by `task-verifier`). Verticals + epic upgraded 2026-06-06; pages/workstreams Skills-line propagation in progress.
### Partners — implementation order *(verified vs Linear 2026-06-06)*

> **Step 1 = the marketing website** — it's static (shadcn/tailwind), the wireframes are ready, and it only needs the **live** `/api/leads` (no partner schema). So it ships **before** SAN-683. The schema-first Gantt in [`partners/index-partners.md`](partners/index-partners.md) is the *platform* sequence; this is the **program** sequence with marketing first.

| Step | Tasks (in order) | Why here |
|---|---|---|
| **1 · Marketing website** | **SAN-660** `/host` (wf ✅) · **661** `/venues` (wf ✅) · **691** `/partners/rentals` · **662** `/about` · **663** `/business/ai` · **664** `/sponsors` · home decision **674/D-13** | static · wireframes ready · CTA→signup · demo form→live `/api/leads` |
| **2 · Platform foundation** | **683** schema+RLS (unblocker) → **665** signup · **690** dashboard · **684** lead-gen | needs schema before prod writes |
| **3 · Monetize + pilot** | **668** revenue → **675** host e2e (first ticket sold) | proves the platform once |
| **4 · Replicate verticals** | **676** nightclub · **677** broker · **678/679/680** restaurant/café/venue | reuse the proven pilot |
| **5 · Augment** | **685** copilot · **686** booking · **687** social · **688** data · **689** comms · **670** automation · **669** AI services · **673** concierge | layer onto live verticals |
| **6 · Expand (P2–3)** | **681** sponsor · **682** agency · **699** tour · **703** venue-features · **672** marketplace | after P0 proves GMV |
- **Relationship to D-track:** independent. D-track re-skins the *consumer* surfaces; Partners builds the *supply/B2B* surfaces. They share components (VenueCard, CopilotKit, Maps) but track separately.
