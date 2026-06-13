# CK-V2 · CopilotKit v1→v2 migration — Changelog

Reverse-chronological log of verified program events.  
Tracker: [`todo.md`](./todo.md) · Report: [`notes-3.md`](./notes-3.md) · Audits: [`04-copilitkit-audit.md`](./04-copilitkit-audit.md) · [`05-890audit.md`](./05-890audit.md) · [`06-891-audit.md`](./06-891-audit.md) · [`07-893-audit.md`](./07-893-audit.md)

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
