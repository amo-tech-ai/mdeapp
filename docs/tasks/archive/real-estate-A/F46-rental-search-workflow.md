---
id: F46
title: rental-search workflow on router (MVP — not full F17 port)
status: Done
completed: 2026-05-24
evidence: ../notes/F46-evidence.md
shipped_note: Backend + F49 UI shipped — lead modal (F47) and strip (SCREEN-004) remain
priority: P0
phase: MVP — O3 Camila
effort: 3-4h
depends_on: [MAP-001, F18]
blocks: [F41, F47]
skill: [mastra, mde-real-estate, copilotkit-integrations]
prd_ref: plan/prd/06-rentals-leads.md
index_ref: index.md §7 PR-5
verified_against:
  - /home/sk/mdeai/CopilotKit/examples/v1/chat-with-your-data/
  - /home/sk/mdeai/CopilotKit/examples/showcases/generative-ui/
  - /home/sk/mdeai/plan/diagrams/03-camila-chat-flow.md
---

# F46 — Thin rental-search workflow (replaces F17 for MVP)

## 1. Purpose

MVP O3: Camila gets ≤5 rental cards + map pins + lead — **without** porting full `rentalAgent` from Path A (F17). Per v7: **`routerAgent` → `rental-search` workflow** + `search_rentals` tool with **keyword/filters** on 25 curated listings (not pgvector).

## 2. Goals

- `rental-search` Mastra workflow registered
- `search_rentals` tool → Supabase read → `ToolResponse` with cards + pins
- `useCopilotAction({ render })` → `RentalCard` (F24)
- ≤5 results enforced in Zod
- Works from `/chat` after MAP-001
- **`RentalSearchState` slice** (alias STATE-002): document `resultIds`, `selectedRentalId` in `MapUiState` / platform contracts — validated in **CK-002**

## 3. Explicitly not doing (defer F17)

- Full `rentalAgent` port from my-mastra-app
- pgvector / `listing_embeddings` semantic search
- Hermes rerank

## 4. Pattern sources

| Source | Use |
|--------|-----|
| `v1/chat-with-your-data` | Chat + data cards |
| `showcases/generative-ui` | Card render |
| F24 RentalCard | UI |

## 5. Acceptance criteria

1. Chat query returns ≤5 cards.
2. Map shows equal pin count.
3. Tool output validates against `platform/contracts`.
4. `npm run floor` green.
