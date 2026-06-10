# Mindtrip vs legacy mde vs mdeapp — three-panel layout audit

**Date:** 2026-05-22  
**Reference:** [Mindtrip chat](https://mindtrip.ai/chat/6462159) · `screenshots/01-mindtrip.png`  
**Legacy source:** `/home/sk/mde/src` (frozen — copy patterns, not runtime)  
**Target:** `/home/sk/mdeai/mdeapp` · task **MAP-001** / **MAP-007**

---

## Executive verdict

| Question | Answer |
|----------|--------|
| **Should we copy layout from legacy `/home/sk/mde`?** | **Yes — selectively.** Port **`ChatCanvas`** (nav · chat · map), **`MapContext`**, and **`MdeMap`** stack. Do **not** port custom `useChat` or edge-first chat. |
| **Does legacy match Mindtrip?** | **~85%** on `/chat`. Same 3-column mental model; Mindtrip adds top filter bar + richer listing cards in-thread. |
| **Does mdeapp use legacy chat?** | **No.** **`/`** = `CopilotKit` + `conciergeAgent` + `CopilotSidebar`. Do **not** port `useChat` or edge chat. |
| **Canonical plan?** | **MAP-001** (contracts) + **F48–F50** (CopilotKit wiring) + **`docs/CHAT-CENTRAL-PLAN.md`** |

**Bottom line:** Copy **layout shell + pin pipeline** from legacy; wire **center column** to **CopilotKit** (already on `/`); execute **MAP-001 → F48 → F49** before Roberto/Camila UI polish.

---

## Panel comparison (Mindtrip · legacy · mdeapp today)

| Panel | Mindtrip | Legacy `/home/sk/mde` | mdeapp today |
|-------|----------|----------------------|--------------|
| **Left** | Logo, Chats/Trips/Explore/Saved, New chat, profile | `ChatLeftNav` 280px — history, workspaces, saved links | CopilotKit sidebar only (no app nav rail) |
| **Center** | User msg, “Thought for Ns”, grouped listing cards, follow-up, input | `ChatMessageList` + embedded cards + chips + input | CopilotSidebar chat (works prod ✅) |
| **Right** | Google Map, numbered markers, weather, layer controls | `ChatMap` 420px persistent, `MapContext` pins | Placeholder text “MAP-001” |
| **Top bar** | Trip title dropdown, filters (Laureles, When, Budget), Create trip | Context chips in center column | Minimal header + auth |
| **Mobile** | (responsive collapse) | Map → bottom Sheet + “Map (N)” pill | Sidebar only |

### Legacy desktop grid (authoritative)

From `ChatCanvas.tsx` comment + implementation:

```text
┌─────────────┬──────────────────────────────┬─────────────┐
│ ChatLeftNav │ Conversation (flex-1)        │ ChatMap     │
│ 280px       │ messages + cards + input     │ 420px       │
└─────────────┴──────────────────────────────┴─────────────┘
```

Mindtrip screenshot aligns: narrow nav · wide chat/results · wide map.

---

## Two layout systems in legacy (do not merge blindly)

| System | Component | Used on | Right column |
|--------|-----------|---------|--------------|
| **Chat canvas** | `ChatCanvas` | `/chat` | **Live map always visible** (desktop) |
| **Browse 3-panel** | `ThreePanelLayout` | `/rentals`, `/explore`, `/apartments`, … | **Slide-in detail** (500px), not map |

**For Camila concierge (Mindtrip-like):** use **`ChatCanvas` pattern**, not `ThreePanelLayout`.

`/rentals` browse (wizard + grid + detail drawer) can reuse **`ThreePanelLayout`** later — separate from MAP-001.

---

## Legacy file inventory — copy vs skip

### Copy / adapt (high value)

| Legacy path | Purpose | mdeapp target |
|-------------|---------|---------------|
| `src/components/chat/ChatCanvas.tsx` | 3-column shell, responsive map sheet | `src/app/chat/chat-canvas.tsx` or `/` layout refactor |
| `src/components/chat/ChatLeftNav.tsx` | Left rail navigation | Port UI; wire to Supabase auth + thread list later |
| `src/components/chat/ChatMap.tsx` | Map panel + pin render | → `src/platform/maps/chat-map.tsx` |
| `src/context/MapContext.tsx` | Pin state, `mergePinsByCategory` | → `src/platform/maps/map-context.tsx` |
| `src/components/map/MdeMap.tsx` | Clustering, InfoWindow, fitBounds | → `src/platform/maps/mde-map.tsx` |
| `src/components/map/useFitBounds.ts` | Viewport + “search this area” | MAP-004 |
| `src/components/chat/embedded/*` | Inline rental/restaurant cards | → `useCopilotAction({ render })` generative UI |
| `docs/CHAT-CENTRAL-PLAN.md` | Product + envelope contract | Already in `mdeai/docs/` ✅ |

### Reference only (patterns)

| Legacy path | Notes |
|-------------|-------|
| `src/components/explore/ThreePanelLayout.tsx` | Browse pages — MAP-007+ for `/rentals` |
| `src/context/ThreePanelContext.tsx` | Detail drawer + URL `?detail=` sync |
| `src/pages/Apartments.tsx` | List \| map split (`?view=map`) |
| `src/pages/Concierge.tsx` | **Retired** — superseded by ChatCanvas |

### Do not port

| Legacy path | Why |
|-------------|-----|
| `useChat` + edge `ai-chat` | mdeapp = CopilotKit + Mastra Pattern 1 |
| `FloatingChatWidget` | Replaced by CopilotSidebar / canvas |
| `ExploreMapView.tsx` | CSS fake map placeholder |
| `ChatRightPanel.tsx` | Unused; map replaced suggestions column |

---

## Mindtrip features → mdeapp mapping

| Mindtrip UX | Legacy has? | mdeapp task |
|-------------|-------------|-------------|
| Listing cards in chat thread | ✅ embedded cards | F26 + CK generative UI |
| Map pins synced to results | ✅ MapContext → ChatMap | **MAP-001** |
| “Thought for Ns” reasoning | Partial (agent trace) | CopilotKit dev panel / optional UI |
| Section headers (“Best pick”) | Partial | Prompt + card component |
| Top filter chips (Laureles, Budget) | ✅ ChatContextChips | MAP-001 follow-up |
| Heart / add to trip on cards | ✅ saved flows | Phase 2 |
| Left nav: Trips, Saved counts | ✅ ChatLeftNav | Post-MVP |
| Create trip CTA | ❌ | Events vertical W9+ |

---

## mdeapp gap list (current `/`)

From `mdeapp/src/app/page.tsx`:

- [ ] Replace placeholder map column with `MdeMap` + `mapId`
- [ ] Add `MapProvider` / `MapContext`
- [ ] `useCopilotAction` render for search tool results → pins
- [ ] Left nav rail (or defer to Phase 2 — Mindtrip has it; MVP can start with sidebar-only)
- [ ] Dedicated `/chat` route vs `/` — PRD says `/chat`; today `/` hosts concierge (prod ✅)
- [ ] Mobile map Sheet (legacy pattern)

**Dependencies:** `@vis.gl/react-google-maps`, `NEXT_PUBLIC_GOOGLE_MAPS_*`, MAP contracts in `src/platform/contracts/`

---

## Recommended implementation order (MAP-001 + F48–F50)

```text
1. MAP-001 — platform/contracts + normalize + merge + MapContext + ChatMap (vis.gl)
2. F48     — CopilotKit 3-panel grid on / (CopilotSidebar center, map right)
3. F49     — useCopilotAction per search-* tool → cards → MapContext pins
4. F50     — MapUiState read-only + focusMapPin (optional before MAP-007)
5. MAP-007 — mobile sheet + pin↔card polish
6. Playwright: ≥3 pins after Laureles query (F39)
7. Optional: ChatLeftNav + top filter chips
```

**Do not block on:** full Mindtrip parity (trips, saved counts, reasoning accordion).

---

## Should `/` or `/chat` be the canvas?

| Option | Pros | Cons |
|--------|------|------|
| **`/` = canvas** (current) | Prod concierge live; matches CHAT-CENTRAL “mdeai.co/” | PRD mentions `/chat` |
| **`/chat` + redirect `/`** | Clean URL semantics | Extra route + redirect |

**Recommendation:** Implement 3-panel on **`/`** first (already prod), add **`/chat` → `/`** redirect (already exists). Update PRD wording to “home canvas” if needed.

---

## Copy checklist (when implementing)

- [ ] Read legacy `ChatCanvas.tsx` grid classes (`lg:grid-cols-[280px_1fr_420px]` or flex equivalent)
- [ ] Port `MapContext` types (`MapPin`, category colors)
- [ ] Ensure every `<AdvancedMarker>` parent `<Map mapId={...}>`
- [ ] Keep CopilotKit provider in `layout.tsx` — **do not** nest second runtime
- [ ] Phase 1 English only — no Spanish nav labels
- [ ] Verify on localhost:3000 + www.mdeai.co after deploy

---

## Related docs

| Doc | Path |
|-----|------|
| Chat-Central Plan | `docs/CHAT-CENTRAL-PLAN.md` |
| Maps PRD chunk | `plan/prd/04-maps-grounding.md` |
| Camila flow diagram | `plan/diagrams/03-camila-chat-flow.md` |
| Legacy 3-panel skill | `/home/sk/mde/.claude/skills/mdeai-three-panel.md` |
| Legacy checklist | `/home/sk/mde/docs-1/3-panel-checklist.md` |
| CopilotKit + Mastra audit | `plan/audit/09-copilotkit-mastra-local-audit.md` |
| MAP-001 blocker note | `plan/audit/08-copilotkit-mastra-plan.md` |

---

## Grade

| Area | Score | Notes |
|------|-------|-------|
| Legacy design completeness | **A-** | ChatCanvas is Mindtrip-aligned; documented in CHAT-CENTRAL |
| mdeapp layout readiness | **D** | Placeholder map; agent chat works |
| Copy feasibility | **A** | Clear port list; no CopilotKit conflict if center = sidebar |
| **Recommended action** | **Proceed MAP-001** using legacy ChatCanvas + MapContext as source |
