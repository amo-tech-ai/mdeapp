---
id: MAP-017
title: Mock layout pin — dev-only / hide when live pins exist
status: Done
priority: P3
phase: MVP-hardening
effort: 30m
owner: claude
depends_on: [MAP-001, F49]
blocks: [SCREEN-010]
skill: [mde-maps, testing]
audit_ref: ../audit/27-maps-audit.md §6 P3 · audit/11-maps-audit.md
---

# MAP-017 — Mock pin lifecycle

## At a glance

**Problem:** `MapContextProvider` seeds `MOCK_LAYOUT_PIN` for layout smoke. **`ChatResultsColumn`** filters `source !== "mock"`, but **`ChatMap`** still renders the mock marker — confusing smokes ("Laureles — map ready" pin) and wrong empty-state signal for **SCREEN-010**.

**Goal:** Mock pin proves map boot in dev only; hide from map + treat as empty when any non-mock pin exists.

## Build scope

### Frontend
- **`ChatMap.tsx`** — filter renderable pins: exclude `source === "mock"` when `pins.some(p => p.source !== "mock")`.
- **`map-context.tsx`** — optional `seedMockPin` default stays `true` in dev; document in `map-config.ts`.
- **`ChatMap`** empty state copy when zero non-mock pins (optional one-liner; full copy → SCREEN-010).

### Do not
- Remove mock seed entirely (MAP-001 layout proof still needs dev boot path).
- Change merge/dedupe logic.

## Acceptance criteria

1. Fresh `/` load: mock pin visible on map **only** until first tool merge adds real pins.
2. After rental search: mock pin **not** in `map-pin` count; smokes pin labels exclude mock.
3. `npm run smoke:map-pins` — pin count matches cards (no extra mock).
4. Vitest: filter helper unit test.
5. `npm run floor` exit 0.

## Verification

- Evidence: `tasks/notes/MAP-017-evidence.md` — screenshot before/after first search.

## Definition of Done

§4 acceptance + evidence.
