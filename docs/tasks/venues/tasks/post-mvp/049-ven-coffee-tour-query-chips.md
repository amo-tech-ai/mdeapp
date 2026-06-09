---
id: VEN-049
title: Coffee tour intent chips on ChatQueryBar
status: Open
priority: P2
phase: CTI-B
effort: 2h
owner: claude
depends_on: [VEN-036]
blocks: []
skill: [copilotkit-develop, shadcn]
mcp: []
---

# VEN-049 — Tour intent chips

## In plain English

Add **quick-tap chips** above chat (“Social impact”, “Near Poblado”, “English tour”) that send a prefilled message and filters — so Tourists do not have to type perfect Spanish/English.

## User story

**As a Tourist,** I want one tap for *“authentic farm tour near Poblado”*, **so that** I get filtered results without writing a long prompt.

## Real-world example

Tap **Social impact** → message sent with `intent: social_impact` → `searchCoffeeTours` returns La Sierra first; tap **Sunset tour** → boosts Atardecer-style profiles.

## Goals

1. Chips on ChatQueryBar (or SCREEN-003 surface).
2. Each chip maps to `CoffeeTourSearchFilters` fields.
3. Next turn must call `searchCoffeeTours`.

## Chips (from roadmap)

| Chip | Injected intent |
|------|-----------------|
| Authentic farm | `intent: authentic_farm` |
| Social impact | La Sierra / social_impact |
| Beginner-friendly | beginner |
| Near Poblado | locationBias poblado |
| English tour | languages en |
| Sunset tour | atardecer |

## Wiring plan

| Layer | File | Action |
|-------|------|--------|
| Query bar | `mdeapp/src/components/chat/ChatQueryBar.tsx` (or equivalent) | Modify |

## Success criteria

1. Click chip → sends prefilled user message.
2. Next turn calls `searchCoffeeTours` with matching filter.
3. Vitest or Playwright: at least one chip changes ranked order vs default.

## Depends

SCREEN-003 if query bar lives there — adjust `depends_on` when wiring known.
