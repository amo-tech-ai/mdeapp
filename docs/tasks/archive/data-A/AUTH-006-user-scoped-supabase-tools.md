---
id: AUTH-006
title: User-scoped Supabase client for Mastra tools
status: Done
priority: P1
phase: Auth — Day 3–4
effort: 6h
owner: claude
depends_on: [AUTH-008]
blocks: [AUTH-009]
skill: [mde-supabase, mastra, copilotkit-integrations]
verified_against:
  - https://supabase.com/docs/guides/auth/jwts
  - https://supabase.com/docs/guides/database/postgres/row-level-security
  - mdeapp/src/app/api/copilotkit/route.ts (userId in RequestContext)
---

# AUTH-006 — User-scoped Supabase client (Mastra tools)

## Purpose

When **Camila** asks the concierge to update a trip, tool SQL must run as **`authenticated`** with her JWT so RLS enforces `auth.uid()` — not as `DATABASE_URL` superuser.

## Goals

- Add `mdeapp/src/lib/supabase/user-scoped.ts` using Supabase **`accessToken`** option (preferred over manual `Authorization` header per [JWT guide](https://supabase.com/docs/guides/auth/jwts)):
  ```ts
  return createClient(url, anonKey, {
    accessToken: async () => accessToken,
    auth: { autoRefreshToken: false, persistSession: false },
  });
  ```

- Document when to use: `trips`, `trip_items`, `saved_*`, `approval_requests` writes.
- Public catalog tools (`search-events` published rows) stay anon.

## CopilotKit / Mastra

- Pattern 1: identity still enters via `copilotkit/route.ts` `getUser()`.
- This task prepares client factory; AUTH-009 wires `access_token` into `RequestContext`.

## Definition of Done

- [ ] `user-scoped.ts` exists + unit test with mock JWT shape
- [ ] At least one tool or loader migrated as reference (e.g. trip read)
- [ ] No service role import in new file
- [ ] `npm run test` pass

## Tests

| # | Test | Expected |
|---|------|----------|
| T1 | Vitest: createUserScopedClient sets Authorization header | Pass |
| T2 | SQL as user A cannot read user B trip (integration, optional) | RLS blocks |
