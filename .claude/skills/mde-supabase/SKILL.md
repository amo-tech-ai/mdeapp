---
name: mde-supabase
description: "mdeai Supabase: DB, RLS, Auth, Edge Functions, Realtime, Storage, vectors, migrations, pgvector. Use for ANY Supabase work on this repo — schema changes, RLS policies, edge function deploy/debug, auth.uid(), service role, supabase-js, Realtime channels, Storage buckets, or Supabase MCP. Load topic files + references/project-rules/. NOT for: Auth0/Clerk-only auth, raw Postgres without Supabase, non-Supabase BaaS."
paths:
  - "supabase/**"
  - "**/*.sql"
  - "src/integrations/supabase/**"
---

# mde-supabase — Supabase superskill

## When NOT to use

- **Auth0 / Clerk / Firebase Auth** as the primary auth story (this skill is Supabase-shaped)
- **Raw Postgres** or **Neon** without Supabase client, RLS, or Edge Functions in scope
- **Vercel-only env** questions with no secrets-plane angle—use **`mde-vercel`** / dashboard docs

## Triggers

supabase, RLS policy, auth.uid, edge function, Deno.serve, verify_jwt, supabase secrets, realtime channel, broadcast, postgres_changes, presence, storage bucket, signed URL, supabase migration, supabase-js, service role, publishable key, user_metadata, app_metadata, Better Auth.

Single auto-fire entry point for all Supabase work on mdeai.co. **Combines existing references** rather than duplicating them — topic files + [`references/project-rules/`](references/project-rules/) (canonical bodies for `.claude/rules/supabase-*.md` symlinks).

---

## Path-scoped rules — [`references/project-rules/`](references/project-rules/)

Same filenames/scopes as [CLAUDE.md](../../../CLAUDE.md) **Rules** table (`supabase-patterns`, `supabase-migrations`, `supabase-rls-policies`, `supabase-database-functions`, `supabase-edge-functions`, `supabase-realtime`, plus **`supabase-sql-style`** and **`supabase-declarative-schema`**). Edit **only** the copies under `references/project-rules/` — `.claude/rules/supabase-*.md` are symlinks.

| Topic | File |
|-------|------|
| Client usage, RLS mindset, schema habits | [supabase-patterns.md](references/project-rules/supabase-patterns.md) |
| Migration file conventions | [supabase-migrations.md](references/project-rules/supabase-migrations.md) |
| RLS policy SQL patterns | [supabase-rls-policies.md](references/project-rules/supabase-rls-policies.md) |
| Postgres function SQL (`SECURITY DEFINER`, search_path, …) | [supabase-database-functions.md](references/project-rules/supabase-database-functions.md) |
| Declarative schema workflow | [supabase-declarative-schema.md](references/project-rules/supabase-declarative-schema.md) |
| Edge Functions (Deno) conventions | [supabase-edge-functions.md](references/project-rules/supabase-edge-functions.md) |
| Realtime broadcast / channels | [supabase-realtime.md](references/project-rules/supabase-realtime.md) |
| SQL style (identifiers, comments, formatting) | [supabase-sql-style.md](references/project-rules/supabase-sql-style.md) |

---

## Core principles

1. **Database is source of truth.** RLS enforces this — not frontend state.
2. **Verify, don't assume.** Supabase changes frequently. Check changelog + current docs before relying on memory.
3. **Service-role key never reaches the browser.** Edge functions only. No `VITE_*` prefix.
4. **Every exposed table has RLS.** No exceptions in `public` schema.
5. **`(SELECT auth.uid())` not `auth.uid()`** in RLS — caches per query, not per row.

---

## Routing — read the matching topic file(s) on demand

| User intent | Read this file |
|-------------|----------------|
| Auth flows, RLS rules, GoTrue gotchas, signed tokens, `app_metadata` vs `user_metadata` | [client-and-auth.md](client-and-auth.md) + [better-auth.md](better-auth.md) |
| Writing/deploying/debugging an Edge Function (Deno.serve, verify_jwt, webhooks, secrets, AI inference, deployment, limits) | [edge-functions.md](edge-functions.md) + [references/edge-functions-inventory.md](references/edge-functions-inventory.md) |
| Which edge functions exist in repo, models, auth matrix | [references/edge-functions-inventory.md](references/edge-functions-inventory.md) + [references/ai-edge-functions.md](references/ai-edge-functions.md) |
| Table groups / schema orientation | [references/tables-overview.md](references/tables-overview.md) |
| Query perf, indexes, schema design, RLS perf, locks, advisors | [postgres.md](postgres.md) + [references/postgres/](references/postgres/) |
| Realtime — broadcast via triggers, private channels, presence, `realtime.messages` RLS, React cleanup | [realtime.md](realtime.md) + [references/realtime/](references/realtime/) |
| Storage — buckets, RLS on `storage.objects`, signed URLs, image transforms, CDN | [storage.md](storage.md) + [references/storage/](references/storage/) |

If ambiguous (e.g. "build an admin dashboard with live updates and signed URLs"), read the matching topic files in parallel.

All topic files in this folder are consolidated copies of what used to live in separate top-level skills (`supabase`, `supabase-edge-functions`, `supabase-postgres-best-practices`, `supabase-realtime`, `supabase-storage`, `better-auth-best-practices`). Those source skills are now soft-deprecated — only this superskill auto-fires.

**Standalone skill names (redirect only, 2026-05-14):** `supabase-edge-functions` and `supabase-audit-functions` under `.claude/skills/` are **thin stubs** — vendor monoliths + pentest playbook live read-only under **`.agents/skills/_archive/2026-05-14/`** (`supabase-edge-functions-vendor/`, `supabase-audit-functions/SKILL.full.md`). Do not revive long-form edits there; extend this skill’s **`edge-functions.md`** / **`references/project-rules/supabase-edge-functions.md`** instead.

---

## Universal Supabase rules (apply everywhere — no need to re-read references for these)

### Security checklist (RLS / auth / storage / edge fn changes)

- **`user_metadata` is user-editable.** Never use it for authorization. Put auth-gating data in `raw_app_meta_data`.
- **Deleting a user does not invalidate JWTs.** Sign out / revoke sessions for sensitive ops.
- **Views bypass RLS by default.** `CREATE VIEW ... WITH (security_invoker = true)` in PG 15+.
- **UPDATE needs SELECT.** RLS UPDATE first SELECTs the row. Without SELECT policy, UPDATE silently returns 0 rows.
- **Storage upsert needs INSERT + SELECT + UPDATE** policies.
- **`security definer` functions stay out of exposed schemas.**
- **API keys go in `apikey` header** — `sb_publishable_*` keys are NOT JWTs and fail as `Authorization: Bearer`.
- **Service-role key never appears in `src/`** — anyone with view-source gets full DB control.

### Schema-change workflow

1. Iterate locally with `execute_sql` (MCP) or `supabase db query` — no migration history written.
2. Never `apply_migration` for iteration (one entry per call corrupts diffs).
3. When ready: `supabase db advisors` → fix issues → `supabase db pull <name> --local --yes` → `supabase migration list --local`.

### `(SELECT auth.uid())` pattern

```sql
-- ❌ slow (re-evaluated per row)
USING (user_id = auth.uid())

-- ✅ cached per query
USING (user_id = (SELECT auth.uid()))
```

Always pair UPDATE policies with SELECT policies. Always index any column referenced in RLS.

---

## mdeai.co repo coordinates

| What | Where |
|------|-------|
| Supabase client | `src/integrations/supabase/` |
| Edge functions | `supabase/functions/<name>/index.ts` |
| Shared edge code | `supabase/functions/_shared/` |
| Migrations | `supabase/migrations/` |
| Public env | `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`) |
| Edge secrets | Supabase dashboard → Edge function secrets |

For the in-repo edge-function inventory (**16** functions: `verify_jwt`, schema, auth, models), read [references/edge-functions-inventory.md](references/edge-functions-inventory.md). Run `scripts/verify-edge-inventory.sh` after adding a function.

---

## mdeai.co-specific gotchas

### Sponsor schema routing

Sponsor tables live in the `sponsor` schema, not `public`:

```ts
// ❌ "relation public.sponsor_applications does not exist"
svc.from('sponsor_applications')

// ✅
svc.schema('sponsor').from('applications')
```

### D5 — hand-crafted `auth.users` rows need GoTrue defaults

Direct INSERT into `auth.users` produces "Database error querying schema" on signin unless `confirmation_token`, `recovery_token`, `email_change`, `email_change_token_new` are set to `''` (not NULL). See [better-auth.md](better-auth.md) Rule 2.

### V1 known smell — host onboarding routes on `user_metadata.account_type`

Acceptable for V1 (data gate is RLS on `landlord_profiles`), but D6 must move to `app_metadata` via server-side trigger. See [better-auth.md](better-auth.md) Rule 1.

### ai_runs table — required for every AI chat turn

Every Mastra concierge chat turn must write a row to `ai_runs`. This is asserted by the smoke spec (MASTRA-045).

Schema:
```sql
-- ai_runs is already in the DB; use this INSERT pattern:
INSERT INTO ai_runs (agent_name, status, duration_ms, grounded, cost_class)
VALUES ('concierge-agent', 'ok', <elapsed_ms>, false, null);
```

For Maps grounding calls (Phase 3 only): `grounded = true`, `cost_class = 'maps'`.

RLS: service role write only. The smoke spec reads via REST with the anon key using a `SELECT` policy scoped to `agent_name = 'concierge-agent'` for observability.

### Mastra + Supabase connection patterns

- **Events, restaurants, attractions:** `@supabase/supabase-js` client in Mastra tools with `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
- **Rentals:** `pg.Pool` direct connection via `DATABASE_URL` (Supabase connection pooler URL)
- **Never share a single pg.Pool across Vercel serverless invocations** — create per-request or use connection pooling via `DATABASE_URL` with `?pgbouncer=true`

### Phase 2 enrichment columns

After MASTRA-048, these nullable columns exist on `events`, `restaurants`, `attractions`:
- `place_id text` — Google Maps stable identifier
- `maps_url text` — canonical Maps link (`googleMapsLinks.placeUri`)
- `ai_summary text` — Gemini-generated venue description (restaurants, attractions only)

These are populated at seeding time; never written during a chat turn.

---

## Companion skills

- `mde-stripe` — Stripe + Supabase webhook integration (idempotency, signature verification)
- `mde-task-lifecycle` — break schema-change work into tasks
- `systematic-debugging` — for "Database error querying schema" debug pattern (D5)

---

## References (deep dives, on demand)

- [references/project-rules/](references/project-rules/) — path-scoped Supabase rules (see table above); symlinked from `.claude/rules/supabase-*.md`
- [references/postgres/](references/postgres/) — 30+ rule files: query perf, indexes, locking, RLS perf, schema design, monitoring, advanced features
- [references/realtime/migration-from-postgres-changes.md](references/realtime/migration-from-postgres-changes.md) — step-by-step migration from `postgres_changes`
- [references/realtime/rls-policy-cookbook.md](references/realtime/rls-policy-cookbook.md) — RLS patterns for mdeai conversations/trips/events/votes
- [references/storage/api-cheatsheet.md](references/storage/api-cheatsheet.md) — all JS client storage methods
- [references/storage/rls-policies.md](references/storage/rls-policies.md) — full storage RLS examples
- [references/edge-functions-inventory.md](references/edge-functions-inventory.md) — in-repo function matrix (canonical)
- [references/ai-edge-functions.md](references/ai-edge-functions.md) — Gemini models + `GEMINI_API_KEY`
- [references/tables-overview.md](references/tables-overview.md) — table groups + RLS audit query
- [references/supabase/skill-feedback.md](references/supabase/skill-feedback.md) — read when reporting incorrect Supabase guidance

---

## Event discovery schema (plan 10 — EVP-020)

| Resource | Path |
|----------|------|
| Schema plan | [10-event-discover-plan.md §7](../../../plan/events/event-discovery/10-event-discover-plan.md) |
| Task | [EVP-020-mvp](../../../tasks/events/EVP-020-mvp-discovered-events-data-model.md) |
| Ingest API | OC-EVD-04 in [OCL-042](../../../tasks/openclaw/tasks/OCL-042-mvp-clawevents-medellin-automation.md) |
| Routing | [event-discovery-skill-routing.md](../../../tasks/events/docs/event-discovery-skill-routing.md) |

**Tables:** `event_sources`, `raw_events`, extend `events`, `event_venues`, `event_scrape_jobs`, `event_runs` — RLS on all; service-role **only** Edge ingest, never `mdeapp/src`. Use Supabase MCP `execute_sql` + advisors before migrate.

---

## Exit conditions

- Routed to the correct source skill(s) and read them
- Universal rules applied (security checklist + `(SELECT auth.uid())`)
- For Stripe webhook handlers → also load `mde-stripe`
- After adding/removing `supabase/functions/<name>/` → update `supabase/config.toml` + [references/edge-functions-inventory.md](references/edge-functions-inventory.md) → run `scripts/verify-edge-inventory.sh`
