---
title: UX task pack — forensic audit report
date: 2026-05-29
auditor: cursor (task-verifier protocol)
scope: tasks/ux/UX-001…UX-010 + INDEX.md
skills_index: ../../index-skills.md
evidence:
  - ../testing/evidence/2026-05-28/concierge-diagnosis-and-ux-verification.md
  - ../testing/evidence/2026-05-28/live-site-qa-checklist.md
  - ../testing/evidence/2026-05-28/ux-audit-report.md
  - ../testing/evidence/2026-05-29/cafe-rich-card-dedup-runtime-proof.md
---

# UX task pack — forensic audit (UX-001…010)

> **Verdict:** The pack is **executable and mostly accurate** (~**87% spec-correct**). The remediation track (UX-001…009) **will succeed** if INDEX status is synced to prod reality, UX-004 is re-scoped, and UX-005 acknowledges existing UI. UX-010 is a strong architecture spec — separate theme, high confidence.
>
> **Plan success (remediation):** 🟢 **Yes** — with the corrections below.
>
> **PRD alignment:** 🟢 Supports Phase 1 concierge + rentals hero flows (`plan/prd/03-runtime-orchestration.md`, W6 `/` chat). Does not conflict with Gemini-only, CopilotKit 1.55.2, or English-only rules.

---

## Executive summary

| Metric | Score | Dot |
|--------|------:|:---:|
| **Overall spec pack accuracy** | **87/100** | 🟢 |
| **Execution readiness (today)** | **82/100** | 🟡 |
| **Skills routing vs `index-skills.md`** | **84/100** | 🟡 |
| **MCP / official docs verification** | **70/100** | 🟡 |
| **PRD goal alignment** | **92/100** | 🟢 |

### Critical findings (fix before executing blindly)

| # | Severity | Finding |
|---|----------|---------|
| 🔴 | **Blocker (INDEX drift)** | **UX-001 is DONE on prod** (PR #13 merged 2026-05-28; 3× café turns on `www.mdeai.co`, same-origin `/api/copilotkit`, zero `RUN_ERROR`). INDEX + all task files still say ⚪ Not started. |
| 🔴 | **Stale premise** | UX-001 Phase A/B still reads like Cloud routing is unfixed — **`copilotkit-client-props.ts` already always returns `runtimeUrl`** + unit test `copilotkit-client-props.test.ts` (3/3). |
| 🟡 | **Build order** | UX-004 (disable chips) is **optional post-fix** — concierge works on prod; keeping chips disabled mis-advertises working features. |
| 🟡 | **UX-005 overlap** | `concierge-chat-messages.tsx:102-106` already renders `copilotKitActivityIndicator` when `inProgress` — task overstates "no indicator". Gap is **visibility + RUN_ERROR handoff**, not zero UI. |
| 🟡 | **UX-010 vs UX-008** | UX-010 §11 says keep SCREEN-011 tooltips; UX-008 removes them — reconcile before M4. |
| 🟢 | **UX-003 confirmed** | Bug live on disk at `rental-query-parser.ts:78`; no test file yet; prod still wrong until deploy. |
| 🟢 | **UX-010 root cause** | Verified: only `grounded` + `rental` mount `<RichCardResultsRegistrar>`; `event`/`restaurant`/`attraction` have pins only (`search-tool-renders.tsx:344,442`). |

### Recommended build order (corrected 2026-05-29)

```text
UX-003 → UX-002+UX-005 (same PR) → UX-009 → UX-006+UX-007 → UX-008
Skip or flip UX-004 (CONCIERGE_ENABLED=true) — concierge restored
Mark UX-001 Done; optional follow-up: ai_runs 500ms insert timeout (F13, not UX-001)
UX-010 M0→M5 on feat/c012-cafe-places-detail (separate PRs)
```

---

## Tests run (this audit session)

| Probe | Command / action | Result |
|-------|------------------|--------|
| Floor gate | `cd mdeapp && npm run floor` | ✅ exit 0 |
| Vitest | `npm test` | ✅ **312/312** pass, 77 files |
| Prod smoke | `chat-smoke.mjs --base https://www.mdeai.co` | 🟡 11/13 pass — **2 fails** on `/api/places/detail` 404 (out of UX scope) |
| Prod homepage | `curl https://www.mdeai.co/` | ✅ HTTP 200 |
| Disk: parser bug | `rental-query-parser.ts:78` | ✅ old regex present |
| Disk: UX-001 fix | `copilotkit-client-props.ts` | ✅ same-origin only |
| Disk: SCREEN-011 | `rental-card.tsx:186` | ✅ internal tooltip present |
| Disk: registrar gap | `grep RichCardResultsRegistrar search-tool-renders.tsx` | ✅ only rental + grounded |
| Playwright dedup | `e2e/rich-card-dedup.spec.ts` | ⚠️ **not run** — no dev server on :3001 (infra, not spec error) |
| CopilotKit MCP | `search-docs` onError | ❌ MCP session failed — **fallback:** `node_modules/@copilotkit/react-core/dist` confirms `<CopilotKit onError?: CopilotErrorHandler>` |
| Gemini MCP | `search_docs` | ❌ tool not exposed in session — **fallback:** CLAUDE.md registry + prod `ai_runs` using `gemini-3.5-flash` |

---

## Skills & MCP verification (`index-skills.md`)

### Phase 1 pack alignment (per task)

| Task | Listed skills | Verdict | Recommended load |
|------|---------------|---------|------------------|
| UX-001 | mastra, copilotkit-debug, gemini, mde-vercel, testing, mastra-smoke-test, mde-task-lifecycle | 🟢 Correct | Same — **task should flip to Done** |
| UX-002 | copilotkit, copilotkit-agui, copilotkit-debug, testing, mde-task-lifecycle | 🟢 Correct | Add **copilotkit-develop** for `<CopilotKit>` in `layout.tsx` |
| UX-003 | mde-real-estate, mastra, testing, mde-task-lifecycle | 🟡 | Drop **mastra** (regex-only); keep mde-real-estate + **vitest** |
| UX-004 | copilotkit-develop, testing, mde-task-lifecycle | 🟢 | OK if still needed |
| UX-005 | copilotkit, copilotkit-agui, testing, mde-task-lifecycle | 🟢 | Pair with UX-002 in one PR |
| UX-006 | copilotkit, mde-maps, testing, mde-task-lifecycle | 🟢 | OK |
| UX-007 | mde-maps, testing, mde-task-lifecycle | 🟢 | Use **google-maps-code-assist** MCP before marker changes |
| UX-008 | copilotkit-develop, testing, mde-task-lifecycle | 🟡 Overkill | **testing** + grep guard sufficient |
| UX-009 | mde-vercel, mastra-smoke-test, testing, mde-task-lifecycle | 🟡 | Add **copilotkit-debug** for SSE/`RUN_ERROR` parsing |
| UX-010 | *(missing `skill:` frontmatter)* | 🔴 | Add: **copilotkit-develop, mde-maps, shadcn, testing, mde-task-lifecycle, mde-worktree-pr-flow** |

### MCP checklist

| Surface | Required MCP | Audit status |
|---------|--------------|--------------|
| CopilotKit `onError` / AG-UI | project-0-mdeai-copilotkit | ❌ session down — verified via **installed 1.55.2 types** |
| Maps AdvancedMarker lifecycle | google-maps-code-assist | ⚠️ not invoked (UX-007 verify-first OK) |
| Gemini model IDs | gemini-api-docs-mcp | ⚠️ not invoked — prod rows confirm `gemini-3.5-flash` |
| Supabase ai_runs | user-supabase | ✅ cited in evidence Part 5 |

---

## Per-task audit

Grading: **Spec %** = accuracy vs disk + PRD today · **Ready %** = safe to execute now · Dot: 🟢 ≥85 · 🟡 70–84 · 🔴 <70

---

### UX-001 — Restore conciergeAgent on prod

| Field | Value |
|-------|-------|
| **Spec %** | **78%** 🟡 |
| **Ready %** | **N/A — shipped** |
| **Grade** | **B−** (was A− before drift) |
| **PRD** | 🟢 Restores W6 concierge — core Phase 1 |

**Verified ✅**
- Root-cause analysis (Cloud v2 vs Pattern-1) was correct at time of writing.
- Fix implemented: `getCopilotKitClientProps` → always `{ runtimeUrl: "/api/copilotkit" }`.
- Prod proof in evidence Part 5: 3× café success, zero Cloud calls.

**Red flags 🔴**
- Task + INDEX still **Not started** — false for executors.
- Phase B steps describe env fix **already merged**.
- Sequence "5 of 9" implies concierge still down — **stale**.

**Corrections**
1. Flip status → **Done**; link evidence Part 5.
2. Add **follow-up task** (not UX-001): `ai_runs` 500 ms insert race in `src/mastra/lib/ai-runs.ts` (observability fragility, not user-facing).
3. UX-004 revert step: set `CONCIERGE_ENABLED=true` or **skip UX-004 entirely**.

---

### UX-002 — RUN_ERROR / timeout error bubble

| Field | Value |
|-------|-------|
| **Spec %** | **88%** 🟢 |
| **Ready %** | **85%** 🟢 |
| **Grade** | **B+** |
| **PRD** | 🟢 Failure visibility for Tourist concierge |

**Verified ✅**
- No `RUN_ERROR` branch in `concierge-chat-messages.tsx`.
- Provider location corrected: `layout.tsx:43` (not geo-chat-shell).
- `<CopilotKit onError>` exists in **@copilotkit/react-core 1.55.2** (types probed).

**Red flags 🟡**
- Must ship **with UX-005** (INDEX coupling correct).
- `onError` may not receive raw AG-UI `RUN_ERROR` — spec correctly says verify via copilotkit-agui; may need `inProgress` false + zero tokens fallback.

**Corrections**
1. Step 1: read `CopilotErrorHandler` signature in `node_modules/@copilotkit/react-core/dist/index.d.mts` before coding.
2. Add AC: error bubble uses **`role="alert"`** or `aria-live="polite"`.
3. Reference **`e2e/screens/SCREEN-019-empty-error.spec.ts`** as existing error UX surface.

---

### UX-003 — "$500 a night" parser fix

| Field | Value |
|-------|-------|
| **Spec %** | **96%** 🟢 |
| **Ready %** | **95%** 🟢 |
| **Grade** | **A** |
| **PRD** | 🟢 Camila rental NLU — hero vertical |

**Verified ✅**
- Line 78 bug present verbatim on current branch.
- `parseBudget` not exported — test via `scoreRentalQuery` (correct).
- `npm test` has **no** `rental-query-parser.test.ts` yet.
- RE-017 collision warning valid.

**Corrections**
1. None blocking — **execute first**.
2. After deploy: prod network body must show `maxPricePerNight: 500`.

---

### UX-004 — Disable Events/Food chips (temporary)

| Field | Value |
|-------|-------|
| **Spec %** | **76%** 🟡 |
| **Ready %** | **60%** 🟡 |
| **Grade** | **C+** |
| **PRD** | 🟡 Mitigation only — **conflicts with restored concierge** |

**Verified ✅**
- Chips at `chat-filter-chips.ts:28-29`; greeting at `chat-center-panel.tsx:16-17`.
- No `CONCIERGE_ENABLED` / feature flag on disk.

**Red flags 🔴**
- **Lower priority now** — UX-001 prod proof shows concierge works; disabling chips **hides working pillars**.
- Default "fail to down" wrong post-fix.

**Corrections**
1. **Defer or cancel** unless prod regresses.
2. If kept: default `NEXT_PUBLIC_CONCIERGE_ENABLED=true`; document flip-off only during incidents.
3. Update INDEX rationale — no longer "concierge dead".

---

### UX-005 — Concierge loading indicator

| Field | Value |
|-------|-------|
| **Spec %** | **72%** 🟡 |
| **Ready %** | **78%** 🟡 |
| **Grade** | **C+** |
| **PRD** | 🟢 Chat feedback for Tourist |

**Verified ✅**
- `inProgress` wired at `concierge-chat-messages.tsx:36,102-106`.
- **`copilotKitActivityIndicator` already renders** during inProgress.

**Red flags 🟡**
- Root cause "no indicator" is **overstated** — likely **too subtle / no copy / hidden by CSS**.
- QA "no spinner observed" may mean RUN_ERROR ended run before visible flash.

**Corrections**
1. Retitle: **"Enhance thinking indicator"** — branded bubble + `aria-busy`.
2. Step 0: inspect computed style on `.copilotKitActivityIndicator` in prod.
3. Explicit handoff: clear indicator before UX-002 error bubble.

---

### UX-006 — New chat reset

| Field | Value |
|-------|-------|
| **Spec %** | **90%** 🟢 |
| **Ready %** | **82%** 🟢 |
| **Grade** | **A−** |
| **PRD** | 🟢 Session hygiene for Camila multi-search |

**Verified ✅**
- `chat-nav-rail.tsx:24-30` — bare `Link href="/"`.
- Provider stack in `geo-chat-shell.tsx` matches spec.

**Corrections**
1. Confirm CopilotKit 1.55.2 **threadId reset API** in copilotkit skill before picking mechanism.
2. Add cancel in-flight run on reset (spec mentions — ensure `useCopilotChat` abort if available).

---

### UX-007 — Stale AdvancedMarker DOM

| Field | Value |
|-------|-------|
| **Spec %** | **92%** 🟢 |
| **Ready %** | **88%** 🟢 |
| **Grade** | **A−** |
| **PRD** | 🟢 Map trust for Camila |

**Verified ✅**
- Verify-first approach matches best practice.
- `merge-pins-by-category.ts` clear path exists.

**Corrections**
1. Load **mde-maps** + google-maps-code-assist before clusterer edits.
2. `e2e/prod/pr12-pin-clear-prod-gate.spec.ts` referenced but **not on current branch** — use local Playwright or port spec.

---

### UX-008 — Save tooltip SCREEN-011

| Field | Value |
|-------|-------|
| **Spec %** | **95%** 🟢 |
| **Ready %** | **98%** 🟢 |
| **Grade** | **A** |
| **PRD** | 🟢 Polish — English copy hygiene |

**Verified ✅**
- `rental-card.tsx:186` — exact bad string present.

**Corrections**
1. Grep all `SCREEN-0` in `mdeapp/src/**` (spec step 1 — do it).
2. Align UX-010 §11 — remove "ships with SCREEN-011" language after UX-008 lands.

---

### UX-009 — Prod synthetic concierge monitor

| Field | Value |
|-------|-------|
| **Spec %** | **88%** 🟢 |
| **Ready %** | **80%** 🟢 |
| **Grade** | **B+** |
| **PRD** | 🟢 Ops / Sofía — prevents F-1 recurrence |

**Verified ✅**
- No `smoke:concierge` in `package.json`; other `smoke:*` scripts exist.
- `depends_on: UX-001` — **satisfied** (prod healthy).

**Corrections**
1. Reuse **`tasks/testing/scripts/chat-smoke.mjs`** patterns + add SSE agent/run assertion.
2. Prefer Vercel Cron guarded route per mde-vercel skill.
3. Point monitor at same-origin `/api/copilotkit` (post UX-001).

---

### UX-010 — Unified result-card architecture

| Field | Value |
|-------|-------|
| **Spec %** | **94%** 🟢 |
| **Ready %** | **86%** 🟢 |
| **Grade** | **A** |
| **PRD** | 🟢 W6 chat/map convergence — matches `.cursor/rules/mdeai-rich-card-dedup.mdc` |

**Verified ✅**
- Registrar gap table matches disk (`search-tool-renders.tsx`).
- `shouldSuppressGenericMapResults` logic matches `rich-card-results.ts:26-33`.
- M0→M5 phasing is safe; branch note (`feat/c012-cafe-places-detail`) accurate — **current git branch**.

**Red flags 🟡**
- Missing YAML `skill:` / `depends_on` frontmatter (unlike UX-001…009).
- `e2e/rich-card-dedup.spec.ts` **events test** expects no dup — may **fail today** for events (registrar missing) once dev server runs.
- Contradicts UX-008 on Save tooltip text in §11.

**Corrections**
1. Add frontmatter: `skill: [copilotkit-develop, mde-maps, shadcn, testing, mde-worktree-pr-flow]`.
2. M1 first — **add `RichCardResultsRegistrar` to event/restaurant/attraction** before shell refactor (quick win).
3. Update §11: "friendly coming-soon tooltip per UX-008".

---

## INDEX.md audit

| Check | Status |
|-------|--------|
| Build order rationale | 🟡 Valid for May-28 outage; **update post UX-001 Done** |
| UX-010 called out as separate theme | 🟢 |
| Scope guardrails (only UX-003 touches parser) | 🟢 |
| Status column | 🔴 All ⚪ — **UX-001 should be ✅ Done** |
| Evidence links | 🟢 |

**INDEX corrections**
1. UX-001 → **Done** with evidence link Part 5.
2. UX-004 → **Deferred** or note "skip if concierge green".
3. Add row note: UX-001 follow-up observability → link F13 / new micro-task for `ai_runs` timeout.

---

## Will the plan achieve PRD goals?

| PRD goal | UX tasks | Achievable? |
|----------|----------|-------------|
| Tourist concierge on `/` (W6) | UX-001 ✅, UX-002, UX-005, UX-009, UX-010 | 🟢 Yes — 001 done; 002/005/009 close reliability gap |
| Camila rental fast-path | UX-003, UX-006, UX-007, UX-008 | 🟢 Yes — 003 is highest ROI |
| One card + one pin (maps/chat) | UX-010 | 🟢 Yes — spec is production-grade |
| CopilotKit 1.55.2 Pattern-1 | UX-001 fix | 🟢 Done |
| English-only, no redesign | All "Do not overbuild" sections | 🟢 Consistent |

---

## Grading scorecard

| ID | Title | Spec % | Ready % | Dot | Grade |
|----|-------|-------:|--------:|:---:|-------|
| UX-001 | Restore concierge prod | 78 | — (Done) | 🟡 | B− *(stale status)* |
| UX-002 | RUN_ERROR visibility | 88 | 85 | 🟢 | B+ |
| UX-003 | Price parser deploy | 96 | 95 | 🟢 | A |
| UX-004 | Disable chips | 76 | 60 | 🟡 | C+ |
| UX-005 | Loading indicator | 72 | 78 | 🟡 | C+ |
| UX-006 | New chat reset | 90 | 82 | 🟢 | A− |
| UX-007 | Clear stale markers | 92 | 88 | 🟢 | A− |
| UX-008 | Save tooltip copy | 95 | 98 | 🟢 | A |
| UX-009 | Synthetic monitor | 88 | 80 | 🟢 | B+ |
| UX-010 | Unified result cards | 94 | 86 | 🟢 | A |
| **Pack average** | | **87** | **82** | 🟢 | **B+** |

---

## Best-practices compliance

| Practice | Status |
|----------|--------|
| task-verifier: disk probes before trust | 🟢 Applied |
| Evidence before Done (localhost + prod) | 🟢 Specs require it; UX-001 evidence exists |
| One worktree / one PR | 🟢 Stated in specs |
| Gemini-only / no service-role leak | 🟢 No violations in specs |
| CopilotKit 1.55.2 (no v2 mix) | 🟢 UX-001 fix enforces Pattern-1 |
| Skills ≤5 per task | 🟡 UX-001 lists 7 — trim to 5 |
| MCP before external API claims | 🟡 CopilotKit MCP down this session; types used |
| Commit discipline (C-### ledger) | 🟡 Specs mention commit but no ledger rows — add before ship |

---

## Priority action list (for Sofía / next agent)

1. **Update INDEX + UX-001 status → Done** (evidence Part 5).
2. **Ship UX-003** (1-line regex + test) — cherry-pick `0660507` or re-apply.
3. **Single PR: UX-002 + UX-005** (error + thinking states).
4. **Skip or defer UX-004** unless prod concierge regresses.
5. **UX-009** — lock in concierge with scheduled smoke.
6. **UX-010 M1** — add missing registrars (fast dup fix) before full shell refactor.
7. **Optional:** F13 micro-fix for `ai_runs` 500 ms timeout (from UX-001 evidence).

---

*Audit protocol: `.claude/skills/task-verifier/SKILL.md` · Skills index: `index-skills.md` · Re-probe before flipping any task to Done.*
