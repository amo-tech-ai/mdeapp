---
id: VEN-048
title: CoffeeTourCompareDrawer + compareCoffeeTours
status: Open
priority: P2
phase: CTI-B
effort: 4h
owner: claude
depends_on: [VEN-038]
blocks: []
skill: [copilotkit-develop, copilotkit-agui, shadcn, testing]
mcp: [copilotkit]
---

# VEN-048 — Compare tours

## In plain English

Open a **side-by-side drawer** so Tourists compare 2–3 tours on score, duration, neighborhood, and “best for” — without asking the agent again.

## User story

**As a Tourist,** I want to compare La Sierra vs La Casa Grande in one view, **so that** I can decide which farm tour fits my group before booking.

## Real-world example

User taps **Compare** on two cards → drawer shows score breakdown (78 vs 71), “Social impact” vs “Family estate”, both with Map links — agent stays silent (read-only tool).

## Goals

1. Tool `compareCoffeeTours` with tour ids.
2. `CoffeeTourCompareDrawer` component.
3. Compare button on `CoffeeTourCard`.

## Success criteria

1. Vitest: drawer renders 2 tours.
2. Read-only tool — no DB writes.
3. Compare works for 2–3 tour IDs from card selection.
