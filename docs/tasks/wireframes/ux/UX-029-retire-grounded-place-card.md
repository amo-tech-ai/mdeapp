---
id: UX-029
title: Retire orphaned GroundedPlaceCard and dead grounding UI
status: Not Started
priority: P2
phase: Card unification M4 cleanup
effort: 2-3h
owner: claude
depends_on: [UX-025]
blocks: []
risk: 🟢 Low
complexity: S
skill: [mde-task-lifecycle, testing]
related:
  - ../UX-010-unified-result-card-architecture.md
  - ../tests/22-card-audit.md
description: GroundedPlaceCard has zero production call-sites; GroundedCafeResults uses CafeResultCard. Delete orphan + tests or repurpose for POI compact variant — audit R-11.
---

# UX-029 — Retire GroundedPlaceCard (M4)

## Purpose

Reduce bundle noise and test maintenance for dead code.

## Files to remove or archive

- `grounded-place-card.tsx`
- `__tests__/grounded-place-card.test.tsx`
- `GroundingAttribution.tsx` if still unmounted (verify grep)
- Dead helpers in `parse-grounded-tool-result.ts` if only referenced by removed components

## Decision

**Default: delete.** Repurpose only if product wants compact POI card — then wire explicitly in `DomainResults`.

## Acceptance

- [ ] No orphaned imports.
- [ ] Cafe grounded path still uses `CafeResultCard`.
- [ ] `npm run floor` green.

## Flow diagram

```mermaid
flowchart TD
  GPC[GroundedPlaceCard orphan] --> Del[Delete file + tests]
  GCR[GroundedCafeResults] --> CRC[CafeResultCard ✅ production path]
```

## Verification (2026-05-31)

| Claim | Result |
|-------|--------|
| Orphan confirmed | ✅ no JSX importers except tests |
| Cafe path | ✅ CafeResultCard |
