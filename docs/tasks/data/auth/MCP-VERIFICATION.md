---
title: Auth tasks — MCP + skill verification log
date: 2026-05-20
---

# MCP verification log

Used before writing AUTH-001…011 task specs.

## Supabase (`user-supabase` → `search_docs`)

| Query | Official href | Confirms |
|-------|---------------|----------|
| `Google OAuth signInWithOAuth Next.js` | https://supabase.com/docs/guides/auth/social-login/auth-google | `signInWithOAuth({ provider: 'google' })`, redirect via Supabase callback URL |
| `getUser server side Next.js SSR cookies` | https://supabase.com/docs/guides/auth/server-side/creating-a-client | `@supabase/ssr`, cookie `getAll`/`setAll`, server validation |

**Task alignment:** AUTH-001, AUTH-002, AUTH-004, AUTH-006.

## Mastra (`user-mastra` → `mastraDocs`)

| Path | Confirms |
|------|----------|
| `docs/server/auth/supabase` | `MastraAuthSupabase`, env `SUPABASE_URL` + `SUPABASE_ANON_KEY`, Bearer `access_token` for `MastraClient` |
| `reference/auth/supabase` | Constructor params; default `authorizeUser` checks `users.isAdmin` — **mdeai uses `profiles.role`** (custom fn if Option B) |

**Task alignment:** AUTH-010 defers in-process CopilotKit; Option B only for `:4111` server.

**Note:** `searchMastraDocs("Supabase authentication MastraAuthSupabase")` returned no embedded hits — remote `mastraDocs` paths used per mastra skill.

## CopilotKit (skills + repo)

| Source | Confirms |
|--------|----------|
| `copilotkit-integrations/references/integrations/mastra.md` | Pattern 1: `MastraAgent.getLocalAgents({ mastra })` on `/api/copilotkit`; Phase 1 v1 hooks only |
| `CopilotKit/examples/integrations/mastra` | **No** Supabase auth — mdeapp `getUser()` in route is required extension |
| `mdeapp/src/app/api/copilotkit/route.ts` | `getUser()` → `RequestContext` + `setAuditUserId` — matches recommended architecture |

**Task alignment:** AUTH-006, AUTH-009; do not add Pattern 2 or v2 `useAgent` for auth.

## Skills applied

| Skill | Rule used in tasks |
|-------|-------------------|
| `mde-supabase` | RLS, no service role in src, `(SELECT auth.uid())`, edge Bearer forward |
| `mastra` | Verify via mastraDocs, not memory |
| `copilotkit-integrations` | Pattern 1 only |
| `copilotkit-setup` | No duplicate runtime; relative `runtimeUrl` |
| `copilotkit-develop` | Phase 1: `useCoAgent`, not v2 auth APIs |
