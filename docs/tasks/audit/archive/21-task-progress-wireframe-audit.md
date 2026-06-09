---
title: Task + Progress + Wireframe Forensic Audit
date: 2026-05-24
auditor: screen-first implementation review
sources:
  - tasks/INDEX.md
  - tasks/progres.md
  - screens/20-wireframe-to-build-roadmap.md
  - screens/wireframes/00-index.md
  - screens/diagrams/00-index.md
  - tasks/data/19-product-schema-roadmap-audit.md
  - mdeapp/src/
  - mdeapp/src/mastra/
architecture: Browser → CopilotKit → Mastra → gemini-3.5-flash → ADK :8000 → Supabase
---

# 21 — Task · Progress · Wireframe Audit

**Score: 86/100 🟡** — architecture and maps foundation are real; **task index and progress tracker are stale**; **visible screen work is under-tasked**.

**Canonical paths (moved 2026-05-24):**

| Was | Now |
|-----|-----|
| `tasks/roadmap/20-wireframe-to-build-roadmap.md` | [`screens/20-wireframe-to-build-roadmap.md`](../../screens/20-wireframe-to-build-roadmap.md) |
| `plan/screens/wireframes/` | [`screens/wireframes/`](../../screens/wireframes/00-index.md) |

---

## 1. Executive summary

### What is done (verified on disk + tests)

- **Foundation:** F01–F10, F12, F13, F13b, F18, F19 ✅
- **3-panel shell:** MAP-001, F48, **MAP-007B** (replaces MAP-007), ChatCanvas grid on `/` ✅
- **Generative UI:** F49 rental/place cards → pins ✅
- **Pin sync:** F50 MapUiState + `smoke:f50-pin-sync` ✅
- **Grounding:** MAP-002 + sidecar + attribution ✅
- **Map hardening:** MAP-008 mapId/markers ✅
- **Mastra runtime:** `routerAgent`, `conciergeAgent`, `rentalAgent`, `eventAgent`, workflows, tools ✅
- **Tests:** **91/91** Vitest (2026-05-24)

### What is not done (blocks visible product)

| Blocker | Impact |
|---------|--------|
| **Chat chrome stubs** | Nav rail + query bar = placeholder copy; no threads/chips/workflow strip |
| **No modals** | Schedule viewing, booking checkout, venue sheet |
| **No EventCard polish** | Events tool exists; no inline card matching wireframe 03 |
| **No commerce edges in mdeapp** | `ticket-checkout`, `chat-lead-capture` not ported |
| **Host wizard UI** | `/host/event/new` = auth gate only |
| **No `/events/:slug`, `/me/tickets`** | Andrés path missing |
| **Persistence UI** | `/saved`, `/trips` — no routes |

### What matters next (screen-first)

**Phase 1 visual shell only:** SCREEN-001–003, SCREEN-013, re-verify F50 smoke.

### What should be ignored (for now)

- `/explore`, `/contests`, `/nightlife`, `/creator`, notifications drawer
- F17, F14, F15 task specs (superseded by shipped agents — **revise/close**, don't rebuild)
- MAP-007 original (superseded by MAP-007B)
- Legacy `ai-chat`, `ai-router`, Vite `/home/sk/mde/` runtime

### What blocks visual progress

1. **No SCREEN-* tasks** in `tasks/INDEX.md` until this audit
2. **INDEX.md stale** — still lists F48/F49/F50 as Not Started
3. **progres.md stale** — MAP-007 at 0% while MAP-007B Done; suggests MAP-007 next
4. **F24/F46/F17 Not Started** while code exists — teams may duplicate work

---

## 2. Completed task verification

| Task | Claimed | Verified | Evidence | Verdict | Notes |
|------|---------|----------|----------|---------|-------|
| F48 | Done | ✅ built 🧪 | `chat-canvas.tsx`, `geo-chat-shell.tsx`, F48-evidence | **Keep** | 3-panel grid live |
| F49 | Done | ✅ built 🧪 | `search-tool-renders.tsx`, `smoke:map-pins` | **Keep** | Rental + place cards |
| F50 | Done | ✅ built 🧪 | `map-ui-sync.tsx`, `smoke:f50-pin-sync` | **Keep** | Re-run smoke each release |
| MAP-001 | Done | ✅ built 🧪 | `platform/maps/`, MapContext | **Keep** | |
| MAP-002 | Done | ✅ built 🧪 | `verify:grounding`, `smoke:grounding-attribution` | **Keep** | |
| MAP-007B | Done | ✅ built 🧪 | MAP-007B-evidence, center CopilotChat layout | **Keep** | Replaces MAP-007 |
| MAP-008 | Done | ✅ built 🧪 | MAP-008-evidence, `verify:maps` | **Keep** | |
| MAP-007 | Superseded | ⬜ closed | MAP-007B | **Close** | Do not execute |
| F18 | Done | ✅ built | `agents/router.ts`, tests | **Keep** | |
| F19 | Done | ✅ built | `concierge.ts`, restaurant/attraction tools | **Keep** | |
| F17 | Not Started | 🟡 **code shipped** | `rental-agent.ts`, `search-rentals.ts` | **Revise → Done** | Agent exists; update task |
| F14 | Not Started | 🟡 **code shipped** | `event-agent.ts` | **Revise → Done** | Port complete in mdeapp |
| F15 | Not Started | 🟡 **code shipped** | `search-events.ts`, `event-discovery-workflow` | **Revise → Done** | |
| F46 | Not Started | 🟡 **code shipped** | `rental-search-workflow.ts` | **Revise → Done** | UI strip still missing |
| F24 | Not Started | 🟡 partial | `rental-card.tsx` — no Schedule/Save | **Revise** | Merge into SCREEN-001 polish |
| F25 | Not Started | 🔴 missing UI | No `EventCard` component file | **Keep open** | → SCREEN + F25 |
| F33–F38 | Not Started | 🔴 | Host page placeholder | **Keep** | After Phase 1–2 |
| EVT-01 | Not Started | 🔴 | Edges in legacy only | **Keep** | Blocks G1 |
| MAP-004 | Not Started | 🔴 | No Places client in app | **Keep** | Post shell |

**progres.md accuracy:** **~55/100** — dates 2026-05-20; MAP-007 wrong; MAP-008 marked 0%; test count 82 vs 91.

**tasks/INDEX.md accuracy:** **~60/100** — "Current state" and MVP tables contradict task frontmatter and disk.

---

## 3. Overlap audit

| Overlap | Existing tasks | Wireframe | Problem | Consolidation |
|---------|----------------|-----------|---------|---------------|
| 3-panel layout | F48, MAP-007, **MAP-007B** | 01, 14 | MAP-007 superseded | **MAP-007B + F48** = shell; chrome = **SCREEN-001–003** |
| Rental cards | F49, F24 | 02 | F49 shipped minimal card; F24 duplicates | **F49 Done**; **F24 → SCREEN rental polish** |
| Event cards | F25, F15 | 03 | Backend done; UI missing | **F15 close**; **F25 + SCREEN EventCard** |
| Pin sync | F50, diagram 05 | 08 | Aligned | Keep F50 verify only |
| Rental workflow | F46, F17, WORKFLOW-001 | 02 | Agents/workflows exist | **Close F17/F46** backend; **SCREEN-002 strip** |
| Lead capture | F47, F12 | 06 | F12 edge verify done; modal missing | **F47 + SCREEN-006** |
| Host wizard | F33–F38 | 22 | No UI | Keep F33–F38; add **SCREEN-011** |
| Checkout | EVT-01, F11 | 06, 19 | Not ported | **EVT-01 + SCREEN-005** |
| Places/grounding | MAP-004, MAP-005 | 08 | MAP-002 done; cache not | MAP-004 after visual MVP |
| Rentals browse | F41 | 15 | Defer | After in-thread rental proves G2 |
| Saved/trips | *(none)* | 07, 17, 05 | No SCREEN tasks | **SCREEN-007–009**, Phase 4 |
| Mobile layout | MAP-007B partial | 14 | `MapMobileSheet` exists | **SCREEN-013** |

---

## 4. Missing task list

New IDs → [`tasks/screens/INDEX.md`](../screens/INDEX.md)

### SCREEN (visible UI)

| ID | Title | Wireframe | Priority |
|----|-------|-----------|----------|
| SCREEN-001 | Home Chat Chrome | 01, 14 | P0 |
| SCREEN-002 | Workflow Progress Strip | 14, 02 | P0 |
| SCREEN-003 | Chat Query Chips | 14 | P0 |
| SCREEN-004 | Venue Detail Sheet | 04 | P0 |
| SCREEN-005 | Booking Checkout Modal | 06 | P0 |
| SCREEN-006 | Schedule Viewing Modal | 06, 02 | P0 |
| SCREEN-007 | Saved Collections Page | 07 | P1 |
| SCREEN-008 | Trips Dashboard | 17 | P1 |
| SCREEN-009 | Itinerary Panel | 05, 18 | P1 |
| SCREEN-010 | My Tickets QR | 20 | P0 |
| SCREEN-011 | Host Event Wizard UI | 22 | P0 |
| SCREEN-012 | Event Detail Page | 19 | P0 |
| SCREEN-013 | Mobile 3-Panel Layout | 14 | P0 |
| SCREEN-014 | Loading/Error/Empty States | all | P1 |

### WORKFLOW (journey wiring)

| ID | Title | Diagram |
|----|-------|---------|
| WORKFLOW-001 | Rental Search Journey | 02 |
| WORKFLOW-002 | Event Discovery Journey | 03 |
| WORKFLOW-003 | Internal Booking Journey | 09 |
| WORKFLOW-004 | Save/Add-to-Trip Journey | 06 |
| WORKFLOW-005 | Host Publish HITL Journey | 08 |

---

## 5. Screen-first roadmap (summary)

Full table: [`22-screen-first-implementation-plan.md`](../roadmap/22-screen-first-implementation-plan.md)

| Order | Screen | Path | Why now | Missing |
|------:|--------|------|---------|---------|
| 1 | Home chrome | `/` | Visible Mindtrip parity | SCREEN-001–003 |
| 2 | Rental in-thread | `/` | Camila MVP | CTAs, SCREEN-004, 006 |
| 3 | Map panel | right | Trust | SCREEN-013 mobile |
| 4 | Event cards | `/` | Tourist | F25, SCREEN-012 |
| 5 | Checkout | modal | G1 | EVT-01, SCREEN-005 |
| 6 | Host wizard | `/host/event/new` | G1 alt | F33–F38, SCREEN-011 |
| 7+ | Saved/trips | `/saved`, `/trips` | Retention | SCREEN-007–009 |

---

## 6–11. Detailed plans

See [`22-screen-first-implementation-plan.md`](../roadmap/22-screen-first-implementation-plan.md) for:

- Frontend wiring (paths, CopilotKit, map sync, tests)
- Backend/Mastra wiring
- Supabase table matrix
- Automations
- Phases 1–6 implementation order
- Testing per phase

---

## 12. Folder organization recommendation

```text
tasks/
├── core/           # F01–F13b, F18–F19, F48–F50 (platform)
├── screens/        # SCREEN-001–014 ← NEW (visible UI)
├── workflows/      # WORKFLOW-001–005 ← NEW (journey specs)
├── maps/           # MAP-001–013 only
├── events/         # F33–F38, EVT-01, F25
├── real-estate/    # F41, F47, F24 polish
├── booking/        # EVT-01, F11 (optional split from events)
├── workspace/      # Phase 5 trips/saved (SCREEN-007–009)
├── automations/    # edge fn port checklist (future)
├── advanced/       # contests, nightlife, creator
├── audit/          # this file
└── roadmap/        # 22-screen-first-implementation-plan.md
```

---

## 13. Final scores

| Dimension | Score | Grade |
|-----------|------:|-------|
| Task clarity | 62 | 🟠 INDEX stale; overlaps; missing SCREEN IDs |
| Screen readiness | 58 | 🟠 Shell yes; chrome/modals/pages no |
| Backend readiness | 78 | 🟡 Agents/tools yes; host/booking edges no |
| Map readiness | 82 | 🟡 MAP-001/002/007B/008 yes; MAP-004/007 polish open |
| Supabase readiness | 76 | 🟡 Schema yes; edge port + RLS verify on saves |
| Implementation order | 88 | 🟢 Wireframes + diagrams + corrections doc |
| Risk level | 72 | 🟡 Medium — duplicate work if INDEX not fixed |

**Overall audit: 86/100 🟡 — safe to build Phase 1 screens; fix INDEX before assigning tasks.**

---

## Immediate actions

1. ~~Update [`tasks/progres.md`](../progres.md) — MAP-007B, 91 tests, screen-first path~~ ✅ 2026-05-24  
2. ~~Update [`tasks/INDEX.md`](../INDEX.md) — current state + SCREEN track~~ ✅ 2026-05-24  
3. Execute **Phase 1** from [`22-screen-first-implementation-plan.md`](../roadmap/22-screen-first-implementation-plan.md)  
4. Revise F17/F14/F15/F46 task status (code shipped) — do not delete files  
5. Use [`screens/20-roadmap-corrections-v1.md`](../../screens/20-roadmap-corrections-v1.md) for version gates  
6. **Sequencing deep-dive:** [`22-task-order-audit.md`](./22-task-order-audit.md) — authoritative P0–P3 order + doc fixes
