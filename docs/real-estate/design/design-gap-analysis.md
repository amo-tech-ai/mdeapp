# Real Estate Design Gap Analysis

> **RE-PLAN-001 — Real Estate Design → Implementation Audit** · Task 2 of 6 · 2026-06-19
> Companion to [`design-inventory.md`](design-inventory.md). Verified against Linear "Real Estate" (page 1 of more — treat absences as "not on the captured 100 issues").

## The answer first

**Camila's consumer rental journey is well covered; the operator/AI "moat" layer is almost entirely unticketed.** The consumer side (browse, search, listing detail) is built or ticketed. The advanced operator features that `16-advanced-designs.md` calls MDE's competitive wedge — Dynamic Pricing, Marketing Studio, Portfolio Analytics, Neighborhood Intelligence, Comparison Engine, Move-In/Out OS, Reviews — have **no Linear tasks at all**.

**What it means in the real world:** Camila can find and view apartments. But the host/broker operator tools that would make MDE more than a listings site — the AI pricing copilot, the marketing generator, the analytics roll-up — exist only as roadmap prose. If anyone says "the advanced designs are ticketed," that is not true.

**Next step:** decide which moat features are Phase-1-relevant vs post-MVP, then file the agreed ones as `RE-*` issues (proposals below).

## Already covered — consumer rental journey

| Capability | Source of Truth | Linear Task | State |
|---|---|---|---|
| Consumer `/rentals` browse shell | [`design/02-consumer-rentals-browse.md`](02-consumer-rentals-browse.md) | `SAN-1089 · RE-DES-001 — Consumer /rentals Mindtrip shell` | Backlog (design ready) |
| Rental search (cards in chat) | `RE-004` | `SAN-471 · RE-004 — Rental cards in chat` | **Done** |
| Listing detail page | `RE-DES-007` | `SAN-1202 · RE-DES-007 — Consumer rental detail page /rentals/[id]` | **Done** |
| Schedule viewing from detail | `RE-DES-008` | `SAN-1203 · RE-DES-008 — Schedule-viewing from rental detail` | Todo |
| Map pin ↔ card sync | `RE-005` | `SAN-472 · RE-005 — Map pin sync with rental cards` | In Progress |
| Saved / trips | `REAL-010` | `SAN-477 · REAL-010 — Saved + trips integration` | Backlog |
| Broker Concierge workspace shell | `RE-DES-002` | `SAN-1093 · RE-DES-002 — Broker Concierge` | **Done** |

## Missing — advanced operator / AI moat (no Linear task)

Each row is named in `16-advanced-designs.md` and/or the V3 spec but has **no corresponding Linear issue**. Proposed task IDs continue the live families.

| Missing capability | Design source | Proposed Linear Task | Suggested priority |
|---|---|---|---|
| **Dynamic Pricing Copilot** (the doc's top revenue lever) | `16-advanced-designs.md` RENT-008; V3 §04 pricing card | propose `RE-AI-080 — Dynamic pricing copilot (recommend + HITL apply)` | High (revenue) — but charts gated `data pending` until pricing data exists |
| **AI Marketing Studio** (campaign builder, content gen, calendar) | `16-advanced-designs.md` RENT-006 | propose `RE-AI-081 — Marketing studio (listing copy + campaign drafts)` | Medium |
| **Portfolio Analytics OS** (exec dashboard, forecast, market intel) | `16-advanced-designs.md` RENT-007 | propose `RE-AI-082 — Portfolio analytics roll-up` | Medium |
| **Neighborhood Intelligence** (area profiles, compare) | `16-advanced-designs.md` RENT-009 | propose `RE-AI-083 — Neighborhood intelligence (extends SAN-1040 · CKRE-008)` | Low |
| **Listing Comparison Engine** | `16-advanced-designs.md` RENT-011 | propose `RE-AI-084 — Listing comparison (extends SAN-1041 · CKRE-010)` | Low |
| **Move-In / Move-Out OS** | `16-advanced-designs.md` RENT-012 | propose `RE-OPS-001 — Move-in/out operations` | Post-MVP |
| **Reviews & Ratings system** | `16-advanced-designs.md` RENT-016 | propose `RE-OPS-002 — Reviews & ratings` | Post-MVP |
| **Renter ↔ host chat thread** | `16-advanced-designs.md` RENT-015 | propose folding into `RE-DES-013 — Unified Inbox` (don't double-build) | Medium |
| **Listing Health / Optimizer** | `16-advanced-designs.md` RENT-002; V3 RENT-029 tab | fold into proposed `RE-DES-022 — Listing Workspace` (Health tab) | Medium |
| **Lead Copilot / scoring** | `16-advanced-designs.md` RENT-003 | fold into proposed `RE-DES-021 — Lead Detail Workspace` + `SAN-1056 · RE-LEAD-001 — Lead lifecycle state machine` | Medium |

## Partial coverage — a related issue exists but does not cover the full design

| Capability | What exists | What's missing |
|---|---|---|
| AI Property Copilot (RENT-001/010) | `SAN-1124 · RE-AI-CK-001 — Broker CopilotKit v2 bridge` + `SAN-1164 · RE-AI-REF-000 — reference adaptation pack` | The bridge wires tool results; the full multi-context copilot UX is not specced as a task |
| Consumer Rental Concierge (RENT-010) | `SAN-739 · CK-006 — Generative rental card` + `SAN-750 · AGT-rentalAgent` | Card + agent only; not the full concierge surface |
| Broker/PM roll-up (RENT-013) | `SAN-1035 · MASTRA-RE-015 — Broker ops agent` | The agent exists as a task; the roll-up UI does not |
| Saved searches / alerts (RENT-014) | `SAN-477 · REAL-010 — Saved + trips integration` | "Saved apartments" only; no alerts/notification engine |

## Decision needed from the user

The 13 workspace surfaces (Task 1) are clearly Phase-1 (the operator OS). The **moat features above are a scoping call** — most read as post-MVP. Before filing ~10 new issues, confirm which moat features are in Phase 1 vs deferred, so we don't flood the backlog with work that isn't this cycle's.
