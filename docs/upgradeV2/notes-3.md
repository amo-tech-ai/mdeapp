# CK-V2 · CopilotKit v1→v2 — Forensic Upgrade Audit (notes-3)

**Date:** 2026-06-13 · **Auditor:** senior software specialist + forensic verifier  
**Ground truth:** `main` @ **`2052086`** (PR #211 merged — E1 proof-script + evidence refresh)  
**Prior baseline:** `0fab08f` (SAN-889 · CK-V2-003 merge via PR #210)  
**Package pin:** `@copilotkit/react-core@1.55.2` · subpath `/v2` only  
**Last verified:** 2026-06-13 — **3×** CK-V2 unit · **2×** build · **1×** full Vitest · **1×** copilot-scoped · disk grep  
**Question:** *Is the migration working, correct, and safe to continue — and is anything blocking SAN-890?*  
**Method:** disk (`git grep` @ `2052086`) · repeated Vitest · `npm run build` · evidence JSON on disk · [`todo.md`](./todo.md) · [`RESULTS.md`](../tasks/testing/evidence/SAN-889/RESULTS.md)

---

## Executive verdict

**The shipped migration is real and working — but the program is not 100% complete.** Four of six epic children are Done on `main`; Roberto’s two host routes have v2 behind flags; backend is untouched. **v2 flag-on paths pass automated gates.** v1 flag-off console noise is tracked as **[SAN-893 · CK-V1-001](https://linear.app/sanjiovani/issue/SAN-893/ck-v1-001-investigate-v1-host-event-wizard-maximum-update-depth-loop)** (not a SAN-889 regression). **Camila’s `/chat` (SAN-890) is 0% code** — the highest-risk cliff ahead.

**Honest “100% correct”?** **No** for the whole program (~40% frontend grep migrated). **Yes (~95%)** for shipped scope (SAN-887–889, SAN-892) with documented exceptions below.

| Scorecard | Grade | % correct | Dot |
|---|---|---:|---|
| Planning / spec / sequencing | A- | **93%** | 🟢 |
| Shipped execution (887–889, 892) | A- | **95%** | 🟢 |
| Tracker (`todo.md`) accuracy | B | **84%** | 🟡 |
| Evidence / proof rigor | B+ | **86%** | 🟡 |
| Automated test proof (CK-V2 scope) | A | **100%** | 🟢 |
| Production persona impact | N/A | **0%** (flags off by design) | 🟢 |
| **Composite program grade** | **B+** | **87/100** | 🟢 |

### Legend

| Dot | Meaning |
|---|---|
| 🟢 | Verified true on disk / tests |
| 🟡 | Partially correct, stale, or watch |
| ⚫ | Not started / unverifiable |
| 🔴 | Error, blocker, or regression risk |

---

## Multi-run proof (@ `2052086`, worktree, Infisical `dev`)

| Layer | Command | Runs | Result | CK-V2? | Dot |
|---|---|---:|---|---|---|
| Unit — host event + v2 flags | `npm test -- --run host-event copilotkit-v2` | **3** | **19/19 PASS** each | Yes | 🟢 |
| Unit — copilot-wide | `npm test -- --run copilot host-event mastra-tool` | 1 | **72/72 PASS** | Yes | 🟢 |
| Build | `npm run build` | **2** | **PASS** each | Yes | 🟢 |
| Full Vitest | `npm test -- --run` | 1 | **1015/1018 PASS** · 3 fail | Mixed | 🟡 |
| Localhost v2 flag-on | `san-889-localhost-proof.mjs` | — | **PASS** @ `0fab08f` evidence | Yes | 🟡 stale SHA |
| Localhost v1 flag-off | same | — | **FAIL** console only | No (SAN-893) | 🟡 |
| HITL approve | `san-889-hitl-approve-proof.mjs` | — | **PASS** @ evidence | Yes | 🟢 |
| HITL reject | `san-889-hitl-proof.mjs` | — | **PARTIAL** (`thought_signature`) | Yes | 🟡 |
| CI floor (PR #211) | GitHub Actions | 1 | **PASS** | Yes | 🟢 |

**Full-suite failures (not CK-V2 blockers):**

| File | Failure | CK-V2? |
|---|---|---|
| `src/mastra/workspaces.test.ts` | Skill folder count drift | No |
| `src/lib/__tests__/flash-route-classifier.test.ts` | API key mock / Infisical env | No |
| `src/mastra/scorers/__tests__/faithfulness.test.ts` | Scorer returns 1.0 not &lt;1 | No |

---

## Disk inventory (@ `2052086`)

| Metric | Count | Proof | Dot |
|---|---:|---|---|
| `react-core` v1 import files | **19** | `git grep -l 'from "@copilotkit/react-core"' -- src \| grep -v /v2 \| grep -v test` | 🟢 |
| `react-ui` v1 import files | **6** | same pattern for `react-ui` | 🟢 |
| `react-core/v2` import files | **6** | analytics ×3 + host event ×3 | 🟢 |
| `useCoAgent` files | **6** | grep | 🟢 |
| `useCopilotAction` files | **6** | grep | 🟢 |
| `renderAndWaitForResponse` occurrences | **2** | host event HITL | 🟢 |
| Package pin | **1.55.2** | `package.json` | 🟢 |
| Backend diff (889 + #211) | **0** | no `src/mastra/**` or `/api/copilotkit` in merge range | 🟢 |
| v1 host-event bridge diff vs `b9a4f70` | **0 lines** | `git diff b9a4f70..2052086 -- host-event-copilot-bridge.tsx` | 🟢 |
| Mixed v1+v2 in same file | **0** | grep cross-check | 🟢 |
| Agent name `hostEventAgent` | match | v2 provider + `mastra/agents` | 🟢 |

**v2 files on `main`:**

```text
src/components/host/host-analytics-provider-v2.tsx
src/components/host/host-analytics-shell-v2.tsx
src/components/host/host-ops-copilot-bridge-v2.tsx
src/components/host/host-event-provider-v2.tsx
src/components/host/host-event-shell-v2.tsx
src/components/host/host-event-copilot-bridge-v2.tsx
```

**v2 hooks confirmed in `node_modules/@copilotkit/react-core/dist/v2/index.d.cts`:**  
`useAgent` · `useAgentContext` · `useFrontendTool` · `useRenderTool` · `useHumanInTheLoop` · `useInterrupt` · `useDefaultRenderTool` · `useCopilotKit` — all present.

**Chat cliff (SAN-890):** `useCopilotChatInternal` in `concierge-chat-messages.tsx` + `concierge-chat-input.tsx` — **0 exports** in `/v2` dist. Spike is accurate.

---

## What shipped (proof)

| Claim | Proof | Dot |
|---|---|---|
| [SAN-888 · CK-V2-002 — host-analytics-prototype](https://linear.app/sanjiovani/issue/SAN-888/ck-v2-002-host-analytics-prototype-v2-hostanalytics-flag) merged `b9a4f70` | `git log` · [`SAN-888/RESULTS.md`](../tasks/testing/evidence/SAN-888/RESULTS.md) | 🟢 |
| [SAN-889 · CK-V2-003 — Host event v2](https://linear.app/sanjiovani/issue/SAN-889/ck-v2-003-migrate-hostevent-hosteventagent-to-v2) merged PR #210 @ `0fab08f` | `gh pr view 210` | 🟢 |
| [SAN-889 · E1 proof-script fix](https://linear.app/sanjiovani/issue/SAN-889/ck-v2-003-migrate-hostevent-hosteventagent-to-v2) merged PR #211 @ `2052086` | `resolveMainSha()` in `san-889-localhost-proof.mjs` | 🟢 |
| Flags | `COPILOTKIT_V2_ANALYTICS` · `COPILOTKIT_V2_HOST_EVENT` only | `src/lib/copilotkit-v2-*-flag.ts` | 🟢 |
| SAN-892 12/12 `build-on-v2` | Linear label | 🟢 |

---

## Per-task scorecard

| Task | Tracker % | Audit % | Dot | Proof |
|---|---:|---:|---|---|
| **SAN-886 · CK-V2-000** — Epic | 67% | **67%** | 🟡 | 4/6 children Done; 890+891 backlog |
| **SAN-887 · CK-V2-001** — Spike gate | 100% | **100%** | 🟢 | hook-signatures doc on `main` |
| **SAN-888 · CK-V2-002** — Analytics v2 | 100% | **100%** | 🟢 | evidence PASS both flags @ `b9a4f70` |
| **SAN-889 · CK-V2-003** — Host event v2 | 100% | **95%** | 🟢 | v2 PASS · E1 on `main` · v1 console → SAN-893 |
| **SAN-890A · CK-V2-004A** — Chat spike | 100% (docs) | **100%** | 🟢 | chat subspike doc |
| **SAN-890 · CK-V2-004** — Chat v2 | 0% | **0%** | ⚫ | 14+ v1 chat files; cliff confirmed |
| **SAN-891 · CK-V2-005** — Retire react-ui | 0% | **98%** (spec) | ⚫ | [`06-891-audit.md`](./06-891-audit.md) · Linear updated 2026-06-13 · blocked SAN-890 |
| **SAN-892 · CK-V2-006** — Tag build-on-v2 | 100% | **100%** | 🟢 | 12/12 |
| **SAN-893 · CK-V1-001** — v1 console loop | 0% | **0%** | 🟡 | flag-off FAIL console · v1 bridge 0 diff |

---

## 🔴 Red flags, errors & failure points

| # | Finding | Severity | CK-V2? | Proof | Fix / owner |
|---|---|---|---|---|---|
| **E1** | ~~Proof-script `copilotkitPost` boolean gate~~ | ✅ Fixed | Yes | PR #211 @ `2052086` | — |
| **E2** | **v1 flag-off wizard console errors** (max depth + Gemini) | 🟡 Med | **No** | `SAN-889-v2-flag-off-results.json` · v1 bridge **0 diff** | **SAN-893** |
| **E3** | **Gemini `thought_signature` on tool calls** | 🟡 Med | Partial | HITL reject PARTIAL · v1 + v2 agent paths | Platform / Gemini SDK |
| **E4** | **Dual static v1+v2 provider imports in layouts** | 🟡 Med | Yes | `host/event/layout.tsx` · `host/analytics/layout.tsx` | Accept Phase 1; `next/dynamic` in P2 |
| **E5** | **Evidence JSON `mainSha` still `0fab08f`** | 🟡 Low | Yes | `SAN-889-v2-flag-on-results.json` L6 | Re-run proofs @ `2052086` |
| **E6** | **SAN-890 chat cliff — no `/v2` chat hooks** | 🔴 High (future) | Yes | `concierge-chat-messages.tsx` · dist `/v2` grep 0 | Do not underestimate SAN-890 |
| **E7** | **Full Vitest 3 unrelated failures** | 🟡 Low | No | workspaces · classifier · faithfulness | Infra / separate tickets |
| **E8** | **`todo.md` row “E1 fix commit” still open** | 🟡 Low | No | `todo.md` L71 | Mark ✅ in tracker sync |

---

## Blockers

| ID | Item | Blocks | Dot |
|---|---|---|---|
| **B1** | **SAN-890 not started** | Camila v2 · full migration | ⚫ |
| **B2** | **All v2 flags off on prod** | Persona-visible v2 | 🟢 by design |
| **B3** | **Gemini `thought_signature`** | Roberto agent form-fill reliability | 🟡 |
| **B4** | **SAN-893 v1 max update depth** | Clean v1 rollback console story | 🟡 |
| **B5** | **Explicit approval gate for SAN-890** | Starting `/chat` migration | 🟢 policy |

**Not blockers:** PR #211 merged · E1 fixed · unit/build green for CK-V2 scope · backend unchanged.

---

## What's missing

1. **Fresh localhost/HITL evidence @ `2052086`** — JSON artifacts still cite `0fab08f`.
2. **SAN-893 triage** — v1 flag-off console hygiene.
3. **SAN-890 branch + `COPILOTKIT_V2_CHAT`** — 0% code; ~14 v1 files on `/chat`.
4. **SAN-891 grep-zero** — retire **19** v1 `react-core` + **9** `rg` `react-ui` refs (6 imports + layout styles + 2 comments) — spec [`06-891-audit.md`](./06-891-audit.md).
5. **Preview flag flip playbook** — when to set analytics/event flags on Vercel preview.
6. **Authed Playwright v2 wizard** — beyond SCREEN-016 login redirect.
7. **SAN-886 epic Linear %** — parent Backlog while 4/6 children Done.
8. **`todo.md` sync** — close E1 row; composite % after #211.

---

## Critical fixes (ordered)

| Priority | Fix | Why | Dot |
|---|---|---|---|
| **P0** | ~~E1 proof-script on `main`~~ | ✅ PR #211 | 🟢 |
| **P0** | **SAN-893** — diagnose v1 max update depth | Roberto rollback story | 🟡 |
| **P1** | Re-run SAN-889 (+ optional SAN-888) proofs @ `2052086` | Close E5 evidence drift | 🟡 |
| **P1** | Sync `todo.md` E1 row + next-actions | Tracker accuracy | 🟡 |
| **P2** | Open **SAN-890** only after explicit approval | Highest-risk route | ⚫ |
| **P2** | `enableInspector` env toggle on v2 providers | Debug ergonomics | ⚫ |

---

## Suggested improvements

| Improvement | Effect |
|---|---|
| **`verify-ck-v2.sh`** — unit + build + optional proof mjs | Sofía one command before flag flip |
| **`last-verified` + `mainSha` per evidence JSON** auto from `resolveMainSha()` | Stops E5 drift |
| **Authed Playwright** v2 host wizard (flag on) | Lucía catches regressions without manual proof |
| **Flag matrix doc** (analytics / event / chat combinations) | Ops preview safety |
| **Promote E7 failures** to Linear if floor ever widens | CI honesty |
| **Close SAN-886 epic** in Linear when 890+891 land | Patricia visibility |

---

## Persona impact today

| Persona | Surface | v2 available? | Dot |
|---|---|---|---|
| **Roberto** | `/host/analytics` | Only if `COPILOTKIT_V2_ANALYTICS=1` | 🟡 |
| **Roberto** | `/host/event/new` | Only if `COPILOTKIT_V2_HOST_EVENT=1` | 🟡 |
| **Camila** | `/chat` | v1 only — SAN-890 not started | ⚫ |
| **Prod users** | all | flags off | 🟢 (no change) |

---

## Route migration progress

| Route | Flag | On `main` | Hooks migrated | Dot |
|---|---|---|---|---|
| `/host/analytics` | `COPILOTKIT_V2_ANALYTICS` | 🟢 | `useAgent` + `useRenderTool` | 🟢 |
| `/host/event/*` | `COPILOTKIT_V2_HOST_EVENT` | 🟢 | `useAgent` + `useAgentContext` + `useFrontendTool` ×3 + `useHumanInTheLoop` | 🟢 |
| `/chat` | (planned `COPILOTKIT_V2_CHAT`) | ⚫ | 14+ v1 files · chat cliff | ⚫ |
| All other CopilotKit surfaces | — | ⚫ | 19 v1 `react-core` files | ⚫ |

**Coverage:** 2 of ~4 Phase-1 targets ≈ **50%** routes · **~40%** frontend grep · **100%** CK-V2 scoped tests.

---

## Bottom line

**GO to continue the program — DO NOT flip prod flags · DO NOT start SAN-890 without approval.**

| Verdict | Detail |
|---|---|
| **Migration working?** | **Yes** for shipped v2 routes (unit 19/19 ×3 · build ×2 · v2 localhost PASS). |
| **100% correct?** | **No** — program ~40% migrated; v1 rollback noisy (SAN-893); chat untouched; evidence SHA stale. |
| **Merge-safe state?** | **Yes** — `main` @ `2052086` is docs + proof hygiene; no runtime regression in CK-V2 scope. |
| **Next step** | Triage **SAN-893** · re-run proofs @ `2052086` · await approval for **SAN-890 · CK-V2-004**. |

---

## References

- Tracker: [`todo.md`](./todo.md) · Changelog: [`changelog.md`](./changelog.md)
- Prior audits: [`04-copilitkit-audit.md`](./04-copilitkit-audit.md) · [`05-890audit.md`](./05-890audit.md) · [`06-891-audit.md`](./06-891-audit.md)
- Evidence: [`SAN-888`](../tasks/testing/evidence/SAN-888/) · [`SAN-889`](../tasks/testing/evidence/SAN-889/)
- Skill: `.claude/skills/copilotkit-upgrade`
- Linear: [v2-upgrade view](https://linear.app/sanjiovani/view/v2-upgrade-30acec9f94bd)
