# CK-V2 · CopilotKit v1→v2 migration — Progress Task Tracker

**Updated:** 2026-06-13 (audit pass) · **Ground truth:** `origin/main` @ **`2052086`**  
**Last verified:** 2026-06-13 — localhost proofs · unit **19/19** · build **PASS** · report [`notes-3.md`](./notes-3.md)  
**Verdict:** Shipped CK-V2 **working** · **not clean enough to flip flags yet**  
**Linear view:** [v2-upgrade](https://linear.app/sanjiovani/view/v2-upgrade-30acec9f94bd)  
**Package pin:** `@copilotkit/react-core@1.55.2` · subpath `/v2` only (no package bump until SAN-891)

---

## Current verdict

| Area | Verdict |
|---|---|
| **SAN-888 · CK-V2-002 — Host Analytics prototype** | ✅ Fully green (**100%**) |
| **SAN-889 · CK-V2-003 — Migrate /host/event/* (hostEventAgent) to v2** | 🟡 Functional **90–95%** · console **60%** · overall **~85%** — **not console-clean** |
| **SAN-890 · CK-V2-004 — Migrate /chat (conciergeAgent) to v2** | ⚫ Not started |
| **SAN-891 · CK-V2-005 — Retire @copilotkit/react-ui** | ⚫ Spec ready · code not started · blocked SAN-890 |
| **Prod risk** | ✅ None — flags off |

---

## 🔴 Program blockers

| ID | Blocker | Severity | Status |
|---|---|---|---|
| **B0** | **[SAN-893 · CK-V1-001 — Investigate v1 host event wizard Maximum update depth loop](https://linear.app/sanjiovani/issue/SAN-893/ck-v1-001-investigate-v1-host-event-wizard-maximum-update-depth-loop)** — `thought_signature` **proven** (every run) · max-depth **intermittent** (21× committed · 0× latest re-run) | 🔴 High | **A1–A4 probes** · audit [`07-893-audit.md`](./07-893-audit.md) ~85% |
| **B1** | **[SAN-890 · CK-V2-004 — Migrate /chat (conciergeAgent) to v2](https://linear.app/sanjiovani/issue/SAN-890/ck-v2-004-migrate-chat-conciergeagent-to-v2-last-highest-risk)** not started | 🟡 Sequencing | **await explicit approval** |
| **B2** | **[SAN-891 · CK-V2-005 — Retire @copilotkit/react-ui](https://linear.app/sanjiovani/issue/SAN-891/ck-v2-005-retire-copilotkitreact-ui-consolidate-frontend-to-react)** blocked by SAN-890 | 🟡 Sequencing | Spec **98%** · exec **0%** |

---

## Parent completion — SAN-886 · CK-V2-000 — CopilotKit v1→v2 Migration

| Child | Dot | Shipped % | State |
|---|---|---:|---|
| **[SAN-887 · CK-V2-001 — v2 hook-signature verification spike](https://linear.app/sanjiovani/issue/SAN-887/ck-v2-001-v2-hook-signature-verification-spike-gate-before-any-v2-code)** | 🟢 | **100%** | Done |
| **[SAN-888 · CK-V2-002 — Host Analytics prototype](https://linear.app/sanjiovani/issue/SAN-888/ck-v2-002-host-analytics-prototype-v2-hostanalytics-flag)** | 🟢 | **100%** | Done · localhost PASS |
| **[SAN-889 · CK-V2-003 — Migrate /host/event/* (hostEventAgent) to v2](https://linear.app/sanjiovani/issue/SAN-889/ck-v2-003-migrate-hostevent-hosteventagent-to-v2)** | 🟡 | **~85%** | Done on `main` · **functionally complete · not console-clean** |
| **[SAN-890 · CK-V2-004 — Migrate /chat (conciergeAgent) to v2](https://linear.app/sanjiovani/issue/SAN-890/ck-v2-004-migrate-chat-conciergeagent-to-v2-last-highest-risk)** | ⚫ | **0%** | Backlog |
| **[SAN-891 · CK-V2-005 — Retire @copilotkit/react-ui](https://linear.app/sanjiovani/issue/SAN-891/ck-v2-005-retire-copilotkitreact-ui-consolidate-frontend-to-react)** | ⚫ | **0%** exec · **98%** spec | Backlog · blocked SAN-890 |
| **[SAN-892 · CK-V2-006 — Tag build-on-v2](https://linear.app/sanjiovani/issue/SAN-892/ck-v2-006-tag-all-unbuilt-ck-concierge-issues-build-on-v2)** | 🟢 | **100%** | Done · 12/12 |
| **[SAN-893 · CK-V1-001 — v1 wizard console loop](https://linear.app/sanjiovani/issue/SAN-893/ck-v1-001-investigate-v1-host-event-wizard-maximum-update-depth-loop)** | 🟡 | **15%** | Backlog · audit done · A1–A4 open |

| **Epic parent complete** | 🟡 | **67%** | 4/6 children Done |

> **Persona impact:** None on prod — all v2 flags off.

---

## Program summary (@ `2052086`)

| Metric | Value |
|---|---|
| **Overall shipped CK-V2 scope** | **~85%** |
| **Full program shipped** | **~45%** |
| **Planning / spec** | **93%** |
| **SAN-888 execution** | **100%** |
| **SAN-889 functional** | **90–95%** |
| **SAN-889 console hygiene** | **60%** |
| **`/v2` files** | **6** |
| **`/chat` v2 files** | **0** |
| **Backend changes** | **0** |
| **Prod flags** | **OFF** |

---

## Task tracker

| Task | Dot | Spec % | Exec % | Proof | Next |
|---|---|---:|---:|---|---|
| **SAN-886 · CK-V2-000** | 🟡 | 93 | 67 | Parent table | Track children |
| **SAN-887 · CK-V2-001** | 🟢 | 100 | 100 | spike on `main` | — |
| **SAN-888 · CK-V2-002** | 🟢 | 100 | **100** | localhost PASS off+on | — |
| **SAN-889 · CK-V2-003** | 🟡 | 98 | **~85** | functional PASS · console PARTIAL · HITL PASS | SAN-893 triage |
| **SAN-890 · CK-V2-004** | ⚫ | 96 | 0 | 0 `/chat` v2 files | **Await approval** |
| **SAN-891 · CK-V2-005** | ⚫ | 98 | 0 | [`06-891-audit.md`](./06-891-audit.md) · [PR #212](https://github.com/amo-tech-ai/mdeapp/pull/212) open | After 890 |
| **SAN-892 · CK-V2-006** | 🟢 | 100 | 100 | 12/12 `build-on-v2` | — |
| **SAN-893 · CK-V1-001** | 🟡 | 100 | **15** | [`07-893-audit.md`](./07-893-audit.md) · Linear updated | **A1–A4** → `CK-V1-002` |

---

## SAN-889 · step tracker

| Step | Dot | Proof |
|---|---|---|
| A1–A4 Scaffold + flag | 🟢 | `copilotkit-v2-host-event-flag.ts` |
| B1–B4 v2 hooks | 🟢 | `useAgent` · `useFrontendTool` · `useHumanInTheLoop` |
| C1 Shell v2 | 🟢 | `host-event-shell-v2.tsx` |
| D1–D5 Verify + merge | 🟡 | HITL approve/reject PASS · **console smoke FAIL** (`thought_signature`) |

---

## Next actions (ordered)

1. **Merge [PR #212](https://github.com/amo-tech-ai/mdeapp/pull/212)** — docs + [`07-893-audit.md`](./07-893-audit.md) + tracker/changelog/notes.
2. **Keep all v2 flags OFF** on prod/preview.
3. **[SAN-893 · CK-V1-001](https://linear.app/sanjiovani/issue/SAN-893/ck-v1-001-investigate-v1-host-event-wizard-maximum-update-depth-loop)** — execute A1–A4 (see Linear) · `thought_signature` blocks flags today.
4. **Await approval** for **[SAN-890 · CK-V2-004](https://linear.app/sanjiovani/issue/SAN-890/ck-v2-004-migrate-chat-conciergeagent-to-v2-last-highest-risk)**.
5. **Do not start** **[SAN-891 · CK-V2-005](https://linear.app/sanjiovani/issue/SAN-891/ck-v2-005-retire-copilotkitreact-ui-consolidate-frontend-to-react)** until SAN-890 merges.

**Do not:** flip flags · start SAN-890 · start SAN-891 · open infra PR.

---

## References

- Report: [`notes-3.md`](./notes-3.md) · Changelog: [`changelog.md`](./changelog.md)
- Audits: [`04-copilitkit-audit.md`](./04-copilitkit-audit.md) · [`05-890audit.md`](./05-890audit.md) · [`06-891-audit.md`](./06-891-audit.md) · [`07-893-audit.md`](./07-893-audit.md)
- [Linear v2-upgrade view](https://linear.app/sanjiovani/view/v2-upgrade-30acec9f94bd)
