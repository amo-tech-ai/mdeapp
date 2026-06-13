# CK-V2 Migration Verification Report (notes-3)

**Date:** 2026-06-13 · **Auditor:** disk + localhost execution  
**Ground truth:** `origin/main` @ **`2052086`** · worktree `.worktrees/san-869`  
**Method:** disk grep · package exports · Vitest · `npm run build` · Playwright · localhost proof scripts  
**Tracker:** [`todo.md`](./todo.md) · [`changelog.md`](./changelog.md)

---

## Current verdict

**CK-V2 shipped work is working, but not clean enough to flip flags yet.**

| Area | Verdict |
|---|---|
| **[SAN-888 · CK-V2-002 — Host Analytics prototype](https://linear.app/sanjiovani/issue/SAN-888/ck-v2-002-host-analytics-prototype-v2-hostanalytics-flag)** | ✅ Fully green |
| **[SAN-889 · CK-V2-003 — Migrate /host/event/* (hostEventAgent) to v2](https://linear.app/sanjiovani/issue/SAN-889/ck-v2-003-migrate-hostevent-hosteventagent-to-v2)** | 🟡 Functionally works, console issue remains |
| **[SAN-890 · CK-V2-004 — Migrate /chat (conciergeAgent) to v2](https://linear.app/sanjiovani/issue/SAN-890/ck-v2-004-migrate-chat-conciergeagent-to-v2-last-highest-risk)** | ⚫ Not started |
| **[SAN-891 · CK-V2-005 — Retire @copilotkit/react-ui](https://linear.app/sanjiovani/issue/SAN-891/ck-v2-005-retire-copilotkitreact-ui-consolidate-frontend-to-react)** | ⚫ Spec ready, code not started |
| **Prod risk** | ✅ None — all flags off |

### SAN-889 wording (important)

Do **not** call SAN-889 "100% clean." Correct statement:

> **SAN-889 is functionally complete but not console-clean.**

| Dimension | % |
|---|---:|
| Functional (form, agent fill, HITL, build) | **90–95%** |
| Console hygiene (smoke chat) | **60%** |
| **SAN-889 overall** | **~85%** |

Why functional passes but console does not:

- v2 form loads ✅
- manual edits work ✅
- agent fill works ✅
- HITL approve/reject works ✅
- build passes ✅
- `thought_signature` errors in chat smoke ❌

### Simple bottom line

| Surface | State |
|---|---|
| Analytics v2 | **Done** |
| Host Event v2 | **Works** — console issue remains |
| Chat v2 | **Not started** |
| react-ui removal | **Not started** |
| Prod | **Safe** — flags off |
| **Next** | **[SAN-893 · CK-V1-001](https://linear.app/sanjiovani/issue/SAN-893/ck-v1-001-investigate-v1-host-event-wizard-maximum-update-depth-loop)** — audit verified ~85% · triage `thought_signature` (proven) + run A1–A4 for max-depth (intermittent) before any flag flip |

---

## Executive summary

| Metric | Value |
|---|---|
| **SAN-888 execution** | **100%** |
| **SAN-889 functional** | **90–95%** |
| **SAN-889 console hygiene** | **60%** |
| **SAN-889 overall** | **~85%** |
| **Overall shipped CK-V2 scope** | **~85%** |
| **Full program shipped** | **~45%** |
| **Spec / planning** | **93%** |
| **Production risk** | **None** (flags off) |

---

## Localhost execution (2026-06-13 00:48–00:54 UTC)

Dev: `http://localhost:3001` · server restarted per flag.

| Area | Result |
|---|---|
| **SAN-888** flag off + on | **PASS 100%** |
| **SAN-889** functional | **PASS** |
| **SAN-889** console smoke | **PARTIAL** (`thought_signature`) |
| `npm test -- --run host-event copilotkit-v2` | **19/19 PASS** |
| `npm run build` | **PASS** |
| Playwright SCREEN-016 | **4/6 PASS** (016c slug drift — not CK-V2) |
| `/v2` files | **6** |
| `/chat` v2 files | **0** |
| Backend touched | **0** |
| Prod flags | **OFF** |

---

## Scorecard

| Task | Status | Spec % | Exec % | Verdict |
|---|---|---:|---:|---|
| **SAN-886 · CK-V2-000 — CopilotKit v1→v2 Migration** | Backlog | 93 | 67 | 🟢 on track |
| **SAN-887 · CK-V2-001 — v2 hook-signature verification spike** | Done | 100 | 100 | 🟢 |
| **SAN-888 · CK-V2-002 — Host Analytics prototype** | Done | 100 | **100** | 🟢 fully green |
| **SAN-889 · CK-V2-003 — Migrate /host/event/* (hostEventAgent) to v2** | Done | 98 | **~85** | 🟡 functional · not console-clean |
| **SAN-890 · CK-V2-004 — Migrate /chat (conciergeAgent) to v2** | Backlog | 96 | 0 | ⚫ not started |
| **SAN-891 · CK-V2-005 — Retire @copilotkit/react-ui** | Backlog | 98 | 0 | ⚫ spec ready · blocked SAN-890 |
| **SAN-892 · CK-V2-006 — Tag unbuilt CK/CONCIERGE issues build on v2** | Done | 100 | 100 | 🟢 |
| **SAN-893 · CK-V1-001 — Investigate v1 host event wizard Maximum update depth loop** | Backlog | 100 | 15 | 🟡 audit ~85% · `thought_signature` proven · max-depth intermittent |

Evidence: [`SAN-888/`](../tasks/testing/evidence/SAN-888/) · [`SAN-889/`](../tasks/testing/evidence/SAN-889/)

---

## SAN-888 · localhost detail

| Check | Flag | Result |
|---|---|---|
| Page + KPI + chat "Sales loaded ✓" | OFF / ON | **PASS** |
| Zero console errors | OFF / ON | **PASS** |
| Rollback (v1 after v2) | OFF restart | **PASS** |

Screenshots: `SAN-888-v2-flag-off-localhost.png` · `SAN-888-v2-flag-on-localhost.png`

---

## SAN-889 · localhost detail

| Check | Flag | Result |
|---|---|---|
| Wizard + form load | OFF / ON | **PASS** |
| Manual form edit | OFF / ON | **PASS** |
| Agent form-fill (neighborhood) | OFF / ON | **PASS** |
| Console clean (smoke chat) | OFF / ON | **FAIL** |
| HITL reject | ON | **PASS** |
| HITL approve | ON | **PASS** |
| Combined HITL script | ON | **FAIL** (approve leg timeout; approve-only PASS) |

```text
[CopilotKit] Agent error: AI_APICallError: Function call is missing a thought_signature
  … function call `default_api:mastra_workspace_list_files`
  agentId: hostEventAgent
```

Captured on flag-off and flag-on smoke proofs. **Not** on HITL approve-only run.

### SAN-893 · two console issues (do not conflate)

| Issue | Committed `main` `2052086` | Latest re-run @ same SHA | Blocks flag flip? |
|---|---|---|---|
| **`thought_signature`** / `mastra_workspace_list_files` | ✅ 2 errors | ✅ 2 errors | **Yes — proven every run** |
| **Max update depth** (v1 `useCoAgent` loop) | ✅ 21 errors | ❌ not reproduced | **Investigate** — intermittent |

**Forensic audit:** [`07-893-audit.md`](./07-893-audit.md) — investigation ~**85%** correct · `mergeEventDraft` ref-instability = **prime hypothesis** (A3 unproven) · taxonomy fixed on Linear.

**Evidence rule:** always cite `mainSha` — `SAN-889-v2-flag-off-results.json` is overwritten each proof run.

---

## Migration inventory (@ `2052086`)

| Metric | Count |
|---|---:|
| `/v2` import files | **6** |
| v1 `react-core` lines (excl `/v2`) | **20** |
| `react-ui` rg matches | **10** |
| `useCoAgent` files | **6** |
| `useCopilotAction` files | **7** |
| `renderAndWaitForResponse` lines | **2** |
| `/chat` v2 files | **0** |
| Backend diff | **0** |

---

## Blockers

| Blocker | Owner | Status |
|---|---|---|
| **[SAN-893 · CK-V1-001 — Investigate v1 host event wizard Maximum update depth loop](https://linear.app/sanjiovani/issue/SAN-893/ck-v1-001-investigate-v1-host-event-wizard-maximum-update-depth-loop)** | `thought_signature` proven · max-depth intermittent · `mergeEventDraft` hypothesis | SAN-893 | **A1–A4 probes** before flag flip |
| **[SAN-890 · CK-V2-004 — Migrate /chat (conciergeAgent) to v2](https://linear.app/sanjiovani/issue/SAN-890/ck-v2-004-migrate-chat-conciergeagent-to-v2-last-highest-risk)** | SAN-890 | not started · await approval |
| **[SAN-891 · CK-V2-005 — Retire @copilotkit/react-ui](https://linear.app/sanjiovani/issue/SAN-891/ck-v2-005-retire-copilotkitreact-ui-consolidate-frontend-to-react)** | SAN-891 | blocked by SAN-890 |

**Do not flip flags** until SAN-893 is triaged.

---

## PR status

| PR | State |
|---|---|
| [#211](https://github.com/amo-tech-ai/mdeapp/pull/211) SAN-889 E1 + evidence | **MERGED** @ `2052086` |
| [#212](https://github.com/amo-tech-ai/mdeapp/pull/212) SAN-891 audit docs | **OPEN** · floor ✅ |

---

## Next steps (ordered)

1. **Merge [PR #212](https://github.com/amo-tech-ai/mdeapp/pull/212)** — include `notes-3.md` · `todo.md` · `changelog.md` · [`07-893-audit.md`](./07-893-audit.md).
2. **Keep prod flags OFF** (`COPILOTKIT_V2_ANALYTICS` · `COPILOTKIT_V2_HOST_EVENT` · `COPILOTKIT_V2_CHAT`).
3. **[SAN-893 · CK-V1-001](https://linear.app/sanjiovani/issue/SAN-893/ck-v1-001-investigate-v1-host-event-wizard-maximum-update-depth-loop)** — run A1–A4:
   - **A1** reproduce with `san-889-localhost-proof.mjs` (cite `mainSha` in evidence)
   - **A3** bisect `mergeEventDraft` ref-stability vs `useCopilotReadable` vs memoized `useCoAgent` state
   - **A4** test whether `thought_signature` triggers or amplifies max-depth bursts
   - **Z1** on close: confirmed root cause → open `CK-V1-002` fix ticket
4. **Do not flip flags** until SAN-893 A4 clears `thought_signature` blocker (proven today).
5. **Do not start** **[SAN-890 · CK-V2-004](https://linear.app/sanjiovani/issue/SAN-890/ck-v2-004-migrate-chat-conciergeagent-to-v2-last-highest-risk)** until approved.
6. **Do not start** **[SAN-891 · CK-V2-005](https://linear.app/sanjiovani/issue/SAN-891/ck-v2-005-retire-copilotkitreact-ui-consolidate-frontend-to-react)** until SAN-890 merges.

---

## References

- Tracker: [`todo.md`](./todo.md) · Changelog: [`changelog.md`](./changelog.md)
- Audits: [`04-copilitkit-audit.md`](./04-copilitkit-audit.md) · [`05-890audit.md`](./05-890audit.md) · [`06-891-audit.md`](./06-891-audit.md) · [`07-893-audit.md`](./07-893-audit.md)
- Linear: [v2-upgrade view](https://linear.app/sanjiovani/view/v2-upgrade-30acec9f94bd)
