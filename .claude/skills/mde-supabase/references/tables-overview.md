---
parent: mde-supabase
title: Database Tables Overview
description: mdeai.co table groups (core, bookings, trips, AI, system) and RLS audit query. Load for schema orientation before migrations or RLS work.
load_when: table list, schema overview, which tables exist, pgvector tables
---

<!-- moved from CLAUDE.md §Database on 2026-05-14 — keep this in sync with the live schema -->

# Database overview — mdeai.co

24+ tables in Supabase PostgreSQL with pgvector + PostGIS.

| Group | Tables |
|---|---|
| **Core** | `profiles`, `apartments`, `cars`, `restaurants`, `events`, `collections` |
| **Bookings** | `bookings`, `saved_places` |
| **Trips** | `trips`, `trip_items` |
| **AI** | `conversations`, `messages`, `agent_jobs`, `ai_context`, `ai_runs` |
| **System** | `notifications` |

For pgvector-specific tables and hybrid search RPCs, see [`mde-supabase/references/postgres/`](postgres/) and the [`pgvector`](../../pgvector/SKILL.md) skill.

For RLS coverage per table, run:
```sql
SELECT relname, relrowsecurity FROM pg_class WHERE relkind='r' AND relnamespace='public'::regnamespace;
```
Every public table must return `relrowsecurity = t`.
