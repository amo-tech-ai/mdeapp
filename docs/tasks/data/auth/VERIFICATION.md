---
title: AUTH-001…011 forensic verification
verifier: task-verifier
date: 2026-05-20
verdict: "Specs are executable (Grade B) — not 100%; 4 patches applied"
---

# Auth tasks verification report

## Verdict summary

| Metric | Score | Grade |
|--------|------:|-------|
| **Spec quality (pack)** | **82/100** | B |
| **Execution readiness** | **78/100** | B |
| **100% correct?** | **No** | 4 issues fixed in specs; 5 remain as 🟡 watch-items |

**Safe to execute?** Yes — start **AUTH-002 → AUTH-001 → AUTH-003**. Do not treat specs as Done; none are implemented on disk yet.

---

## Phase 1 — Source of truth

| Source | Wins on |
|--------|---------|
| `CLAUDE.md` | No service role in `src/**`, CopilotKit 1.55.2, Pattern 1 Mastra |
| `F08` (Done) | Magic link, `@supabase/ssr`, `/auth/callback` + `exchangeCodeForSession` |
| `plan/21` | Architecture intent (Supabase SSO, in-process CopilotKit) |
| **Official docs** | OAuth/JWT/Mastra auth API shapes |

**Conflict resolved:** F08 deferred Google OAuth to Phase 2 note; AUTH-001 correctly adds it now — not a regression, explicit extension.

---

## Phase 2 — Disk probes (2026-05-20)

| Claim | Probe | Result |
|-------|-------|--------|
| F08 Done | `ls mdeapp/src/lib/supabase/{client,server,middleware}.ts` | ✅ |
| Callback PKCE | `mdeapp/src/app/auth/callback/route.ts` → `exchangeCodeForSession` | ✅ matches [sessions PKCE](https://supabase.com/docs/guides/auth/sessions) |
| CopilotKit identity | `copilotkit/route.ts` → `getUser()` + `RequestContext` | ✅ |
| Google OAuth in app | `rg signInWithOAuth mdeapp/src` | ❌ not implemented (expected Ready) |
| `@mastra/auth-supabase` | `rg auth-supabase mdeapp/package.json` | ❌ not installed (AUTH-010 Option B only) |
| `public.users` table | Supabase MCP `execute_sql` | ❌ **no `users` table** — only `profiles` |
| `profiles` auth column | MCP columns | ✅ `role` (not `isAdmin`) |

---

## Phase 3 — Official docs / MCP

### Supabase ([Auth](https://supabase.com/docs/guides/auth))

| Doc | Task alignment |
|-----|----------------|
| [Architecture](https://supabase.com/docs/guides/auth/architecture) | Client → Auth service → JWT → RLS — matches task pack |
| [Next.js quickstart](https://supabase.com/docs/guides/auth/quickstarts/nextjs) | `@supabase/ssr` + cookies — F08 Done |
| [Users](https://supabase.com/docs/guides/auth/users) | `getUser()` for server validation — AUTH-004 ✅ |
| [Sessions](https://supabase.com/docs/guides/auth/sessions) | PKCE + refresh via middleware — ✅ |
| [Magic link](https://supabase.com/docs/guides/auth/auth-email-passwordless) | `signInWithOtp` in `auth/actions.ts` — ✅ |
| [Google OAuth](https://supabase.com/docs/guides/auth/social-login/auth-google) | GCP redirect = `…/auth/v1/callback`; app allow-list = `/auth/callback` — AUTH-002 ✅ |

### Mastra ([Auth overview](https://mastra.ai/docs/server/auth))

| Doc | Task alignment |
|-----|----------------|
| [Supabase provider](https://mastra.ai/docs/server/auth/supabase) | `MastraAuthSupabase` on `Mastra({ server: { auth } })` — **AUTH-010 Option B only** |
| [Reference](https://mastra.ai/reference/auth/supabase) | Default `authorizeUser` → **`users.isAdmin`** — 🔴 **wrong for mdeai** (see below) |

**MCP `mastraDocs` paths `docs/server/auth/supabase` + `reference/auth/supabase`:** matches web docs (verified 2026-05-20).

### CopilotKit (skill + disk)

- [CopilotKit Mastra example](https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra): **no auth** — mdeapp `getUser()` in route is the correct extension.
- Do **not** require Bearer on `/api/copilotkit` for browser chat ([Mastra Supabase doc](https://mastra.ai/docs/server/auth/supabase) is for `MastraClient` → `:4111`, not Pattern 1).

---

## GitHub repo: `mastra-auth-examples/supabase` — can we use it?

| Question | Answer |
|----------|--------|
| Use for Mastra agent auth? | **No** — that folder is the [Next.js + Supabase starter](https://github.com/mastra-ai/mastra-auth-examples/tree/main/examples/supabase) (cookie middleware, login UI), **not** `@mastra/auth-supabase` wiring. |
| Use for mdeapp? | **No clone needed** — mdeapp already has F08 SSR + callback; copy-only reference for middleware patterns if stuck. |
| What to use instead | [Mastra Supabase auth](https://mastra.ai/docs/server/auth/supabase) + existing `mdeapp/src/lib/supabase/*` + [Supabase Next.js SSR](https://supabase.com/docs/guides/auth/server-side/nextjs). |

**Red flag (was in plan/21):** listing this repo as “Mastra Supabase example” is misleading — patched in plan/21 and `MCP-VERIFICATION.md`.

---

## Per-task grades

| ID | Spec | Readiness | Blockers / notes |
|----|------:|----------:|------------------|
| AUTH-002 | 90 | 88 | ✅ Dashboard-only; GCP redirect URI correct |
| AUTH-001 | 85 | 82 | 🟡 patched: server action must `redirect(data.url)` |
| AUTH-003 | 88 | 85 | ✅ Matches architecture; `/chat` stays public |
| AUTH-004 | 80 | 75 | 🟡 `schedule-viewing` may stay anon-by-design — document before 401 |
| AUTH-005 | 82 | 78 | ✅ OTP inject pattern exists (SCREEN-013) |
| AUTH-006 | 86 | 80 | ✅ JWT Bearer pattern per [JWT guide](https://supabase.com/docs/guides/auth/jwts) |
| AUTH-007 | 92 | 90 | ✅ Small, correct |
| AUTH-008 | 84 | 78 | ✅ Option A (anon client) preferred — simpler |
| AUTH-009 | 80 | 72 | 🟡 Optional — defer until AUTH-006 ships |
| AUTH-010 | 75→85 | 80 | 🔴 patched: `profiles.role` not `users.isAdmin`; depends_on fixed |
| AUTH-011 | 88 | 85 | ✅ Checklist task |

---

## Red flags (fixed vs watch)

### 🔴 Fixed in specs (2026-05-20)

1. **AUTH-010 Option B** — Mastra default `authorizeUser` queries `public.users.isAdmin`; live DB has **`profiles.role` only**. Option B must pass custom `authorizeUser`.
2. **AUTH-001** — Server-side OAuth must call `redirect(data.url)` from `next/navigation` when `signInWithOAuth` returns a URL ([server OAuth troubleshooting](https://supabase.com/docs/guides/troubleshooting/oauth-sign-in-isnt-redirecting-on-the-server-side-ShGMtr)).
3. **AUTH-010 `depends_on`** — Was `[AUTH-002]` (nonsense); changed to `[F08]`.
4. **plan/21 + MCP-VERIFICATION** — Clarified `mastra-auth-examples/supabase` is not Mastra auth integration.

### 🟡 Watch (do not block MVP)

| Item | Guidance |
|------|----------|
| Template vs F08 | AUTH tasks omit §8–10 numbering — acceptable for `tasks/data/` specs |
| `schedule-viewing` 401 | Edge accepts anon today for lead capture — AUTH-004 must say “require auth OR document guest path” |
| Password auth | Not in scope; [passwords doc](https://supabase.com/docs/guides/auth/passwords) N/A — magic link + Google only ✅ |
| AUTH-009 + AUTH-006 | Slight overlap — keep 006 factory, 009 wiring only |
| Over-engineering guard | Skip AUTH-010 Option B for MVP; Option A doc-only is enough per [Mastra auth overview](https://mastra.ai/docs/server/auth) (auth optional on server) |

### 🟢 Confirmed correct (do not change)

- Supabase as **single** identity source
- Reuse `/auth/callback` + `exchangeCodeForSession` for Google ([identities](https://supabase.com/docs/guides/auth/identities) link on OAuth)
- CopilotKit Pattern 1 + cookie `getUser()` — no `MastraAuthSupabase` on `/api/copilotkit`
- No `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in app (Supabase-hosted OAuth)
- Execution order: AUTH-002 before AUTH-001

---

## Simplification recommendation (MVP)

**Ship this slice only:**

1. AUTH-002 + AUTH-001 + AUTH-003 + AUTH-004 (partial — only routes that must be authed)
2. AUTH-007 (one-line safety)
3. AUTH-011 before prod

**Defer without guilt:** AUTH-008, AUTH-009, AUTH-010 Option B (Camila chat works with `userId` audit today; RLS on catalog reads is the urgent fix).

---

## INDEX.md sync

| Row | `tasks/INDEX.md` | Spec `status:` | Match |
|-----|------------------|----------------|-------|
| AUTH-* | Ready (11 specs, 0 code) | All `Ready` | ✅ |

---

## Sign-off

| Role | Result |
|------|--------|
| **Lucía (QA)** | Specs testable; add AUTH-001 redirect to manual test |
| **Sofía (dev)** | Execute AUTH-002→001→003; ignore mastra-auth-examples repo |
| **Patricia (ops)** | AUTH-002 is Dashboard-only evidence |

**Not 100%** — spec pack is **~82%** quality, **~78%** execution-ready. After patches above, **safe to implement** without architectural rework.

---

## Addendum (2026-05-20) — user review suggestions

| Suggestion | Correct? | Action taken |
|------------|----------|--------------|
| Rotate exposed Google client secret | ✅ Yes | Note in AUTH-002; **operator must rotate in GCP** — not automatable here |
| AUTH-006 use `accessToken` not only `Authorization` header | ✅ Yes | Implemented in `user-scoped.ts` per [JWT guide](https://supabase.com/docs/guides/auth/jwts) |
| AUTH-008 before AUTH-006 (public catalog ≠ user scope) | ✅ Yes | INDEX order + `depends_on` updated |
| AUTH-011 depends on AUTH-008 | ✅ Yes | `depends_on` includes AUTH-008 |
| AUTH-004: 401 on schedule-viewing unless guest supported | ✅ Yes | Guest path **explicitly** kept + comment in route |
| AUTH-005 Google E2E manual/staging only | ✅ Yes | Spec updated |
| AUTH-010 hard check :4111 not public | ✅ Yes | ARCHITECTURE.md + AUTH-010 spec |
| RLS policy tests for trips/saved | ✅ Yes, defer | Add with AUTH-009 when tools write user rows — not blocking Google MVP |

**Implementation batch (2026-05-20):** AUTH-001, 003, 004, 007, 008, 006 (factory), 010 (doc). **155/155** tests, **build exit 0**. Evidence: `tasks/notes/AUTH-001-003-007-008-evidence.md`.

**Remaining:** AUTH-009 (wire JWT to tools), AUTH-005 (E2E), AUTH-011 (prod checklist after manual Google test).
