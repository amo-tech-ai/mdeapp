---
id: AUTH-007
title: Remove service-role fallback in search-events (production)
status: Done
priority: P2
phase: Auth — Day 4
effort: 1h
owner: claude
depends_on: [F08]
skill: [mde-supabase, mastra]
verified_against:
  - tasks/data/plan/18-supabase-audit.md (anon read on events)
  - mdeapp/src/mastra/tools/search-events.ts
---

# AUTH-007 — `search-events` — no service role fallback

## Purpose

Prevent accidental RLS bypass if `SUPABASE_ANON_KEY` is missing in production — tool must use **anon key only** for public `events` reads.

## Goals

In `src/mastra/tools/search-events.ts`:

```ts
// Before: SUPABASE_ANON_KEY ?? SUPABASE_SERVICE_ROLE_KEY
// After:  SUPABASE_ANON_KEY only; if missing, return fallback empty (like today)
```

Production build: log error if anon missing; never read `SUPABASE_SERVICE_ROLE_KEY` in this file.

## Definition of Done

- [ ] `rg SERVICE_ROLE search-events.ts` → none
- [ ] `npm run test` pass
- [ ] Hook `no-service-role-in-src` still passes

## Tests

| # | Test | Expected |
|---|------|----------|
| T1 | Unit test searchEvents without env | `source: 'fallback'` |
| T2 | With anon key | returns published events |
