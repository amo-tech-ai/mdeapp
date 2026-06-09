---
id: AUTH-004
title: getUser() before edge token forward in API routes
status: Done
priority: P1
phase: Auth — Day 2
effort: 2h
owner: claude
depends_on: [F08]
skill: [mde-supabase]
verified_against:
  - https://supabase.com/docs/guides/auth/server-side/nextjs
  - Supabase MCP 2026-05-20 — prefer getUser() over getSession() for server validation
---

# AUTH-004 — Server routes use `getUser()` before JWT forward

## Purpose

Edge proxies and ticket routes must only forward **validated** user JWTs — Supabase recommends `auth.getUser()` on the server because it verifies the token with the Auth server ([SSR docs](https://supabase.com/docs/guides/auth/server-side/nextjs)).

## Goals

Audit and fix:

| File | Change |
|------|--------|
| `src/app/api/leads/schedule-viewing/route.ts` | `getUser()` first; **either** 401 if login required **or** document guest path (today forwards anon key when no session) |
| `src/app/api/approval-commit/route.ts` | `getUser()` + require user before forward |
| `src/app/api/tickets/checkout/route.ts` | `getUser()` where session required |
| Any other `getSession()`-only handlers | Same pattern |

Pattern:

```ts
const supabase = await createClient();
const { data: { user }, error } = await supabase.auth.getUser();
if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
const { data: { session } } = await supabase.auth.getSession();
// forward session.access_token
```

## Definition of Done

- [ ] Grep `getSession()` in `mdeapp/src/app/api` — each site documented or migrated
- [ ] Unauthenticated POST to `schedule-viewing` returns 401 (if product requires login)
- [ ] `npm run build` + `npm run test` pass

## Tests

| # | Test | Expected |
|---|------|----------|
| T1 | `rg "getSession" mdeapp/src/app/api` | Reviewed list in PR |
| T2 | POST schedule-viewing without cookies | 401 or anon-only path documented |
