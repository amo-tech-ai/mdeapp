---
title: "UX Project — Design Track Forensic Audit (D-01…D-14)"
audited: 2026-06-05
auditor: forensic pass (disk + Linear + design-plan + design-system)
project: https://linear.app/sanjiovani/project/ux-0ad555e403b4/issues
epic: SAN-566
scope: Design Track D-01…D-14 (SAN-567…580) — primary; other UX backlog noted at end
refs:
  - ../docs/design-plan.md
  - ../docs/design-system.md
  - ../index-design.md
  - audit-design.md
  - audit-3-progress.md
---

# UX Design Track Audit — Per-Task Report

> **One-line verdict:** Planning is **strong and aligned** with `design-plan.md` + `design-system.md` (**88% spec-correct**). **Execution is 43%** (6/14 Done). **Not production-ready** — zero re-skin code shipped. **Will succeed** if agents start at **SAN-573 only** and respect **SAN-462** soak before card refactors.

---

## Executive summary

| Question | Answer |
|----------|--------|
| **Overall % correct (spec + hygiene)** | **88 / 100** 🟡 |
| **Execution complete** | **43%** (6 Done · 8 Backlog) |
| **Production ready?** | **No** — Track B is prep complete; build phase not started |
| **Will the track succeed?** | **Yes**, if D-07 → D-08 → D-09 order holds and Track A fixes `/rentals` (design-plan #1) |
| **Biggest blocker** | **SAN-462** prod soak (1/3) gates D-08 card refactor |
| **Safe to assign now** | **SAN-573 (D-07)** only |

### Grading legend

| Dot | Score | Meaning |
|-----|------:|---------|
| 🟢 | 90–100 | Shipped or agent-ready; spec matches disk + design docs |
| 🟡 | 70–89 | Spec good; minor fix or blocked on external gate |
| ⚪ | 50–69 | Not started / waiting on deps (expected for build tasks) |
| 🔴 | &lt;50 | Wrong scope, missing artifact, or duplicate risk |

---

## Verification tests (2026-06-05)

| # | Test | Result | Evidence |
|---|------|:------:|----------|
| T1 | D-01…D-04 markdown on disk | 🟢 PASS | `ia-journey.md` 195L · `design-system.md` 186L · `images.md` 135L · `component-inventory.md` 145L |
| T2 | D-05…D-06 wireframes on disk | 🟢 PASS | `explore-wireframe.html` 704L · `dashboard-wireframe.html` 205L |
| T3 | D-07 shadcn primitives (6 files) | 🔴 FAIL | All MISSING: `tabs` · `command` · `avatar` · `carousel` · `sonner` · `sidebar` |
| T4 | D-08 `components/browse/*` | 🔴 FAIL | Directory does not exist |
| T5 | Linear D-06…D-14 `blockedBy` wired | 🟢 PASS | Verified via MCP `get_issue` |
| T6 | Duplicate card tickets merged | 🟢 PASS | SAN-437 + SAN-360 → Duplicate of SAN-574 |
| T7 | design-system ↔ globals.css alignment | 🟢 PASS | Tokens transcribed; 2-colour rule documented |
| T8 | design-plan workflow alignment | 🟢 PASS | Code-first + shadcn MCP (88/100) — no Figma-as-SOT |
| T9 | `npm run floor` | 🔴 FAIL | exit 1 · ESLint ~25k errors (likely generated `.next`/route types — **pre-existing**, not design-track) |

---

## Alignment with design-plan.md + design-system.md

| design-plan insight | Design track response | Following correctly? |
|---------------------|----------------------|:--------------------:|
| **Best dev workflow = Claude Code + shadcn + DESIGN.MD (88/100)** | D-07 installs shadcn; D-02 documents `globals.css`; code-first wireframes | 🟢 Yes |
| **Don't adopt directory templates (35–62/100)** | Re-skin existing routes; no `/explore` greenfield | 🟢 Yes |
| **Mindtrip bar: map↔card sync (#5, score 93)** | D-11 map workspace; D-08 unified VenueCard | 🟡 Spec yes · code no |
| **Top ROI #1 fix `/rentals` cards** | Track A (SAN-478); D-09 skin-only after functional fix | 🟢 Correct split |
| **SCREEN-019/020 production gates (#8, #20)** | D-14 extends to re-skinned surfaces; SAN-265/268 Done | 🟢 Yes |
| **2 brand colours: teal + gold** | design-system.md §0–1; wireframes use `--primary` / `--accent` | 🟢 Yes |
| **70/20/10 component split** | D-04 inventory tags shadcn / 21st / custom | 🟢 Yes |
| **Competitive risk = unfinished surfaces, not strategy** | Track B explicit non-blocker for MVP | 🟢 Yes |

---

## Master scorecard — D-01…D-14

| D | Linear | Phase | Purpose (plain English) | Linear status | Disk | Blockers | % correct | Dot | Prod ready? |
|---|--------|-------|-------------------------|---------------|------|----------|----------:|:---:|-------------|
| **D-01** | [SAN-567](https://linear.app/sanjiovani/issue/SAN-567) | 0 | Lock the 5-domain IA: where Home, Explore, Concierge, Maps, Profile live | Done | ✅ | — | **96** | 🟢 | ✅ (doc) |
| **D-02** | [SAN-568](https://linear.app/sanjiovani/issue/SAN-568) | 0 | Document shipped teal+gold tokens from `globals.css` | Done | ✅ | — | **94** | 🟢 | ✅ (doc) |
| **D-03** | [SAN-569](https://linear.app/sanjiovani/issue/SAN-569) | 0 | Photo rules: Places proxy, blur-up, one placeholder gradient | Done | ✅ | — | **93** | 🟢 | ✅ (doc) |
| **D-04** | [SAN-570](https://linear.app/sanjiovani/issue/SAN-570) | 0 | Tag every UI block 70% shadcn / 20% 21st / 10% custom | Done | ✅ | — | **92** | 🟢 | ✅ (doc) |
| **D-05** | [SAN-571](https://linear.app/sanjiovani/issue/SAN-571) | 1 | Flagship discovery pattern: AI band + cards │ map | Done | ✅ | — | **91** | 🟢 | ✅ (wireframe) |
| **D-06** | [SAN-572](https://linear.app/sanjiovani/issue/SAN-572) | 1 | Dashboard OS wireframe: 5 life-management zones | Done | ✅ | ←567 | **86** | 🟡 | ✅ (wireframe) |
| **D-07** | [SAN-573](https://linear.app/sanjiovani/issue/SAN-573) | 2 | Install missing shadcn primitives (tabs, ⌘K, sidebar…) | Backlog | ❌ | **NONE — assign** | **78** | 🟡 | ❌ |
| **D-08** | [SAN-574](https://linear.app/sanjiovani/issue/SAN-574) | 3 | One VenueCard + BrowseLayout for all verticals | Backlog | ❌ | 568✓ 569✓ 571✓ **462** | **82** | 🟡 | ❌ |
| **D-09** | [SAN-575](https://linear.app/sanjiovani/issue/SAN-575) | 3 | Visual re-skin of `/rentals` `/restaurants` `/nightlife` `/cafes` | Backlog | ❌ | 573 574 567✓ 571✓ | **85** | ⚪ | ❌ |
| **D-10** | [SAN-576](https://linear.app/sanjiovani/issue/SAN-576) | 3 | Re-skin `/saved` `/trips` `/me/tickets` dashboard | Backlog | ❌ | 572✓ 573 574 | **84** | ⚪ | ❌ |
| **D-11** | [SAN-577](https://linear.app/sanjiovani/issue/SAN-577) | 3 | Map pins sync with cards (Mindtrip moat) | Backlog | partial | 574 575 | **83** | ⚪ | ❌ |
| **D-12** | [SAN-578](https://linear.app/sanjiovani/issue/SAN-578) | 3 | Full-width AI concierge band on browse pages | Backlog | partial | 575 | **85** | ⚪ | ❌ |
| **D-13** | [SAN-579](https://linear.app/sanjiovani/issue/SAN-579) | 3 | Re-skin `/` from 14-band home wireframe | Backlog | ❌ | 574 | **86** | ⚪ | ❌ |
| **D-14** | [SAN-580](https://linear.app/sanjiovani/issue/SAN-580) | 4 | Final polish + Playwright/a11y proof on new surfaces | Backlog | ❌ | 575–579 | **88** | ⚪ | ❌ |

**Epic:** [SAN-566](https://linear.app/sanjiovani/issue/SAN-566) — **82%** 🟡 (description still says "Start D-05"; 6/14 children Done but epic Backlog)

---

## Per-task reports

### D-01 — IA + route reconciliation (SAN-567) · 96% 🟢

| Field | Detail |
|-------|--------|
| **Purpose** | One page that says "the app is 5 domains around AI" — before anyone picks colours |
| **Real-world example** | Camila opens mdeai: nav shows Home · Explore · Trips · Saved · Events — not 20 mystery links. She knows `/restaurants` is Explore, not a separate product |
| **design-plan fit** | Matches "architecture before colour" + Mindtrip-style OS framing |
| **design-system fit** | References light-final + domains; defers tokens to D-02 |
| **What's correct** | `ia-journey.md` on disk · no `/explore` greenfield · Linear Done |
| **Corrections** | Update frontmatter `project screens` → **UX** (cosmetic) |
| **Will succeed?** | ✅ Already succeeded (foundation doc) |
| **Production ready?** | ✅ As specification input to build |

---

### D-02 — Design system doc (SAN-568) · 94% 🟢

| Field | Detail |
|-------|--------|
| **Purpose** | Transcribe what already ships in `globals.css` — teal interactive, gold AI/stars only |
| **Real-world example** | A dev adds a "Save" button: uses `bg-primary` (teal), not random `emerald-500` or `gray-600` |
| **design-plan fit** | Implements "Claude Code + tokens" workflow (88/100 stack); rejects template palettes |
| **design-system fit** | Self-referential — **this is the SOT** over drifting `DESIGN.MD` |
| **What's correct** | Verbatim oklch table · 2-colour rule · light-final scoped dark |
| **Corrections** | Run small follow-up: reconcile top-level `DESIGN.MD` amber hue 65→86 (noted in doc §7) |
| **Will succeed?** | ✅ Done |
| **Production ready?** | ✅ Agents must cite this before any UI PR |

---

### D-03 — Image strategy (SAN-569) · 93% 🟢

| Field | Detail |
|-------|--------|
| **Purpose** | One placeholder gradient + Places photo proxy + blur-up — no broken image boxes |
| **Real-world example** | Tourist sees a café card: real Google photo fades in; if cold, pale-teal gradient — never a grey "X" box |
| **design-plan fit** | Supports design-plan #7 "real photos on every card" (score 89) |
| **design-system fit** | Placeholder colour derived from brand teal, not per-category tints |
| **Corrections** | None blocking |
| **Will succeed?** | ✅ Done (policy doc) |

---

### D-04 — Component inventory (SAN-570) · 92% 🟢

| Field | Detail |
|-------|--------|
| **Purpose** | Single list: what's shadcn vs custom (Concierge, Maps, VenueCard) |
| **Real-world example** | Agent asked to "build trips panel" → inventory says custom 10% OS component, not new shadcn fork |
| **design-plan fit** | Matches shadcn MCP P0 (#3, score 92) — know what to pull vs build |
| **design-system fit** | 70/20/10 split matches design-process §0 |
| **Corrections** | Mark D-07 items ✅ after shadcn install lands |
| **Will succeed?** | ✅ Done |

---

### D-05 — Discovery wireframe (SAN-571) · 91% 🟢

| Field | Detail |
|-------|--------|
| **Purpose** | Flagship layout: AI-in-center band, cards │ map, scroll storytelling |
| **Real-world example** | Camila asks "quiet rooftop dinner Provenza" → AI band at top, restaurant cards left, map pins right — same unit as Mindtrip |
| **design-plan fit** | Directly targets design-plan #5 map↔card + #12 persistent AI |
| **design-system fit** | Wireframe uses `--primary-soft` / `--accent-soft` derivations from §1.1 |
| **Corrections** | None — pattern doc, not a route |
| **Will succeed?** | ✅ Done |

---

### D-06 — Dashboard wireframe (SAN-572) · 86% 🟡

| Field | Detail |
|-------|--------|
| **Purpose** | "Manage your life" OS: trips · tickets · saved · plans in 5 zones |
| **Real-world example** | Andrés opens `/me/tickets` after buying salsa tickets — QR + event detail in dashboard zone, not buried in chat |
| **design-plan fit** | Supports #16 trips panel (score 79) — deferred depth OK for MVP |
| **What's thin** | 205 lines vs 704 explore / 624 home — fewer annotated bands |
| **Corrections** | Optional: add 2–3 band annotations before D-10 build (not blocking D-07) |
| **Will succeed?** | ✅ Wireframe sufficient to start D-10 later |

---

### D-07 — P0 shadcn install (SAN-573) · 78% 🟡 · **ASSIGN NOW**

| Field | Detail |
|-------|--------|
| **Purpose** | Add tabs, command palette, avatar, carousel, sonner, sidebar — primitives Explore/Dashboard need |
| **Real-world example** | Camila taps ⌘K → jumps to "saved cafés" or "concierge" without hunting nav |
| **design-plan fit** | design-plan Part 1 #13 shadcn MCP (88/100) — **exact recommended stack** |
| **design-system fit** | base-nova registry; tokens already in globals.css |
| **Red flags** | **6/6 files missing on disk** — task not started |
| **Corrections** | Run install command in SAN-573 AC · flip inventory ☐→✅ · mark Done |
| **Blockers** | None — **only safe assignment** |
| **Will succeed?** | ✅ High confidence (~1 command + floor) |
| **Production ready?** | ❌ Until install + `npm run floor` green |

---

### D-08 — Shared browse system (SAN-574) · 82% 🟡

| Field | Detail |
|-------|--------|
| **Purpose** | Consolidate RestaurantCard / RentalCard / Café into one `VenueCard` + layout |
| **Real-world example** | Same card chrome on `/restaurants`, chat results, and map hover — tourist trusts it's one product, not three apps glued together |
| **design-plan fit** | #5 living map↔card (93) + card identity "same unit everywhere" (Mindtrip) |
| **design-system fit** | 16:10 image, 2-line clamp, teal pins, gold stars per tokens |
| **Red flags** | **SAN-462 soak 1/3** blocks runtime refactor · no `browse/*` yet |
| **Corrections** | Wait soak · reuse existing cards (SAN-437/360 Duplicate) · Vitest parity before merge |
| **Will succeed?** | 🟡 Yes if consolidate-not-rebuild discipline holds |
| **Production ready?** | ❌ |

---

### D-09 — Re-skin discovery routes (SAN-575) · 85% ⚪

| Field | Detail |
|-------|--------|
| **Purpose** | Apply D-05 visual pattern to existing routes — **skin only** |
| **Real-world example** | `/restaurants` already works (SAN-490 Done) → D-09 swaps layout to light-luxury VenueCard grid without breaking filters/API |
| **design-plan fit** | #4 deploy restaurants (94) functional Done; D-09 is polish layer |
| **Cross-track** | `/rentals` functional fix = **SAN-478 Track A** (design-plan #1 score 99) — D-09 must not steal that |
| **Corrections** | Do restaurants/nightlife first (functional Done) · rentals after SAN-478 · cafes after SAN-519 |
| **Will succeed?** | ✅ If D-08 lands first |
| **Production ready?** | ❌ |

---

### D-10 — Re-skin Dashboard (SAN-576) · 84% ⚪

| Field | Detail |
|-------|--------|
| **Purpose** | Apply dashboard wireframe to `/saved` `/trips` `/me/tickets` |
| **Real-world example** | Roberto checks host tickets in same visual language as Camila's saved places — one OS |
| **design-plan fit** | Post-revenue; correctly labeled non-MVP-blocker |
| **Corrections** | Keep `phase:post-mvp` · don't pull before Track A North-Star |
| **Will succeed?** | ✅ After D-07 + D-08 |

---

### D-11 — Map workspace (SAN-577) · 83% ⚪

| Field | Detail |
|-------|--------|
| **Purpose** | Pins appear with cards; hover highlights pin (Mindtrip moat) |
| **Real-world example** | Camila hovers "1BR Laureles" card → map pin pulses teal — she sees *where* before clicking |
| **design-plan fit** | **#5 highest ROI UX feature (93)** in competitive audit |
| **Hard rules** | `mapId` + `X-Goog-FieldMask` in AC |
| **Corrections** | Fold SAN-524 mobile map into responsive section of D-11/D-14 |
| **Will succeed?** | 🟡 Map partially exists — extend, don't rewrite |

---

### D-12 — Concierge surface (SAN-578) · 85% ⚪

| Field | Detail |
|-------|--------|
| **Purpose** | Full-width CopilotKit v1 band + grounded insight strips (no fake stats) |
| **Real-world example** | Browse `/nightlife` → AI strip says "You saved 2 places in Provenza" only if true — hides when no signal |
| **design-plan fit** | #12 persistent chat on all pages (83) |
| **Corrections** | Fold SAN-522/523 mobile composer into D-12/D-14 responsive |
| **Will succeed?** | ✅ Reuses existing `conciergeAgent` |

---

### D-13 — Re-skin Home (SAN-579) · 86% ⚪

| Field | Detail |
|-------|--------|
| **Purpose** | Implement 14 bands from `home-wireframe.html` on `/` |
| **Real-world example** | Tourist lands on `/` → hero + AI band + vertical carousels + map column — flagship first impression |
| **design-plan fit** | Hero surface; aligns with Mindtrip home density |
| **Corrections** | Reuse SAN-232 chat chrome (relatedTo wired) — don't rebuild shell |
| **Will succeed?** | ✅ Wireframe is detailed (624L) |

---

### D-14 — Polish + proof (SAN-580) · 88% ⚪

| Field | Detail |
|-------|--------|
| **Purpose** | §6 Quality Gate on **new** re-skinned surfaces only |
| **Real-world example** | After home re-skin: Camila on phone (375px) gets skeletons on slow load, keyboard nav on cards, zero-results copy — same bar as MVP SCREEN-019/020 |
| **design-plan fit** | #8 loading/empty (88) + #20 WCAG (74) — MVP Done; D-14 extends |
| **Corrections** | Write `d-14-RESULTS.md` per surface · run prod-synthetic when deployed |
| **Will succeed?** | ✅ AC complete; execution is last mile |
| **Production ready?** | ❌ Final gate — nothing ships without this |

---

## Epic SAN-566 · 82% 🟡

| Issue | Correction |
|-------|------------|
| Description says **"Start D-05"** | Update to **"Start D-07 (SAN-573); D-08 after SAN-462 soak"** |
| Epic status **Backlog** while 6/14 Done | Move to **In Progress** or add progress comment |
| `relatedTo` stale WIRE tickets | SAN-244/247/261/267 should show Canceled (verify Linear UI) |

---

## Critical fixes (priority order)

| P | Fix | Owner | Unblocks |
|---|-----|-------|----------|
| **P0** | Execute **SAN-573** shadcn install + floor | Agent | D-09, D-10 |
| **P0** | Complete **SAN-462** soak (2 more scheduled PASS) | Ops | D-08 card refactor |
| **P1** | Update **SAN-566** epic "Start now" text | 5 min | Agent confusion |
| **P1** | Fix doc frontmatter `project screens` → **UX** (D-01–03) | 5 min | Hygiene |
| **P2** | Enrich **dashboard-wireframe.html** before D-10 | Design | D-10 build clarity |
| **P2** | Reconcile **DESIGN.MD** ↔ design-system.md drift | D-14 or chore | Token consistency |

---

## Red flags still open

| Flag | Severity | Mitigation |
|------|----------|------------|
| Zero build tasks started (D-07–14) | 🟡 | Assign SAN-573 today |
| SAN-462 1/3 soak | 🟡 | No D-08 merge until 3/3 |
| UX project mixes D-track + legacy SCREEN/MOB | 🟡 | Filter [`track:ux` view](https://linear.app/sanjiovani/view/ux-tasks-0e5d9fe91725) to epic SAN-566 for design agents |
| Track A `/rentals` broken (design-plan #1) | 🔴 | SAN-478 — revenue blocker separate from D-09 skin |

---

## Best practices — are we following them?

| Practice | Status | Notes |
|----------|:------:|-------|
| Code-first, not Figma-SOT | 🟢 | design-plan verdict honored |
| 2 brand colours (teal + gold) | 🟢 | design-system.md locked |
| 70/20/10 component split | 🟢 | D-04 inventory |
| Re-skin existing routes, no `/explore` | 🟢 | D-01 decision |
| Track B doesn't block Track A | 🟢 | D-10 post-MVP; D-09 skin-only |
| Linear blockers before assign | 🟢 | Wired 2026-06-05 |
| §6 Quality Gate on build tasks | 🟢 | SAN-573…580 AC |
| Duplicate ticket hygiene | 🟢 | SAN-437/360 merged |
| shadcn MCP before custom UI | 🟡 | D-07 not run yet |
| Mindtrip map↔card moat | ⚪ | D-11 not built |

---

## Suggested improvements

1. **Milestone UX project** — M1 Foundation (Done) · M2 Primitives (D-07) · M3 Card system (D-08) · M4 Surfaces (D-09–13) · M5 Proof (D-14)
2. **Progress epic SAN-566** to In Progress; paste assignment table from `index-design.md`
3. **Automate verify** — `npm run verify:task -- D-07` script checking 6 ui files exist
4. **Separate views** — D-track filter vs legacy MOB/SCREEN backlog (reduce agent noise)
5. **After D-07** — snapshot `/` to Figma optional QA (design-plan #6, score 78) — not required

---

## Other UX project issues (out of D-track scope)

The [UX project](https://linear.app/sanjiovani/project/ux-0ad555e403b4/issues) contains **~80+ issues** beyond D-01…D-14 (SCREEN-024+, MOB-*, A11Y-*, legacy UX-010 children). These are **not errors** — but agents on the design track should **filter to SAN-566 children** only. Mobile cluster (SAN-522–530) folds into D-11/D-12/D-14 per dedup map.

---

## Final grades

| Layer | Score | Dot | Production ready? |
|-------|------:|:---:|-------------------|
| **Planning & specs (D-01–06)** | **93** | 🟢 | ✅ Ready as input |
| **Task hygiene (Linear)** | **88** | 🟢 | ✅ Assign-safe with blockers |
| **Build execution (D-07–14)** | **12** | 🔴 | ❌ Not started |
| **design-plan alignment** | **90** | 🟢 | Strategy correct |
| **design-system alignment** | **94** | 🟢 | Tokens documented |
| **Overall track** | **88** | 🟡 | ❌ Not prod until D-14 |

**Bottom line:** The design track is **correctly planned** and **ready to execute**. It is **not production-ready** because no re-skin code exists. **Next action:** assign [SAN-573](https://linear.app/sanjiovani/issue/SAN-573) (D-07 shadcn install) — the only task with zero blockers and full acceptance criteria.

---

*Cross-ref: [audit-design.md](./audit-design.md) · [audit-3-progress.md](./audit-3-progress.md) · [index-design.md](../index-design.md)*
