---
task_id: TRIP-006
title: Saved collections page (SCREEN-011)
layer: APP
priority: P1
phase: mvp
status: Not Started
estimated_effort: 5h
persona: Camila
depends_on: [TRIP-005]
unblocks: [TRIP-007]
skills: [copilotkit-develop, shadcn, mde-supabase, mde-task-lifecycle]
screen_ids: [SCREEN-011]
wireframes:
  - ../wireframes/014-wire-saved-collections.md
  - ../wireframes/014-scr-saved-collections-page.md
path: /saved
description: /saved route — collections grid + saved_places; RLS isolation.
---

# TRIP-006 — `/saved` collections page

## Current disk

❌ No `app/saved/page.tsx`  
✅ Tables `collections`, `saved_places` with RLS

## Build scope

### Frontend

- **Create** `app/saved/page.tsx`
- Collection list + detail view (or modal)
- Empty state per wireframe
- Nav link from chat chrome (SCREEN-002) when ready

### Supabase

- SELECT own `collections` WHERE `deleted_at IS NULL`
- JOIN/hydrate `saved_places` by `collection_id`
- Polymorphic cards: apartment, event, restaurant (read source tables)

### Mastra

- Defer `save_place` tool — page shell first

## Acceptance criteria

- [ ] `/saved` 200 authenticated
- [ ] User A cannot see User B saves (RLS test note)
- [ ] `data-testid="saved-page"`
- [ ] Empty state when no collections

## Do not do

- No `collection_items` table — use `saved_places.collection_id`
