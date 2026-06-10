---
title: Forensic audit checklist
impact: MEDIUM
impactDescription: Pre-flight code audit for Phase 2 research
tags: mde-task-lifecycle, audit, research
---

# Forensic audit checklist

Use during Phase 2 ([research.md](../research.md)) when auditing existing code or pre-flight before a non-trivial change.

---

## Forensic review methodology

Before changing existing code:

| Check | How |
|-------|-----|
| Symbol usage | `Grep -n "<symbol>"`; read every match. |
| Drift from rules | Compare against [.claude/rules/style-guide.md](../../../rules/style-guide.md), `supabase-patterns.md`, `edge-function-patterns.md`. |
| Schema reality | `mcp__ed3787fc…__list_tables` or read latest migrations under [supabase/migrations/](../../../../supabase/migrations/). |
| RLS coverage | `mcp__ed3787fc…__execute_sql` against `pg_policies`. |
| Dependency versions | Read [package.json](../../../../package.json); check official changelogs for breaking changes. |
| Dead / shadow code | Grep for symbol; zero callers = candidate for removal under a separate task. |
| Doc/code consistency | If a doc says "the X hook returns Y" and code returns Z, flag and cite both. |

### Red-flag patterns

Surface these in the audit note:

- Service role key reference inside `src/`
- `auth.uid()` used directly in RLS instead of `(select auth.uid())`
- `any` type, `// @ts-ignore`, `// eslint-disable` without justification
- `console.log` left after debug
- `useEffect` with empty deps doing data fetch (should be `useQuery`)
- Migration without down-script when reversible
- Edge function without Zod schema on input
- Frontend code referencing `process.env.X` (should be `import.meta.env.VITE_X`)

---

## Risk-analysis matrix

Rate each risk on a 3×3 grid.

| | Blast: Low (1 user, reversible) | Blast: Med (one feature) | Blast: High (production-wide) |
|---|---|---|---|
| **Likelihood: Low** | Note it; ship | Note it; mitigation in commit body | Mitigation required before ship |
| **Likelihood: Med** | Mitigation in test plan | Mitigation in implementation | **Block** until plan replanned |
| **Likelihood: High** | Add monitoring | **Block**; need design review | **Block**; escalate to user |

Mitigations live in the prompt body's Risk register section or in commit messages.

---

## Secrets

```
[ ] No SUPABASE_SERVICE_ROLE_KEY referenced in src/.
[ ] No ANTHROPIC_API_KEY / GEMINI_API_KEY in src/.
[ ] No SHOPIFY_CLI_TOKEN, GADGET_API_SECRET, PRIVATE_ADMIN_API_ACCESS_TOKEN in src/.
[ ] All client-safe vars prefixed VITE_.
[ ] No hard-coded JWTs, Bearer tokens, or signed URLs in committed code.
[ ] .env.local entries match .env.example structure (no key drift).
[ ] No secrets in test fixtures, seed scripts, or comments.
```

Grep targets:
- `Grep -n "service_role"`
- `Grep -n "process.env\." src/`
- `Grep -n -i "secret\|password\|token" src/`

---

## RLS

```
[ ] Every table has RLS enabled (\d+ <table> in psql shows "Row Security: enabled").
[ ] SELECT policies exist for every read pattern.
[ ] INSERT/UPDATE/DELETE policies use (select auth.uid()) subquery, not direct.
[ ] No table is publicly writable.
[ ] Service-role-only tables (e.g., ai_runs writes) policies enforce auth.role() = 'service_role'.
[ ] FK columns have policies that match the parent's ownership model.
```

Check via `mcp__ed3787fc…__execute_sql`:

```sql
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

---

## Schema drift

```
[ ] Migrations in supabase/migrations/ are applied to the project.
[ ] Generated types in src/integrations/supabase/types.ts match current schema.
[ ] No table referenced in code that doesn't exist in DB.
[ ] No column referenced in code that doesn't exist in the table.
[ ] FK ON DELETE behavior matches business intent (CASCADE vs SET NULL vs RESTRICT).
[ ] Indexes exist on FK columns and frequently filtered columns.
```

---

## Dependency CVEs

```
[ ] npm audit --omit=dev shows no high/critical CVEs.
[ ] No deps pinned to a major version with known security drift (>1 year stale).
[ ] React, Vite, TypeScript, Supabase JS within current major.
[ ] No duplicate locks: pick one of bun.lockb / package-lock.json.
```

---

## Dead code

```
[ ] Symbols with zero callers flagged for removal (separate task).
[ ] Hooks not used by any component flagged.
[ ] Routes registered in App.tsx but unreachable from navigation flagged.
[ ] Edge functions present in supabase/functions/ but never invoked from src/ flagged.
[ ] Migrations creating tables never read flagged.
```

Grep targets:
- `Grep -n "export function" src/hooks/` then check usages of each
- Diff `src/pages/` route list against `App.tsx` route registrations

---

## Env var hygiene

```
[ ] All VITE_* used in src/ exist in .env.
[ ] All non-VITE env vars are read only inside supabase/functions/.
[ ] .env.example mirrors .env structure (no key drift).
[ ] Edge function secrets configured in Supabase dashboard match what supabase/functions/ reads.
[ ] No env var read at module top-level in src/ (use lazy reads to avoid build-time crashes).
```

---

## Doc/code consistency

```
[ ] CLAUDE.md statements about file layout match reality (run a sample check).
[ ] PRD references that are file paths actually exist.
[ ] tasks/prompts/INDEX.md row count matches actual file count in each subfolder.
[ ] Coverage matrix rows reflect current prompt status.
[ ] todo.md doesn't have ✅ DONE rows whose prompt status is still In Progress.
[ ] Linked URLs in CHANGELOG and prompts resolve.
```

---

## AI/edge function specifics

```
[ ] Every AI call logs to ai_runs (agent_name, input_tokens, output_tokens, duration_ms, status).
[ ] Rate limits enforced: AI 10/min/user, Search 30/min/user.
[ ] Timeouts: ≤30s for AI, ≤10s for DB queries.
[ ] Zod schema on every input.
[ ] Structured error responses ({ success: false, error: { code, message } }).
[ ] CORS preflight handled.
[ ] JWT validated on every protected route.
```

---

## Three-panel layout

```
[ ] Pages under main routes use the three-panel layout per CLAUDE.md.
[ ] Left panel: navigation, filters, user info — read-only context.
[ ] Center panel: primary work area.
[ ] Right panel: AI suggestions, map, summaries.
[ ] Mobile: collapses to single column with bottom navigation.
[ ] No new full-bleed pages added without explicit approval.
```

---

## Reporting format

When auditing, write findings as:

```
## Audit findings — <topic> (<date>)

**Pass**
- <area>: <one-line summary> — checked at <ref>

**Fail / Warn**
- <area>: <issue> — at <file:line> — fix: <action> — severity: <H/M/L>

**Open questions**
- <question> — needs source/decision
```

For broader research methodology, see [../research.md](../research.md).
