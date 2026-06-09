---
title: UX-010 result-card architecture — spec audit
date: 2026-05-29
spec: ../UX-010-unified-result-card-architecture.md
auditor: Cursor (task-verifier style)
verdict: "Spec ~84/100 · execution-ready ~68/100 · not 100% correct as-written"
---

# UX-010 audit — unified result cards

## Verdict

| Dimension | Score | Notes |
|-----------|------:|-------|
| **Problem diagnosis** | **95/100** | Root cause (registrar missing for event/restaurant/attraction) matches committed code @ `895f459` |
| **Architecture target** | **90/100** | DomainResults + ResultCardShell is the right structural fix |
| **Spec freshness** | **55/100** | `status: not started` is wrong; M1 WIP exists uncommitted on disk |
| **DoD / test alignment** | **70/100** | Conflicts with existing `maps-layout-desktop` rental pin-row test |
| **Execution readiness** | **68/100** | Blockers below; do not mark Done until M1 committed + e2e reconciled |

**Bottom line:** UX-010 is an **excellent audit doc** and a **sound migration plan**, but it is **not 100% correct or merge-safe as a task spec** until status, sequencing, and Playwright contradictions are fixed.

---

## What is correct (verified on disk)

### Root cause @ PR #14 head (`895f459`)

```text
grep RichCardResultsRegistrar on 895f459:src/components/copilot/search-tool-renders.tsx
  grounded  L130 ✅
  rental    L212 ✅
  event     ❌ (ToolPinsSync only ~L344)
  restaurant/attraction via GenericResults ❌ (ToolPinsSync only)
```

`shouldSuppressGenericMapResults` only fires when `counts[activeMapCategory] > 0` — without registrar, counts stay 0 → `ChatResultsColumn` pin rows show → **duplicate surface**. Spec §2.1 is **accurate for prod and for merged-until-PR14 main**.

### Other verified claims

| Claim | Verdict |
|-------|---------|
| `RICH_CARD_CATEGORIES` includes event/restaurant/attraction | ✅ |
| Nightlife = event facet, not pin category | ✅ |
| `mergePinsByCategory` 1:1 pin logic healthy | ✅ (spec reasonable) |
| `GroundingAttribution.tsx` orphaned (no JSX importer) | ✅ grep — only self + tests/sanitizer refs |
| `grounded-place-card.tsx` orphaned | ✅ only `grounded-place-card.test.tsx` imports |
| Café dedup proof on branch | ✅ [`cafe-rich-card-dedup-runtime-proof.md`](../../testing/evidence/2026-05-29/cafe-rich-card-dedup-runtime-proof.md) |
| Mermaid / persona framing | ✅ Good for handoff |

---

## Errors & stale content in the spec

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | **`status: Spec (not started)`** | 🔴 | Change to **M1 in progress (uncommitted WIP)** or split sub-tasks M0–M5 |
| 2 | **`source_audit: this file (§2)`** | 🟡 | Point to `10-audit-cards.md` or commit SHA audited |
| 3 | **§2 table "Cafés branch only"** | 🟡 | Add column **Prod (main)** vs **PR #14** — prod still minimal/dup until merge |
| 4 | **M1 already partially implemented** | 🔴 | Working tree has `DomainResults` + tests **not in `895f459`** — spec migration table says M1 future |
| 5 | **Sequencing violation** | 🟡 | Spec says M0 before M1; disk has M1 without `ResultCardShell` (M0) |
| 6 | **§9 e2e vs existing e2e** | 🔴 | `maps-layout-desktop.spec.ts` **expects** `[data-testid="results-pin-row"]` visible for rentals; UX-010 AC requires **0** pin rows when rich cards show |
| 7 | **No COMMIT-LEDGER / PR slot** | 🟡 | Add `C-015` or `UX-010-M1` row per commit playbook — don't land 308 lines on café PR |
| 8 | **§11 "No backend changes"** | 🟡 | M2/M3 rich restaurant/attraction cards likely need **Places detail / photo proxy** (C-012 pattern) — render-only ≠ zero API |

---

## Blockers before execution / Done

1. **Do not mix UX-010 with C-012 PR #14** — café branch should merge first; UX-010 M1+ on fresh `main` (or dedicated `feat/ux-010-m1` branch).
2. **Commit or discard uncommitted M1 WIP** (7 files, ~308 LOC) — currently invisible to PR #14 reviewers.
3. **Reconcile Playwright:**
   - Update or delete `rental card click highlights pin row` in `maps-layout-desktop.spec.ts` if suppression is correct behaviour.
   - Add explicit UX-010 specs (event / restaurant / attraction) — helpers exist in WIP `maps-layout.ts` but no spec file yet.
4. **C-012 merge dependency** — M0 `CafeResultCard` → shell refactor conflicts if both branches touch same files.

---

## Failure points (runtime)

| Risk | Likelihood | Mitigation in spec? |
|------|------------|---------------------|
| Registrar count stuck > 0 after clear | Med | ✅ §8.2 — add e2e "new search clears panel" |
| `activeMapCategory` null → suppression false | Med | ⚠️ Spec doesn't mention — pin strip may flash if category lags |
| Event **dual web citation** (inline + panel) | High (today) | ✅ §6.4 — still open on committed code |
| Sparse restaurant payload → ugly rich card | Med | ✅ shell degradation |
| Agent flake on new domain e2e | High | ⚠️ Add `waitFor*` nudge pattern like SCREEN-021 |

---

## Suggested improvements to UX-010 spec

### 1. Split into executable slices (match commit playbook)

| Slice | Scope | PR |
|-------|-------|-----|
| UX-010-M1 | `DomainResults` + registrar for event/restaurant/attraction only | Small PR after C-012 |
| UX-010-M0 | `ResultCardShell` extract (no visual change) | Own PR |
| UX-010-M2/M3 | RestaurantCard / AttractionCard rich | One PR each |
| UX-010-M4 | Delete orphans + citation collapse | Chore PR |

### 2. Fix frontmatter

```yaml
status: "M1 WIP (uncommitted on feat/c012 — move to own branch)"
source_audit: tasks/ux/audit/10-audit-cards.md
depends_on: C-012  # merge PR #14 first
blocks: none
commit_ledger: C-015  # propose
```

### 3. Add prod vs branch column to §2 audit table

### 4. Test plan patch

- **Replace** conflicting rental pin-row assertion OR document exception (there should be none if suppression works).
- **Add** `e2e/screens/SCREEN-022-result-card-dedup.spec.ts` (or extend `maps-layout-desktop`) with:
  - event query → 0 `results-pin-row`, N event cards, N map pins
  - restaurant / attraction same
- **Keep** rental + café regressions (SCREEN-021, existing rental e2e).

### 5. Clarify Places API scope for M2/M3

```text
Render-layer only for M1.
M2/M3 may consume GET /api/places/detail (field-masked) — same as C-012; not a Mastra tool change.
```

### 6. Persona one-liner (task-verifier)

**Tourist** on `/` stops seeing every restaurant/event twice (chat card + side-panel row); **Camila** keeps rental cards unchanged; **Sofía** gets one Playwright invariant per domain.

---

## PR #14 relationship

| Question | Answer |
|----------|--------|
| Is UX-010 done when PR #14 merges? | **No** — PR #14 fixes **café** only; event/restaurant/attraction dup remains on prod until UX-010 M1 ships |
| Is the spec wrong about café? | **No** — café pattern on branch is the template; spec correctly cites evidence |
| Should UX-010 WIP ride on café branch? | **No** — split branch after C-012 merge |

---

## GO / NO-GO

| Use spec as… | Verdict |
|--------------|---------|
| Architecture direction | **GO** |
| Execution task as-is | **NO-GO** — update status, split slices, fix e2e conflicts |
| Merge blocker for PR #14 | **NO** — orthogonal; merge C-012 first |

*Audited against `feat/c012-cafe-places-detail @ 895f459` + unstaged working tree 2026-05-29.*
