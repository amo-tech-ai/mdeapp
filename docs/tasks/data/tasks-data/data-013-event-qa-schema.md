---
task_id: data-013
mvp_step: 13
title: event_qa schema — Ask Host Q&A + moderation
layer: DATA
priority: P1
status: Not Started
estimated_effort: 4h
depends_on: ["data-012"]
unblocks: []
blocks_evidence_for:
  - ../../events/tasks/EVP-034-mvp-ask-host-ai-qa.md
  - ../../events/tasks/EVP-045-mvp-host-pricing-moderation-basics.md
skills: [mde-task-lifecycle, mde-supabase, task-verifier]
related:
  - ../../events/docs/event-features-improvements-matrix.md
description: Create event_qa table with moderation lifecycle; AI drafts never public without host approval.
---

# DATA-013 — event_qa schema

## At a glance

| | |
|---|---|
| **For** | Andrés (asks) · Roberto (approves) |
| **Surface** | `/events/[slug]` · `/host/events` |
| **Layer** | DATA |

## What we're building

Persist guest questions and host-approved answers for **EVP-034** and spam moderation in **EVP-045**.

## Proposed schema (minimal)

```sql
CREATE TABLE public.event_qa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  asker_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  question_text text NOT NULL,
  ai_draft_answer text,
  host_answer text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','ai_draft','approved','rejected','hidden')),
  moderation_flags jsonb NOT NULL DEFAULT '{}',
  is_public boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  approved_at timestamptz,
  approved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_event_qa_event_status ON public.event_qa (event_id, status);
CREATE INDEX idx_event_qa_event_public ON public.event_qa (event_id) WHERE is_public = true;
```

## RLS (sketch)

- **SELECT public:** `is_public = true AND status = 'approved'`
- **SELECT organizer:** event `organizer_id = (SELECT auth.uid())`
- **INSERT authenticated:** own question on published events
- **UPDATE organizer/admin:** approve/reject only
- **service_role:** edge commit path if used

## Acceptance criteria

- [ ] Migration in `supabase/migrations/`
- [ ] RLS enabled + ≥4 policies; MCP advisor clean for this table
- [ ] `is_public = false` until `status = 'approved'`
- [ ] Evidence SQL proves anon cannot read pending rows
- [ ] EVP-034/045 reference this task as schema dependency

## Out of scope

- CopilotKit UI, Mastra prompts (EVP-034 app task)
