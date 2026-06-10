---
title: PR #14 forensic audit — feat(cafe) C-012
date: 2026-05-29
pr: https://github.com/amo-tech-ai/mdeapp/pull/14
branch: feat/c012-cafe-places-detail @ 72363c6
base: main
auditor: cursor (task-verifier protocol)
skills_index: ../../../index-skills.md
---

# PR #14 audit — `feat(cafe): Places detail and café booking panel (C-012)`

> **Verdict:** Strong feature work, **not merge-ready without fixes**. Spec/implementation ~**82%** correct; **3 blockers** + **5 should-fix** before merge.
>
> **Merge?** 🟡 **Conditional** — fix critical bugs, split or justify UX-001 commit, manual preview smoke after SSO.

---

## Executive summary

| Metric | Score | Dot |
|--------|------:|:---:|
| PR scope vs C-012 intent | 88 | 🟢 |
| Code correctness (verified files) | 78 | 🟡 |
| Test quality | 80 | 🟡 |
| Merge gates / evidence | 65 | 🟡 |
| Skills alignment (`index-skills.md`) | 84 | 🟡 |
| **Overall PR readiness** | **82%** | 🟡 |

**Size:** +2047 / −101, **29 files**, **10 commits** — exceeds commit-discipline target (~≤400 lines/feat). Acceptable as one feature PR only if split rationale is documented (C-012 + UX-001 cherry-pick).

---

## What blocked the live re-run

During this audit session, `npm run floor`, Maps MCP, and several reads **timed out / were interrupted** (~7 min). Findings below are from:

- `gh pr view 14` + `gh pr diff 14` (complete)
- On-disk reads on current branch `feat/c012-cafe-places-detail`
- Prior session: `npm run floor` ✅, `npm test` 312/312 ✅ (before latest commit `72363c6`)
- CodeRabbit review on PR (5 actionable + 2 outside-diff)

**Not re-run this session:** full Playwright SCREEN-021 (needs `npm run dev` + Mastra ~3 min/turn).

---

## Blockers 🔴 (fix before merge)

### B1 — Attribution index misalignment after café filter (Critical)

**File:** `src/mastra/tools/search-grounded-places.ts:137-140`

After `filterCafeGroundingRows` shrinks `results`, attribution still maps by **index** against full `adk.attribution`:

```ts
const attribution = adk.attribution.map((row, index) => ({
  ...row,
  title: results[index]?.title,  // wrong once rows filtered
}));
```

**Impact:** Wrong/missing attribution titles on café queries when bar/lounge rows are filtered. CodeRabbit 🔴 confirmed; disk verified.

**Fix:** Align by pin/id, not index (filter attribution to filtered pin set).

---

### B2 — `test-prod-gate.mjs` points at missing spec

**File:** `scripts/test-prod-gate.mjs` → runs `e2e/prod/pr12-pin-clear-prod-gate.spec.ts`

**Probe:** `glob e2e/prod/**` → **0 files** on branch.

**Impact:** `npm run test:prod-gate` with `SMOKE_BASE_URL=https://www.mdeai.co` will **fail** (not skip). Doc comment still says "C-010d prod pin-clear gate" — stale.

**Fix:** Add the spec, retarget to SCREEN-021/café gate, or remove script from `package.json` until spec exists.

---

### B3 — Preview smoke not proven (PR's own gate)

PR body: **"Do not merge until preview café smoke passes"** — Vercel Deployment Protection → HTTP 401 for automated checks.

**Status:** Localhost evidence cited (`C-012-RESULTS.md`, SCREEN-021 4/4 on `895f459`); **preview + post-merge prod café path not re-verified** in this audit.

**Fix:** Manual SSO preview smoke OR `vercel curl` bypass (as done for PR #13) before merge.

---

## Should-fix 🟡 (merge strongly discouraged without)

| ID | File | Issue | Verified |
|----|------|-------|----------|
| S1 | `use-place-details.ts` | No AbortController / stale-response guard when sibling rail changes `placeId` | ✅ disk |
| S2 | `search-tool-renders.tsx:108` | `factsCheckedAt: row.fieldMaskVersion` — version shown as "Facts checked …" in booking sheet | ✅ disk |
| S3 | `cafe-detail-panel.tsx:69` | `fieldMaskVersion` fallback uses `card.factsCheckedAt` not `card.fieldMaskVersion` | ✅ disk |
| S4 | `SCREEN-021-cafe-listings.spec.ts:87-89` | `.copilotKitAssistantMessage` without `.last()` — only first message checked for JSON leak | ✅ diff |
| S5 | `cafe-booking-sheet.tsx` | `directionsUrl ?? mapsUrl` renders misleading "Directions" when only `mapsUrl` set | CodeRabbit |

---

## Nitpicks 🟢 (post-merge OK)

- `maps-grounding.spec.ts` title still says "grounding attribution visible" but asserts count 0
- `restore-wip-c012.sh` hardcoded WIP path + vague "Run wiring + floor"
- CodeRabbit docstring coverage warning (24% vs 80%) — not a runtime blocker
- PR mixes **UX-001** (`copilotkit-client-props.ts`) — already merged separately via PR #13; **dedupe on rebase** to avoid double-cherry-pick noise

---

## Verified strengths ✅

| Area | Evidence |
|------|----------|
| **C-012 scope** | Places detail API, `CafeResultCard`, detail panel, mobile sheet, booking stub, grounding filter, SCREEN-021 e2e |
| **No rental/event API drift** | No `api/rentals/**` or event fast-path in diff |
| **Rich-card dedup (café)** | `RichCardResultsRegistrar` + `results-column` count 0 in SCREEN-021 |
| **Sanitizer** | `72363c6` routes assistant prose through shared `sanitizeAssistantChatContent` + unit test |
| **UX-001 fix** | `getCopilotKitClientProps` always `runtimeUrl: "/api/copilotkit"` + 3 unit tests |
| **Places route** | Field-mask path via `google-places-client`; invalid id → 400 (note: prod chat-smoke expected 404 for missing — **test expectation drift**, not necessarily PR bug) |
| **Vercel** | Preview deploy ✅ |

---

## Skills & MCP (`index-skills.md`)

| Work surface | Should load | PR touch |
|--------------|-------------|----------|
| Café UI + CopilotKit renders | `copilotkit-develop`, `shadcn`, `testing` | ✅ chat wiring, sheets |
| Maps / Places | `mde-maps` + **google-maps-code-assist** MCP | `/api/places/detail`, pins |
| Mastra grounding tool | `mastra`, `gemini` | `search-grounded-places.ts` |
| Done gate | `task-verifier`, `mde-worktree-pr-flow` | evidence + PR size |
| Deploy | `mde-vercel` | preview SSO blocker |

**MCP this session:** CopilotKit + Maps MCP calls **failed/timed out** — Places field-mask rule verified via existing `google-places-client` usage on disk (matches CLAUDE.md hard rule).

---

## PRD / UX-010 alignment

- **PRD W6 concierge + maps:** 🟢 PR delivers Tourist café detail flow on `/` — aligns with Phase 1 hero chat.
- **UX-010:** This PR is the **café proof branch** UX-010 depends on (`feat/c012-cafe-places-detail`). Café domain scores ~90/100 in UX-010 audit; events/restaurants still dup — **out of PR #14 scope**.
- **English-only:** 🟢 No Spanish regression spotted in diff sample.

---

## Commit / PR hygiene

| Rule | Status |
|------|--------|
| One logical slice | 🟡 C-012 + UX-001 + sanitizer fix in one PR |
| ≤400 lines feat | 🔴 2047 additions |
| Evidence in repo | 🟡 `C-012-RESULTS.md` outside `mdeapp/` git root |
| CI | 🔴 No GitHub Actions — local floor + Playwright only |
| CopilotKit 1.55.2 | 🟢 Pattern-1, no v2 mix |

**Recommendation:** Merge UX-001 only if not already on `main` (PR #13 landed it). Keep C-012 as primary narrative; rebase onto `main` to drop duplicate runtime commit if present.

---

## Grading

| Dimension | % | Grade | Dot |
|-----------|--:|-------|:---:|
| Feature completeness (C-012) | 90 | A− | 🟢 |
| Correctness (bug-free) | 72 | C+ | 🟡 |
| Test coverage | 80 | B | 🟡 |
| Merge evidence | 65 | D+ | 🟡 |
| Process / skills | 84 | B | 🟡 |
| **Weighted readiness** | **82** | **B−** | 🟡 |

---

## Pre-merge checklist (minimum)

1. 🔴 Fix attribution index bug (`search-grounded-places.ts`)
2. 🔴 Fix or remove broken `test:prod-gate` target
3. 🔴 Preview café smoke (manual SSO or vercel curl)
4. 🟡 AbortController in `use-place-details.ts`
5. 🟡 Remove `factsCheckedAt: row.fieldMaskVersion` alias
6. 🟡 Fix `fieldMaskVersion` fallback in `cafe-detail-panel.tsx`
7. 🟡 SCREEN-021 JSON-leak assert → `.last()` or `allTextContents()`
8. Re-run `npm run floor` + `npx playwright test e2e/screens/SCREEN-021-cafe-listings.spec.ts`

---

## Will this PR succeed?

**Yes for C-012 product goal** (Tourist café cards → detail → booking stub) **after blockers B1–B3**.

**Risk if merged as-is:** wrong grounding attribution on filtered café results, broken prod gate script, and unproven preview path.

---

*Next: I can apply the 6 quick surgical fixes (B1, S1–S4, test-prod-gate doc/target) in one commit on the branch if you want.*
