---
id: AUTH-009
title: Optional — pass access_token in Mastra RequestContext
status: Ready
priority: P2
phase: Auth — Day 5
effort: 4h
owner: claude
depends_on: [AUTH-006]
skill: [mastra, copilotkit-integrations, mde-supabase]
verified_against:
  - mdeapp/src/app/api/copilotkit/route.ts
  - https://supabase.com/docs/guides/auth/jwts
---

# AUTH-009 — JWT in RequestContext for tools

## Purpose

Wire **Camila’s** Supabase `access_token` from the CopilotKit route into Mastra tools so AUTH-006 `createUserScopedClient` can run RLS-safe queries inside agent turns.

## Goals

1. In `copilotkit/route.ts` after `getUser()`:
   - `getSession()` → store `access_token` in `RequestContext` (custom key, e.g. `supabaseAccessToken`).
2. In `tool-audit-context.ts` (or sibling): getter for token.
3. One tool migrated end-to-end (e.g. load user trip by id).

## CopilotKit note

Upstream Mastra integration does not pass JWT — mdeapp extension only. Do **not** switch to Pattern 2 ([copilotkit-integrations/mastra.md](.claude/skills/copilotkit-integrations/references/integrations/mastra.md)).

## Definition of Done

- [ ] Signed-in chat turn → tool uses user-scoped client
- [ ] Anonymous chat → tools without user scope still work (catalog only)
- [ ] Token never logged to console
- [ ] `npm run test` pass

## Tests

| # | Test | Expected |
|---|------|----------|
| T1 | Unit: RequestContext carries token when session present | Pass |
| T2 | Manual: authenticated chat + trip tool | RLS-scoped row |
