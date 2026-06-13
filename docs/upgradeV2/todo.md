# CK-V2 · CopilotKit v1→v2 migration — Progress Task Tracker

**Updated:** 2026-06-13 · **Auditor:** `main` @ `2052086` (PR #211 merged) + Linear MCP  
**Last verified:** 2026-06-13 — unit 19/19 ×3 · build ×2 · SAN-891 spec audited [`06-891-audit.md`](./06-891-audit.md)  
**Linear view:** [v2-upgrade](https://linear.app/sanjiovani/view/v2-upgrade-30acec9f94bd)  
**Package pin:** `@copilotkit/react-core@1.55.2` · subpath `/v2` only (no package bump until SAN-891)  
**Rule:** Docs first · prototype second · infra later (`vercel-deploy.yml` **not** in CK-V2 scope)

---

## 🔴 Program blockers (watch)

| ID | Blocker | Severity | CK-V2? | Status |
|---|---|---|---|---|
| **R1** | **`npm run audit`** (`--audit-level=high`) — transitive moderate CVEs | 🟡 Watch | **No** | Floor **PASS**; gate fails only on **high+** |
| **R2** | **SAN-893 · CK-V1-001** — v1 wizard console max update depth | 🟡 Watch | **No** | v1 bridge 0 diff vs pre-889; v2 path PASS |

---

## Parent completion — SAN-886 · CK-V2-000 (migration epic)

| Child | Dot | Shipped % | State |
|---|---|---:|---|
| **SAN-887 · CK-V2-001** — Spike gate | 🟢 | **100%** | Done · spike on `main` |
| **SAN-888 · CK-V2-002** — Analytics prototype | 🟢 | **100%** | Done · `b9a4f70` + evidence |
| **SAN-889 · CK-V2-003** — Host event v2 | 🟢 | **100%** | Done · merged `0fab08f` · [PR #210](https://github.com/amo-tech-ai/mdeapp/pull/210) |
| **SAN-890 · CK-V2-004** — Chat v2 | ⚫ | **0%** | Backlog · **await approval** |
| **SAN-891 · CK-V2-005** — Retire react-ui | ⚫ | **0%** | Backlog |
| **SAN-892 · CK-V2-006** — Tag build-on-v2 | 🟢 | **100%** | Done · 12/12 tagged |
| **SAN-893 · CK-V1-001** — v1 wizard console loop | 🟡 | **0%** | Backlog · watch (not SAN-889) |

| **Epic parent complete** | 🟡 | **67%** | 4/6 children Done · 890+891 backlog |

> **Persona impact:** Roberto v2 wizard when `COPILOTKIT_V2_HOST_EVENT=1`. Prod flags off — no user-visible change.

### Legend

| Dot | Meaning |
|---|---|
| 🟢 | Complete — verified on disk / merged |
| 🟡 | In progress — partial or watch |
| 🔴 | Failed / blocker — must fix before Done |
| ⚫ | Not started — spec ready, zero code |

---

## Program summary

| Metric | Value | Dot |
|---|---|---|
| **Planning / spec quality** | **93%** | 🟢 |
| **Execution shipped on `main`** | **~45%** | 🟡 |
| **Epic SAN-886 composite** | **67%** | 🟡 |
| **Frontend migration shipped (`main`)** | **~40%** | 🟡 |
| **Production persona impact today** | **None** (flags off on prod) | 🟢 |
| **`/v2` on `main`** | **6 files** (`/host/analytics` + `/host/event`) | 🟡 |
| **Backend changes required** | **0** | 🟢 |
| **v1 retirement grep (`main` @ `0fab08f`)** | **19** `react-core` · **6** `react-ui` imports · **7** `useCopilotAction` files · **6** `useCoAgent` files · **2** `renderAndWaitForResponse` | 🟢 |

Canonical command: `git grep -l 'from "@copilotkit/react-core"' -- 'src/*' | grep -v /v2 | grep -v test`

---

## Task tracker (SAN-886 → SAN-892)

| Task | Dot | % | Linear | Proof / evidence | Next |
|---|---|---:|---|---|---|
| **SAN-886 · CK-V2-000** — Epic | 🟡 | **67%** | Backlog | Parent table above | Track children |
| **SAN-887 · CK-V2-001** — Spike gate | 🟢 | **100%** | **Done** | [`CK-V2-001-hook-signatures.md`](../tasks/copilotkit/CK-V2-001-hook-signatures.md) | — |
| **SAN-888 · CK-V2-002** — Analytics prototype | 🟢 | **100%** | **Done** | `main` · [`evidence/SAN-888`](../tasks/testing/evidence/SAN-888/RESULTS.md) | — |
| **SAN-889 · CK-V2-003** — Host event v2 | 🟢 | **100%** | **Done** | `2052086` · [`evidence/SAN-889`](../tasks/testing/evidence/SAN-889/RESULTS.md) | — |
| **SAN-890 · CK-V2-004** — Chat v2 (last) | ⚫ | **0%** | Backlog | [`CK-V2-004-chat-subspike.md`](../tasks/copilotkit/CK-V2-004-chat-subspike.md) | **Await approval** |
| **SAN-891 · CK-V2-005** — Retire react-ui | ⚫ | **0%** | Backlog | grep-zero AC (19/6 today) · spec audited [`06-891-audit.md`](./06-891-audit.md) ~98% | After 890 |
| **SAN-892 · CK-V2-006** — Tag build-on-v2 | 🟢 | **100%** | **Done** | 12/12 `build-on-v2` | — |
| **SAN-893 · CK-V1-001** — v1 console loop | 🟡 | **0%** | Backlog | flag-off console FAIL · v1 0 diff | Investigate |

---

## SAN-889 · CK-V2-003 — step tracker (merged ✅)

| Step | Dot | Proof |
|---|---|---|
| A1–A4 Scaffold + flag | 🟢 | `copilotkit-v2-host-event-flag.ts` · providers · layout/page gate |
| B1–B4 v2 hooks | 🟢 | `useAgent` · `useAgentContext` · `useFrontendTool` ×3 · `useHumanInTheLoop` |
| C1 Shell v2 | 🟢 | `host-event-shell-v2.tsx` |
| D1–D5 Verify + merge | 🟢 | v2 localhost PASS · HITL approve PASS · [PR #210](https://github.com/amo-tech-ai/mdeapp/pull/210) |

---

## Next actions (ordered)

1. ~~SAN-889 merge + E1 proof fix~~ ✅ `2052086`  
2. **[SAN-893 · CK-V1-001 — Investigate v1 host event wizard Maximum update depth loop](https://linear.app/sanjiovani/issue/SAN-893/ck-v1-001-investigate-v1-host-event-wizard-maximum-update-depth-loop)** — v1 flag-off console investigation  
3. **SAN-890 · CK-V2-004** — `/chat` v2 — **only when approved**  
4. **SAN-891 · CK-V2-005** — retire `react-ui` (spec ~98% — [`06-891-audit.md`](./06-891-audit.md)) · after 890  

---

## References

- [Linear v2-upgrade view](https://linear.app/sanjiovani/view/v2-upgrade-30acec9f94bd)
- Audit: [`04-copilitkit-audit.md`](./04-copilitkit-audit.md) · [`notes-3.md`](./notes-3.md) · [`05-890audit.md`](./05-890audit.md) · [`06-891-audit.md`](./06-891-audit.md)
- Changelog: [`changelog.md`](./changelog.md)
