---
task_id: RE-012
title: Rental detail page (/rentals/[id])
layer: APP
priority: P2
phase: post-mvp
status: Not Started
persona: Camila
depends_on: [RE-011]
unblocks: []
skills: [shadcn, mde-maps]
path: /rentals/[id]
description: Slide-in / full detail — gallery, schedule, save, chat return.
---

# RE-012 — Rental detail page

## Scope

- SSR/ISR listing from `apartments` by slug or id
- Gallery, price, amenities, host snippet
- CTAs: Schedule viewing, Save, "Ask in chat"
- SEO metadata (POST-MVP)

## Acceptance criteria

- [ ] Valid slug loads; invalid → 404
- [ ] Only active listings public
- [ ] Schedule modal reuses RE-006 component
