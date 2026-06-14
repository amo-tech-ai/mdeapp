# CK-V2 · CopilotKit v1→v2 migration — Changelog

Reverse-chronological log of verified program events.  
Tracker: [`todo.md`](./todo.md) · Audits: [`12-tasks-audit.md`](./12-tasks-audit.md) · [`11-tasks-audit.md`](./11-tasks-audit.md) · [`08-local-hostaudit.md`](./08-local-hostaudit.md)

---

## 2026-06-14 — [SAN-891 · CK-V2-005 — Retire @copilotkit/react-ui](https://linear.app/sanjiovani/issue/SAN-891/ck-v2-005-retire-copilotkitreact-ui-consolidate-frontend-to-react) cutover · [PR #219](https://github.com/amo-tech-ai/mdeapp/pull/219) In Review @ `871d751e`

**Verdict:** Frontend migration **~95% exec** on 891 branch — v2-only code, grep-zero, browser proof PASS. **Prod still pre-cutover** until #219 merges and deploys.

| Gate | Result |
|---|---|
| [SAN-890 · CK-V2-004](https://linear.app/sanjiovani/issue/SAN-890) | ✅ **Done** — merged [#218](https://github.com/amo-tech-ai/mdeapp/pull/218) @ `078a677c` |
| [SAN-891 · CK-V2-005](https://linear.app/sanjiovani/issue/SAN-891) | 🟡 **In Review** · [#219](https://github.com/amo-tech-ai/mdeapp/pull/219) @ `871d751e` |
| grep-zero | ✅ `react-ui` 0 · v1 `/v2`-less imports 0 · `COPILOTKIT_V2_*` 0 |
| `npm run audit:copilotkit-v2` | ✅ v1 **0** · v2 **16** · react-ui **0** · hook share **100%** |
| `npm run build` + focused vitest | ✅ build PASS · **10/10** |
| Browser localhost | ✅ `/chat` · `/host/event/new` · `/host/analytics` · `consoleErrors: []` |
| `npm run floor` | 🟡 local OOM (worktree lint) — CI source of truth |
| **SAN-886 epic exec** | **~95%** (891 branch) |
| **Prod v2 visible** | **0%** — mdeai.co on pre-891 deploy |

**Delivered:** drop `@copilotkit/react-ui` · promote v2 canonical names · delete v1 twins · remove flag modules/branches · `useConciergeChat` · evidence + proof script.

**Evidence:** [`docs/tasks/testing/evidence/SAN-891/SAN-891-RESULTS.md`](../tasks/testing/evidence/SAN-891/SAN-891-RESULTS.md)

**Linear:** [v2-upgrade view](https://linear.app/sanjiovani/view/v2-upgrade-30acec9f94bd) · tracker [`todo.md`](./todo.md)

**Next:** merge #219 → refresh `09-file-map.md` → optional prod smoke → close SAN-891 + SAN-886.

---

## 2026-06-14 — [SAN-890 · CK-V2-004 — Migrate /chat (conciergeAgent) to v2](https://linear.app/sanjiovani/issue/SAN-890/ck-v2-004-migrate-chat-conciergeagent-to-v2-last-highest-risk) **Merged** [PR #218](https://github.com/amo-tech-ai/mdeapp/pull/218) @ `078a677c`

**Verdict:** SAN-890 **100% complete** — unblocks SAN-891 irreversible cutover.

| Gate | Result |
|---|---|
| Merge | ✅ [#218](https://github.com/amo-tech-ai/mdeapp/pull/218) @ `078a677c` (merged 2026-06-14) |
| Tool renders + map pin + HITL | ✅ flag-on/off proofs PASS |
| Review fixes | ✅ merged (proof gates · citations · HITL respond) |
| Linear | ✅ **Done** (user-confirmed) |
| **SAN-886 epic @ main** | **~78%** — chat behind flag until 891 |

**Evidence:** [`docs/tasks/testing/evidence/SAN-890/RESULTS.md`](../tasks/testing/evidence/SAN-890/RESULTS.md)

**Next:** SAN-891 cutover → [#219](https://github.com/amo-tech-ai/mdeapp/pull/219).

---

## 2026-06-14 — Program status sync + PR #218 review fixes (superseded)

**Superseded by:** SAN-890 merge (#218) + SAN-891 PR #219 entries above.

---

## 2026-06-14 — [SAN-890 · CK-V2-004 — Migrate /chat (conciergeAgent) to v2](https://linear.app/sanjiovani/issue/SAN-890/ck-v2-004-migrate-chat-conciergeagent-to-v2-last-highest-risk) slice 2 — tool renders + map pin + HITL (uncommitted)

**Verdict:** SAN-890 **~95% exec** — [PR #218](https://github.com/amo-tech-ai/mdeapp/pull/218) In Review; review fixes pending push.

| Gate | Result |
|---|---|
| 12× `useRenderTool` | ✅ `search-tool-renders-v2.tsx` (events · restaurants · grounded · citations · errors · rental) |
| Map pin | ✅ `focus-map-pin-action-v2.tsx` inside `MapsShell` |
| HITL | ✅ `venue-booking-hitl-card` · café booking prompt · `consoleErrors: []` |
| Flag on proof | ✅ PASS @ `697a8759` working tree |
| Flag off rollback | ✅ PASS · v1 shell · `consoleErrors: []` |
| v2 hook files | **12** (+2 vs slice 1) · hook share **~34%** |
| **SAN-886 epic** | **~75%** |
| Prod flags | ✅ OFF |

**Evidence:** [`docs/tasks/testing/evidence/SAN-890/RESULTS.md`](../tasks/testing/evidence/SAN-890/RESULTS.md)

**Next:** commit branch → open single SAN-890 PR → then SAN-891.

---

## 2026-06-14 — [SAN-890 · CK-V2-004 — Migrate /chat (conciergeAgent) to v2](https://linear.app/sanjiovani/issue/SAN-890/ck-v2-004-migrate-chat-conciergeagent-to-v2-last-highest-risk) slice 1 @ `697a8759`

**Verdict:** SAN-890 **~40% exec** — GeoChatShellV2 scaffold + flag proofs PASS; bridge/tools/HITL/PR remain.

| Gate | Result |
|---|---|
| [SAN-901 · CK-V2-004A](https://linear.app/sanjiovani/issue/SAN-901) | ✅ **100%** — merged [PR #217](https://github.com/amo-tech-ai/mdeapp/pull/217) @ `a57516de` |
| Slice 1 commits | `827dd684` scaffold · `697a8759` coagent providers + proof |
| Flag on shell | ✅ `geo-chat-shell-v2` · `chat-canvas` · `center-chat-panel` · `consoleErrors: []` |
| Flag off rollback | ✅ v1 `GeoChatShell` · no v2 shell testid · `consoleErrors: []` |
| v2 hook files | **10** (was 6 @ `a57516de`) · hook share **30%** |
| **SAN-886 epic** | **~68%** (was ~62%) |
| Prod flags | ✅ OFF |

**Evidence:** [`docs/tasks/testing/evidence/SAN-890/RESULTS.md`](../tasks/testing/evidence/SAN-890/RESULTS.md)

**Next:** expand `concierge-copilot-bridge-v2` (12 tool renders) → map pin → HITL proof → single PR.

---

## 2026-06-14 — [SAN-901 · CK-V2-004A — Chat vertical slice spike](https://linear.app/sanjiovani/issue/SAN-901/ck-v2-004a-chat-vertical-slice-spike-useagent-1-tool-1-hitl) **Merged** [PR #217](https://github.com/amo-tech-ai/mdeapp/pull/217) @ `a57516de`

**Verdict:** SAN-901 **100% complete** — unblocks SAN-890 full migration.

| Gate | Result |
|---|---|
| Flag on/off localhost | ✅ PASS |
| Rental tool render | ✅ `spike-rental-results` |
| Venue HITL | 🟡 wired · soft (not auto-triggered) |
| Linear | ✅ **Done** |

**Evidence:** [`docs/tasks/testing/evidence/SAN-901/RESULTS.md`](../tasks/testing/evidence/SAN-901/RESULTS.md)

---

## 2026-06-13 — [SAN-903 · CK-V2-007a — P0 workspace opt-out on hostEventAgent](https://linear.app/sanjiovani/issue/SAN-903/ck-v2-007a-p0-workspace-opt-out-on-hosteventagent) **Merged** [PR #213](https://github.com/amo-tech-ai/mdeapp/pull/213) @ `7674986`

**Verdict:** Hypothesis test **merged** — `Closes SAN-903` only · **does not** close SAN-895.

| Gate | Result |
|---|---|
| Merge commit | ✅ `7674986` (squash of `3778e91` + `0ce16b7`) |
| Floor CI on PR | ✅ Success |
| `workspace: () => undefined` on `hostEventAgent` | ✅ `host-event.ts` |
| Unit: opt-out + B2a `getWorkspace()` collateral | ✅ 5/5 `host-event-agent` |
| Live turn1 | ✅ no `mastra_workspace_*` |
| Live turn2 | ✅ no thrown `thought_signature` |
| Live turn3 (pre-merge) | 🟡 generic `AGENT_STREAM_ERROR` → SAN-902 |
| SAN-895 parent | ⛔ remains open until 902→904→905 |

**Post-merge:** SAN-902 repro @ `7674986` PASS 2/2 (turn3 flake **not** reproduced in script). Browser HITL approve PASS · reject/combined script still intermittent `thought_signature` on `preview_and_publish` → SAN-904/905.

**Next:** merge [PR #214](https://github.com/amo-tech-ai/mdeapp/pull/214) (SAN-902, floor ✅) → SAN-904/905 → parallel 898/910/896.

---

## 2026-06-13 — [SAN-900 · CK-V2-011 — Migration dependency map](https://linear.app/sanjiovani/issue/SAN-900/ck-v2-011-migration-dependency-map-audit-copilotkit-v2-map-script) Done @ `4ee1bb9`

**Verdict:** SAN-900 **100% complete** — living migration map shipped; **SAN-901 unblocked**; SAN-890 still awaits spike + approval.

| Deliverable | Status |
|---|---|
| `scripts/audit-copilotkit-v2-map.mjs` | ✅ (prior) |
| `npm run audit:copilotkit-v2` | ✅ counts @ `4ee1bb9`: v1 **23** · v2 **6** · react-ui **8** · **~52%** |
| `npm run graphify:update` | ✅ 73014 nodes |
| Graphify queries (concierge · hostEvent · hostOps) | ✅ summarized in map |
| [`09-file-map.md`](./09-file-map.md) | ✅ §A–K: routes · clusters · Mermaid · risk · rules |
| SAN-901 blocker | ✅ cleared |
| SAN-890 blocker | ⛔ SAN-901 PASS + approval + SAN-895 hygiene |

**Docs updated:** [`09-file-map.md`](./09-file-map.md) · [`todo.md`](./todo.md) · this changelog

**Next:** SAN-903 P0 workspace · SAN-901 chat spike · parallel SAN-898/910/896

---

## 2026-06-13 — [SAN-893 · CK-V1-001 — Investigate v1 host event wizard Maximum update depth loop](https://linear.app/sanjiovani/issue/SAN-893/ck-v1-001-investigate-v1-host-event-wizard-maximum-update-depth-loop) forensic audit + Linear sync @ `2052086`

**Verdict:** Investigation ticket ~**85%** correct · **not** a SAN-889 regression · two separate console issues

| Finding | Proof |
|---|---|
| Forensic audit [`07-893-audit.md`](./07-893-audit.md) | `mergeEventDraft` = **prime hypothesis** (A3 unproven) · host-ops dedup precedent |
| Committed evidence @ `2052086` | `git show 2052086:…/SAN-889-v2-flag-off-results.json` → **21** max-depth + **2** `thought_signature` |
| Latest re-run @ `2052086` | **0** max-depth · **2** `thought_signature` — max-depth **intermittent** |
| `thought_signature` | **Proven** on v1 + v2 flag paths every recent run — **blocks flag flip today** |
| Taxonomy | Linear relabeled `Bug` + `phase:launch` · detached from SAN-886 epic |
| Linear description | Updated with audit verdict + evidence dual-state + Z1 close-out |

**Docs updated:** [`notes-3.md`](./notes-3.md) · [`todo.md`](./todo.md) · [`07-893-audit.md`](./07-893-audit.md) · this changelog · for [PR #212](https://github.com/amo-tech-ai/mdeapp/pull/212)

**Next:** merge PR #212 · SAN-893 A1–A4 probes · keep flags off

---

## 2026-06-13 — Localhost execution + corrected SAN-889 grades @ `2052086`

**Verdict:** CK-V2 shipped work **working** · **not clean enough to flip flags yet**

| Result | Task | Grade |
|---|---|---|
| SAN-888 localhost flag off+on | [SAN-888 · CK-V2-002 — Host Analytics prototype](https://linear.app/sanjiovani/issue/SAN-888/ck-v2-002-host-analytics-prototype-v2-hostanalytics-flag) | **100%** ✅ |
| SAN-889 functional (form, agent, HITL) | [SAN-889 · CK-V2-003 — Migrate /host/event/* (hostEventAgent) to v2](https://linear.app/sanjiovani/issue/SAN-889/ck-v2-003-migrate-hostevent-hosteventagent-to-v2) | **90–95%** |
| SAN-889 console hygiene | SAN-889 | **60%** · `thought_signature` smoke chat |
| SAN-889 overall | SAN-889 | **~85%** — **functionally complete · not console-clean** |
| Unit + build | Program | **19/19** · build **PASS** |
| Playwright SCREEN-016 | Program | **4/6** · 016c slug drift unrelated |
| Overall shipped CK-V2 | Program | **~85%** |
| Full program shipped | Program | **~45%** |

**Wording fix:** SAN-889 is **not** "100% clean" — functional PASS, console PARTIAL.

**Blockers:** [SAN-893 · CK-V1-001](https://linear.app/sanjiovani/issue/SAN-893/ck-v1-001-investigate-v1-host-event-wizard-maximum-update-depth-loop) · [SAN-890 · CK-V2-004](https://linear.app/sanjiovani/issue/SAN-890/ck-v2-004-migrate-chat-conciergeagent-to-v2-last-highest-risk) not started · [SAN-891 · CK-V2-005](https://linear.app/sanjiovani/issue/SAN-891/ck-v2-005-retire-copilotkitreact-ui-consolidate-frontend-to-react) blocked

**Docs updated:** [`notes-3.md`](./notes-3.md) · [`todo.md`](./todo.md) · this changelog · for [PR #212](https://github.com/amo-tech-ai/mdeapp/pull/212)

**Next:** merge PR #212 · triage SAN-893 · keep flags off · do not start SAN-890/891

---

## 2026-06-13 — CK-V2 full verification pass @ `2052086` + PR #212 open

**Auditor:** disk grep · package exports · Vitest · build · Linear · GitHub  
**Verdict:** Shipped routes (SAN-887–889, SAN-892) **correct** · program **~45%** shipped · **not** 100% complete

| Change | Task | Proof |
|---|---|---|
| Full verification report | Program | [`notes-3.md`](./notes-3.md) · unit **19/19** · build **PASS** |
| Tracker refresh | Program | [`todo.md`](./todo.md) @ `2052086` |
| SAN-891 audit docs | [SAN-891 · CK-V2-005 — Retire @copilotkit/react-ui](https://linear.app/sanjiovani/issue/SAN-891/ck-v2-005-retire-copilotkitreact-ui-consolidate-frontend-to-react) | [PR #212](https://github.com/amo-tech-ai/mdeapp/pull/212) **OPEN** · floor ✅ · docs only |
| Confirmed `/chat` v2 = 0 files | [SAN-890 · CK-V2-004 — Migrate /chat (conciergeAgent) to v2](https://linear.app/sanjiovani/issue/SAN-890/ck-v2-004-migrate-chat-conciergeagent-to-v2-last-highest-risk) | `git grep` `/chat` + `react-core/v2` → 0 |
| Confirmed analytics + host event v2 done | SAN-888 · SAN-889 | 6 `/v2` files · flags · evidence on `main` |

**Program %:** planning **93%** · shipped **~45%** · composite **87%** (unchanged — verification only)

**Next:** merge PR #212 · triage SAN-893 · await SAN-890 approval

---

## 2026-06-13 — [SAN-891 · CK-V2-005 — Retire @copilotkit/react-ui; consolidate frontend to react-core/v2 + remove flags](https://linear.app/sanjiovani/issue/SAN-891/ck-v2-005-retire-copilotkitreact-ui-consolidate-frontend-to-react) forensic audit + Linear spec fix (docs only)

**Ground truth:** `main` @ `2052086` · **Status:** Backlog · **Blocked by:** [SAN-890 · CK-V2-004 — Migrate /chat (conciergeAgent) to v2](https://linear.app/sanjiovani/issue/SAN-890/ck-v2-004-migrate-chat-conciergeagent-to-v2-last-highest-risk)

| Change | Task | Proof |
|---|---|---|
| Forensic audit [`06-891-audit.md`](./06-891-audit.md) — spec **~98%** | [SAN-891 · CK-V2-005 — Retire @copilotkit/react-ui](https://linear.app/sanjiovani/issue/SAN-891/ck-v2-005-retire-copilotkitreact-ui-consolidate-frontend-to-react) | 6 v1/v2 twins · 9 `react-ui` rg matches · A3a/A3b hook gates |
| Linear description updated | [SAN-891 · CK-V2-005](https://linear.app/sanjiovani/issue/SAN-891/ck-v2-005-retire-copilotkitreact-ui-consolidate-frontend-to-react) | Linear MCP 2026-06-13 |
| PR #212 opened | SAN-891 | docs only · floor ✅ |

**Not included:** implementation · flag removal · `react-ui` dep drop.

---

## 2026-06-12 — [SAN-889 · CK-V2-003 — Migrate /host/event/* (hostEventAgent) to v2](https://linear.app/sanjiovani/issue/SAN-889/ck-v2-003-migrate-hostevent-hosteventagent-to-v2) post-merge verify + E1 fix + [SAN-893 · CK-V1-001 — Investigate v1 host event wizard Maximum update depth loop](https://linear.app/sanjiovani/issue/SAN-893/ck-v1-001-investigate-v1-host-event-wizard-maximum-update-depth-loop)

| Change | Task | Proof |
|---|---|---|
| E1 proof-script fix (`copilotkitPost` boolean 200\|400) | [SAN-889 · CK-V2-003 — Migrate /host/event/* (hostEventAgent) to v2](https://linear.app/sanjiovani/issue/SAN-889/ck-v2-003-migrate-hostevent-hosteventagent-to-v2) | `san-889-localhost-proof.mjs` on `main` follow-up |
| Post-merge re-verify @ `0fab08f` | [SAN-889 · CK-V2-003 — Migrate /host/event/* (hostEventAgent) to v2](https://linear.app/sanjiovani/issue/SAN-889/ck-v2-003-migrate-hostevent-hosteventagent-to-v2) | unit **16/16** + **6/6** · build PASS · v2 flag-on **PASS** |
| HITL approve **PASS** · reject **PARTIAL** (`thought_signature`) | [SAN-889 · CK-V2-003 — Migrate /host/event/* (hostEventAgent) to v2](https://linear.app/sanjiovani/issue/SAN-889/ck-v2-003-migrate-hostevent-hosteventagent-to-v2) | `san-889-hitl-*.mjs` · [`RESULTS.md`](../tasks/testing/evidence/SAN-889/RESULTS.md) |
| v1 flag-off console FAIL → [SAN-893 · CK-V1-001 — Investigate v1 host event wizard Maximum update depth loop](https://linear.app/sanjiovani/issue/SAN-893/ck-v1-001-investigate-v1-host-event-wizard-maximum-update-depth-loop) (v1 bridge 0 diff) | [SAN-893 · CK-V1-001 — Investigate v1 host event wizard Maximum update depth loop](https://linear.app/sanjiovani/issue/SAN-893/ck-v1-001-investigate-v1-host-event-wizard-maximum-update-depth-loop) | `SAN-889-v2-flag-off-results.json` |
| Tracker grep **19/6** · audits updated | Program | `todo.md` · `notes-3.md` · `05-890audit.md` |

**Program % after this entry:** planning **93%** · shipped **~45%** · composite **67%**

---

## 2026-06-12 — SAN-888 merged + proof + SAN-889 scaffold started

| Change | Task | Proof |
|---|---|---|
| PR #208 merged to `main` @ `b9a4f70` | SAN-888 | Admin squash merge after resolving CodeRabbit threads |
| Localhost proof PASS flag off + flag on | SAN-888 | `san-888-localhost-proof.mjs` · "How are my sales?" → `Sales loaded ✓` |
| Evidence on `main` | SAN-888 | [`docs/tasks/testing/evidence/SAN-888/`](../tasks/testing/evidence/SAN-888/) |
| SAN-888 marked **Done** in Linear | SAN-888 | D8 complete |
| SAN-889 scaffold: flag + providers + layout gate + shell-v2 | SAN-889 | Branch `ai/san-889-ck-v2-003-migrate-hostevent-hosteventagent-to-v2` |
| Tracker: parent complete **48%** · shipped **28%** | Program | [`todo.md`](./todo.md) |

**Program % after this entry:** planning **93%** · shipped **28%** · in-flight **18%** · composite **48%**

---

## 2026-06-12 — Execution pass: floor fix + SAN-892 + SAN-890A spike

| Change | Task | Proof |
|---|---|---|
| `audit:floor` critical-only · pushed `83b8f26` | SAN-888 / CI | [Floor CI run](https://github.com/amo-tech-ai/mdeapp/actions/runs/27445847022) **pass** |
| SAN-892 tagging **12/12** `build-on-v2` | SAN-892 | Linear Done |
| SAN-890A spike doc written | SAN-890 prep | [`CK-V2-004-chat-subspike.md`](../tasks/copilotkit/CK-V2-004-chat-subspike.md) |

---

## 2026-06-12 — Tracker source-of-truth pass (prompt-verified)

| Change | Task | Proof |
|---|---|---|
| [`todo.md`](./todo.md) promoted to source-of-truth | Program | Verification Summary 6/6 PASS |
| SAN-886 scorecard: planning 93% · composite 38% | SAN-886 | Was single 95% epic % |

---

## Earlier entries

See git history for SAN-887 spike merge (PR #207), Linear step lists, and SAN-888 branch proof (`2026-06-12`).
