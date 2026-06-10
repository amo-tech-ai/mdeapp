---
id: AUTH-008
title: search-rentals — anon+RLS or read-only pool role
status: Done
priority: P2
phase: Auth — Day 4–5
effort: 4h
owner: claude
depends_on: [F08]
blocks: [AUTH-006]
skill: [mde-supabase, mastra]
verified_against:
  - tasks/data/plan/18-supabase-audit.md (DATABASE_URL bypass)
  - https://supabase.com/docs/guides/database/postgres/row-level-security
---

# AUTH-008 — `search-rentals` RLS-safe access

## Purpose

**Camila’s** rental search must not use a Postgres pool that bypasses RLS (`DATABASE_URL` as `postgres` role). Public apartment catalog should use **anon + SELECT policy** or a **read-only** DB role limited to `apartments` / `neighborhoods`.

## Goals (pick one — document choice in PR)

**Option A (preferred MVP):** Replace `pg` Pool with Supabase JS + `SUPABASE_ANON_KEY` (mirror `search-events`).

**Option B:** Keep pool but connect as DB user with `GRANT SELECT` only on public catalog tables (no BYPASSRLS).

## Workflows

1. Confirm RLS on `apartments` allows anon/authenticated SELECT for active listings (MCP `execute_sql` policies).
2. Refactor `search-rentals.ts` execute path.
3. Remove or narrow `DATABASE_URL` from `.env.example` comment if unused.

## Definition of Done

- [ ] No superuser/catalog bypass for user-specific filters (if added later)
- [ ] `npm run test` + manual chat “apartments in El Poblado” still returns cards
- [ ] Note in `tasks/notes/AUTH-008-evidence.md` which option shipped

## Tests

| # | Test | Expected |
|---|------|----------|
| T1 | Vitest rental search mock | Results shape unchanged |
| T2 | Advisors: no new RLS violations | MCP get_advisors clean |
