# Real Estate Design Inventory

> **SAN-1210 · RE-PLAN-001 — Real Estate Design → Implementation Audit** · Task 1 of 6 · 2026-06-19
> ⚠️ **`SAN-1096` is NOT this audit** — it is `SAN-1096 · PTR-RENTALS-001 — landlord_id ownership model`, a **Duplicate**. The real audit issue is **`SAN-1210 · RE-PLAN-001`** (created 2026-06-19).
> Verified against Linear "Real Estate" on 2026-06-19. **Caveat:** the Linear pull was page 1 of more, so any "no task" reflects the captured 100 issues.

## The answer first

**The Rentals OS design is ~95% done, and as of this audit its 12 unticketed workspace surfaces are now filed as real Linear issues (`SAN-1211…1222 · RE-DES-011…022`).** Before today only the Broker Concierge shell had a ticket; the design and the build plan had drifted. They now line up.

**What it means in the real world:** an engineer can now open Linear and find every Rentals OS surface — Today Home, Unified Inbox, Approval Queue, and the rest — each with acceptance criteria, dependencies, and a design source. Roberto's and the broker operator's workspace is fully ticketed, not just designed.

**Next step:** execute the roadmap order ([`implementation-roadmap.md`](../implementation-roadmap.md)); the surfaces unblock once the CopilotKit bridge (`SAN-1124`) and ops agent (`SAN-1035`) land.

## Legend

- **Status** — ✅ Built (Linear Done) · 🟢 Ticketed (live issue, not Done) · 🔴 Design-only (no issue)
- **Ready For Build** — ✅ ticketed + acceptance + deps known · ⏳ ticketed but blocked by a dependency

## Inventory

| Design | Status | Source of Truth | Linear Task | Ready For Build |
|---|---|---|---|---|
| **RENT-000 · AI-Native Workspace Contract** (the 3-region shell) | ✅ Built | V3 §02 + `RENT-000 AI-Native Workspace Contract.html` | Covered by `SAN-1093 · RE-DES-002 — Broker Concierge` (the shell) — no separate ticket | ✅ shell exists |
| **SAN-1093 · RE-DES-002 — Broker Concierge** | ✅ Built | [`design/03-broker-concierge.md`](03-broker-concierge.md) + `concierge/*.html` | `SAN-1093` (**Done**) | ✅ done |
| **Operator Today Home** | 🟢 Ticketed | V3 §04 + `prototypes/RENT-017 Operator Today Home.html` | `SAN-1211 · RE-DES-011` | ⏳ blocked by `SAN-1124` (CK bridge) |
| **Unified Inbox** | 🟢 Ticketed | V3 §04 + `prototypes/RENT-018 Unified Inbox.html` | `SAN-1212 · RE-DES-012` | ⏳ blocked by `SAN-1124` + ≥1 real channel |
| **Approval Queue** | 🟢 Ticketed | V3 §04 (governance spine) | `SAN-1213 · RE-DES-013` | ⏳ blocked by `SAN-1124` + `SAN-1133` (HITL guard) |
| **Owner Communications** | 🟢 Ticketed | V3 §04 | `SAN-1214 · RE-DES-014` | ⏳ blocked by `SAN-1124`; owner-portal scope is open |
| **Global Search & Command Bar** | 🟢 Ticketed | V3 §04 + `Command` primitive (⌘K) | `SAN-1215 · RE-DES-015` | ✅ ready (no AI dep for v1) |
| **AI Activity Timeline** | 🟢 Ticketed | V3 §04 | `SAN-1216 · RE-DES-016` | ⏳ blocked by `SAN-1124` + `SAN-1035` (agent) |
| **Universal Activity Feed** | 🟢 Ticketed | V3 §04 | `SAN-1217 · RE-DES-017` | ⏳ needs `SAN-1111` (data hooks) |
| **Notifications Center** | 🟢 Ticketed | V3 §04 | `SAN-1218 · RE-DES-018` | ✅ ready (shell + data done) |
| **Tasks & Follow-Ups** | 🟢 Ticketed | V3 §04 | `SAN-1219 · RE-DES-019` | ✅ ready (shell + data done) |
| **Lead Detail Workspace** | 🟢 Ticketed | V3 §05 | `SAN-1220 · RE-DES-020` | ⏳ blocked by `SAN-1124` + `SAN-1212` (Inbox) |
| **Listing Workspace** | 🟢 Ticketed | V3 §05 (Listing Health is one tab) | `SAN-1221 · RE-DES-021` | ⏳ blocked by `SAN-1124`; builds on `SAN-1094` |
| **Viewings Command Center** | 🟢 Ticketed | V3 §04 (RENT-005) | `SAN-1222 · RE-DES-022` | ⏳ needs Maps; reconcile with `SAN-1206 · RE-DES-010` |

## Supporting issues that already exist (build infrastructure, verified live)

| Linear Task | Title | Status | Role |
|---|---|---|---|
| `SAN-1095 · RE-DES-004` | Broker OS data layer + overview redirect | **Done** | Data foundation under every surface |
| `SAN-1109 · RE-WIRE-001` | /host/rentals route tree + gate | **Done** | The route the shell mounts at |
| `SAN-1094 · RE-DES-003` | Broker Listings + map | Todo | Feeds Listing Workspace |
| `SAN-1111 · RE-WIRE-003` | Broker data hooks + Class U proof | Todo | Landlord-scoped hooks + E2E |
| `SAN-1124 · RE-AI-CK-001` | Broker CopilotKit v2 bridge | Todo | Wires tool results → generative UI / HITL |
| `SAN-1035 · MASTRA-RE-015` | Broker ops agent | Todo | The Gemini agent behind the workspace |
| `SAN-1126 · RE-AI-054` | Broker agent specification | Todo | Agent spec |
| `SAN-1133 · RE-AI-073` | HITL write guard (listings + leads) | Backlog | The Approval-Queue governance gate |
| `SAN-1108 · PTR-RENTALS-005` | Broker empty/loading/error contract | Todo | The `data pending` contract V3 mandates |

## Notes for the reader

- **`RENT-NNN` is V3 design vocabulary, not Linear.** The 12 surfaces above were filed under the live `RE-DES-*` family (`RE-DES-011…022`); the `RENT-NNN` numbers remain only as design-source references.
- **Persona naming caveat:** V3's "Andrés the broker" collides with mdeapp-canon Andrés (ticket buyer). Map operators to **Roberto** (host/landlord) + the broker operator; map V3's "PM" to **Patricia**. Resolve before RLS work.
- **Mount route:** `/host/rentals` (one broker shell — no second dashboard).
- **D-track duplicates:** live `SAN-1104…1111` supersede stale `SAN-1096…1103` (close the dupes).
