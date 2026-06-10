---
task_id: data-015
mvp_step: 15
title: Attendee social visibility schema — audience breakdown
layer: DATA
priority: P2
status: Not Started
estimated_effort: 4h
depends_on: ["data-012"]
blocks_evidence_for:
  - ../../events/tasks/EVP-035-mvp-attendee-profiles-audience-breakdown.md
skills: [mde-task-lifecycle, mde-supabase, task-verifier]
description: Extend attendee social opt-in for Luma-style "going" + role categories; distinct from check-in event_attendee_profiles fields.
---

# DATA-015 — attendee social visibility schema

## At a glance

| | |
|---|---|
| **For** | Andrés · Tourist (aggregate view) |
| **Surface** | `/events/[slug]` · `/me/tickets` |
| **Layer** | DATA |

## Gap

`event_attendee_profiles` **exists** but holds check-in fields (dietary, accessibility, shirt size) — not EVP-035 social proof.

Prefer **new table** to avoid mixing PII check-in with public opt-in social:

```sql
CREATE TABLE public.event_attendee_social (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attendee_id uuid NOT NULL REFERENCES public.event_attendees(id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  is_visible boolean NOT NULL DEFAULT false,
  display_name text,
  avatar_url text,
  role_category text CHECK (role_category IN (
    'founder','investor','marketer','creator','engineer','student','other'
  )),
  interest_tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (attendee_id)
);

CREATE INDEX idx_event_attendee_social_event_visible
  ON public.event_attendee_social (event_id) WHERE is_visible = true;
```

Aggregate RPC/view for counts by `role_category` with **privacy threshold** (e.g. ≥5 per bucket).

## RLS

- **SELECT visible:** `is_visible = true` on published events
- **SELECT own:** attendee owner
- **SELECT organizer:** event organizer (aggregates only via RPC recommended)
- **INSERT/UPDATE:** ticket buyer for own attendee row

## Acceptance criteria

- [ ] Migration + RLS; anon sees only opted-in rows
- [ ] Aggregate function enforces min bucket size (EVP-035)
- [ ] Does not alter check-in `event_attendee_profiles` semantics
