---
task_id: data-020
mvp_step: 20
title: leads rental FK — apartment_id + preferred_showing_at
layer: DATA
priority: P1
status: Done
verified: 2026-05-29
evidence: ../evidence/data-020-leads-rental-fk.md
estimated_effort: 3h
depends_on: ["data-019"]
blocks_evidence_for:
  - ../../real-estate/017-scr-schedule-viewing-modal.md
description: Add deterministic listing FK on leads; backfill from metadata; update chat-lead-capture to populate columns.
---

# DATA-020 — leads rental FK columns

## Gap

`chat-lead-capture` stores `listing_id` / `listing_title` in `leads.metadata` JSON only. **Andrés** landlord inbox and CRM filters need indexed `apartment_id`.

`landlord_inbox` already has `apartment_id` — leads should match.

## Proposed migration

```sql
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS apartment_id uuid REFERENCES public.apartments(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS preferred_showing_at timestamptz;

CREATE INDEX idx_leads_apartment_id ON public.leads (apartment_id) WHERE apartment_id IS NOT NULL;
CREATE INDEX idx_leads_intent_apartment ON public.leads (intent, apartment_id) WHERE intent = 'rental';

-- Backfill
UPDATE public.leads
SET apartment_id = (metadata->>'listing_id')::uuid
WHERE apartment_id IS NULL
  AND metadata->>'listing_id' ~ '^[0-9a-f-]{36}$';
```

## Edge fn follow-up (app track)

Update `supabase/functions/chat-lead-capture/index.ts` to set `apartment_id` + `preferred_showing_at` from schedule-viewing payload (not metadata-only).

## Acceptance criteria

- [x] Migration + RLS unchanged (5 existing policies on `leads`)
- [x] Backfill count in evidence (1/11 from `metadata.listing_id`)
- [ ] `017-scr-schedule-viewing-modal` G2 gate queryable by `apartment_id` — **app track**: update `chat-lead-capture`
- [x] No anon direct INSERT — edge only (mde-supabase rule)
