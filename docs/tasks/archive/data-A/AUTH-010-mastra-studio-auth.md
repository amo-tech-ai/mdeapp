---
id: AUTH-010
title: Lock Mastra :4111 or MastraAuthSupabase
status: Done
priority: P2
phase: Auth — Day 5
effort: 2h
owner: claude
depends_on: [F08]
skill: [mastra, mde-supabase]
verified_against:
  - Mastra MCP mastraDocs 2026-05-20 docs/server/auth/supabase
  - https://mastra.ai/docs/server/auth/supabase
  - https://mastra.ai/reference/auth/supabase
---

# AUTH-010 — Mastra Studio / :4111 auth

## Purpose

**Sofía’s** local Mastra Studio (`npm run dev` → `:4111`) must not be a public unauthenticated agent API if the port is tunneled or exposed on LAN.

## Goals (choose one)

**Option A — MVP (recommended):** Document in `mdeapp/docs/ARCHITECTURE.md`: bind Studio to localhost only; never expose `:4111` on Vercel. **Hard rule:** if `:4111` is reachable from a public URL or tunnel without `MastraAuthSupabase`, treat as a security incident.

**Option B — Production-like:** Install `@mastra/auth-supabase` and configure:

```ts
import { MastraAuthSupabase } from '@mastra/auth-supabase'

export const mastra = new Mastra({
  server: {
    auth: new MastraAuthSupabase({
      url: process.env.SUPABASE_URL,
      anonKey: process.env.SUPABASE_ANON_KEY,
    }),
  },
})
```

Per [Mastra Supabase auth](https://mastra.ai/docs/server/auth/supabase) — applies to **Mastra server**, not in-process CopilotKit.

**If Option B:** default `authorizeUser` checks `public.users.isAdmin` ([reference](https://mastra.ai/reference/auth/supabase)) — mdeai has **`profiles.role` only** (no `users` table). Pass custom `authorizeUser` querying `profiles`.

**Important:** mdeapp Phase 1 uses **Pattern 1** CopilotKit in-process — do not require Bearer token on `/api/copilotkit` for browser chat (cookies suffice).

**Do not clone** [mastra-auth-examples/supabase](https://github.com/mastra-ai/mastra-auth-examples/tree/main/examples/supabase) — that repo is a Next.js + Supabase starter, not `@mastra/auth-supabase` integration.

## Definition of Done

- [ ] Decision recorded in ARCHITECTURE.md
- [ ] If Option B: `curl :4111/api/agents` without Bearer → 401
- [ ] CopilotKit chat on :3001 still works without Bearer in dev

## Tests

| # | Test | Expected |
|---|------|----------|
| T1 | `npm run check:mastra` | Still passes |
| T2 | Dev chat POST /api/copilotkit | 200 with cookies only |
