---
id: PAGE-M03
route: /dashboard
status: Spec-only
linear: SAN-690
persona: roberto
spec_ref: ../../../partners/06-dashboards.md
updated: 2026-06-08
---

# PAGE-M03 — Partner dashboard (events module)

## Purpose

Role-aware `/dashboard` with **Events** tab: list events, revenue, bookings, campaigns.

## Host module sections

Overview KPIs · My events (link /host/events) · Bookings calendar · Revenue · AI assistant pane.

## Components

shadcn `sidebar` + `tabs`; reuse `HostEventsGrid` in tab.

## Acceptance

- [ ] Tab visible when partner type includes host
- [ ] Deep link to /host/event/new
- [ ] Matches 06-dashboards.md module table
