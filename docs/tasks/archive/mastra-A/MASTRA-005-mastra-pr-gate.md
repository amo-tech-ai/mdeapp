---
id: MASTRA-005
title: Mastra PR gate — check:mastra script for mdeapp/src/mastra
status: Done
priority: P2
phase: W3 — quality gate
effort: 1h
owner: claude
depends_on: [../core/F09-floor-script-and-vitest.md]
skill: [mastra, testing, code-review]
plan_ref: ../../plan/mastra/github/14-mastra-system-check.md
target_files:
  - mdeapp/package.json
  - mdeapp/scripts/check-mastra.mjs
  - mdeapp/docs/ARCHITECTURE.md
  - tasks/notes/MASTRA-005-evidence.md
verified_against:
  - ../../plan/mastra/github/14-mastra-system-check.md
  - ../../.claude/skills/copilotkit-integrations/references/integrations/mastra.md
---

# MASTRA-005 — Mastra PR gate (system-check)

## Easy summary

| | |
|---|---|
| **In one line** | `npm run check:mastra` fails CI on agent-name mismatches, secret leaks, and pin violations. |
| **Who cares** | **Sofía** · **Lucía** |
| **Effort** | ~1 hour |

**Example failure:** `useCoAgent({ name: "router-agent" })` while Mastra key is `routerAgent` → silent CopilotKit 404 for Camila.

**Note:** No `.github/workflows/ci.yml` in mdeapp repo yet — wire script into `package.json`; CI workflow is a separate F06/floor follow-on.

---

## 1. Purpose

Lightweight gate inspired by [mastra-system-check](https://github.com/goldk3y/mastra-system-check) — not a 66-rule dump.

## 2. Goals

Add `npm run check:mastra` (script `mdeapp/scripts/check-mastra.mjs`) that **exits non-zero** on:

| Check | Rule |
|-------|------|
| Agent map key | Every `useCoAgent({ name: "X" })` in `src/app` has matching key in `Mastra({ agents: { X } })` |
| CopilotKit pin | `@copilotkit/*` === `1.55.2` in package.json; no `@copilotkit/react-core/v2` imports |
| Gemini model | No `gemini-2.0`, `gemini-2.5`, `gemini-3-flash-preview` in `src/mastra/agents` |
| Service role | No `SUPABASE_SERVICE_ROLE` / service-role imports in `src/app/**` client components |
| Pattern 1 | `getLocalAgentsWithLogging` present in `api/copilotkit/route.ts` |
| `:memory:` storage | **After MASTRA-003 Done only** — fail if `LibSQLStore(:memory:)` in `mastra/index.ts` (gate flag or version check) |

Document in `mdeapp/docs/ARCHITECTURE.md` § Mastra + link from [`INDEX.md`](./INDEX.md).

## 3. Acceptance criteria

- [ ] `npm run check:mastra` in `mdeapp/package.json` runs script exit 0 on current tree (pre-MASTRA-003 `:memory:` allowed).
- [ ] Dry-run output in `tasks/notes/MASTRA-005-evidence.md`.
- [ ] No false positive on server-only paths (`lib/supabase/server.ts`, `api/**`).
- [ ] Phased modes documented: default allows `:memory:`; `MASTRA_REQUIRE_PG=1` fails on ephemeral storage (post MASTRA-003).

## 4. Verification commands

```bash
cd /home/sk/mdeai/mdeapp && npm run check:mastra
# After MASTRA-003 Done — strict storage mode:
MASTRA_REQUIRE_PG=1 npm run check:mastra
cd /home/sk/mdeai/mdeapp && npm run floor
```

## 5. Defer

- Full GitHub Actions workflow — until repo root CI exists.
- `@mastra/codemod v1` — run manually on major Mastra bumps, not every PR.
