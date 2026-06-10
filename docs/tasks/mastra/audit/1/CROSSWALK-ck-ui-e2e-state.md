---
title: Crosswalk — MASTRA ↔ CK ↔ STATE ↔ E2E aliases
updated: 2026-05-22
canonical_ids: tasks/copilotkit/BACKLOG-ck-gaps.md
plan: ../../plan/mastra/05-mastra-copilotkit.md
forensic_score: 92/100
---

# Crosswalk — production gap aliases → canonical tasks

> **Do not duplicate work under alias IDs.** This file maps audit alias names (CK-AGUI-*, PM-STATE-*, CK-FE-*, STATE-*, E2E-*) to **one canonical owner** each.

## Three-example canon (verified)

| Repo | Role | mdeapp action |
|------|------|---------------|
| [`integrations/mastra`](../../CopilotKit/examples/integrations/mastra/) | **Runtime foundation** — Pattern 1, sidebar, `useCoAgent` | **Copy runtime only** — F01/F02 ✅ |
| [`canvas/mastra`](../../CopilotKit/examples/canvas/mastra/) | **State + generative UI patterns** — Zod, cards, HITL | **Copy patterns only** — CK-002, [F50](../archive/copilot-A/F50-copilotkit-map-ui-state.md) |
| [`canvas/mastra-pm`](../../CopilotKit/examples/canvas/mastra-pm/) | **Structured workflow draft state** — wizard sections | **Copy patterns only** — [EVP-008/009](../archive/events-A/EVP-008-core-event-draft-state-types.md), EVP-010 |

**Never:** downgrade CopilotKit to canvas example pins (~1.10.x). **Never:** replace `integrations/mastra` runtime with canvas repo structure.

---

## MASTRA-001…005 scope boundary

| In scope (MASTRA) | Out of scope — see crosswalk |
|-------------------|------------------------------|
| Router/workflow/tool Vitest | AG-UI SSE contracts → CK-001, CK-007 |
| `routerAgent` on `/chat` | Typed `MapUiState` → CK-002, MAP-001 |
| PostgresStore | Thread hydration → CK-008 |
| `ai_runs` audit | Frontend tools → CK-003, CK-FE-* |
| `check:mastra` gate | Playwright E2E → CK-005, E2E-* |
| | Roberto draft state → F33–F36, PM-STATE-* |

---

## CK-AGUI-* → canonical

| Alias | Canonical | MVP? | Notes |
|-------|-----------|------|-------|
| CK-AGUI-001 typed AG-UI event schema | **CK-007** (+ doc in CK-001) | hard | Document expected event types per [ag-ui](https://docs.copilotkit.ai/mastra/ag-ui) |
| CK-AGUI-002 SSE lifecycle validator | **CK-007** | hard | Vitest/fixture or dev script |
| CK-AGUI-003 AG-UI replay logger | Phase 2+ | defer | After CK-008 / MASTRA-003 |
| CK-AGUI-004 disconnect/reconnect recovery | Phase 2+ | defer | Not Phase 1 DoD |
| CK-AGUI-005 stream timeout recovery | **CK-007** AC | hard | Error UI when stream ends early |

---

## PM-STATE-* → canonical (Roberto / mastra-pm)

| Alias | Canonical | Notes |
|-------|-----------|-------|
| PM-STATE-001 EventDraftState Zod | **F33** | `platform/contracts/event-draft.ts` |
| PM-STATE-002 Draft persistence | **F36** + **MASTRA-003** | In-thread WM until PostgresStore |
| PM-STATE-003 Agent-driven draft mutations | **F34** + **F36** `useCopilotAction` tools | `set_event_basics`, `set_venue`, etc. |
| PM-STATE-004 Partial workflow continuation | **F34** memory `scope: "thread"` | Not full resumable engine — Phase 2+ |
| PM-STATE-005 Wizard section sync | **EVP-010** + `canvas/mastra-pm` | mastra-pm multi-section pattern |

**mastra-pm importance:** Primary value is **agent-driven structured workflow state**, not kanban UI clone.

---

## CK-FE-* → canonical (frontend tools)

| Alias | Canonical | Persona |
|-------|-----------|---------|
| CK-FE-001 map focus tool | **CK-003** | Camila |
| CK-FE-002 modal open tool | **CK-003** + MAP-007 | Camila |
| CK-FE-003 route navigation tool | MAP-007 / F46 follow-on | Camila |
| CK-FE-004 host wizard step tool | **F36** frontend actions | Roberto |
| CK-FE-005 ticket checkout tool | **EVT-01** / Stripe W9 | Andrés |

---

## STATE-* → canonical (typed Zod architecture)

| Alias | Canonical | Schema location |
|-------|-----------|-----------------|
| STATE-001 MapUiState | **CK-002** + **MAP-001** | `maps-prd.md` §6.2 · `platform/contracts` |
| STATE-002 RentalSearchState | **F46** + **CK-002** slice | Workflow output + `selectedRentalId` in MapUiState |
| STATE-003 EventDraftState | **F33** | `event-draft.ts` |
| STATE-004 shared state validators | **CK-002** AC | Zod parse on agent + UI boundaries |
| STATE-005 serialization tests | **CK-002** + F33 Vitest | Round-trip Zod safeParse |
| STATE-006 hydration tests | **CK-008** | Post MASTRA-003 only |

---

## E2E-* → canonical (Playwright)

| Alias | Canonical | MVP? |
|-------|-----------|------|
| E2E-001 streaming lifecycle | **CK-001** + **CK-007** | hard (manual OK until Playwright W8) |
| E2E-002 pin↔card sync | **CK-005** | hard |
| E2E-003 interrupt/resume | **CK-004** + F37/F38 | hard |
| E2E-004 frontend tool execution | **CK-003** + **CK-005** partial | soft |
| E2E-005 thread restoration | **CK-008** | post-MVP |
| E2E-006 disconnect recovery | Phase 2+ | defer |

**Rule:** Vitest alone is **insufficient** for CopilotKit production DoD on `/chat` — CK-005 or documented manual equivalent required before Camila path is "production-ready."

---

## Execution order (full platform)

```text
MAP-001 → MASTRA-001 (parallel OK) → MASTRA-002
→ CK-001/CK-006/CK-007 (AG-UI proof)
→ F46 + CK-002 + CK-003 + CK-005 (Camila)
→ F33–F38 + CK-004 (Roberto)
→ MASTRA-004 → MASTRA-005 → MASTRA-003 + CK-008
```

---

## Forensic score (tasks layer)

| Area | Score |
|------|------:|
| MASTRA-001…005 spec quality | 90 |
| Example understanding (this crosswalk) | 95 |
| AG-UI / E2E explicit specs | 84 → **after CK backlog** |
| Typed state explicit specs | 86 → **F33 + CK-002** |
| **Overall task mapping** | **92/100** |

**Not 100% until:** CK-001…007 executed on disk + `/chat` exists + Playwright specs land.
