---
task_id: RE-009
title: Showing bridge (leads → showings)
layer: DATA + APP
priority: P1
phase: mvp
status: Not Started
persona: Camila, Andrés
depends_on: [RE-006, data-021]
unblocks: [RE-013]
skills: [mde-supabase]
related:
  - ../../data/tasks-data/data-021-showings-lead-bridge.md
description: After schedule viewing, create showings row; optional trip_items mirror.
---

# RE-009 — Showing bridge

## Gap

`showings` table exists, **0 rows** — modal only writes `leads` with `metadata.listing_id`.

## Scope (data-021)

- Migration: `leads.apartment_id`, `preferred_showing_at` if not in RE-007
- Edge or API: on lead create → insert `showings` (pending)
- Link landlord_id from apartment host

## Acceptance criteria

- [ ] Schedule viewing creates lead **and** showing
- [ ] Andrés sees showing in inbox/calendar stub
- [ ] Optional: data-028 trip_items mirror if trip_id present

## Do not do

- Auto-confirm showing without landlord action (POST-MVP)
