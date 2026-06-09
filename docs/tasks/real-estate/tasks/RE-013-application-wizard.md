---
task_id: RE-013
title: Rental application wizard
layer: APP
priority: P2
phase: post-mvp
status: Not Started
persona: Camila, Andrés
depends_on: [RE-009]
unblocks: [RE-014]
skills: [copilotkit-develop, mastra]
description: 4-step wizard → rental_applications; AI form-fill with HITL.
---

# RE-013 — Application wizard

## Scope

- Route: `/rentals/[id]/apply` or modal wizard
- Writes `rental_applications` RLS-scoped
- CopilotKit form-filling pattern — user submits
- Landlord summary card (draft — Andrés approves)

## Acceptance criteria

- [ ] Application row created on submit
- [ ] Landlord can read applications for own listings
- [ ] Gemini does not auto-submit

## POST-MVP

- Document upload, lease PDF (ADVANCED)
