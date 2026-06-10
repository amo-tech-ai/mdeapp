# .claude — mdeai Claude Code workspace

> Workspace-level Claude Code configuration for the mdeai project. Sits at the
> workspace root (`/home/sk/mdeai/`), not inside `mdeapp/`, so hooks can read
> plan/, tasks/, and docs/ for context.

## Files

```
.claude/
├── settings.json              ← Committed. Hooks + permissions.
├── settings.local.json        ← Gitignored. MCP toggles.
├── hooks/                     ← 10 active hooks, 4 deferred in _deferred/
├── commands/                  ← 3 slash commands (/verify-floor, /supabase-rls-audit, /copilotkit-check)
├── agents/
│   └── .agents/               ← **Canonical skill library** (77 skills + _archive + auto-review)
├── skills/                    ← 42 scan-root entries (symlinks → ../../.agents/skills/*)
├── auto-review -> ../.agents/auto-review
├── docs/                      ← Workspace-scoped docs (not user-facing)
├── worktrees/                 ← mde-worktree-pr-flow scratch dirs
└── README.md                  ← this file
```

**Root symlink:** `/home/sk/mdeai/.agents` → `.claude/agents/.agents` (required for `.claude/skills/*` symlinks).  
If skills vanish after clone: `ln -sf .claude/agents/.agents .agents` — then `./scripts/verify-skills.sh`.

## Hooks (10 active, 4 deferred)

| Event | Hook | Mode | Why |
|---|---|---|---|
| SessionStart | `session-start.mjs` | informational | Branch + recent commits + tasks/INDEX preview + Phase 1 reminders |
| PreToolUse Edit/Write/MultiEdit | `guard-sensitive-paths.mjs` | **blocking** | Block .env edits, supabase/migrations/ edits, /home/sk/mde/** edits |
| PreToolUse Edit/Write/MultiEdit | `scan-secrets.mjs` | **blocking** | Block writes containing Stripe/OpenAI/Anthropic/Google/GitHub PAT/known-leaked patterns |
| PreToolUse Edit/Write/MultiEdit | `no-service-role-in-src.mjs` | **blocking** | Block service-role keys in mdeapp/src/** (per CLAUDE.md hard rule) |
| PreToolUse Edit/Write/MultiEdit | `gemini-model-pin.mjs` | **blocking** | Block deprecated Gemini models + @ai-sdk/openai + @anthropic-ai/* in mdeapp/src |
| PreToolUse Edit/Write/MultiEdit | `copilotkit-version-pin.mjs` | **blocking** | Block @copilotkit/* != 1.55.2 in package.json; block v2 imports in src |
| PreToolUse Bash | `dist-leak-scan.mjs` | **blocking** | Scan .next/ + .vercel/output/ for leaked secrets before deploy commands |
| PostToolUse Edit/Write/MultiEdit | `lint-edited-ts.mjs` | warning | ESLint just the edited file (no-op if config missing) |
| PostToolUse Edit/Write/MultiEdit | `typecheck-edited-ts.mjs` | warning | tsc --noEmit for the edited file's project |
| Stop | `stop-rls-gate.mjs` | warning | If migrations changed this session, require RLS verification marker in last message |

### Deferred (in `_deferred/`)

| Hook | Promote when |
|---|---|
| `places-api-field-mask.mjs` | First Maps code lands (W5) |
| `advanced-marker-needs-mapid.mjs` | First Maps code lands (W5) |
| `post-migration-typegen.mjs` | First migration created (W2) |
| `stop-attribution-gate.mjs` | W10 cutover (style polish) |

Promote a hook by moving it from `_deferred/` to `hooks/` and adding its entry to `settings.json`.

### Bypass envs (per-turn escape hatches)

| Env var | Bypasses |
|---|---|
| `MDEAI_ALLOW_SECRET_LITERAL=1` | scan-secrets.mjs (e.g. legitimate test fixture) |
| `MDEAI_ALLOW_SERVICE_ROLE_IN_SRC=1` | no-service-role-in-src.mjs (extremely rare) |
| `MDEAI_ALLOW_ENV_EDIT=1` | guard-sensitive-paths.mjs for .env files |
| `MDEAI_ALLOW_MIGRATION_EDIT=1` | guard-sensitive-paths.mjs for supabase/migrations |
| `MDEAI_ALLOW_MODEL_DRIFT=1` | gemini-model-pin.mjs |
| `MDEAI_ALLOW_COPILOTKIT_VERSION_CHANGE=1` | copilotkit-version-pin.mjs |
| `MDEAI_ALLOW_PLACES_NO_FIELDMASK=1` | places-api-field-mask.mjs (when promoted) |
| `MDEAI_ALLOW_MAP_NO_MAPID=1` | advanced-marker-needs-mapid.mjs (when promoted) |

## Slash commands

| Command | Use case |
|---|---|
| `/verify-floor` | Pre-commit floor: build + audit + tsc + RLS evidence (~60s) |
| `/supabase-rls-audit` | RLS audit on public schema via Supabase MCP (~15s) |
| `/copilotkit-check` | Verify CK 1.55.2 pin, single mount, no v2 imports, agent-name consistency (~20s) |

## Subagents

| Agent | Model | Trigger |
|---|---|---|
| `security-reviewer` | haiku | Manual via /agents, or before commit. Audits diff for secrets, RLS gaps, JWT misconfig, XSS |

Future subagents (deferred per `plan/` strategy):
- `supabase-reviewer` (sonnet, W2 when first migration lands)
- `copilotkit-reviewer` (sonnet, W3 when form-fill flow lands)
- `maps-reviewer` (sonnet, W5 when maps lands)
- `accessibility-reviewer` (haiku, W3+ when UI lands)
- `performance-reviewer` (sonnet, W6+ /chat bundle audit)
- `architecture-reviewer` (opus, W4 + W7 one-shot Phase 1 fidelity)
- `test-verifier` (haiku, W8)

## Permissions strategy

- **deny:** destructive ops (rm -rf root, force push, hard reset, branch -D), legacy `/home/sk/mde/**` writes, prod deploy commands
- **ask:** npm install/uninstall, git commit/push, gh repo create, vercel deploy, Supabase MCP migrations/sql writes
- **allow:** read-only npm scripts (build/audit/dev/start), git status/diff/log, Supabase MCP read-only queries, AG-UI/CK doc MCPs, Playwright + Chrome DevTools MCPs

## MCP allowlist (settings.local.json)

Default opt-out: `enableAllProjectMcpServers: false` (to avoid loading broken
CopilotKit MCP endpoint and unused Figma/Gmail/Postiz). Explicit allowlist
covers Phase 1 needs.

## How to extend

1. **Add a hook** — write `.mjs` in `hooks/`, add entry to `settings.json`.
2. **Add a slash command** — write `.md` in `commands/` with frontmatter (description, allowed-tools).
3. **Add a subagent** — write `.md` in `agents/` with frontmatter (name, description, tools, model).
4. **Permission too tight** — add to `permissions.allow` or `permissions.ask`.
5. **Promote a deferred hook** — move from `_deferred/` to `hooks/`, add entry to `settings.json`, smoke-test with a deliberate violation.

## Related docs

- Project rules: `/home/sk/mdeai/CLAUDE.md`
- PRD: `/home/sk/mdeai/plan/prd.md` (and `plan/prd/00–10*.md`)
- Tasks: `/home/sk/mdeai/tasks/INDEX.md`
- Skill governance: `plan/audit/02-skills-audit.md`
