# Events UI specs — index

**Master audit:** [`../pages-ui-inventory.md`](../pages-ui-inventory.md)  
**Linear coverage:** [`LINEAR-COVERAGE.md`](./LINEAR-COVERAGE.md)  
**Template:** [`_SPEC-TEMPLATE.md`](./_SPEC-TEMPLATE.md)  
**Updated:** 2026-06-08

## Live pages (verified on disk)

| ID | Route | Spec | Linear | Status |
|----|-------|------|--------|--------|
| PAGE-001 | `/`, `/chat` | [PAGE-001](./pages/PAGE-001-home-chat-events.md) | SAN-236, SAN-117 | 🟢 |
| PAGE-002 | `/events` | [PAGE-002](./pages/PAGE-002-events-browse.md) | SAN-518 | 🟢 |
| PAGE-003 | `/events/[slug]` | [PAGE-003](./pages/PAGE-003-event-detail-commerce.md) | SAN-237 | 🟡 |
| PAGE-003b | Luma upgrade | [PAGE-003b](./pages/PAGE-003b-event-detail-luma.md) | SAN-135 | ⚪ spec |
| PAGE-004 | `/me/tickets` | [PAGE-004](./pages/PAGE-004-tickets-wallet.md) | SAN-259 | 🟢 |
| PAGE-005 | `/me/tickets/[id]` | [PAGE-005](./pages/PAGE-005-ticket-qr.md) | SAN-259 | 🟢 |
| PAGE-006 | `/host/event/new` | [PAGE-006](./pages/PAGE-006-host-wizard.md) | SAN-240, SAN-366 | 🟢 |
| PAGE-007 | `/host/events` | [PAGE-007](./pages/PAGE-007-host-events-list.md) | SAN-118, SAN-730 | 🟢 |
| PAGE-008 | `/login`, `/signup` | [PAGE-008](./pages/PAGE-008-auth-gates.md) | SAN-112 | 🟢 |

## Overlays

| ID | Surface | Spec |
|----|---------|------|
| OVL-001 | Event card | [OVL-001-event-card.md](./overlays/OVL-001-event-card.md) |
| OVL-002 | Checkout modal | [OVL-002-checkout-modal.md](./overlays/OVL-002-checkout-modal.md) |
| OVL-003 | HITL approval | [OVL-003-approval-panel.md](./overlays/OVL-003-approval-panel.md) |
| OVL-004 | Discovery save | [OVL-004-discovery-save-ui.md](./overlays/OVL-004-discovery-save-ui.md) |
| OVL-005 | Event detail sheet | [OVL-005-event-detail-sheet.md](./overlays/OVL-005-event-detail-sheet.md) |

## Missing pages (spec-only)

| ID | Route | Linear | Spec |
|----|-------|--------|------|
| PAGE-M01 | `/host` | SAN-660 | [PAGE-M01-host-marketing.md](./pages/missing/PAGE-M01-host-marketing.md) |
| PAGE-M02 | `/host/analytics` | SAN-729 | [PAGE-M02-host-analytics.md](./pages/missing/PAGE-M02-host-analytics.md) |
| PAGE-M03 | `/dashboard` (events tab) | SAN-690 | [PAGE-M03-dashboard-host-module.md](./pages/missing/PAGE-M03-dashboard-host-module.md) |
| PAGE-M04 | `/admin/events` | SAN-515 | [PAGE-M04-admin-events.md](./pages/missing/PAGE-M04-admin-events.md) |
| PAGE-M05 | `/admin/bookings` | SAN-502 | [PAGE-M05-admin-bookings.md](./pages/missing/PAGE-M05-admin-bookings.md) |
| PAGE-M06 | `/admin/leads` | SAN-516 | [PAGE-M06-admin-leads.md](./pages/missing/PAGE-M06-admin-leads.md) |
| PAGE-M07 | `/sponsors` | SAN-664 | [PAGE-M07-sponsors-landing.md](./pages/missing/PAGE-M07-sponsors-landing.md) |
| PAGE-M08 | `/business/event-marketing` | SAN-701 | [PAGE-M08-event-marketing.md](./pages/missing/PAGE-M08-event-marketing.md) |
| PAGE-M09 | Discovery approval queue | SAN-129 | [PAGE-M09-discovery-approval-queue.md](./pages/missing/PAGE-M09-discovery-approval-queue.md) |
| PAGE-M10 | Sponsor CRM-lite | SAN-132 | [PAGE-M10-sponsor-crm-lite.md](./pages/missing/PAGE-M10-sponsor-crm-lite.md) |

## Venue booking UI (SAN-494 → SAN-514)

| ID | Surface | Linear | Spec |
|----|---------|--------|------|
| VEN-001 | Restaurant Event Venue CTA | SAN-494 | [VEN-001-restaurant-venue-cta.md](./venue-booking/VEN-001-restaurant-venue-cta.md) |
| VEN-002 | Offerings panel | SAN-495 | [VEN-002-offerings-panel.md](./venue-booking/VEN-002-offerings-panel.md) |
| VEN-003 | Request proposal modal | SAN-496 | [VEN-003-proposal-modal-hitl.md](./venue-booking/VEN-003-proposal-modal-hitl.md) |
| VEN-004 | AI venue match panel | SAN-498 | [VEN-004-venue-match-panel.md](./venue-booking/VEN-004-venue-match-panel.md) |
| VEN-005 | Compare venues | SAN-499 | [VEN-005-compare-venues.md](./venue-booking/VEN-005-compare-venues.md) |
| VEN-006 | Host wizard venue step | SAN-500 | [VEN-006-wizard-venue-step.md](./venue-booking/VEN-006-wizard-venue-step.md) |
| VEN-007 | Admin booking queue | SAN-502 / SAN-514 | [VEN-007-admin-booking-queue.md](./venue-booking/VEN-007-admin-booking-queue.md) |
