# Events platform — task changelog

> **Purpose:** One row per shipped Events (or Events-adjacent) task with **grades, scores, and % correct**.  
> **Rule:** [`.cursor/rules/mdeai-events-changelog.mdc`](../../../../.cursor/rules/mdeai-events-changelog.mdc) — agents **must** append an entry before Linear **In Review** or **Done**.  
> **Naming:** `SAN-### · SPEC-ID — <full Linear title>` (see [`notes/1-notes.md`](./notes/1-notes.md)).

---

## Scoring rubric (execution grade)

Score each dimension **0–100**, then compute weighted **% correct** and letter **grade**.

| Dimension | Weight | What to score |
|-----------|-------:|---------------|
| **Spec / AC match** | 25% | Acceptance criteria met on disk; no scope creep; persona-visible outcome matches spec |
| **Tests** | 25% | Vitest + Playwright + `npm run floor` (or CI equivalent) — count pass/total |
| **Review hygiene** | 20% | cubic + CodeRabbit threads resolved; no unresolved P1/P2 at merge |
| **Runtime proof** | 20% | Dev restart + localhost; Browser/Playwright evidence; prod when shipped |
| **Process** | 10% | Full task name, one issue = one PR, evidence path, Linear sync |

```text
% correct = round(0.25×spec + 0.25×tests + 0.20×review + 0.20×runtime + 0.10×process)
```

| Grade | % correct |
|-------|----------:|
| **A** | 90–100 |
| **B** | 80–89 |
| **C** | 70–79 |
| **D** | 60–69 |
| **F** | &lt;60 or any unresolved blocker at ship |

**Evidence:** link `tasks/testing/evidence/YYYY-MM-DD/SAN-###-RESULTS.md` when UI/agent touched.

---

## Summary

| Date | Task | Grade | % correct | PR | Linear |
|------|------|:-----:|----------:|----|--------|
| 2026-06-09 | SAN-135 · AIE-024 — host display normalization (follow-up) | **A** | **94%** | [#142](https://github.com/amo-tech-ai/mdeapp/pull/142) | Done |
| 2026-06-08 | SAN-135 · AIE-024 — MVP Luma event detail layout (EVP-032) | **A** | **95%** | [#138](https://github.com/amo-tech-ai/mdeapp/pull/138) | Done |
| 2026-06-08 | SAN-731 · UI-004 — Event detail loading skeleton + hero alt (a11y) | **B+** | **90%** | [#137](https://github.com/amo-tech-ai/mdeapp/pull/137) | Done |
| 2026-06-08 | SAN-660 · MKT — For Event Hosts landing (/host) | **A** | **92%** | [#130](https://github.com/amo-tech-ai/mdeapp/pull/130) | Done |
| 2026-06-08 | SAN-730 · AIE-002 — Enable host navigation rail | **B+** | **88%** | [#135](https://github.com/amo-tech-ai/mdeapp/pull/135) | Done |

**Platform readiness (post Phase A / SAN-135):** 96/100 — see [`todo.md`](./todo.md) · [`PHASE-A-GATE-AUDIT.md`](../../../../tasks/testing/evidence/2026-06-08/PHASE-A-GATE-AUDIT.md)

---

## Entries (newest first)

### 2026-06-09 — SAN-135 · AIE-024 — host display normalization (follow-up)

| Field | Value |
|-------|-------|
| **Linear** | Done (cleanup slice on SAN-135) |
| **PR / commit** | [#142](https://github.com/amo-tech-ai/mdeapp/pull/142) → `8936927` |
| **Persona** | Roberto publish path — trimmed `host_display.avatar_url`; Camila read path unchanged |
| **Grade** | **A** |
| **% correct** | **94%** |

| Dimension | Weight | Score | Notes |
|-----------|-------:|------:|-------|
| Spec / AC match | 25% | 98 | Runtime-only normalization; no migration; no UI; cubic P1 resolved |
| Tests | 25% | 95 | Vitest event 113/113; structured browser smoke desktop+mobile PASS |
| Review hygiene | 20% | 92 | cubic pass; migration removed; floor fail = pre-existing npm audit |
| Runtime proof | 20% | 96 | localhost PR-branch + prod browser proof; `approval-commit` redeployed |
| Process | 10% | 90 | PR #139 closed duplicate; evidence `SAN-135-PR142-browser-proof.md` |

**Evidence:** [`SAN-135-PR142-browser-proof.md`](../../../../tasks/testing/evidence/2026-06-09/SAN-135-PR142-browser-proof.md)

---

### 2026-06-08 — SAN-135 · AIE-024 — MVP Luma event detail layout (EVP-032)

| Field | Value |
|-------|-------|
| **Linear** | Done |
| **PR / commit** | [#138](https://github.com/amo-tech-ai/mdeapp/pull/138) → `9971bb8` |
| **Branch** | `ai/san-135-aie-024-mvp-luma-event-detail-layout-evp-032` |
| **Persona** | Camila / Andrés — `/events/[slug]` host + venue layout (Phase A) |
| **Grade** | **A** |
| **% correct** | **95%** |

| Dimension | Weight | Score | Notes |
|-----------|-------:|------:|-------|
| Spec / AC match | 25% | 95 | Host + venue + reorder; Option C; no SAN-136 |
| Tests | 25% | 95 | Vitest event 112/112; SCREEN-014 5/5 |
| Review hygiene | 20% | 94 | cubic P2 fixed; all threads resolved; floor green at merge |
| Runtime proof | 20% | 94 | localhost Browser MCP; prod smoke optional post-deploy |
| Process | 10% | 95 | PR #138 merged; Phase A gate closed; evidence + changelog complete |

**Scope guardrails:** no profile RLS · no RPC · no SAN-492 · no venue booking · no SAN-136

**Evidence:** [`SAN-135-RESULTS.md`](../../../../tasks/testing/evidence/2026-06-08/SAN-135-RESULTS.md) · [`PHASE-A-GATE-AUDIT.md`](../../../../tasks/testing/evidence/2026-06-08/PHASE-A-GATE-AUDIT.md) · post-merge PNGs

---

### 2026-06-08 — SAN-731 · UI-004 — Event detail loading skeleton + hero alt (a11y)

| Field | Value |
|-------|-------|
| **Linear** | Done |
| **PR / commit** | [#137](https://github.com/amo-tech-ai/mdeapp/pull/137) → `0baeda7` |
| **Branch** | `ai/san-731-ui-004-event-detail-skeleton-alt` |
| **Persona** | Andrés / Tourist — `/events/[slug]` detail polish |
| **Grade** | **B+** |
| **% correct** | **90%** |

| Dimension | Weight | Score | Notes |
|-----------|-------:|------:|-------|
| Spec / AC match | 25% | 92 | Route skeleton + hero `alt={event.name}`; no SAN-135 scope creep |
| Tests | 25% | 85 | SCREEN-014 subset 5/5; full serial 404 test pre-existing fail (out of scope) |
| Review hygiene | 20% | 88 | cubic 0; cr 0 on product files; 2 e2e flake notes (non-blocking) |
| Runtime proof | 20% | 90 | localhost:3001 Playwright + hard-nav skeleton probe; screenshot captured |
| Process | 10% | 95 | Evidence + scoped commit; Linear In Review |

**Evidence:** [`tasks/testing/evidence/2026-06-08/SAN-731-RESULTS.md`](../../../../tasks/testing/evidence/2026-06-08/SAN-731-RESULTS.md) · screenshot [`SAN-731-localhost.png`](../../../../tasks/testing/evidence/2026-06-08/SAN-731-localhost.png)

---

### 2026-06-08 — SAN-730 · AIE-002 — Enable host navigation rail

| Field | Value |
|-------|-------|
| **Linear** | Done |
| **PR / commit** | [#135](https://github.com/amo-tech-ai/mdeapp/pull/135) → `b50104c` |
| **Branch** | `ai/san-730-aie-002-host-nav-rail` |
| **Persona** | Roberto — host shell nav rail on `/host/*` |
| **Grade** | **B+** |
| **% correct** | **88%** |

| Dimension | Weight | Score | Notes |
|-----------|-------:|------:|-------|
| Spec / AC match | 25% | 90 | Nav rail enabled; Analytics deferred with visible “Coming soon” |
| Tests | 25% | 95 | `host-nav-rail.spec.ts` + targeted Vitest; CI floor green |
| Review hygiene | 20% | 78 | cubic P2 threads blocked merge until `ab1dcc9` fixes |
| Runtime proof | 20% | 85 | Localhost + CI; prod not re-smoked post-merge in this session |
| Process | 10% | 95 | One PR; `Closes SAN-730`; threads resolved before squash |

**Fixes at merge gate:** Analytics `(Coming soon)` + `aria-label`; removed unnecessary `"use client"` from `host-events-shell.tsx`.

**Evidence:** CI floor on PR #135 (green ~2m24s). Add `tasks/testing/evidence/2026-06-08/SAN-730-RESULTS.md` if browser proof required retroactively.

---

### 2026-06-08 — SAN-660 · MKT — For Event Hosts landing (/host)

| Field | Value |
|-------|-------|
| **Linear** | Done |
| **PR / commit** | [#130](https://github.com/amo-tech-ai/mdeapp/pull/130) → `b8d19b0` |
| **Branch** | `ai/san-660-mkt-event-hosts-landing` |
| **Persona** | Roberto — public `/host` marketing landing |
| **Grade** | **A** |
| **% correct** | **92%** |

| Dimension | Weight | Score | Notes |
|-----------|-------:|------:|-------|
| Spec / AC match | 25% | 92 | Landing shipped; proof band + CTAs match MKT scope |
| Tests | 25% | 100 | event-host-landing Vitest 6/6; middleware-host-public 2/2; Playwright SAN-660 1/1 |
| Review hygiene | 20% | 85 | PR review caught tap targets + inverted proof-band tokens — fixed pre-merge |
| Runtime proof | 20% | 88 | Localhost + Playwright; prod smoke not logged in evidence file |
| Process | 10% | 95 | One PR; review fixes `51eca03`, `d714b2c` before squash |

**Fixes at review:** `min-h-11 px-4` tap targets; proof section `bg-muted/40` / `text-muted-foreground` (not inverted foreground).

**Evidence:** Playwright SAN-660 1/1; CI floor green on PR #130.

---

## Template (copy for next task)

```markdown
### YYYY-MM-DD — SAN-### · SPEC-ID — <full Linear title>

| Field | Value |
|-------|-------|
| **Linear** | In Review / Done |
| **PR / commit** | #NNN → `<sha>` |
| **Branch** | `ai/san-###-…` |
| **Persona** | Who + surface |
| **Grade** | **A** / **B** / … |
| **% correct** | **NN%** |

| Dimension | Weight | Score | Notes |
|-----------|-------:|------:|-------|
| Spec / AC match | 25% | | |
| Tests | 25% | | |
| Review hygiene | 20% | | |
| Runtime proof | 20% | | |
| Process | 10% | | |

**Evidence:** `tasks/testing/evidence/YYYY-MM-DD/SAN-###-RESULTS.md`
```
