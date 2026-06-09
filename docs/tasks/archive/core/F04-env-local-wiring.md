---
id: F04
title: Wire .env.local with Supabase + Maps + GOOGLE_GENERATIVE_AI_API_KEY
status: Done
completed_at: 2026-05-20
priority: P0
effort: 20 min
owner: claude
depends_on: [F01]
skill: [mde-supabase, copilotkit-setup]
evidence: /home/sk/mdeai/tasks/notes/F04-evidence.md
test_pass_rate: 9/9 (T10 gitignore deferred to F06)
verified_against:
  - /home/sk/mdeai/.claude/skills/mde-supabase/
  - /home/sk/mdeai/.claude/skills/copilotkit-setup/SKILL.md §5 (env vars)
  - actual /home/sk/mde/.env.local (legacy source of truth for keys)
---

# F04 — Wire `.env.local` with Supabase + Maps + Gemini

## 1. Purpose

The new app needs the same Supabase project, same Google Maps key, and the same Gemini key as legacy mdeai — but with Next.js naming conventions (`NEXT_PUBLIC_*` instead of Vite's `VITE_*`) and the `@ai-sdk/google` env var name (`GOOGLE_GENERATIVE_AI_API_KEY`). This task copies the values from legacy and renames the prefixes so `pingAgent` can authenticate in F05.

## 2. Goals

- `/home/sk/mdeai/mdeapp/.env.local` exists with 5 keys minimum:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
  - `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID`
  - `GOOGLE_GENERATIVE_AI_API_KEY` (value copied from legacy `GEMINI_API_KEY`)
- `LOG_LEVEL=info`
- `.env.example` written with placeholder shapes (committed to git in F06)
- No secret literals in any committed file (`.env.local` is gitignored)

## 3. Features (what the user gets)

- **Sofía (dev):** can `npm run dev` (F05) without any env error
- **Camila / Roberto:** unchanged

## 4. Workflows

1. `cp /home/sk/mde/.env.local /home/sk/mdeai/mdeapp/.env.local`
2. In the new `.env.local`, rename:
   - `VITE_SUPABASE_URL=` → `NEXT_PUBLIC_SUPABASE_URL=`
   - `VITE_SUPABASE_PUBLISHABLE_KEY=` → `NEXT_PUBLIC_SUPABASE_ANON_KEY=`
   - `VITE_GOOGLE_MAPS_API_KEY=` → `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=`
   - `VITE_GOOGLE_MAPS_MAP_ID=` → `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=`
3. Append:
   ```env
   # @ai-sdk/google reads from GOOGLE_GENERATIVE_AI_API_KEY by default.
   # Value is the same as legacy GEMINI_API_KEY (Gemini API key for mdeai).
   GOOGLE_GENERATIVE_AI_API_KEY=<paste value from legacy GEMINI_API_KEY>
   LOG_LEVEL=info
   ```
4. Write `/home/sk/mdeai/mdeapp/.env.example` (placeholder shapes only — no literals):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-jwt>
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<google-maps-api-key>
   NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=<google-maps-map-id>
   GOOGLE_GENERATIVE_AI_API_KEY=<gemini-api-key>
   LOG_LEVEL=info
   ```
5. Verify `.gitignore` excludes `.env*` (the example's gitignore already does this — confirm)

## 5. User journeys

- **Sofía (dev):** copies one file, runs 4 sed renames, appends 2 lines. Total ~5 min.
- **Lucía (QA):** confirms `.env.example` has no secret values via `cat .env.example | grep -v "^#" | grep -E "(eyJ|sk_|pcp_|AIza)"` returning nothing.

## 6. Agents

None. This is config wiring.

## 7. Integrations

| Integration | Variable | Used by |
|---|---|---|
| Supabase Auth + reads | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `@supabase/supabase-js` client |
| Google Maps + Places | `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` | `@vis.gl/react-google-maps` (W5+) |
| Gemini via `@ai-sdk/google` | `GOOGLE_GENERATIVE_AI_API_KEY` | `pingAgent` (F02) and future Mastra agents |
| Logging | `LOG_LEVEL` | Mastra `ConsoleLogger` (registered in `src/mastra/index.ts`) |

## 8. Summary

Point the new app's `.env.local` at the same Supabase project, Maps keys, and Gemini budget as legacy mdeai — using Next.js naming. It helps `pingAgent` authenticate in F05 without any new infrastructure cost. We'll know it worked when `grep -oE '^[A-Z_]+=' .env.local | sort -u` lists exactly the 5 required keys + `LOG_LEVEL`.

## 9. Definition of Done

- [ ] `/home/sk/mdeai/mdeapp/.env.local` exists with 5 required keys + `LOG_LEVEL`
- [ ] No `VITE_*` prefix on any required key (renamed to `NEXT_PUBLIC_*`)
- [ ] `GOOGLE_GENERATIVE_AI_API_KEY` is set (not `GOOGLE_API_KEY`, not bare `GEMINI_API_KEY`)
- [ ] `.env.example` committed with placeholder shapes only — no secrets
- [ ] `.gitignore` excludes `.env*` (confirmed via `git check-ignore -v .env.local`)
- [ ] Evidence: output of `grep -oE '^[A-Z_]+=' /home/sk/mdeai/mdeapp/.env.local | sort -u` shows the 5 required + LOG_LEVEL

## 10. Tests

Run from `mdeapp/`. All must pass before marking Done.

### Acceptance tests (automated)

| # | Maps to DoD | Command | Expected |
|---|---|---|---|
| T1 | .env.local exists | `test -f .env.local && echo OK` | `OK` |
| T2 | 5 required vars present | `grep -cE '^(NEXT_PUBLIC_SUPABASE_URL\|NEXT_PUBLIC_SUPABASE_ANON_KEY\|NEXT_PUBLIC_GOOGLE_MAPS_API_KEY\|NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID\|GOOGLE_GENERATIVE_AI_API_KEY)=' .env.local` | `5` |
| T3 | LOG_LEVEL set | `grep -c '^LOG_LEVEL=' .env.local` | `1` |
| T4 | no `VITE_*` leftover | `grep -c '^VITE_' .env.local` | `0` |
| T5 | no bare `GEMINI_API_KEY` var | `grep -c '^GEMINI_API_KEY=' .env.local` | `0` |
| T6 | no bare `GOOGLE_API_KEY` var | `grep -c '^GOOGLE_API_KEY=' .env.local` | `0` |
| T7 | values look non-empty | `grep -E '^[A-Z_]+=.+' .env.local \| wc -l` | `≥ 6` |
| T8 | .env.example exists | `test -f .env.example && echo OK` | `OK` |
| T9 | .env.example has no real secrets | `! grep -E '^(NEXT_PUBLIC_GOOGLE_MAPS_API_KEY\|GOOGLE_GENERATIVE_AI_API_KEY)=AIza[A-Za-z0-9_-]{30,}' .env.example && ! grep -E '^NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ' .env.example && echo OK` | `OK` |
| T10 | .gitignore excludes .env.local | `git check-ignore -v .env.local \|\| grep -E '^\.env(\.local)?$' .gitignore` | output shows match |
| T11 | hook pass — guard-sensitive-paths blocks future .env edits | `echo '{"tool_input":{"file_path":"/home/sk/mdeai/mdeapp/.env.local","content":"X=1"}}' \| node /home/sk/mdeai/.claude/hooks/guard-sensitive-paths.mjs; echo exit=$?` | `exit=2` (proof rule is live) |
| T12 | hook pass — scan-secrets on .env.example with placeholders | feed `.env.example` content via stdin | `exit=0` |

### Negative tests

| # | Inject | Expected |
|---|---|---|
| Tn1 | rename `GOOGLE_GENERATIVE_AI_API_KEY` to `GOOGLE_API_KEY` | T6 fails (key for `@copilotkit/agent` v2, NOT our path) |
| Tn2 | put a literal `AIzaSy…` value in `.env.example` | T9 fails AND `scan-secrets.mjs` hook blocks the commit-shaped edit |
| Tn3 | leave `VITE_SUPABASE_URL` in `.env.local` | T4 fails — Next.js won't read VITE_* |

### Source-of-truth checks

| Source | Used for | Confirmed exists? |
|---|---|---|
| `/home/sk/mdeai/.env.local` (workspace root, per CLAUDE.md) | First-choice source for key values | Verify before reading legacy |
| `/home/sk/mde/.env.local` (legacy) | Fallback — but **denied** by `.claude/settings.json` `Read(/home/sk/mde/**)` | Requires explicit user lift of deny |

### Evidence to capture in `tasks/notes/F04-evidence.md`

- `grep -oE '^[A-Z_]+=' .env.local \| sort -u` (var-names only — never values)
- T2–T6 numeric outputs
- T11 + T12 hook results

## Notes / verification

- **P0-3 correction (from `plan/audit/01-plan-audit.md`):** Three names for the same Gemini key exist in the ecosystem:
  - `GOOGLE_GENERATIVE_AI_API_KEY` — `@ai-sdk/google` default (✅ we use this)
  - `GOOGLE_API_KEY` — `@copilotkit/agent` v2 `BuiltInAgent` default (not our path)
  - `GEMINI_API_KEY` — what legacy mde edge functions use (the value, not the var name)

  Same key value, three different variable names. Don't try to alias; just paste the same value under the right variable name.
- Per `mde-supabase` skill: never commit service-role keys. We only copy the *public* `NEXT_PUBLIC_SUPABASE_ANON_KEY` into the frontend env.
