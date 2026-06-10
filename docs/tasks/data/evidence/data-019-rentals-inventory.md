---
task: data-019
date: 2026-05-29
project: zkwcbyxiwklihegjhuql
status: Done
---

# DATA-019 — Rentals inventory evidence

## CORE verdict: ✅ Search + leads work; column gaps remain

| Table | Rows |
|-------|-----:|
| `apartments` | 44 (44 active, all geo) |
| `listing_embeddings` | 44 |
| `neighborhoods` | 12 |
| `leads` | 11 |
| `showings` | 0 |
| `landlord_inbox` | 0 |
| `payments` | 3 |

## Column gaps (verified)

| Column | Table | Status |
|--------|-------|--------|
| `apartment_id` | `leads` | **Missing** → DATA-020 |
| `preferred_showing_at` | `leads` | **Missing** → DATA-020 |
| `trip_id` | `leads` | **Missing** → DATA-029 |
| `neighborhood_id` | `apartments` | **Missing** → DATA-022 (P2) |
| `price_daily` index | `apartments` | **Applied** DATA-009 M3 2026-05-29 |

## Backfill candidates

2 leads have `metadata.listing_id` for DATA-020 backfill.

## RLS

`leads` 5 policies · `showings` 5 policies · `apartments` 3 policies
