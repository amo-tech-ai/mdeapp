---
id: AIE-014-mvp
title: attendeeAgent on ticket wallet
status: Not Started
priority: P1
phase: mvp
persona: andres
linear: —
percent: 0
blocked_by: [AIE-008]
blocks: []
depends_on: []
wireframe: ../../wireframes/events/005-ticket-wallet.md
plan: ../../../plans/04-AI-native-system.md §4
---

# AIE-014-mvp — attendeeAgent

## Objective

Narrow specialist on `/me/tickets` — QR help, gate times, nearby café, event recs. **Not** a second discovery brain.

## Tools

`get_wallet_tickets` · `suggest_nearby_places` · `recommend_events` (reuse concierge where possible)

## Acceptance criteria

- Agent #6 of 8 max (MVP cap)
- Chat entry on wallet page
- Example: *"Coffee before Visionarios Night?"* → places card
- No overlap with hostOpsAgent tools
