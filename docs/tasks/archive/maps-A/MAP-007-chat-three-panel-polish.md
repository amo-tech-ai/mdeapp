---
id: MAP-007
title: / concierge three-panel polish (layout + mobile sheet)
status: Superseded
superseded_by: MAP-007B
note: Path A sidebar-first polish replaced by MAP-007B center CopilotChat layout
priority: P0
phase: MVP — O4
effort: 3-4h
owner: claude
depends_on: [MAP-001, MAP-002, F48, F49, F50]
blocks: []
supersedes: F43
skill: [copilotkit-develop, mde-maps, shadcn]
index_ref: ../../../index.md · CopilotKit/examples/canvas/mastra · CopilotKit/examples/v1/travel (layout only)
draft_sources:
  - ../../../docs/CHAT-CENTRAL-PLAN.md
  - ../../../drafts/tasks/mastra/maps/tasks/runtime/006-chat-pipeline-playwright.md
verified_against:
  - /home/sk/mdeai/CopilotKit/examples/canvas/mastra/
  - /home/sk/mdeai/CopilotKit/examples/v1/travel/
---

# MAP-007 — `/` three-panel polish

## 0. Layout prerequisite — execute F48 first (ex-MAIC-002)

> **Not a MAP task.** CopilotKit layout ships in **[F48](../core/F48-copilotkit-map-canvas-layout.md)**. Do not implement “center-column CopilotKit chat” (Phase 2 / CK v2 only).

| Item | Spec |
|------|------|
| Pattern | `CopilotSidebar` = chat on **edge**; **`children`** = map + results canvas |
| Wrong pattern | Mindtrip center chat column — see [`audit/10-mindtrip-three-panel-layout-audit.md`](../audit/10-mindtrip-three-panel-layout-audit.md) |
| Files (F48) | `page.tsx`, optional `GeoChatLayout.tsx`, `MapDrawer.tsx` (mobile sheet) |
| Mobile | Map drawer/bottom sheet; `google.maps.event.trigger(map, 'resize')` on open |
| a11y | Focus trap in drawer; skip link to map |
| Depends on | **MAP-001** `ChatMap` exists |

**F48 Done** before MAP-007 polish. MAP-007 = responsive UX + pin↔card sync only.

## At a glance

**Description:** Polish the **`/`** concierge screen so chat, result cards, and the map feel production-ready on **desktop and mobile** — especially pin↔card highlighting.

**Purpose:** MAP-001/F48/F49 make pins exist; this task makes the experience feel shippable: **Camila** on a phone can open the map sheet without losing the chat input; **Tourist** can read cards without horizontal scroll.

**Goals:**
- Desktop (~1280px): chat sidebar + results column + map column.
- Mobile (~390px): bottom sheet for map; chat input always reachable.
- Click card ↔ highlight pin (needs **F50** + `MapContext`).
- Loading skeletons, English-only copy, required Playwright screenshots.

**Features:**
| Who | What they get |
|-----|----------------|
| **Camila** | Swipe-up map on mobile; tap pin scrolls the matching card. |
| **Tourist** | Readable restaurant cards beside the map. |
| **Lucía** | Playwright smoke at 390×844 with zero map console errors. |

> **Renamed from F43** (2026-05-21). **MAP-001** ships contracts + vis.gl; **F48** ships CopilotKit grid on `/`; **F49** ships generative cards + pins; **MAP-002** ships grounded cards; this task is responsive UX polish only.  
> **Map stack stays vis.gl** — borrow progress/step copy from `v1/travel` only; **do not** port OSM or non-Google map from travel example.

## 1. Purpose

**Camila** and **Tourist** get production-quality **`/`** concierge: desktop three columns (nav stub · CopilotSidebar chat · map), mobile bottom sheet for map, pin↔card highlight sync (**F50**), empty states — without changing agent wiring from F19.

## 2. Goals

- Desktop **1280px+:** ~40% chat (CopilotSidebar), ~35% results/cards, ~25% map (adjust per `CHAT-CENTRAL-PLAN`)
- Mobile **390×844:** cards primary; map in **bottom sheet** (drag handle, does not cover input)
- `selectedPinId` ↔ card `data-pin-id` bidirectional highlight
- Grounded + rental + event cards use MAP-002 `GroundingAttribution` where required
- Loading skeletons for map panel while `APIProvider` initializes
- `tasks/notes/MAP-007-evidence.md` — screenshot desktop + mobile, `npm run floor` green

## 3. Features (personas)

| Persona | Success |
|---------|---------|
| **Camila** | Swipes up map sheet on phone; tap pin scrolls card into view. |
| **Tourist** | Restaurant suggestions readable without horizontal scroll. |
| **Lucía** | Playwright viewport 390×844 — three regions exist; no console errors. |

## 4. Workflows

1. Read [`docs/CHAT-CENTRAL-PLAN.md`](../../../docs/CHAT-CENTRAL-PLAN.md) + `CopilotKit/examples/canvas/mastra/` layout patterns.
2. Refine `mdeapp/src/app/page.tsx` / `chat-canvas.tsx` grid + `md:` breakpoints (Tailwind v4).
3. Extract `ChatResultsColumn`, `ChatMapPanel` if MAP-001 monolith is large — match existing file style.
4. Wire `selectedPinId` from `MapContext` to card list `onClick` / scroll-into-view.
5. Mobile sheet: shadcn `Sheet` or custom drawer — map `mapId` still required inside sheet.
6. **Required** Playwright: desktop 1280px three regions; mobile 390×844 sheet; card click ↔ pin highlight (F50 + MapContext).
7. localhost proof: `curl -s -o /dev/null -w "%{http_code}" http://localhost:<port>/` → 200 (actual dev port).

## 5. Acceptance criteria

1. Three distinct regions in DOM at 1280px width.
2. Map sheet usable at 390px; chat input not obscured.
3. Click card → map centers/highlights pin; click pin → card highlights.
4. No Spanish UI strings (Phase 1 English).
5. CopilotKit **1.55.2** imports only.
6. `npm run floor` exit 0.
7. Evidence screenshots in `tasks/notes/MAP-007-evidence.md`.

## 6. Verification checklist (100% Done gate)

> [`VERIFICATION-CHECKLIST.md`](./VERIFICATION-CHECKLIST.md) · Evidence: [`MAP-007-evidence.md`](../notes/MAP-007-evidence.md).  
> Depends on **F50** for pin↔card sync.

### Shared gates

- [ ] G1–G8 complete

### Layout (manual + screenshot)

- [ ] Desktop 1280px: three regions visible (chat sidebar · results · map)
- [ ] Mobile 390×844: bottom sheet opens; Copilot input not covered
- [ ] No horizontal overflow on results column
- [ ] `rg "lang=\"es\"|Buscar apartamento" mdeapp/src/app` → 0 (Phase 1 English)

### Playwright (**required**)

- [ ] `e2e/maps-layout-desktop.spec.ts` (or equivalent) — three regions at 1280px
- [ ] `e2e/maps-layout-mobile.spec.ts` — sheet + input visible at 390×844
- [ ] Card click → `selectedPinId` updates (F50 + MapContext)
- [ ] Pin click → matching `data-pin-id` card highlighted / scrolled

### Console

- [ ] chrome-devtools / Playwright: zero map + CopilotKit errors on `/`

### Cross-task

- [ ] VERIFICATION-CHECKLIST X3 pin↔card passes with F49 pins present

## 7. Rollback

Revert layout CSS/components; MAP-001 minimal shell remains functional.

## 8. Out of scope

- `routerAgent` / F18 routing logic
- New Mastra tools
- OSM map from `v1/travel`
- Clustering (MAP-009)

## 9. Definition of Done

§5 acceptance + **§6 verification checklist** + desktop/mobile screenshots in evidence. Commit: `feat(chat): three-panel layout polish (MAP-007)`.
