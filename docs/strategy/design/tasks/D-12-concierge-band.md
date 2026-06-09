---
id: D-12
linear: SAN-578
phase: 3
status: Blocked
blocked_by: [D-09]
outputs:
  - Full-width AI concierge band on browse pages
---

# D-12 — Concierge surface (grounded AI band)

## Purpose

Reuse CopilotKit v1 chat patterns as full-width AI band on browse surfaces; grounded insight strips only.

## Acceptance criteria

- [ ] Band uses `useCoAgent` / existing concierge patterns — no v2 imports
- [ ] AI Insight strips **grounded** (saved places, time, neighborhood) — never fabricated stats
- [ ] Mobile: collapses to sticky composer + FAB (D-05 pattern)

## Wireframe / spec references

- [`../wireframe/explore-wireframe.html`](../wireframe/explore-wireframe.html) AI band
- [`../wireframes/03-chat-maps-workspace.md`](../wireframes/03-chat-maps-workspace.md)
- [`../wireframes/mobile/mob-chat-001-mobile-chat-composer.md`](../wireframes/mobile/mob-chat-001-mobile-chat-composer.md)

## Legacy / dedup

- Fold SAN-523 mobile concierge into responsive slice of D-14

## Proof

One browse route: band visible · one grounded insight · CK POST count <8 per query
