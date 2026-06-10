---
id: AIE-002-core
title: Enable host navigation rail
status: Not Started
priority: P0
phase: core
persona: roberto
linear: SAN-730
percent: 0
blocked_by: []
blocks: [AIE-008]
depends_on: [EVP-014-core]
wireframe: ../../wireframes/events/008-host-dashboard.md
plan: ../../../plans/04-AI-native-system.md §15.1
---

# AIE-002-core — Enable host navigation rail

## Objective

Roberto can reach `/host/events`, `/host/event/new`, and future `/host/analytics` from visible nav — not buried links.

## Scope

- Re-enable host nav items disabled in layout/shell
- Links: Events list · Create event · Analytics (stub OK until AIE-008)
- Match 3-panel shell from wireframe 008

## Acceptance criteria

- Host nav visible when authenticated as organizer
- Vitest or Playwright: nav renders + routes resolve 200
- No duplicate CopilotKit provider mounts

## Files (expected)

`src/components/host/*`, `src/app/host/layout.tsx` or nav component
