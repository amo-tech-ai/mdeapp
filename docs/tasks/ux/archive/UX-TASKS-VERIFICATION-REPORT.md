---
title: UX tasks forensic verification report
date: 2026-05-31
superseded_runtime: 2026-06-01
live_status: STATUS-2026-06-01.md
g2c_evidence: ../../testing/evidence/2026-06-01/g2c-pr-readiness.md
verifier: cursor (task-verifier protocol)
branch_probed: feat/ux-002-005-chat @ a8d2e26
branch_current_g2c: fix/ux-g2c-copilotkit-stability @ b1879b9
skills: task-verifier, copilotkit-integrations, mastra, mde-supabase, mde-maps, gemini
overall_spec_score: 82%
execution_readiness: 74%
plan_sync: 2026-06-01
---

# UX tasks — forensic verification report

> **⚠️ STALE for shipped code** — This report audited `feat/ux-002-005-chat @ a8d2e26`. For **current G2c merge readiness** (runtime + branch cleanliness), use [`g2c-pr-readiness.md`](../../testing/evidence/2026-06-01/g2c-pr-readiness.md) and [`STATUS-2026-06-01.md`](STATUS-2026-06-01.md). Red flags below were **fixed on main or G2c branch** (venue_anchors, writer.custom, RentalCard a11y, react-core/v2).
>
> **Not 100% correct as shipped work** — specs are **82% accurate** / **74% execution-ready** after third-pass fixes. See §Third-pass below.

## Plan sync (2026-06-01 — user forensic verdict)

**Proceed after doc revision.** Authoritative sequencing is now in [`UX-010-CARD-UNIFICATION-STRATEGY.md`](UX-010-CARD-UNIFICATION-STRATEGY.md) §7 and [`UX-010-unified-result-card-architecture.md`](../UX-010-unified-result-card-architecture.md) §6.6:

| Fix | Applied |
|-----|---------|
| UX-010 stale “events lack registrar” | Parent + strategy updated — event ✅ on `main` |
| “M1 WIP” vs child “Not Started” | Parent `status` → Approved; §6.6 milestone table |
| UX-030 ↔ UX-021 | INDEX + strategy: UX-030 depends **UX-022 + UX-021** |
| UX-023 blocks UX-022 | **Removed** — UX-022 ships first |
| UX-025 depends UX-023 | **Removed** — depends **UX-022 only** |
| UX-036 | Merged #28 — fast path has registrar; agent path still UX-022 |

**Next implementation task:** **UX-022 only** (proof: screenshot + Playwright + `npm run floor`).

## Executive summary

| Bucket | Count | Action |
|--------|------:|--------|
| 🔴 Blocker / stale | 6 | Fixed in task specs |
| 🟡 Correction | 9 | Updated |
| 🟢 Verified accurate | 15 task claims | No change |

## 🔴 Critical findings

| ID | Issue | Probe | Fix applied |
|----|-------|-------|-------------|
| **UX-015** | `ConciergeAgentErrorBridge` imports `@copilotkit/react-core/v2` | `grep v2 concierge-agent-error-bridge.tsx` | Added AC: migrate to v1 API or hook guard — **violates CLAUDE.md no v1/v2 mix** |
| **UX-015** | Task says "missing on GitHub" but bridge + try/catch **exist locally** | `ls` + read `concierge-chat-input.tsx` L108-113 | Status → In Progress (push + v2 fix remain) |
| **UX-017** | `npm run smoke:golden-queries` **does not exist** | `grep package.json` — no match; `scripts/intelligence/` **missing on branch** | Replaced with `npm test` + `npm run test:e2e` + optional script restore from #19 |
| **UX-016** | `npm run smoke:ux005-thinking` **does not exist** | `grep package.json` | Use Vitest pending-store tests + new Playwright spec |
| **UX-010** | Claims events lack `RichCardResultsRegistrar` | `search-tool-renders.tsx:343` | **Stale** — events have registrar; only restaurant/attraction gap remains |
| **UX-027** | Copy leaks still open | `rental-card.tsx:186` + git `a8d2e26` | **Done** on branch — task marked shipped |

## 🟡 Corrections

| ID | Was wrong | Corrected to |
|----|-----------|--------------|
| UX-014 | Implied all tools use `writer.custom` | Only `search-restaurants`, `search-rentals`, `search-events`, `search-attractions` — **not** `search-grounded-places` |
| UX-013 | Implied B-10 unfixed | Interim `FALLBACK_RESTAURANTS` café rows + retry exist; **canonical fix** still `venue_anchors` (0 refs in `src/`) |
| UX-019 | Option A missing | `NON_EVENT_FOOD_VENUE_RE` includes dinner/rooftop — **shipped**; Option B memory L81 still open |
| UX-031 | `golden-queries-smoke.ts` path | File absent on disk — use Playwright live-audit spec |
| UX-022 | — | Added exact line refs: `GenericResults` @ ~418, no `pinId` on `PlaceResultCard` |
| UX-030 | — | Extend existing `e2e/rich-card-dedup.spec.ts` (restaurant test missing) |
| All CK tasks | `copilotkit-develop` in skill lists | **Do not load** — v2 docs only; use `copilotkit-integrations` + Mastra example |
| UX-018 | — | Env var confirmed: `ADK_GROUNDING_URL` in `adk-grounding-client.ts`, default localhost:8000 |
| UX-021 | — | Rental **still missing** aria-label, hover, data-result-kind (UX-027 fixed copy only) |

## Disk probes (evidence)

```text
venue_anchors in mdeapp/src:     0 files (UX-013 still required)
RichCardResultsRegistrar:       grounded:129, rental:211, event:343
GenericResults (no registrar):  restaurant/attraction ~596/615
writer.custom:                  search-restaurants:327, rentals:368, events:294, attractions:291
ConciergeAgentErrorBridge:      exists, mounted chat-center-panel:40
onSend try/catch:               concierge-chat-input:108-113
golden-queries-smoke:           NOT on disk (main branch)
e2e/rich-card-dedup.spec.ts:    exists — café, event, rental (no restaurant)
```

## Priority order (post-verification)

```text
P0: UX-019 (memory guard) → UX-013 → UX-014 → UX-022
P0: UX-015 (v2→v1 bridge + push) — do not merge with v2 import
Done: UX-027
P1: UX-021, UX-031, UX-030, card shell track UX-020–026
```

## Per-task scores

| Task | Spec % | Ready? | Grade |
|------|-------:|--------|-------|
| UX-013 | 92 | Yes | A- |
| UX-014 | 88 | Yes | B+ |
| UX-015 | 75 | Blocked (v2) | C |
| UX-016 | 70 | Yes after script fix | C+ |
| UX-017 | 65 | Blocked (script missing) | D+ |
| UX-018 | 90 | Deferred OK | A- |
| UX-019 | 85 | Yes | B |
| UX-020–030 | 80–88 | Yes | B |
| UX-031 | 82 | Yes | B |
| UX-010 strategy | 85 | Yes (stale event row fixed) | B+ |

**100% correct?** No — execution readiness **72%** until UX-015 v2 fix, UX-017 script path, and UX-013/014 ship.

---

## Second-pass independent re-audit (2026-05-31 — claude, task-verifier protocol @ a8d2e26)

Re-probed every falsifiable claim against disk. Prior-pass findings **all confirmed** (`venue_anchors` 0 refs; bridge `@copilotkit/react-core/v2` import real; `writer.custom` in 4 tools not grounded; registrar grounded:129/rental:211/event:343; `smoke:golden-queries` + `scripts/intelligence/` absent; `e2e/rich-card-dedup.spec.ts` exists w/ café+event+rental, no restaurant; ADK default `localhost:8000`; `GroundedPlaceCard` 0 non-test importers; `GroundingAttribution` unmounted; `CafeResultCard` has aria+data-result-kind, `RentalCard` has neither). **3 new findings the first pass missed:**

| # | Task | Finding | Severity | Fix applied |
|---|------|---------|----------|-------------|
| N1 | **UX-019** | Root cause named **L81** for the "Provenza tonight inherits `category:music`" leak. Disk trace shows that case returns at **L55** (`s.category ?? q?.category`) inside the `hasEventFastPathSignals` block. L81 is a *separate*, lower-frequency leak (bare follow-up replays full last query). Implementer was pointed at the wrong line. | 🔴 | Rewrote root cause + Files + AC + diagram to name **L55 (primary)** and **L81 (secondary)**; added 3 targeted Vitest cases. Confirmed Option A already ships (73bb50c) and closes the headline case at `event-search-fast-path.ts:35`. |
| N2 | **UX-015** | AC corrected `smoke:ux005-thinking`→Vitest, but **step 5 and the Tests section still invoked the nonexistent script** — internal contradiction. | 🟡 | Fixed step 5 + Tests section to Vitest pending-store; noted script confirmed absent in `package.json`. |
| N3 | **UX-022** | "Modify `place-result-card.tsx` — accept pin props" is misleading: component **already** accepts `pinId`/`selected`/`onSelect` (L7-9). Gap is purely the `GenericResults` caller (~L448) omitting them. | 🟡 | Changed to "No change" on the component; pointed fix at the call site. |

**Revised verdict:** spec **80%** / execution readiness **74%** after N1–N3. UX-019 is now correctly scoped (Option A done; Option B = L55+L81 + 3 tests). Same three release blockers stand: UX-015 v2→v1 bridge, UX-017 rebase (no golden-queries script on main), UX-013/UX-014 ship for the café/agent-card prod gaps. No task is safe to flip **Done** without localhost+prod browser proof per CLAUDE.md.

---

## Third-pass independent re-audit (2026-05-31 — cursor, @ a8d2e26)

Re-probed all four "second-pass corrections" plus remaining falsifiable claims. **N1–N3 suggestions are correct.** **N4 was claimed applied but was still stale on disk** — fixed in this pass.

| # | Prior claim | Third-pass probe | Verdict |
|---|-------------|------------------|---------|
| **N1** | UX-019 L55 primary / L81 secondary | Read `event-search-fast-path.ts:54-55` (`s.category ?? q?.category`) and `:81-87` (memory replay). Body + diagram + AC match disk. Frontmatter `description` still said "line 81" only. | ✅ Correct — **frontmatter fixed** |
| **N2** | UX-015 no `smoke:ux005-thinking` | `grep package.json` — absent. Steps 5 + Tests section use Vitest only. | ✅ Correct — no change |
| **N3** | UX-022 caller gap not component | `place-result-card.tsx:7-9` has `pinId/selected/onSelect`; `GenericResults` @ `search-tool-renders.tsx:448-464` omits them. | ✅ Correct — no change |
| **N4** | INDEX G3 golden-queries stale | `INDEX.md` G3 still prescribed `npm run smoke:golden-queries` despite report claiming fix. | 🔴 **Missed in second pass** — **fixed now** to `npm test` + `e2e/rich-card-dedup.spec.ts` |

### Disk re-confirmed (unchanged from prior passes)

| Probe | Result |
|-------|--------|
| `venue_anchors` in `mdeapp/src` | 0 refs — UX-013 still valid |
| `@copilotkit/react-core/v2` in bridge | 🔴 present — UX-015 merge blocker |
| `writer.custom` | restaurants:327, rentals:368, events:294, attractions:291 — not grounded |
| `RichCardResultsRegistrar` | grounded:129, rental:211, event:343; **missing** in `GenericResults` @418 |
| `smoke:golden-queries` / `smoke:ux005-thinking` | absent from `package.json` |
| `test:e2e` + `e2e/rich-card-dedup.spec.ts` | ✅ present |
| Option A `NON_EVENT_FOOD_VENUE_RE` | ✅ L55-56 includes dinner/rooftop |
| Session-order Vitest for L55/L81 | ❌ still missing in `event-search-fast-path.test.ts` (12 tests) — UX-019 AC open |
| Branch | `feat/ux-002-005-chat` @ `a8d2e26` |

### Revised scores (third pass)

| Metric | Score | Notes |
|--------|------:|-------|
| **Spec accuracy** | **82%** | Task bodies + INDEX now aligned with disk after N4 + UX-019 frontmatter fix |
| **Execution readiness** | **74%** | Unchanged — same 3 release blockers (UX-015 v2, UX-017 rebase, UX-013/014 ship) |
| **100% correct?** | **No** | Specs describe **open work** (UX-013–019, UX-015 push). Accuracy ≠ shipped. |

**Safe to execute?** Yes for UX-013, UX-014, UX-019, UX-022, card track — specs are now trustworthy. **Not safe to mark Done** on any until probes + browser evidence pass.
