---
title: Claude Code Setup Audit + Corrections
date: 2026-06-03
owner: sanjiovani
scope: .claude/ hooks · subagents · skills · plugins · .mcp.json · permissions
status: corrections applied
---

# Claude Code Setup — Audit & Corrections (2026-06-03)

Ran `claude-code-setup:claude-automation-recommender` as an **audit** (not greenfield
recommend) against disk, then applied the fixes. Every claim below was verified against
the filesystem / config, not against config *intent*.

## Setup profile

Mature, hook-heavy Phase-1 config:

| Category | Count | Notes |
|---|---|---|
| Wired hooks | 12 | 7 PreToolUse(Edit/Write) + 1 PreToolUse(Bash) + 2 PostToolUse + 1 Stop + 1 SessionStart |
| Parked hooks | 2 | `_deferred/post-migration-typegen.mjs`, `_deferred/stop-attribution-gate.mjs` |
| Subagents | 3 | `mdeai-auto-reviewer`, `pr-scope-reviewer`, `security-reviewer` |
| Scan-root skills | 27 | `.claude/skills/` (excl `_template`) |
| Slash commands | 4 | `auto-review`, `copilotkit-check`, `supabase-rls-audit`, `verify-floor` |
| Project MCP servers | 6 | `.mcp.json`: mastra, copilotkit, google-maps-code-assist, gemini-api-docs-mcp, google-developer-knowledge, gcp |
| Plugin/global MCP | — | copilotkit-docs, supabase, linear, vercel, chrome-devtools, playwright-test |

Most CLAUDE.md hard rules are deterministically enforced. The problems found were all
**drift** — the MCP layer migrated to the plugin system, but the old `.mcp.json` paths,
permission entries, and CLAUDE.md references were never cleaned up.

---

## Findings + corrections applied

### 🔴 1. `.mcp.json` launchers pointed at a vanished `scripts/` dir — FIXED
`.mcp.json` launches 3 stdio servers via `/home/sk/mdeai/scripts/mcp-*.sh`
(copilotkit, google-maps-code-assist, gemini-api-docs-mcp). That `scripts/` dir was
**swallowed into the gitignored `screenshots/scripts/`** — so the servers silently
failed to launch on every session.

- Root cause: the whole `scripts/` tree now lives under `screenshots/scripts/`
  (`screenshots/` is `.gitignore`d), while `.mcp.json` + CLAUDE.md still reference the
  canonical root `scripts/` path.
- **Fix:** restored the 3 launchers to `/home/sk/mdeai/scripts/` (root `scripts/` is
  NOT gitignored — correct tracked target). All 3 are self-contained
  (`npx mcp-remote` / `uvx mcpdoc`), no `lib/` deps. Re-marked executable.
- `.mcp.json` itself needed **no edit** — its paths were already correct; only the files
  were missing.

```
scripts/mcp-copilotkit.sh              -> npx mcp-remote https://mcp.copilotkit.ai/mcp
scripts/mcp-google-maps-code-assist.sh -> npx mcp-remote https://mapscodeassist.googleapis.com/mcp
scripts/mcp-gemini-api-docs.sh         -> uvx mcpdoc GeminiAPI llms.txt
```

### 🔴 2. Stale MCP permission entries (server IDs → plugin names) — FIXED
Supabase + Linear now run as **plugins** (`mcp-needs-auth-cache.json` confirms
`plugin:supabase:supabase`, `plugin:linear:linear`). But permissions still named the
**old direct-server UUIDs**, so the carefully-tuned allow/ask rules matched *nothing* —
meaning read-only Supabase calls re-prompted and the `ask`-gate on
`execute_sql`/`apply_migration`/`deploy_edge_function` no longer fired.

- `settings.json`: replaced all `mcp__ed3787fc-985d-4fc2-87ac-e09815d3583a__*`
  → `mcp__plugin_supabase_supabase__*` (3 in `ask`, 14 in `allow`).
- `settings.local.json`: `mcp__0ebfc964-…__save_issue` → `mcp__plugin_linear_linear__save_issue`.
- Net effect: **strictly additive** — replaces dead-match entries with live ones; the
  `ask` gate on destructive Supabase ops is restored.

### 🟡 3. Redundant skill + duplicate hooks — REMOVED
- `.claude/skills/playwright-cli.bak` — symlink duplicating the real `playwright-cli/`
  dir; both loaded into the scan root (`playwright-cli` appeared **twice** in `/context`).
  Deleted.
- `_deferred/places-api-field-mask.mjs` + `_deferred/advanced-marker-needs-mapid.mjs` —
  byte-stale copies of the two hooks already wired from the parent dir. Deleted.
  `_deferred/` now holds only genuinely-parked hooks (see below).

### ⚪ 4. CLAUDE.md doc drift — FIXED
- "24 enabled skills" → **27** (actual scan-root count post-dedupe).
- "13 enforcement hooks" → **12 wired … 2 parked in `_deferred/`**.
- MCP cadence table: `mcp__ed3787fc__execute_sql` → `mcp__plugin_supabase_supabase__execute_sql`.
- Linear footnote: `mcp__0ebfc964__save_issue` → `mcp__plugin_linear_linear__save_issue`.

---

## Verified GOOD (no action)

- Hard-rule guards all present: ✅ secrets scan, ✅ no-service-role-in-src,
  ✅ `@anthropic-ai/*` + `gpt-*` ban (`gemini-model-pin.mjs` blocks **both** — model
  literals *and* the SDK import), ✅ CopilotKit version pin, ✅ Places `X-Goog-FieldMask`,
  ✅ `<AdvancedMarker>` mapId, ✅ Stop-RLS gate, ✅ legacy `/home/sk/mde/**` write-block.
- 3 subagents map cleanly to risk areas (semantic review / PR-scope creep / security).
- 4 project slash commands are tight and project-specific.
- File-based memory under `~/.claude/projects/-home-sk-mdeai/memory/` in use.

## Left for the user to decide (not auto-applied)

1. **`_deferred/post-migration-typegen.mjs`** — regenerates TS types after a Supabase
   migration. Useful given schema churn; currently does nothing. Wire as PostToolUse on
   the migration MCP, or delete.
2. **`_deferred/stop-attribution-gate.mjs`** — enforces commit co-author trailer. Wire or delete.
3. **Language-scope guard gap** — the "English only, no Spanish/Lingui" hard rule is the
   *only* hard rule with no hook. A ~10-line PreToolUse hook flagging `<html lang="es">`,
   `lingui`, or Spanish placeholders in `mdeapp/src/**` would close it. Low risk; optional.
4. **MCP redundancy** — copilotkit docs are now served by BOTH the `.mcp.json` stdio
   server (`mcp__copilotkit__*`) and the `copilotkit-docs` plugin
   (`mcp__plugin_copilotkit_copilotkit-docs__*`). Harmless but duplicative; pick one in
   Phase 2 cleanup.
5. **Bigger latent issue (out of audit scope):** the entire `scripts/` automation tree
   (30+ Linear scripts) lives under gitignored `screenshots/scripts/` — untracked, will
   vanish on a clean checkout. Only the 3 MCP launchers were rescued here.

---

## Files touched

| File | Change |
|---|---|
| `scripts/mcp-copilotkit.sh` | restored (+x) |
| `scripts/mcp-google-maps-code-assist.sh` | restored (+x) |
| `scripts/mcp-gemini-api-docs.sh` | restored (+x) |
| `.claude/settings.json` | Supabase MCP perms → plugin names (17 entries) |
| `.claude/settings.local.json` | Linear MCP perm → plugin name |
| `.claude/skills/playwright-cli.bak` | deleted (dupe) |
| `.claude/hooks/_deferred/places-api-field-mask.mjs` | deleted (dupe) |
| `.claude/hooks/_deferred/advanced-marker-needs-mapid.mjs` | deleted (dupe) |
| `CLAUDE.md` | 2 counts + 2 stale MCP names corrected |
