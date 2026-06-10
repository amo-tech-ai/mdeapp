---
parent: mde-supabase
title: Supabase Patterns
description: Client usage, RLS mindset, schema habits for mdeai.co. Path-scoped rule symlinked from .claude/rules/supabase-patterns.md.
paths:
  - "src/**"
  - "src/integrations/supabase/**"
  - "supabase/**"
---

# Supabase Patterns

## Client Usage

- Import from `@/integrations/supabase/` — never create new clients
- Use `supabase.from()` for all queries — no raw SQL from frontend
- Always handle `.error` — Supabase returns `{ data, error }`, not exceptions

```tsx
const { data, error } = await supabase.from('apartments').select('*').limit(50);
if (error) throw new Error(error.message);
```

## RLS Policy Rules

- Every table has RLS enabled — no exceptions
- SELECT: public for listings, user-scoped for personal data
- INSERT/UPDATE/DELETE: always require `auth.uid()` match
- Use subquery pattern: `(select auth.uid())` not direct `auth.uid()`
- Admin writes use service role in edge functions only

## Schema Changes

- All changes via migration files in `supabase/migrations/`
- Never modify `auth.users` — extend via `profiles` table
- Foreign keys use `ON DELETE CASCADE` where parent owns children
- Add indexes on: foreign keys, filter columns, frequently sorted columns

## Query Patterns

- Default pagination: `.range(0, 49)` (50 items)
- Always `.select()` only needed columns for list views
- Use `.single()` for detail views
- Realtime via `useRealtimeChannel` hook — don't roll your own

## Security

- `VITE_SUPABASE_PUBLISHABLE_KEY` (anon key) — safe for frontend
- Service role key — edge functions only, never in VITE_ vars
- `.env` contains only public keys — secrets in Supabase dashboard
