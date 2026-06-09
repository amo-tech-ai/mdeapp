---
task: data-012
date: 2026-05-29
project: zkwcbyxiwklihegjhuql
status: Done
---

# DATA-012 — Events inventory evidence

## CORE verdict: ✅ No new tables for MVP commerce

| Table | Rows | Notes |
|-------|-----:|-------|
| `events` | 49 | Publishable stack live |
| `event_venues` | 7 | |
| `event_tickets` | 4 | |
| `event_orders` | 35 | Andrés paid path |
| `event_attendees` | 39 | |
| `event_check_ins` | 3 | |
| `event_embeddings` | 43 | |
| `event_sponsors` | 0 | Phase 2 |
| `approval_requests` | 0 | |

## Missing (post-MVP)

| Table | Task |
|-------|------|
| `event_qa` | DATA-013 |
| `event_live_updates` | DATA-014 |
| `event_attendee_social` | DATA-015 |
| Discovery pipeline tables | DATA-017 |

## Events AI columns (live)

- `events.ai_summary` exists
- Approval gate columns **missing** → DATA-016
