---
task: data-020
date: 2026-05-29
project: zkwcbyxiwklihegjhuql
status: Done
---

# DATA-020 — leads rental FK evidence

## Migration

Applied live: `data020_leads_rental_fk_columns`

## Columns added

- `leads.apartment_id` → FK `apartments(id)` ON DELETE SET NULL
- `leads.preferred_showing_at` timestamptz

## Indexes

- `idx_leads_apartment_id`
- `idx_leads_intent_apartment` (intent = rental)

## Backfill

| Metric | Value |
|--------|------:|
| Total leads | 11 |
| With `apartment_id` after backfill | 1 |

Only one lead had valid UUID in `metadata.listing_id`. Edge fn follow-up still needed for new captures.

## RLS

Existing `leads` policies unchanged (5 policies).

## Next

DATA-021 showings bridge · update `chat-lead-capture` to set columns directly.
