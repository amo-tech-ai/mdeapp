---
id: OVL-004
title: Web discovery save UI
route: overlay in chat
status: Spec-only
linear: SAN-128
persona: patricia
depends_on: [EVP-025, EVP-026, SAN-129]
updated: 2026-06-08
implementation:
  partial: mdeapp/src/components/copilot/event-web-citation-fetch.tsx
  api: /api/grounding/event-web
---

# OVL-004 — Discovery citation + save approval

## Purpose

Show **cited** web-discovered events in chat; Patricia/host approves before DB insert.

## Persona example

Camila: *events on Eventbrite tonight* → cards with source links → **Save to catalog** → HITL queue.

## Layout

```text
Chat bubble
  └─ DiscoveryEventCard (citation badge, source URL)
       [Approve save] [Dismiss]
```

## Components (to build)

| Component | Role |
|-----------|------|
| `DiscoveryEventCard` | Cited card variant |
| `DiscoverySaveApprovalPanel` | HITL mirror OVL-003 |
| `EventWebCitationFetch` | **exists** — fetch only |

## Data

`discovered_events` staging table (EVP-020) — not migrated

## States

loading citation · empty · error · pending approval · saved

## Acceptance

- [ ] Citation visible on every web result
- [ ] No auto-publish
- [ ] HITL before insert
- [ ] Vitest + Playwright discovery pack

## Design

Badge: `text-xs` source domain; destructive if unverified source
