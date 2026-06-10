---
id: PAGE-005
title: Ticket QR detail
route: /me/tickets/[id]
status: Live
persona: andres
screen: SCREEN-015
updated: 2026-06-08
implementation:
  page: mdeapp/src/app/me/tickets/[id]/page.tsx
  view: mdeapp/src/components/tickets/ticket-detail-view.tsx
---

# PAGE-005 — Ticket QR

## Purpose

Single ticket with QR for door scan; optional `?token=` wallet access.

## Persona example

Andrés shows QR on phone at venue entrance.

## Accessibility

QR with text fallback order id; sufficient contrast on QR container

## Acceptance

- [x] Renders TicketDetailView
- [ ] Prod scan proof (ops)
