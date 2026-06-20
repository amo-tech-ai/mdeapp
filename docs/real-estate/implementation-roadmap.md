# Real Estate Implementation Roadmap

> **SAN-1210 · RE-PLAN-001 — Real Estate Design → Implementation Audit** · Task 3 of 6 · 2026-06-19
> Build order for the Rentals OS operator workspace. Grounded in [`design/design-inventory.md`](design/design-inventory.md) + verified Linear state. All surfaces are now ticketed (`SAN-1211…1222`).

## The answer first

**Build the shell first, then the AI plumbing, then the surfaces into it — never standalone screens.** The foundation (data layer, concierge shell, route gate) is **Done**; the next real work is the AI bridge + ops agent, after which the now-ticketed V3 surfaces become buildable.

**What it means in the real world:** the broker operator gets a working AI workspace incrementally — a shell with real data (Phases 1–2), then the daily-driver surfaces (Phase 3), then ops tooling and deep workspaces. Each phase is shippable.

**Next step:** land `SAN-1124` (CK bridge) + `SAN-1035` (ops agent), then execute Phase 3 in order.

## Status legend

✅ Done · 🟢 Ticketed (live, not Done)

## Phase 1 — Foundation (mostly done)

| Order | Task | Status |
|---|---|---|
| 1 | `SAN-1095 · RE-DES-004 — Broker OS data layer + overview redirect` | ✅ Done |
| 2 | `SAN-1093 · RE-DES-002 — Broker Concierge` (the shell) | ✅ Done |
| 3 | `SAN-1109 · RE-WIRE-001 — /host/rentals route tree + gate` | ✅ Done |
| 4 | `SAN-1111 · RE-WIRE-003 — Broker data hooks + Class U proof` | 🟢 Todo |

## Phase 2 — AI Infrastructure

| Order | Task | Status |
|---|---|---|
| 1 | `SAN-1124 · RE-AI-CK-001 — Broker CopilotKit v2 bridge` | 🟢 Todo |
| 2 | `SAN-1035 · MASTRA-RE-015 — Broker ops agent` | 🟢 Todo |
| 3 | `SAN-1133 · RE-AI-073 — HITL write guard (listings + leads)` | 🟢 Backlog |

## Phase 3 — Core Workflows (the daily driver)

| Order | Task | Status |
|---|---|---|
| 1 | `SAN-1211 · RE-DES-011 — Operator Today Home` | 🟢 Backlog |
| 2 | `SAN-1212 · RE-DES-012 — Unified Inbox` | 🟢 Backlog |
| 3 | `SAN-1213 · RE-DES-013 — Approval Queue` | 🟢 Backlog |
| 4 | `SAN-1215 · RE-DES-015 — Global Search & Command Bar` | 🟢 Backlog |

## Phase 4 — Operations

| Order | Task | Status |
|---|---|---|
| 1 | `SAN-1218 · RE-DES-018 — Notifications Center` | 🟢 Backlog |
| 2 | `SAN-1219 · RE-DES-019 — Tasks & Follow-Ups` | 🟢 Backlog |
| 3 | `SAN-1214 · RE-DES-014 — Owner Communications` | 🟢 Backlog |
| 4 | `SAN-1216 · RE-DES-016 — AI Activity Timeline` | 🟢 Backlog |
| 5 | `SAN-1217 · RE-DES-017 — Universal Activity Feed` | 🟢 Backlog |

## Phase 5 — Context Workspaces (deep drill-downs)

| Order | Task | Status |
|---|---|---|
| 1 | `SAN-1220 · RE-DES-020 — Lead Detail Workspace` | 🟢 Backlog |
| 2 | `SAN-1221 · RE-DES-021 — Listing Workspace` | 🟢 Backlog |
| 3 | `SAN-1222 · RE-DES-022 — Viewings Command Center` (reconcile with `SAN-1206 · RE-DES-010`) | 🟢 Backlog |

## Dependency spine (read top-to-bottom)

```text
RE-DES-004 data layer ✅ ──┐
RE-WIRE-001 route gate ✅ ──┼─► RE-DES-002 concierge shell ✅
RE-WIRE-003 hooks 🟢 ───────┘
   │
   ▼
RE-AI-CK-001 CK bridge (SAN-1124) 🟢 ─► MASTRA-RE-015 ops agent (SAN-1035) 🟢 ─► RE-AI-073 HITL guard (SAN-1133) 🟢
   │
   ├─► RE-DES-011 Today Home (SAN-1211)
   ├─► RE-DES-012 Unified Inbox (SAN-1212) ─► RE-DES-020 Lead Detail (SAN-1220)
   ├─► RE-DES-013 Approval Queue (SAN-1213) [needs RE-AI-073]
   ├─► RE-DES-015 Command Bar (SAN-1215)
   ├─► RE-DES-018 Notifications / RE-DES-019 Tasks / RE-DES-016 Timeline / RE-DES-017 Feed
   ├─► RE-DES-021 Listing Workspace (SAN-1221)
   └─► RE-DES-022 Viewings (SAN-1222) [needs Maps]
```

## Hard rules every phase inherits (from V3 §02 + mdeai guardrails)

- **No auto-mutations.** AI drafts/scores/summarizes; every publish/price/contact waits for explicit human approval (Approval Queue). `SAN-1133 · RE-AI-073` enforces it.
- **Gemini only** for production AI. **RLS + ≥1 policy** on every new table; landlord-scoped via `acting_landlord_ids()`.
- **`data pending`**, never an invented number/chart, for missing values.
- **Maps rules** for the route map (`SAN-1222`): `mapId` on every `<Map>`, `X-Goog-FieldMask` on every Places call.
- **Localhost runtime proof + evidence** required before any task flips Done.
