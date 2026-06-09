---
task_id: data-016
mvp_step: 16
title: events AI content approval columns — vibe tags + summary
layer: DATA
priority: P1
status: Not Started
estimated_effort: 2h
depends_on: ["data-012"]
blocks_evidence_for:
  - ../../events/tasks/EVP-033-mvp-event-vibe-ai-summary.md
skills: [mde-task-lifecycle, mde-supabase, task-verifier]
description: Add approval metadata on events so ai_summary and tags are draft until Roberto approves (EVP-033).
---

# DATA-016 — events AI content approval columns

## At a glance

| | |
|---|---|
| **For** | Roberto · Tourist (reads approved only) |
| **Surface** | `/events/[slug]` · event cards |
| **Layer** | DATA |

## Gap (live schema)

`events` already has `tags text[]` and `ai_summary text` — **missing approval gate columns**.

Public SELECT policies on published events would leak unapproved AI text without status fields.

## Proposed migration

```sql
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS ai_summary_status text NOT NULL DEFAULT 'none'
    CHECK (ai_summary_status IN ('none','draft','approved')),
  ADD COLUMN IF NOT EXISTS tags_status text NOT NULL DEFAULT 'none'
    CHECK (tags_status IN ('none','draft','approved')),
  ADD COLUMN IF NOT EXISTS ai_content_approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS ai_content_approved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;
```

Update **public SELECT** policy or view so anon/authenticated readers only see `ai_summary` when `ai_summary_status = 'approved'` (and same for tags), OR enforce in app + document RLS exception for organizer draft reads.

## Acceptance criteria

- [ ] Migration applied; backfill existing rows: if `ai_summary` IS NOT NULL → `draft` or `approved` per product rule
- [ ] RLS or documented app rule: unapproved AI content not public
- [ ] EVP-033 acceptance criteria trace to this schema
- [ ] Evidence: SELECT as anon on draft event hides AI fields

## Real-world example

Roberto's wizard generates vibe tags — stored as `tags` + `tags_status='draft'` until he clicks approve → `approved` and cards render tags.
