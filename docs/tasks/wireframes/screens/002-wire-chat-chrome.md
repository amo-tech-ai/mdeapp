---
type: wireframe
id: WIRE-014
number: "002"
title: Chat Chrome (nav, filters, workflow)
persona: Camila
path: /
priority: P0
build_status: Mixed
paired_scr_note: "Shared chrome wire — events are group 003 (003-wire-event-detail-page)"
screens:
  - 001-scr-home-chat-chrome.md
  - 002-scr-chat-nav-rail.md
  - 002-scr-chat-query-bar.md
  - 017-scr-workflow-progress-strip.md
  - 018-scr-mobile-responsive-shell.md
screen_ids:
  - SCREEN-001
  - SCREEN-002
  - SCREEN-003
  - SCREEN-004
  - SCREEN-018
skill:
  - mde-wireframe
---
# Wireframe: Chat Chrome (nav, filters, workflow)

**Source:** legacy `ChatLeftNav.tsx`, `ChatContextChips.tsx`, `ChatReasoningTrace.tsx`  
**Persona:** Camila · **Surface:** `/` chat shell — left rail + top filter bar + workflow strip  
**mdeapp targets:** `chat-nav-rail.tsx`, `chat-query-bar.tsx`, `WorkflowProgressStrip` (new)

## Left nav rail (desktop)

```text
┌ LEFT 260px ────────────────┐
│ [+ New chat]               │
│ ─────────────────────────  │
│ Chats                      │
│ 🔍 Search threads…         │
│ · Affordable Medellín hotels │
│ · Laureles 2BR             │
│ · Salsa this Friday        │
│ ─────────────────────────  │
│ Trips                      │
│ · Move to Laureles         │
│ ─────────────────────────  │
│ Saved (3)                  │
│ Bookings (1 pending)       │
│ ─────────────────────────  │
│ Explore · Events · Rentals │  ← deep links (not workspace tabs)
│ ─────────────────────────  │
│ [avatar] Settings          │
└────────────────────────────┘
```

**Mobile:** same content in `chat-nav-drawer.tsx` via hamburger.

## Context filter bar (sticky above chat)

Legacy `ChatContextChips` · Mindtrip filter bar (`05-three-panel-map.png`).

```text
┌──────────────────────────────────────────────────────────────────┐
│ Trip: "June Medellín" ▼  │ [Laureles ▼] [Jun 1–30 ▼] [2 guests ▼] [≤ $2.5M ▼] │
└──────────────────────────────────────────────────────────────────┘
```

Chip values flow into Mastra working memory + tool calls (not re-typed each turn).

## Workflow progress strip (during agent turn)

```text
┌─ Agent activity ─────────────────────────────────── [Skip] ─┐
│ ✓ Routing to rental agent                                    │
│ ● Searching Laureles — 2BR, balcony…                         │
│ ○ Ranking 8 listings                                         │
└──────────────────────────────────────────────────────────────┘
         ↓ complete
┌─ Thought for 12s ▼ ──────────────────────────────────────────┐
```

## Components

| Component | Legacy | mdeapp | Data |
|-----------|--------|--------|------|
| Thread list | `ChatLeftNav` | `ChatNavRail` | `mastra_threads` |
| Filter chips | `ChatContextChips` | `ChatQueryBar` | `useCoAgent<TripWorkspaceState>` |
| Progress | `ChatReasoningTrace` | `WorkflowProgressStrip` | Mastra step SSE |
| Anon gate | `EmailGateModal` | Phase 2 | 3-msg quota |

## States

| State | Nav | Query bar | Workflow |
|-------|-----|-----------|----------|
| New user | Empty threads | Placeholder chips | Hidden |
| Active search | Current thread highlighted | Chips filled | Steps animating |
| Complete | — | — | Collapse to "Thought for Ns" |

## Do not port

- `ChatTabs` (4 agent tabs) — routerAgent handles dispatch
- `FloatingChatWidget` — chat is `/`
