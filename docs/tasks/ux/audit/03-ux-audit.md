---
title: UX task pack — forensic re-audit (UX-001…010)
date: 2026-05-30
auditor: claude (senior-specialist + forensic protocol)
scope: tasks/ux/UX-001…UX-010 + INDEX.md, verified against live disk + git + Linear
method: disk-probe every cited path/line/string; git for branch/stash/merge truth; Linear GraphQL for status/ID truth
skills_lens: code-review · copilotkit · gemini · mastra · mde-maps · tailwind-best-practices · mde-supabase
supersedes_cross_check: ./audit-ux-tasks.md (2026-05-29, cursor) — re-verified; deltas noted
evidence:
  - ../testing/evidence/2026-05-28/ (prod SSE/DOM captures)
  - ../testing/evidence/2026-05-29/cafe-rich-card-dedup-runtime-proof.md
---

# UX task pack — forensic re-audit (UX-001…010)

> **Verdict — the pack is executable and accurate. Overall spec-correctness ≈ 89% 🟢.**
> Every spec was re-checked against the *current* working tree (branch `feat/c012-cafe-places-detail`), not the commit the specs were authored on — so this audit also reports **line-number drift** the earlier audit predates. The remediation track (UX-001…009) **will succeed**; UX-010 is a production-grade architecture plan whose dedup code is **written but stranded in a git stash** (single point of loss — protect it).
>
> **Will it hit PRD goals?** 🟢 Yes — restores the Tourist concierge on `/` (W6) and Camila's rental fast-path. No conflict with Gemini-only, CopilotKit 1.55.2 same-origin, or English-only rules.

---

## How to read the grades

| Dot | Meaning | Spec-correct % |
|:---:|---------|:--------------:|
| 🟢 | Accurate & safe to execute as written | ≥ 85% |
| 🟡 | Mostly right, but premise/priority/lines need a fix first | 70–84% |
| 🔴 | Wrong premise or blocker — do not execute blind | < 70% |

**Spec-correct %** = how well the spec's cited code anchors (paths, line numbers, strings, root cause) match what is actually on disk *today* + whether the task is still the right thing to do.

---

## Scorecard (independent re-verification, 2026-05-30)

| ID | SAN | Linear state | Title (plain) | Spec % | Dot | Grade |
|----|-----|--------------|---------------|-------:|:---:|-------|
| UX-001 | [SAN-315](https://linear.app/sanjiovani/issue/SAN-315) | **Done** | Restore AI concierge on prod | 88 | 🟢 | A− *(shipped)* |
| UX-002 | [SAN-320](https://linear.app/sanjiovani/issue/SAN-320) | Todo | Show retryable errors when chat fails | 90 | 🟢 | A− |
| UX-003 | [SAN-316](https://linear.app/sanjiovani/issue/SAN-316) | Todo | Fix "$500 a night" price parsing | 96 | 🟢 | A |
| UX-004 | [SAN-317](https://linear.app/sanjiovani/issue/SAN-317) | **Canceled** | Disable broken chips (optional) | 88 | 🟡 | B *(correctly canceled)* |
| UX-005 | [SAN-319](https://linear.app/sanjiovani/issue/SAN-319) | Todo | Visible "thinking" state | 76 | 🟡 | C+ |
| UX-006 | [SAN-321](https://linear.app/sanjiovani/issue/SAN-321) | Todo | Reset chat + map on "New chat" | 92 | 🟢 | A− |
| UX-007 | [SAN-323](https://linear.app/sanjiovani/issue/SAN-323) | Todo | Clear ghost map pins | 90 | 🟢 | A− |
| UX-008 | [SAN-324](https://linear.app/sanjiovani/issue/SAN-324) | Todo | Fix Save tooltip copy | 96 | 🟢 | A |
| UX-009 | [SAN-322](https://linear.app/sanjiovani/issue/SAN-322) | Todo | Prod AI chat health monitor | 86 | 🟢 | B+ |
| UX-010 | [SAN-318](https://linear.app/sanjiovani/issue/SAN-318) | In Progress | Unify result cards (one card, one pin) | 90 | 🟢 | A− |
| **Pack** | | | | **89** | 🟢 | **B+/A−** |

> ✅ **INDEX Linear-ID column verified correct** — all 10 UX→SAN mappings match live Linear titles (a prior working note had them transposed; the INDEX is right).

---

## Tests run this session

| Probe | Command / action | Result |
|-------|------------------|--------|
| Floor gate | `cd mdeapp && npm run floor` (lint+typecheck+build+test+audit) | ✅ **exit 0** |
| Vitest | (in floor) | ✅ **313/313 pass · 77 files** *(+1 vs the 2026-05-29 audit's 312)* |
| `npm audit` | (in floor) | 🟡 19 vulns (9 low/10 mod) — all transitive `@langchain/*`→`uuid`, none in UX scope |
| Parser bug live | `rental-query-parser.ts:78` | ✅ buggy guard `!/\/\s*night|per night/i` present verbatim |
| SCREEN-011 leak | `rental-card.tsx:186` | ✅ `title="Saved collections ship with SCREEN-011"` verbatim |
| Registrar gap | `grep RichCardResultsRegistrar search-tool-renders.tsx` | ✅ **only `grounded`(:129) + `rental`(:211)** mount → event/restaurant/attraction duplicate |
| UX-001 fix merged | `git log main` | ✅ tip `9956277 fix(copilotkit): force same-origin runtime (#13)` |
| M1 code location | `git stash list` | ✅ `stash@{0}: UX-010-M1 DomainResults dedup (6 files, +344/-103)` — **uncommitted** |
| Café PR #14 | branch/tip check | 🟡 `feat/c012-cafe-places-detail` checked out; **`8c99ded` is main-merged-into-branch, not PR #14 landing** (main tip is #13) |
| UX-009 infra | `find e2e/prod .github/workflows vercel.*` | ✅ none exist → task is greenfield, as spec claims |
| Linear truth | GraphQL `issues 315..324` | ✅ states + titles pulled; mapping + UX-004=Canceled confirmed |
| Gemini-only | `models.ts:7` | ✅ `FLASH_MODEL = google("gemini-3.5-flash")` — no `@anthropic-ai/*`, no `gpt-*` |
| MCP (CopilotKit/Gemini) | — | ⚪ not re-invoked; `<CopilotKit>` 1.55.2 same-origin verified on disk, model verified on disk |

---

## Critical findings

| # | Sev | Finding | Action |
|---|-----|---------|--------|
| 1 | 🔴 **Blocker** | **UX-010 M1 dedup lives only in `git stash@{0}`** (6 files, +344/-103) — no branch, no commit. A `git stash drop`/`clear` or checkout mishap loses it. The duplicate-card bug is **live on disk** (only 2 of 5 registrars mounted). | Commit the stash to a real branch **now** to stop the loss risk; land off main after PR #14 per scope rules. |
| 2 | 🟡 Status drift | **UX-004 is `Canceled` in Linear** (correct — concierge is back) but `INDEX.md` still shows "⚪ Backlog". | Sync INDEX → Canceled/Skip. *(applied — see Corrections.)* |
| 3 | 🟡 Spec conflict | **UX-008 vs UX-010 §11**: UX-008 deletes the `SCREEN-011` tooltip; UX-010 §11 says keep "ships with SCREEN-011" language. | UX-008 wins — note in UX-010 §11. *(applied.)* |
| 4 | 🟡 Line drift | Specs authored ~`895f459`; files have since grown. Biggest: **UX-010 restaurant/attraction `442` → actual `596/615`**; smaller ±1–6 elsewhere. Root causes still 100% valid; only the line pointers are stale. | Refresh high-drift pointers. *(UX-010 applied.)* |
| 5 | 🟡 Premise overstated | **UX-005** says "no thinking indicator" but `concierge-chat-messages.tsx:103-105` already renders `copilotKitActivityIndicator` when `inProgress`. Gap is *visibility/branding*, not zero-UI. | Reframe to "enhance", add Step 0 = inspect computed style. |
| 6 | 🟡 Enumeration | **UX-009** lists 5 example `smoke:*` scripts; there are **7** (omits `smoke:search-grounding`, `smoke:ticket-paid-proof`). Cosmetic — pattern advice still valid. | Complete the list. *(applied.)* |
| 7 | 🟢 Clean | No safety-rule violations in any spec: Gemini-only ✓, CopilotKit 1.55.2 same-origin ✓, no service-role in `src/**` ✓, English-only ✓, one-worktree/one-PR ✓. | — |

---

## Per-task audit

> Each task: a one-line **plain-English + persona** description, what's **verified ✅**, **drift/errors ⚠️** with exact line corrections, and a **corrections 🔧** list.

### 🟢 UX-001 — Restore AI concierge on prod · SAN-315 · **Done** · 88%
**Real-world:** *Camila opens `/chat` and asks for a café in Poblado; on prod the chat hangs ~30s then dies with `EAUTHTIMEOUT`. The fix forces the chat to talk to our own server (same-origin Pattern-1) instead of CopilotKit Cloud, so the agent actually answers.* **Already shipped — PR #13.**
- ✅ Root cause correct: prod's `publicApiKey` sent CopilotKit down a v2 Cloud path that can't reach the in-process Mastra `getLocalAgents`. Fix on disk: `copilotkit-client-props.ts` always returns `{ runtimeUrl: "/api/copilotkit" }` (:28); `publicApiKey` intentionally never passed (:8/:11/:20-comment).
- ✅ Merged: `main` tip `9956277 …(#13)`. Linear SAN-315 = Done. `concierge.ts` 248 lines, model `FLASH_MODEL` (:236) = `gemini-3.5-flash` (`models.ts:7`).
- ⚠️ Path drift: spec cites `src/app/api/copilotkit/route.ts` → actual **`src/app/api/copilotkit/[[...path]]/route.ts`** (catch-all segment). `models.ts`/`logging-mastra-agent.ts` are under **`src/mastra/lib/`** and **`src/mastra/copilotkit/`** respectively. `getLocalAgentsWithLogging` is at **:71** (spec range "44-68" predates a refactor).
- 🔧 (1) Flip task framing to **Done + evidence link** (matches Linear). (2) The remaining `ai_runs` 500 ms cold-start insert race is a **separate F13 micro-task** (tracked), *not* UX-001. (3) Correct the route path to the `[[...path]]` segment when referenced downstream.

### 🟢 UX-002 — Show retryable errors when chat fails · SAN-320 · Todo · 90%
**Real-world:** *When the agent throws mid-answer (`RUN_ERROR`/timeout), the Tourist just watches a spinner that never stops. This adds a visible "Something went wrong — retry" bubble so they know to try again.*
- ✅ Premise valid: **no `RUN_ERROR` branch** anywhere in `concierge-chat-messages.tsx`; **no `role="alert"`/`aria-live`**. `<CopilotKit onError>` is the right hook (1.55.2 supports it).
- ⚠️ Line drift: provider is at **`layout.tsx:46`** (spec says `:43`); `<CopilotKit {...getCopilotKitClientProps("conciergeAgent")}>`. In `concierge-chat-messages.tsx`: `inProgress` **:30** (spec :36), `interrupt` **:37/:107** (spec :106).
- 🔧 (1) Read `CopilotErrorHandler` signature in `node_modules/@copilotkit/react-core/dist/*.d.mts` before coding — `onError` may not surface raw AG-UI `RUN_ERROR`; have an `inProgress=false + zero-tokens` fallback. (2) AC: bubble uses `role="alert"`. (3) Ship in **one PR with UX-005** (same file).

### 🟢 UX-003 — Fix "$500 a night" price parsing · SAN-316 · Todo · 96% · **execute first**
**Real-world:** *Camila types "$500 a night"; the parser reads it as $500/**month** (≈$17/night) and shows implausibly cheap rooms. A one-line regex fix makes "a night" mean nightly.*
- ✅ Bug verbatim at **`rental-query-parser.ts:78`**: `if (amount >= 400 && !/\/\s*night|per night/i.test(text)) { … budgetType:"monthly" }`. Because "$500 a night" has no `/night` or "per night", the guard passes → wrong "monthly". `parseBudget` not exported (**:48**) → test via `scoreRentalQuery` (**:117**, exported). Both exact.
- ⚠️ Tiny label slip: `MONTHLY_RE` is **defined at :45** (spec points at :67, which is the *use* site `if (MONTHLY_RE.test…)`). No functional impact.
- ✅ No `rental-query-parser.test.ts` yet; commit `0660507` ("parse '$500 a night' / 'nightly' as nightly price") exists on `test/rentals-prod-qa-may28`.
- 🔧 (1) **Execute now** — highest ROI, zero deps, only UX-003 may touch this file (scope guard honored). (2) Cherry-pick `0660507` or re-apply; broaden guard to `!/\bnight(?:ly)?\b/i`. (3) Post-deploy proof: prod search body shows `maxPricePerNight: 500, budgetType:"nightly"`. Watch RE-017/INT-002 overlap.

### 🟡 UX-004 — Disable broken chips (optional) · SAN-317 · **Canceled** · 88%
**Real-world:** *A stop-gap that greyed out the Events/Food chips while the concierge was down. Concierge is back (UX-001), so leaving working buttons greyed would advertise dead features — Linear already **Canceled** this.*
- ✅ Spec anchors accurate: chips at **`src/platform/copilot/chat-filter-chips.ts:28-29`** (`events`, `food`), event sub-chips :32-41; greeting at **`chat-center-panel.tsx:17`**. No `CONCIERGE_ENABLED` flag on disk (consistent with "never built").
- ⚠️ INDEX shows "⚪ Backlog"; Linear is **Canceled**. The task's "fail-to-down" default is wrong now that concierge is green.
- 🔧 (1) Keep Canceled; **no work**. (2) Sync INDEX status → Canceled. (3) Only revive if a prod incident re-breaks concierge, with default `NEXT_PUBLIC_CONCIERGE_ENABLED=true`.

### 🟡 UX-005 — Visible "thinking" state · SAN-319 · Todo · 76%
**Real-world:** *While the agent thinks, the only feedback is a faint dot most users miss, so the chat feels frozen. Make it a clear "Searching Medellín…" state.*
- ✅ `inProgress` wired (`concierge-chat-messages.tsx:30`); a `copilotKitActivityIndicator` **already renders** when `inProgress` (**:103-105**).
- ⚠️ Root cause "no indicator" is **overstated** — an indicator exists but is too subtle / no copy / possibly flashes before a `RUN_ERROR` ends the run.
- 🔧 (1) Retitle to **"Enhance thinking indicator"**. (2) Step 0: inspect computed style of `.copilotKitActivityIndicator` on prod before adding UI. (3) Hand-off contract with UX-002: clear the indicator before the error bubble renders (never co-render). (4) Tailwind v4: brand via utility classes, no new CSS file.

### 🟢 UX-006 — Reset chat + map on "New chat" · SAN-321 · Todo · 92%
**Real-world:** *Camila clicks "New chat" but old map pins and the prior thread linger, so her fresh search shows stale results. Reset the thread and clear the pins.*
- ✅ `chat-nav-rail.tsx:24-30` is a bare `<Link href="/">` "New chat" (**:25** href, **:29** label) — verbatim. `clearPins` exists in `map-context.tsx` (type :33, impl :93, `useMapContext` :136). `geo-chat-shell.tsx` provider stack (:40-79) matches spec: `RentalUi/RentalFastPath/EventSearchResults/RichCardResults/EventLocalChat`.
- 🔧 (1) Confirm the CopilotKit 1.55.2 **threadId-reset** mechanism in the `copilotkit` skill before wiring (don't full-page-reload if a thread reset suffices). (2) Abort any in-flight run on reset. (3) Coordinate with UX-007 so zero residual markers remain (same-PR candidate).

### 🟢 UX-007 — Clear ghost map pins · SAN-323 · Todo · 90% · verify-first
**Real-world:** *After an empty search, pins from the previous search stay stuck on the map, implying results that aren't there. Clear the `AdvancedMarker`s.*
- ✅ `ChatMap.tsx:77-91` `<AdvancedMarker>`→`<CategoryMapMarker>` block verbatim; `merge-pins-by-category.ts:11` `mergePinsByCategory` with "empty `incoming` clears that category" (:9). `ClusteredCategoryMarkers` imported :24, used :65.
- ⚠️ `e2e/prod/pr12-pin-clear-prod-gate.spec.ts` is referenced but **not on this branch** (it's on the QA branch).
- 🔧 (1) Honor "verify-first" — reproduce the ghost-pin before editing. (2) Load **mde-maps** + `google-maps-code-assist` MCP before clusterer changes; keep `mapId` on the parent `<Map>` (hard rule). (3) Port or re-create the pin-clear e2e locally.

### 🟢 UX-008 — Fix Save tooltip copy · SAN-324 · Todo · 96%
**Real-world:** *The disabled Save button's tooltip leaks an internal ticket name "SCREEN-011" to Camila. Swap to "Saving is coming soon" and keep the button disabled.*
- ✅ Exact bad string at **`rental-card.tsx:186`**: `title="Saved collections ship with SCREEN-011"`.
- 🔧 (1) Copy-only; highest ready %. (2) Run `grep -rn "SCREEN-0" mdeapp/src` before/after to catch sibling leaks. (3) Reconcile UX-010 §11 (it currently endorses the SCREEN-011 tooltip).

### 🟢 UX-009 — Prod AI chat health monitor · SAN-322 · Todo · 86%
**Real-world:** *Nobody knew the concierge was dead until a human noticed. A scheduled synthetic hits prod `/chat`, sends a query, and alerts on `RUN_ERROR`/timeout — so we learn before Camila does.*
- ✅ Greenfield as claimed: no `e2e/prod/`, no `.github/workflows/`, no `vercel.json`, no `concierge-agent-smoke.spec.ts`. `depends_on: UX-001` is **satisfied** (concierge merged).
- ⚠️ The "existing scripts to mirror" list names 5 of **7** real `smoke:*` scripts (missing `smoke:search-grounding`, `smoke:ticket-paid-proof`).
- 🔧 (1) Reuse `tasks/testing/scripts/chat-smoke.mjs` patterns + assert a streamed answer (fail on `RUN_ERROR`). (2) Point at same-origin `/api/copilotkit` (post UX-001). (3) Pick Vercel Cron vs GH Actions + an alert channel. (4) Add `copilotkit-debug` skill for SSE parsing.

### 🟢 UX-010 — Unify result cards (one card, one pin) · SAN-318 · In Progress · 90%
**Real-world:** *Search for a restaurant and it appears **twice** — a rich card plus a duplicate plain side-panel row, with a mismatched map pin. Route every domain through one `ResultCardShell` + `DomainResults` wrapper so it's always one card + one pin. The dedup (M1) is written but **stranded in a git stash**.*
- ✅ Root cause exact: `RICH_CARD_CATEGORIES = ["rental","event","restaurant","attraction","grounded"]` (`rich-card-results.ts:4-9`) but **only `grounded`(:129) and `rental`(:211) mount `<RichCardResultsRegistrar>`** in `search-tool-renders.tsx`, so `shouldSuppressGenericMapResults` (:26) never fires for event/restaurant/attraction → duplicate render. M0→M5 phasing is safe; café branch note accurate (current branch).
- ✅ M1 status exact: `stash@{0}` "UX-010-M1 DomainResults dedup (6 files, +344/-103)" — **uncommitted, no branch**, gated behind PR #14 (open).
- ⚠️ Line drift (file grew since authoring): event card region is now ~**:343/:375** (spec L344), **restaurant `:596` / attraction `:615`** (spec said L442). Orphan `GroundingAttribution.tsx` is under **`src/components/maps/`** (spec implies `copilot/`); `grounded-place-card.tsx` is at `src/components/copilot/` ✓. Missing YAML `skill:`/`depends_on` frontmatter (unlike UX-001…009).
- 🔧 (1) **Protect the stash now** — commit to a branch to remove the single-point-of-loss; cut `feat/ux-010-m1-domain-results` off main *after* PR #14 merges (scope rule). (2) Refresh line pointers (restaurant/attraction). (3) Add frontmatter `skill: [copilotkit-develop, mde-maps, testing, mde-worktree-pr-flow]`. (4) Update §11 to "friendly coming-soon tooltip per UX-008".

---

## Cross-task & INDEX

| Check | Status |
|-------|--------|
| Build order (`UX-003 → UX-002+UX-005 → UX-009 → UX-006+UX-007 → UX-008`) | 🟢 Sound; UX-004 correctly out |
| UX-001 marked shipped (🟢 PR #13) | 🟢 Matches main + Linear |
| UX-010 flagged separate theme | 🟢 |
| Scope guard (only UX-003 edits parser) | 🟢 |
| Linear-ID column correctness | 🟢 **Verified 10/10 against Linear titles** |
| UX-004 status | 🟡 INDEX "Backlog" vs Linear **Canceled** → sync |
| UX-008 ↔ UX-010 §11 tooltip | 🟡 Conflict → UX-008 wins |

## Best-practices compliance (skills lens)

| Practice (skill) | Status |
|------------------|--------|
| Disk-probe before trust (code-review / task-verifier) | 🟢 Applied — 30+ probes |
| Gemini-only, no `@anthropic-ai/*`/`gpt-*` (gemini) | 🟢 `models.ts:7` clean |
| CopilotKit 1.55.2, no v1/v2 mix (copilotkit) | 🟢 same-origin Pattern-1 enforced |
| `mapId` on `<Map>` + FieldMask on Places (mde-maps) | 🟢 No violation in specs; reinforce in UX-007 |
| No service-role in `src/**` (mde-supabase) | 🟢 None in cited paths |
| Tailwind v4 utilities, no Spanish (tailwind / lang) | 🟢 |
| Evidence before Done (CLAUDE.md gate) | 🟢 Specs require it; UX-001 has it |
| Skills ≤ 5/task | 🟡 UX-001 lists 7 — trim; UX-010 lists 0 — add |

---

## Priority action list — "get moving"

1. **UX-003 now** — 1-line regex + first unit test (`scoreRentalQuery`). No deps, 96% ready. Cherry-pick `0660507`. → unblocks Camila's price NLU.
2. **UX-010: protect the stash** — `git stash branch feat/ux-010-m1-domain-results stash@{0}` (or commit to a wip branch) to stop the loss risk **today**; merge to main only after PR #14.
3. **One PR: UX-002 + UX-005** — error bubble + enhanced thinking state (same file). Reframe UX-005 as "enhance".
4. **One PR: UX-006 + UX-007** — reset thread + clear pins (coordinate residual markers).
5. **UX-009** — scheduled prod smoke (deps satisfied). Locks in UX-001 against regression.
6. **UX-008** — trivial copy fix; pair with the UX-010 §11 reconcile.
7. **Sync INDEX**: UX-004 → Canceled. **No build work** on UX-004.
8. **Separate F13 micro-task** (already tracked): `ai_runs` 500 ms cold-start insert race — observability, not user-facing, not UX-001.

---

## Corrections applied by this audit

See the diffs alongside this report:
- `INDEX.md` — UX-004 status `⚪ Backlog` → `🚫 Canceled` (Linear truth).
- `UX-009*.md` — completed the `smoke:*` example list (7 scripts).
- `UX-010*.md` — refreshed restaurant/attraction line pointers (442 → 596/615) + §11 tooltip reconcile note (defer to UX-008).

All other line-drift items are pointer-only (specs are guides, not compiled code) and are listed per-task above for the executor to refresh in-flight.

---

*Protocol: `.claude/skills/task-verifier` + `code-review`. Re-probe before flipping any task to Done (CLAUDE.md runtime-proof gate). Floor green (exit 0, 313/313) at audit time.*
