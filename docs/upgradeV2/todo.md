# CK-V2 · CopilotKit v1→v2 migration — Progress Task Tracker

**Updated:** 2026-06-12 · **Auditor:** `main` @ `b9a4f70` + localhost proof + Linear  
**Linear view:** [v2-upgrade](https://linear.app/sanjiovani/view/v2-upgrade-30acec9f94bd)  
**Package pin:** `@copilotkit/react-core@1.55.2` · subpath `/v2` only (no package bump until SAN-891)  
**Rule:** Docs first · prototype second · infra later (`vercel-deploy.yml` **not** in CK-V2 scope)

---

## Parent completion — SAN-886 · CK-V2-000 (migration epic)

| Child | Dot | Shipped % | State |
|---|---|---:|---|
| **SAN-887 · CK-V2-001** — Spike gate | 🟢 | **100%** | Done · spike on `main` |
| **SAN-888 · CK-V2-002** — Analytics prototype | 🟢 | **100%** | Done · merged `b9a4f70` · proof PASS |
| **SAN-889 · CK-V2-003** — Host event v2 | 🟡 | **18%** | In Progress · scaffold on branch |
| **SAN-890 · CK-V2-004** — Chat v2 | ⚫ | **0%** | Backlog · spike ready |
| **SAN-891 · CK-V2-005** — Retire react-ui | ⚫ | **0%** | Backlog |
| **SAN-892 · CK-V2-006** — Tag build-on-v2 | 🟢 | **100%** | Done · 12/12 tagged |

| **Epic parent complete** | 🟡 | **48%** | 2/6 children Done · 1 in-flight · 3 backlog |

> **Persona impact:** Roberto can use v2 analytics only when ops sets `COPILOTKIT_V2_ANALYTICS=1`. Default off on prod — no user-visible change yet.

### Legend

| Dot | Meaning |
|---|---|
| 🟢 | Complete — verified on disk / merged |
| 🟡 | In progress — partial or blocked on non-CK-V2 gate |
| 🔴 | Failed / blocker — must fix before Done |
| ⚫ | Not started — spec ready, zero code |

---

## Program summary

| Metric | Value | Dot |
|---|---|---|
| **Planning / spec quality** | **93%** | 🟢 |
| **Execution shipped on `main`** | **28%** | 🟡 |
| **Execution in-flight (SAN-889 branch)** | **18%** | 🟡 |
| **Epic SAN-886 composite** | **48%** | 🟡 |
| **Frontend migration shipped (`main`)** | **~20%** | 🟡 |
| **Production persona impact today** | **None** (flags off on prod) | 🟢 |
| **`/v2` on `main`** | **3 files** (`/host/analytics` only) | 🟡 |
| **Backend changes required** | **0** | 🟢 |

---

## Task tracker (SAN-886 → SAN-892)

| Task | Dot | % | Linear | Proof / evidence | Next |
|---|---|---:|---|---|---|
| **SAN-886 · CK-V2-000** — Epic | 🟡 | **48%** | Backlog | Parent table above | Track children |
| **SAN-887 · CK-V2-001** — Spike gate | 🟢 | **100%** | **Done** | [`CK-V2-001-hook-signatures.md`](../tasks/copilotkit/CK-V2-001-hook-signatures.md) | — |
| **SAN-888 · CK-V2-002** — Analytics prototype | 🟢 | **100%** | **Done** | `main` `b9a4f70` · [`evidence/SAN-888`](../tasks/testing/evidence/SAN-888/RESULTS.md) | — |
| **SAN-889 · CK-V2-003** — Host event v2 | 🟡 | **18%** | In Progress | Branch `ai/san-889-ck-v2-003-*` · A2–A4 scaffold | B3–B4 tools + HITL |
| **SAN-890 · CK-V2-004** — Chat v2 (last) | ⚫ | **0%** | Backlog | [`CK-V2-004-chat-subspike.md`](../tasks/copilotkit/CK-V2-004-chat-subspike.md) | After 889 |
| **SAN-891 · CK-V2-005** — Retire react-ui | ⚫ | **0%** | Backlog | grep-zero AC | After 890 |
| **SAN-892 · CK-V2-006** — Tag build-on-v2 | 🟢 | **100%** | **Done** | 12/12 `build-on-v2` | — |

---

## SAN-888 · CK-V2-002 — step tracker (merged)

| Step | Dot | Proof |
|---|---|---|
| A1–A4 Scaffold + flag gate | 🟢 | `copilotkit-v2-analytics-flag.ts` · providers · layout/page gate |
| B1–B4 v2 hooks | 🟢 | `host-ops-copilot-bridge-v2.tsx` · `host-analytics-shell-v2.tsx` |
| C1–C5 Contracts | 🟢 | Flag-off + flag-on localhost proof PASS |
| D1–D4 floor + merge | 🟢 | `audit:floor` · PR #208 merged `b9a4f70` |
| D5–D7 Proof on `main` | 🟢 | [`san-888-localhost-proof.mjs`](../tasks/testing/evidence/SAN-888/san-888-localhost-proof.mjs) |
| D8 Linear Done | 🟢 | SAN-888 · CK-V2-002 marked Done |

---

## SAN-889 · CK-V2-003 — step tracker (in flight)

| Step | Dot | Proof |
|---|---|---|
| A1 SAN-888 on `main` | 🟢 | `b9a4f70` |
| A2 Flag `COPILOTKIT_V2_HOST_EVENT` | 🟢 | `copilotkit-v2-host-event-flag.ts` + 3/3 tests |
| A3 Providers v1/v2 split | 🟢 | `host-event-provider-v1/v2.tsx` |
| A4 Layout + page gate | 🟢 | `host/event/layout.tsx` · `host/event/new/page.tsx` |
| B1 `useAgent` state sync | 🟡 | `host-event-copilot-bridge-v2.tsx` scaffold |
| B2 `useAgentContext` | 🟡 | draft readable wired |
| B3 `useFrontendTool` ×3 | ⚫ | Not started |
| B4 `useHumanInTheLoop` publish | ⚫ | Not started |
| C1 Shell v2 | 🟢 | `host-event-shell-v2.tsx` |
| D1–D5 Verify + merge | ⚫ | Pending |

---

## SAN-890A · CK-V2-004A — Concierge Chat Migration Spike

**Status:** 🟢 Done (docs only) · [`CK-V2-004-chat-subspike.md`](../tasks/copilotkit/CK-V2-004-chat-subspike.md)

---

## Official Migrate-to-V2 steps (`official-docs.md`)

| Step | Scope | `main` @ `b9a4f70` | Dot |
|---|---|---|---|
| 1. v1 hooks → `/v2` | Per route | ✅ `/host/analytics` (3 files) | 🟡 |
| 2. `react-ui` → `/v2` | Per route | ✅ analytics shell only | 🟡 |
| 3. `/v2/styles.css` | Per route | ✅ analytics provider-v2 | 🟡 |
| 4. Backend unchanged | `/api/copilotkit` + Mastra | ✅ | 🟢 |
| 5. `@ag-ui/client` bump | Optional | defer | 🟢 |

---

## Next actions (ordered)

1. ~~Merge SAN-888~~ ✅ `b9a4f70`  
2. ~~Preview proof flag on/off~~ ✅ [`evidence/SAN-888`](../tasks/testing/evidence/SAN-888/)  
3. ~~SAN-888 Linear Done~~ ✅  
4. ~~SAN-892 tagging~~ ✅  
5. ~~SAN-890A spike~~ ✅  
6. **SAN-889 · CK-V2-003** — B3 `useFrontendTool` ×3 + B4 `useHumanInTheLoop` publish  
7. **SAN-890 · CK-V2-004** — `/chat` v2 (last)  
8. **SAN-891 · CK-V2-005** — retire `react-ui` · remove flags  

---

## References

- [Linear v2-upgrade view](https://linear.app/sanjiovani/view/v2-upgrade-30acec9f94bd)
- Changelog: [`changelog.md`](./changelog.md)
