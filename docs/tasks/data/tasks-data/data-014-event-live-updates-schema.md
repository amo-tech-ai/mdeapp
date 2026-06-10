---
task_id: data-014
mvp_step: 14
title: event_live_updates schema — host day-of feed
layer: DATA
priority: P2
status: Not Started
estimated_effort: 3h
depends_on: ["data-012"]
blocks_evidence_for:
  - ../../events/tasks/EVP-046-mvp-live-event-updates.md
skills: [mde-task-lifecycle, mde-supabase, task-verifier]
description: Host-controlled live updates with visibility tiers (public / registered / staff) for EVP-046.
---

# DATA-014 — event_live_updates schema

## At a glance

| | |
|---|---|
| **For** | Roberto · Andrés (registered) |
| **Surface** | `/events/[slug]` · `/me/tickets` |
| **Layer** | DATA |

## Proposed schema

```sql
CREATE TABLE public.event_live_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  author_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text,
  body text NOT NULL,
  visibility text NOT NULL DEFAULT 'registered'
    CHECK (visibility IN ('public','registered','staff')),
  ai_draft_body text,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','published','deleted')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_event_live_updates_event_published
  ON public.event_live_updates (event_id, published_at DESC)
  WHERE status = 'published';
```

## RLS highlights

- **public:** `visibility = 'public' AND status = 'published'`
- **registered:** buyer has paid `event_orders` for `event_id` OR visibility = public
- **staff:** organizer or staff JWT claim
- **INSERT/UPDATE:** organizer only; AI rewrite stays in `ai_draft_body` until publish

## Acceptance criteria

- [ ] Migration + RLS; registered-only rows invisible to anon
- [ ] Soft-delete via `status = 'deleted'` (no hard delete for audit)
- [ ] EVP-046 references this task
