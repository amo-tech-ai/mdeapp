---
task_id: RE-008
title: Landlord inbox MVP
layer: APP
priority: P1
phase: mvp
status: Not Started
persona: Andrés
depends_on: [RE-007, data-020]
unblocks: [RE-009]
skills: [copilotkit-develop, shadcn, mde-supabase]
description: Read-only inbox — landlord sees leads for own listings.
---

# RE-008 — Landlord inbox MVP

## Scope

- Route: `/host/leads` or `/landlord/inbox` (pick one — document in PRD)
- Query `leads` + `landlord_inbox` RLS-scoped to host
- Lead detail: contact, listing title, preferred time, status
- No WhatsApp send MVP

## Supabase

- Requires **data-020** `leads.apartment_id` for clean listing join
- Populate `landlord_inbox` on lead create (edge hook or trigger — spec in data-021)

## Acceptance criteria

- [ ] Andrés sees only own leads
- [ ] Camila cannot see Andrés leads (RLS test)
- [ ] Empty state when no leads

## POST-MVP

- Reply drafts, showing confirm actions
