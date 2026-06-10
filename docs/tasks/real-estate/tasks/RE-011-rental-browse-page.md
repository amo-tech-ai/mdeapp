---
task_id: RE-011
title: Rental browse page (/rentals)
layer: APP
priority: P2
phase: post-mvp
status: Not Started
persona: Camila
depends_on: [RE-005, MAP-001]
unblocks: [RE-012]
skills: [copilotkit-develop, mde-maps, shadcn]
wireframes:
  - ../wireframes/009-wire-rentals-browse.md
related:
  - ../tasks/F41-rentals-page-map.md
path: /rentals
description: F41 catalog page — POST-MVP; chat remains primary until CORE Done.
---

# RE-011 — `/rentals` browse page

## Gate

**Do not start** until RE-004–007 Done + product sign-off. Wireframe marked **Frozen**.

## Scope

- `app/rentals/page.tsx` — grid + filters
- Map split mode per wireframe
- Link to `/chat` for conversational search
- Reuse `search-rentals` data layer — not separate agent

## Acceptance criteria

- [ ] `/rentals` HTTP 200 with ≥1 card
- [ ] Map pins for visible listings
- [ ] Chat entry link works

## Do not do

- Duplicate rentalAgent — use workflow results
