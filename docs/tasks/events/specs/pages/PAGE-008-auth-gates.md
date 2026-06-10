---
id: PAGE-008
title: Auth gates for events flows
route: /login , /signup
status: Live
persona: roberto
updated: 2026-06-08
implementation:
  pages:
    - mdeapp/src/app/login/page.tsx
    - mdeapp/src/app/signup/page.tsx
---

# PAGE-008 — Login / signup (events context)

## Purpose

Gate host routes (`/host/*`) and optional buyer wallet.

## Events flows

| From | Redirect |
|------|----------|
| `/host/events` | `?next=/host/events` |
| `/host/event/new` | middleware protected |
| `/me/tickets` | buyer auth |

## Acceptance

- [x] Protected host prefix
- [x] Playwright auth redirect tests (016b)
