# CK-V2 · CopilotKit v1→v2 — Forensic Upgrade Audit (notes-3)

**Date:** 2026-06-12 · **Auditor:** senior software specialist + forensic verifier  
**Ground truth:** `main` @ `0fab08f` · package `@copilotkit/react-core@1.55.2`  
**Last verified:** 2026-06-12 (post-merge re-run: unit + build + localhost/HITL proofs)  
**Question:** *Is the upgrade correct, complete, and safe to continue to SAN-890?*  
**Method:** disk (`git show origin/main`) · unit tests (worktree @ `0fab08f`) · localhost re-verify · Linear MCP · PR #210 merge record · [`todo.md`](./todo.md) cross-check

---

## Executive verdict

**The upgrade is real and mostly correct — 4 of 6 epic children shipped on `main`, both host routes migrated behind flags, backend untouched.** Planning and sequencing are strong (🟢 **93%**). Execution on shipped routes is solid (🟢 **~88%**). The program is **not** launch-ready for personas: every v2 path is flag-off on prod, and **SAN-890 · CK-V2-004** (Camila's `/chat`) is untouched — the highest-risk surface.

**Overall program grade: B+ (85/100)** — honest progress, two critical follow-ups before flipping flags in preview.

| Scorecard | Grade | % correct | Dot |
|---|---|---:|---|
| Planning / spec / sequencing | A- | **93%** | 🟢 |
| Shipped execution (887–889, 892) | B+ | **88%** | 🟢 |
| Tracker (`todo.md`) accuracy | B | **86%** | 🟡 |
| Evidence / proof rigor | B | **82%** | 🟡 |
| Production persona impact | N/A | **0%** (by design) | 🟢 |
| **Composite** | **B+** | **85%** | 🟢 |

### Legend

| Dot | Meaning |
|---|---|
| 🟢 | Verified true on disk / tests |
| 🟡 | Partially correct, stale, or watch |
| ⚫ | Not started / unverifiable |
| 🔴 | Error, blocker, or regression risk |

---

## What shipped on `main` @ `0fab08f` (proof)

| Claim | Proof | Dot |
|---|---|---|
| [SAN-888 · CK-V2-002 — host-analytics-prototype (v2 /host/analytics flag)](https://linear.app/sanjiovani/issue/SAN-888/ck-v2-002-host-analytics-prototype-v2-hostanalytics-flag) merged `b9a4f70` | `git log origin/main` | 🟢 |
| [SAN-889 · CK-V2-003 — Migrate /host/event/* (hostEventAgent) to v2](https://linear.app/sanjiovani/issue/SAN-889/ck-v2-003-migrate-hostevent-hosteventagent-to-v2) merged via PR #210 | `gh pr view 210` → MERGED `0fab08f` | 🟢 |
| `/v2` import sites | **6 files** (analytics ×3 + host event ×3) | 🟢 |
| Backend unchanged | No `/api/copilotkit` or `src/mastra/**` diff in #210 | 🟢 |
| Package pin 1.55.2 | `package.json` | 🟢 |
| `/v2` hooks exist | `useAgent`, `useAgentContext`, `useFrontendTool`, `useRenderTool`, `useHumanInTheLoop` in `dist/v2/index.d.cts` | 🟢 |
| `useCopilotChatHeadless_c` absent from `/v2` | grep `dist/v2` → no match | 🟢 |
| Unit tests (2026-06-12 re-run) | `host-event` **16/16** · `copilotkit-v2` **6/6** | 🟢 |
| SAN-892 12/12 `build-on-v2` | Linear `list_issues label=build-on-v2` | 🟢 |

**v2 files on `main`:**

```text
src/components/host/host-analytics-provider-v2.tsx
src/components/host/host-analytics-shell-v2.tsx
src/components/host/host-ops-copilot-bridge-v2.tsx
src/components/host/host-event-provider-v2.tsx
src/components/host/host-event-shell-v2.tsx
src/components/host/host-event-copilot-bridge-v2.tsx
```

---

## Per-task scorecard (percent correct + proof)

| Task | Tracker % | Audit % | Dot | Proof |
|---|---:|---:|---|---|
| **SAN-886 · CK-V2-000** — Epic | 67% | **67%** | 🟡 | 4/6 children Done; 890+891 backlog |
| **SAN-887 · CK-V2-001** — Spike gate | 100% | **100%** | 🟢 | [`CK-V2-001-hook-signatures.md`](../tasks/copilotkit/CK-V2-001-hook-signatures.md) on `main` |
| **SAN-888 · CK-V2-002** — Analytics v2 | 100% | **100%** | 🟢 | `b9a4f70` · 9 evidence files · flag `COPILOTKIT_V2_ANALYTICS` |
| **SAN-889 · CK-V2-003** — Host event v2 | 100% | **95%** | 🟢 | `0fab08f` · v2 proof PASS @ re-verify · E1 fixed · E2 → SAN-893 |
| **SAN-890A · CK-V2-004A** — Chat spike | 100% (docs) | **100%** | 🟢 | [`CK-V2-004-chat-subspike.md`](../tasks/copilotkit/CK-V2-004-chat-subspike.md) |
| **SAN-890 · CK-V2-004** — Chat v2 | 0% | **0%** | ⚫ | Zero code; 14-file v1 inventory in spike |
| **SAN-891 · CK-V2-005** — Retire react-ui | 0% | **0%** | ⚫ | grep baseline only |
| **SAN-892 · CK-V2-006** — Tag build-on-v2 | 100% | **100%** | 🟢 | Linear 12/12 |

---

## Verification ladder (2026-06-12 re-run @ `0fab08f`)

| Layer | Command | Result | Dot | Notes |
|---|---|---|---|---|
| Unit — host event | `npm test -- --run host-event` | **16/16 PASS** | 🟢 | worktree @ `0fab08f` |
| Unit — v2 flags | `npm test -- --run copilotkit-v2` | **6/6 PASS** | 🟢 | analytics + host event flags |
| Build | `npm run build` | **PASS** | 🟢 | re-run 2026-06-12 @ `0fab08f` |
| Playwright | `SCREEN-016` chromium | **2/2 PASS** | 🟢 | login redirect only |
| Localhost flag **ON** | `san-889-localhost-proof.mjs` | **PASS** | 🟢 | v2 wizard + agent fill · E1 fix committed |
| Localhost flag **OFF** | same script | **FAIL** (console) | 🟡 | max update depth + `thought_signature` → **SAN-893** (v1 bridge 0 diff) |
| HITL reject | `san-889-hitl-proof.mjs` | **PARTIAL** | 🟡 | panel PASS · `thought_signature` on reject path |
| HITL approve | `san-889-hitl-approve-proof.mjs` | **PASS** | 🟢 | published link · zero console errors |

**E1 fixed (2026-06-12):** `copilotkitPostOk()` returns `true` when POST returns **200 or 400** — committed on `main` follow-up.

---

## 🔴 Red flags & errors

| # | Finding | Severity | CK-V2? | Proof | Fix |
|---|---|---|---|---|---|
| **E1** | ~~**`san-889-localhost-proof.mjs` copilotkitPost gate broken on `main`**~~ | ✅ Fixed | Yes | Committed 2026-06-12 · returns `200 \|\| 400` as boolean | — |
| **E2** | **v1 flag-off wizard console errors (max depth + Gemini)** | 🟡 Med | **No** (pre-889 v1) | `git diff b9a4f70..0fab08f` v1 bridge **0 lines** · re-verify FAIL console only | **SAN-893 · CK-V1-001** |
| **E3** | **Tracker v1 grep counts stale** | 🟡 Med | No | `todo.md` said **17/8**; `main` has **19** `react-core` · **6** `react-ui` import files (+ layout styles) | Updated in `todo.md` |
| **E4** | **Dual static v1+v2 provider imports in layouts** | 🟡 Med | Yes | `host/event/layout.tsx` + `host/analytics/layout.tsx` | Accept for Phase 1 (matches SAN-888); optional `next/dynamic` in P2 |
| **E5** | **HITL / flag-off claims in `RESULTS.md` vs re-verify** | 🟡 Med | Yes | RESULTS says flag-off PASS; re-run FAIL on console | Re-run proofs on `main` after E1 fix; update evidence |
| **E6** | **SAN-890 chat cliff — `useCopilotChatInternal` has no `/v2` export** | 🔴 High (future) | Yes | spike doc + `concierge-chat-messages.tsx` on `main` | Do not underestimate SAN-890; spike is accurate |

---

## Blockers & watch items

| ID | Item | Blocks | Owner | Dot |
|---|---|---|---|---|
| **B1** | SAN-890 not started | Camila v2 / full migration | Next PR after approval | ⚫ |
| **B2** | All flags off on prod | Persona-visible v2 | Ops / preview env | 🟢 by design |
| **B3** | Gemini `thought_signature` on tool calls | Roberto agent form-fill (v1 + v2) | Platform / Gemini SDK | 🟡 |
| **B4** | **SAN-893** v1 max update depth on flag-off | Roberto rollback console hygiene | Platform / v1 bridge | 🟡 |
| **R1** | `npm audit` moderate CVEs | Nothing today (floor passes `--audit-level=high`) | Infra | 🟡 |

---

## What's missing

1. ~~**Committed proof-script fix** on `main` (E1).~~ ✅ 2026-06-12
2. ~~**Post-merge re-verify** of HITL scripts on `main` @ `0fab08f`~~ ✅ 2026-06-12 (approve PASS · reject PARTIAL)
3. **v1 rollback console hygiene** — **SAN-893 · CK-V1-001** (not SAN-889 regression)
4. **SAN-890 branch + `COPILOTKIT_V2_CHAT` flag** — 0% code; ~14 v1 files on `/chat`.
5. **SAN-891 grep-zero** — still **19** v1 `react-core` + **9** `react-ui` files to retire.
6. **Preview flag flip playbook** — when to set `COPILOTKIT_V2_ANALYTICS=1` / `COPILOTKIT_V2_HOST_EVENT=1` on Vercel preview.
7. **`notes-3` / tracker sync** — `todo.md` grep row still off by 2–1 files.
8. **Playwright beyond SCREEN-016** — no authed v2 wizard e2e on `main` yet.
9. **[SAN-886 · CK-V2-000 — CopilotKit v1→v2 Migration (frontend-only, subpath path)](https://linear.app/sanjiovani/issue/SAN-886/ck-v2-000-copilotkit-v1v2-migration-frontend-only-subpath-path)** epic % — parent still Backlog; children 4/6 Done but epic not updated.

---

## Critical fixes (ordered)

| Priority | Fix | Why |
|---|---|---|
| **P0** | ~~Commit `copilotkitPost` boolean fix~~ | ✅ Done |
| **P0** | **SAN-893** — diagnose v1 max update depth on flag-off | Rollback console story for Roberto |
| **P1** | Re-run HITL proof scripts on `main` with Infisical + flag-on dev | Close evidence drift |
| **P1** | Update `todo.md` v1 grep to **19/6** (+ hook counts) | ✅ Done 2026-06-12 |
| **P2** | Open SAN-890 only after explicit approval | Highest-risk route |
| **P2** | `enableInspector` env toggle on v2 providers | Debug ergonomics (nitpick) |

---

## Suggested improvements

| Improvement | Effect |
|---|---|
| Add `✅ disk` + `last-verified` date per row in `todo.md` | Stops SAN-889-style drift |
| One **verification script** wrapping unit + build + proof mjs | Sofía runs one command before flag flip |
| **Authed Playwright** for v2 host wizard (flag on) | Lucía catches regressions without manual proof |
| Promote E2/E3 to Linear tickets with persona labels | Patricia can prioritize rollback vs Gemini |
| Post-SAN-890: single **flag matrix** doc (analytics / event / chat) | Ops knows preview combinations |
| Re-verify SAN-888 flag-on proof after E1 fix | Parity with SAN-889 evidence quality |

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
| `/chat` | (planned `COPILOTKIT_V2_CHAT`) | ⚫ | 14 v1 files remain | ⚫ |
| All other CopilotKit surfaces | — | ⚫ | 19 v1 `react-core` files | ⚫ |

**Routes migrated:** 2 of ~4 Phase-1 targets ≈ **50%** route coverage · **~40%** frontend grep coverage.

---

## Bottom line

**GO to continue the program — DO NOT flip prod flags yet.**

- **What's correct:** SAN-887/888/889/892 are forensically real on `main`; v2 subpath pattern works; backend invariant holds; SAN-889 HITL evidence exists; unit tests green.
- **What's wrong:** v1 flag-off console noise tracked as **SAN-893** (not SAN-889); HITL reject path has intermittent `thought_signature`; SAN-890 is the real cliff ahead.
- **Next step:** land E1 commit on `main` · triage **SAN-893** · do **not** start **SAN-890 · CK-V2-004** until explicit approval.

---

## References

- Tracker: [`todo.md`](./todo.md) · Changelog: [`changelog.md`](./changelog.md)
- Prior audit: [`04-copilitkit-audit.md`](./04-copilitkit-audit.md)
- Evidence: [`SAN-888`](../tasks/testing/evidence/SAN-888/) · [`SAN-889`](../tasks/testing/evidence/SAN-889/) (on `main` @ `0fab08f`)
- Skill: `.claude/skills/copilotkit-upgrade` (mdeai subpath rules)
- Linear: [v2-upgrade view](https://linear.app/sanjiovani/view/v2-upgrade-30acec9f94bd)
