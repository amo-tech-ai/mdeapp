---
id: PAGE-M01
route: /host
status: Spec-only
linear: SAN-660
persona: roberto
wireframe: ../../../design/wireframe/host-wireframe.html
updated: 2026-06-08
---

# PAGE-M01 — Event host marketing landing

## Purpose

Acquire hosts: explain AI wizard, ticketing, Medellín audience. Funnel → `/partners/signup?type=host` or `/host/event/new`.

## Persona example

Roberto clicks Google ad → reads value prop → **Start hosting** → signup.

## Layout

Hero (Medellín night) · 3 benefits · social proof · CTA · FAQ · footer links.

## Components

Marketing shell: `MarketingHeader`, hero, feature grid, CTA band, `MarketingFooter`. shadcn: `card`, `button`, `accordion`.

## States

Standard marketing — no empty/error data

## Mobile

Stack sections; sticky CTA bar optional

## Acceptance

- [ ] Route `app/host/page.tsx`
- [ ] CTA to signup + login
- [ ] DESIGN.MD tokens only
- [ ] Lighthouse a11y ≥90
