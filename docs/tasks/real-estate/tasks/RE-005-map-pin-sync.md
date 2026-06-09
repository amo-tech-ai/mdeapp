---
task_id: RE-005
title: Map pin sync with rental cards
layer: MAPS
priority: P1
phase: core
status: Not Started
persona: Camila
depends_on: [RE-004, MAP-008]
unblocks: [RE-011]
skills: [mde-maps, copilotkit-develop]
description: Card hover/select ↔ AdvancedMarker; smoke:f50 proof.
---

# RE-005 — Map pin sync

## Scope

- Wire `RentalCard` selection → map highlight (geo-chat-shell / MapContext)
- Numbered pins for result set
- Parent `<Map mapId=...>` per mde-maps rules

## Acceptance criteria

- [ ] Card #N highlights pin #N
- [ ] Filter change replaces pin set
- [ ] `npm run smoke:f50-pin-sync` or equivalent passes
- [ ] No map without mapId

## Defer

- Clustering → RE-011 browse page
