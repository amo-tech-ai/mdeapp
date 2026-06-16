---
task_id: AGT-PTR-07
linear: SAN-710
title: Concierge leads.partner_id attribution
parent: SAN-673
project: AI & Intelligence
phase: mvp
priority: P2
status: Backlog
depends_on: [SAN-683, SAN-706]
unblocks: [SAN-673, SAN-684]
skills: [mastra, mde-supabase, copilotkit]
audit: docs/partners/docs/07-ai-intelligence-partners-audit.md
---

# AGT-PTR-07 — Concierge `leads.partner_id` attribution

## Purpose

When Camila's concierge captures a lead from a partner listing, persist `leads.partner_id` so partner dashboards show demand.

**Persona:** Camila books a viewing → broker sees lead in `/dashboard` via `list_partner_leads`.

## Data flow

```mermaid
sequenceDiagram
  participant Camila as Camila
  participant Concierge as conciergeAgent
  participant Search as search_rentals
  participant Modal as schedule-viewing modal
  participant API as POST /api/leads/schedule-viewing
  participant Leads as public.leads
  participant Partner as partnerAgent tools

  Camila->>Concierge: book viewing for this apartment
  Concierge->>Search: rental card
  Search-->>Concierge: listing_id plus partner_id metadata
  Camila->>Modal: submit viewing request
  Modal->>API: body includes partner_id when present
  API->>Leads: INSERT with partner_id
  Partner->>Leads: list_partner_leads scoped RLS
```

## Listing to partner bridge

```mermaid
flowchart LR
  accTitle: Lead attribution bridge
  accDescr: Search tools must emit partner_id after partners table links supply.

  Apt["apartments row"] --> P["partners row"]
  P --> Card["rental card metadata"]
  Card --> Lead["leads.partner_id"]
```

Requires `partners.landlord_profile_id` or event `organizer_id` bridge (SAN-683 + vertical e2e).

## Acceptance criteria

- [ ] **`POST /api/leads/schedule-viewing`** — existing endpoint (`src/app/api/leads/schedule-viewing/route.ts`); add `partner_id` attribution here when listing context present (primary path to update)
- [ ] Rental/event/grounded search tools expose `partner_id` in tool result metadata when resolvable
- [ ] Concierge path only — no `partnerAgent` on `/chat`
- [ ] RLS: partner members see leads via ptr012 policies
- [ ] Vitest: capture with `listingPartnerId` → row has `partner_id`
- [ ] Organic query → `partner_id` null

## Files (expected touch)

- `mdeapp/src/app/api/leads/schedule-viewing/route.ts`
- `mdeapp/src/lib/leads/submit-schedule-viewing.ts`
- `mdeapp/src/mastra/tools/search-rentals.ts` (card metadata)
- `mdeapp/src/mastra/tools/search-events.ts` (organizer bridge)

## Verify

```bash
cd mdeapp && npm test -- --run src/lib/leads
npm run floor
```

## Coordination

Parent [SAN-673](https://linear.app/sanjiovani/issue/SAN-673). Ship after at least one partner type live (SAN-675 or SAN-677).
