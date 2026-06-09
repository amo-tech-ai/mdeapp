---
task_id: RE-004
title: Rental cards in chat (SCREEN-005)
layer: APP
priority: P0
phase: core
status: In Progress
persona: Camila
depends_on: [RE-003]
unblocks: [RE-005, RE-006]
skills: [copilotkit-develop, shadcn, mde-task-lifecycle]
screen_ids: [SCREEN-005]
wireframes:
  - ../wireframes/009-wire-rental-search.md
  - ../wireframes/009-scr-rental-card-polish.md
path: /
description: Finish SCREEN-005 Done gate — cards, CTAs, evidence, Playwright.
---

# RE-004 — Rental cards in chat

## Disk (partial)

✅ `rental-card.tsx`, `search-tool-renders.tsx`, `search-rentals` tool  
🟡 Save CTA disabled until TRIP-006  
🟡 SCREEN-005 evidence / Playwright incomplete

## Acceptance criteria

- [ ] ≥3 cards with photo, price, neighborhood from live search
- [ ] Schedule opens modal (RE-006)
- [ ] `data-testid="rental-card"`, `data-pin-id`
- [ ] SCREEN-005 Done gate + evidence file

## Related (intelligence — not Done)

Infra/cards/pins ✅ ([`01-rentals-prompt`](../../testing/prompts/01-rentals-prompt.md)). Monthly/date expertise ❌ → **[RE-017](RE-017-rental-parser-intelligence.md)**, **[RE-018](RE-018-gemini-rental-clarify-routing.md)**.

## Do not do

- Do not invent listings in render layer
