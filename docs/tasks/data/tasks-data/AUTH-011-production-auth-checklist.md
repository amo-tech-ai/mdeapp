---
id: AUTH-011
title: Production auth checklist + evidence
status: Ready
priority: P0
phase: mvp
persona: sanjiovani
project: sofia-platform
milestone: P0
imp: "085"
linear: SAN-367
percent: 40
blocked_by: []
blocks: []
effort: 2h
owner: sanjiovani
depends_on: [AUTH-001, AUTH-003, AUTH-004, AUTH-007, AUTH-008]
skill: [mde-supabase, mde-vercel, copilotkit-integrations]
verified_against:
  - tasks/data/plan/21-auth-architecture-roadmap.md §17
  - https://supabase.com/docs/guides/auth
  - https://mastra.ai/docs/server/auth
---

# AUTH-011 — Production auth checklist

## Purpose

Gate production cutover: **Patricia** and **Sofía** sign off that auth, CopilotKit, and Supabase align before marketing login.

## Checklist (copy to evidence file)

### Supabase Dashboard

- [ ] Site URL = production domain
- [ ] Redirect URLs: prod + preview + `/auth/callback`
- [ ] Google provider enabled (if AUTH-001 shipped)
- [ ] Email magic link enabled
- [ ] No service role in client env on Vercel

### Vercel (mdeapp)

- [ ] `NEXT_PUBLIC_SITE_URL` = production
- [ ] `COPILOTKIT_API_KEY` set (Production)
- [ ] `E2E_BYPASS_AUTH` **unset** in Production
- [ ] `npm run build` clean on main

### Runtime smoke (production)

- [ ] `GET /login` 200
- [ ] Google or magic link sign-in completes
- [ ] `POST /api/copilotkit` without Bearer → **401** in production
- [ ] Signed-in chat → row in `ai_runs` with `user_id`
- [ ] `/trips` redirects when logged out

### Security

- [ ] `! grep -r SERVICE_ROLE mdeapp/src` (hook)
- [ ] Edge money fns: webhook secrets rotated per F11 plan
- [ ] Supabase MCP `get_advisors` — no new critical auth findings

## Deliverable

- `tasks/notes/AUTH-011-evidence.md` with dates, URLs, curl outputs (redact tokens)

## Definition of Done

- [ ] All boxes checked or explicitly N/A with reason
- [ ] Readiness score updated in plan/21 §21 (target ≥80 production auth)
