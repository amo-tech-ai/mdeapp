---
id: PAGE-004
title: Ticket wallet
route: /me/tickets
status: Live
persona: andres
screen: SCREEN-015
updated: 2026-06-08
implementation:
  page: mdeapp/src/app/me/tickets/page.tsx
  list: mdeapp/src/components/tickets/my-tickets-list.tsx
playwright: mdeapp/e2e/screens/SCREEN-015-tickets.spec.ts
---

# PAGE-004 — My tickets wallet

## Purpose

List Andrés's purchased tickets — upcoming vs past.

## Data

`listBuyerOrders()` server-side

## States

Empty: no orders copy; Success: partitioned lists

## Mobile

`max-w-2xl` centered column

## Gaps

Auth required — redirect behavior verify in SCREEN-015

## Acceptance

- [x] Upcoming/past sections
- [x] Link to ticket detail
