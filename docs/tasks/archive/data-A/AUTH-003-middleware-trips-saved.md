---
id: AUTH-003
title: Middleware — protect /trips and /saved
status: Done
priority: P1
phase: Auth — Day 1
effort: 2h
owner: claude
depends_on: [F08]
skill: [mde-supabase]
verified_against:
  - https://supabase.com/docs/guides/auth/server-side/nextjs
  - mdeapp/src/lib/supabase/middleware.ts (existing /host pattern)
---

# AUTH-003 — Middleware protect `/trips` + `/saved`

## Purpose

**Camila’s** trip planner and saved listings are not reachable by URL guessing when logged out — same hard gate as **Roberto’s** `/host/**`.

## Goals

- Extend `PROTECTED_PREFIXES` in `src/lib/supabase/middleware.ts`:
  ```ts
  const PROTECTED_PREFIXES = ["/host", "/trips", "/saved"];
  ```
- Keep `E2E_BYPASS_AUTH=1` bypass for Playwright (document in runbook).
- Matcher unchanged — still excludes `api/copilotkit`.

## Workflows

1. Edit `PROTECTED_PREFIXES` only — match existing redirect to `/login?next=`.
2. Update any E2E that expects logged-out `/trips` 200 → expect redirect or use bypass.
3. `/chat` stays public (anonymous discovery).

## Definition of Done

- [ ] Logged out → `/trips` redirects to `/login?next=/trips`
- [ ] Logged out → `/saved` redirects to `/login?next=/saved`
- [ ] Logged in → pages load data (RLS)
- [ ] `E2E_BYPASS_AUTH=1` still skips guard for CI

## Tests

| # | Test | Command / action | Expected |
|---|------|------------------|----------|
| T1 | curl -I `/trips` no cookies | 302 → `/login` | |
| T2 | Authenticated Playwright | `/trips` 200 + cards | |
| T3 | `npm run test` | Pass after spec updates | |
