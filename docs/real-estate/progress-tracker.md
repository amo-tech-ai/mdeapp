# Real Estate Progress Tracker

> **RE-PLAN-001 — Real Estate Design → Implementation Audit** · Task 5 of 6 · 2026-06-19
> One row per buildable unit, tracked across the full lifecycle. Source: [`design/design-inventory.md`](design/design-inventory.md) + verified Linear (page 1 of more).

## The answer first

**Foundation is shipped; the AI bridge is next; the 12 V3 workspace surfaces are now ticketed (`SAN-1211…1222`) and waiting on Code.** Only the data layer, route gate, onboarding, listings, and the Broker Concierge shell have moved past design — but every operator surface now has a Linear issue with acceptance criteria and dependencies.

**What it means in the real world:** the broker operator's daily-driver screens (Today Home, Inbox, Approval Queue) have zero implementation progress, but they are no longer invisible — each has a ticket an engineer can pick up the moment the AI bridge (`SAN-1124`) lands.

## Column legend

- **Design** — ✅ design artifact complete · 🟡 partial
- **Linear** — ✅ live issue · 🔴 none (needs filing)
- **Code** — ✅ merged · 🟡 PR open · ⬜ not started · — blocked (no ticket)
- **Test** — ✅ tests green · 🟡 partial · ⬜ none
- **Evidence** — ✅ localhost proof on file · ⬜ none
- **Status** — Done · In Progress · Ready · **Blocked: no ticket**

## Foundation + AI infrastructure (real Linear issues)

| Task Name | Design | Linear | Code | Test | Evidence | Status |
|---|---|---|---|---|---|---|
| `SAN-1095 · RE-DES-004 — Broker OS data layer + overview redirect` | ✅ | ✅ | ✅ | ✅ | ✅ | Done |
| `SAN-1093 · RE-DES-002 — Broker Concierge` (shell) | ✅ | ✅ | ✅ | 🟡 | ⬜ | Done (Linear) · needs localhost proof on file |
| `SAN-1109 · RE-WIRE-001 — /host/rentals route tree + gate` | ✅ | ✅ | ✅ | ✅ | ✅ | Done |
| `SAN-1092 · RE-DES-005 — Broker onboarding wizard UI` | ✅ | ✅ | ✅ | ✅ | ✅ | Done |
| `SAN-1094 · RE-DES-003 — Broker Listings + map` | ✅ | ✅ | 🟡 | 🟡 | ⬜ | In Progress (PR merged · verify Done gate) |
| `SAN-1111 · RE-WIRE-003 — Broker data hooks + Class U proof` | ✅ | ✅ | ⬜ | ⬜ | ⬜ | Ready (blocked by 1093/1095/1094) |
| `SAN-1124 · RE-AI-CK-001 — Broker CopilotKit v2 bridge` | ✅ | ✅ | ⬜ | ⬜ | ⬜ | Ready (blocked by 1093/1095) |
| `SAN-1035 · MASTRA-RE-015 — Broker ops agent` | ✅ | ✅ | ⬜ | ⬜ | ⬜ | Ready (blocked by 1124) |
| `SAN-1133 · RE-AI-073 — HITL write guard (listings + leads)` | ✅ | ✅ | ⬜ | ⬜ | ⬜ | Backlog |

## V3 workspace surfaces (now ticketed — `SAN-1211…1222`)

| Task Name | Design | Linear | Code | Test | Evidence | Status |
|---|---|---|---|---|---|---|
| `SAN-1211 · RE-DES-011 — Operator Today Home` | ✅ | ✅ | ⬜ | ⬜ | ⬜ | Backlog (blocked by SAN-1124) |
| `SAN-1212 · RE-DES-012 — Unified Inbox` | ✅ | ✅ | ⬜ | ⬜ | ⬜ | Backlog (blocked by SAN-1124) |
| `SAN-1213 · RE-DES-013 — Approval Queue` | ✅ | ✅ | ⬜ | ⬜ | ⬜ | Backlog (blocked by SAN-1124 + SAN-1133) |
| `SAN-1214 · RE-DES-014 — Owner Communications` | ✅ | ✅ | ⬜ | ⬜ | ⬜ | Backlog (owner-portal scope open) |
| `SAN-1215 · RE-DES-015 — Global Search & Command Bar` | ✅ | ✅ | ⬜ | ⬜ | ⬜ | Backlog (ready — no AI dep v1) |
| `SAN-1216 · RE-DES-016 — AI Activity Timeline` | ✅ | ✅ | ⬜ | ⬜ | ⬜ | Backlog (blocked by SAN-1124 + SAN-1035) |
| `SAN-1217 · RE-DES-017 — Universal Activity Feed` | ✅ | ✅ | ⬜ | ⬜ | ⬜ | Backlog (needs SAN-1111) |
| `SAN-1218 · RE-DES-018 — Notifications Center` | ✅ | ✅ | ⬜ | ⬜ | ⬜ | Backlog (ready) |
| `SAN-1219 · RE-DES-019 — Tasks & Follow-Ups` | ✅ | ✅ | ⬜ | ⬜ | ⬜ | Backlog (ready) |
| `SAN-1220 · RE-DES-020 — Lead Detail Workspace` | ✅ | ✅ | ⬜ | ⬜ | ⬜ | Backlog (blocked by SAN-1124 + SAN-1212) |
| `SAN-1221 · RE-DES-021 — Listing Workspace` | ✅ | ✅ | ⬜ | ⬜ | ⬜ | Backlog (blocked by SAN-1124) |
| `SAN-1222 · RE-DES-022 — Viewings Command Center` | ✅ | ✅ | ⬜ | ⬜ | ⬜ | Backlog (needs Maps; reconcile SAN-1206) |

## Roll-up

| Bucket | Count |
|---|---|
| Done | 4 (RE-DES-004, RE-DES-002, RE-WIRE-001, RE-DES-005) |
| In Progress | 1 (RE-DES-003) |
| Ready/blocked-by-deps (ticketed infra) | 4 (RE-WIRE-003, RE-AI-CK-001, MASTRA-RE-015, RE-AI-073) |
| Ticketed surfaces, not started | **12** (`SAN-1211…1222 · RE-DES-011…022`) |

**The headline change:** the 12 designed surfaces that had no Linear task now do. Design↔task drift is closed; the next gate is Code, not ticketing.
