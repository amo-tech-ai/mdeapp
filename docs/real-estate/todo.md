# Real Estate — Next 15 (execution queue)

> **North star:** Broker OS concierge-first · Camila lead loop · PTR gate before real broker data.  
> **Linear Todo column:** synced via `npm run linear:rentals-queue` (script: `scripts/linear-rentals-todo-queue.mjs`)  
> **MVP view:** [phase:mvp](https://linear.app/sanjiovani/view/mvp-48ab105e7f0a) · **Real Estate project:** [board](https://linear.app/sanjiovani/project/real-estate-43bea599dc09/issues)  
> **Architecture:** [Concierge-first restructure](./ai-native/linear-restructure-2026-06-16.md) · **Full backlog:** [todo-backlog.md](./todo-backlog.md) · **Plans:** [ainative-plan.md](./plans/ainative-plan.md)

**Updated:** 2026-06-18 · **Option B** — one shell (`SAN-1093`); `SAN-1095` = data + redirect only.

---

## Next 15 — top to bottom (Todo column order)

| # | Task (full name) | Linear | Class | Status | Next action |
|---|------------------|--------|-------|--------|-------------|
| 1 | **PTR-RENTALS-001 — landlord_id ownership model** | [SAN-1104](https://linear.app/sanjiovani/issue/SAN-1104) | C | 🟡 In Review | Merge migration + ownership doc |
| 2 | **PTR-RENTALS-002 — Broker RLS + two-user test** | [SAN-1105](https://linear.app/sanjiovani/issue/SAN-1105) | C | 🟡 In Review | Two-user vitest negative proof |
| 3 | **PTR-RENTALS-003 — Publish FSM + audit columns** | [SAN-1106](https://linear.app/sanjiovani/issue/SAN-1106) | C | 🟡 In Review | FSM columns + invalid transition test |
| 4 | **PTR-RENTALS-004 — Onboarding backend writes** | [SAN-1107](https://linear.app/sanjiovani/issue/SAN-1107) | C | 🟡 In Review | Profile + first draft API |
| 5 | **PTR-RENTALS-005 — Broker empty/loading/error contract** | [SAN-1108](https://linear.app/sanjiovani/issue/SAN-1108) | C | 🟡 In Review | `BrokerSurfaceState` + **Data pending.** |
| 6 | **RE-WIRE-001 — /host/rentals route tree + gate** | [SAN-1109](https://linear.app/sanjiovani/issue/SAN-1109) | C | 🟢 PR [#242](https://github.com/amo-tech-ai/mdeapp/pull/242) | **Gate shipped:** `landlord_profiles` via `(broker)/layout` + `getBrokerContext()` · `/dashboard` → `?mode=overview` · merge → #243 |
| 7 | **RE-DES-005 — Broker onboarding wizard UI** | [SAN-1092](https://linear.app/sanjiovani/issue/SAN-1092) | U | 🟡 PR [#243](https://github.com/amo-tech-ai/mdeapp/pull/243) | Merge after #242 |
| 8 | **RE-DES-004 — Broker OS data layer + overview redirect** | [SAN-1095](https://linear.app/sanjiovani/issue/SAN-1095) | C | 🟡 PR [#244](https://github.com/amo-tech-ai/mdeapp/pull/244) | **Data only** — SQL + redirect; layout owner = SAN-1093; strip KPI shell from #244 |
| 9 | **RE-DES-002 — Broker Concierge (primary AI-native workspace)** | [SAN-1093](https://linear.app/sanjiovani/issue/SAN-1093) | U | ⚪ Todo | **Owns only 3-panel shell** at `/host/rentals` — Phase A static from `RentalsConcierge.jsx` |
| 10 | **RE-DES-003 — Broker Listings + map** | [SAN-1094](https://linear.app/sanjiovani/issue/SAN-1094) | U | 🟡 In Review | Grid default + publish HITL drawer |
| 11 | **RE-AI-CK-001 — Broker CopilotKit v2 bridge** | [SAN-1124](https://linear.app/sanjiovani/issue/SAN-1124) | C | ⚪ Backlog | Pattern: `/host/analytics` `HostOpsCopilotBridge` |
| 12 | **RE-AI-054 — Broker agent specification** | [SAN-1126](https://linear.app/sanjiovani/issue/SAN-1126) | D | ⚪ Backlog | Spec before `brokerAgent` register |
| 13 | **MASTRA-RE-015 — Broker ops agent** | [SAN-1035](https://linear.app/sanjiovani/issue/SAN-1035) | C/U | ⚪ Backlog | `brokerAgent` after SAN-1124 + SAN-1126 |
| 14 | **RE-WIRE-002 — Kit tokens + shared broker primitives** | [SAN-1110](https://linear.app/sanjiovani/issue/SAN-1110) | C/U | ⚪ Backlog | HITL ack + tokens (parallel with 9–10) |
| 15 | **RE-WIRE-003 — Broker hooks + Class U E2E** | [SAN-1111](https://linear.app/sanjiovani/issue/SAN-1111) | U | ⚪ Backlog | Playwright broker journey + RE-PROD-001 row |

---

## Chrome rule (locked)

```text
HostNavRail  = global host nav (Events · Rentals · Analytics)
rc-top tabs  = Rentals OS only (Concierge · Listings · Dashboard)
rc-left      = opps / workflows / recent — NOT a second global rail
```

---

## Demoted (not in queue — Backlog)

| Task | Why |
|------|-----|
| [SAN-1088 · UX-NAV-001](https://linear.app/sanjiovani/issue/SAN-1088) | P3 — after P0 + broker OS |
| [SAN-1089 · RE-DES-001](https://linear.app/sanjiovani/issue/SAN-1089) | P3 — consumer AI shell |
| [SAN-1090 · RE-DES-006](https://linear.app/sanjiovani/issue/SAN-1090) | P5 — partners landing |
| [SAN-1167 · RE-AI-REF-001](https://linear.app/sanjiovani/issue/SAN-1167) | Canceled — merged into SAN-1093 |
| [SAN-1091 · PTR-RENTALS-P0](https://linear.app/sanjiovani/issue/SAN-1091) | Superseded by SAN-1104–1108 |

---

## Sync command

```bash
cd /home/sk/mdeai/mdeapp
infisical run --silent --env=dev --path=/ -- node scripts/linear-rentals-todo-queue.mjs
```

**Do not:** merge PR #244 KPI shell · import `mdeai-design-system` into `src/` · use `ui_kits/explore/` for broker.
