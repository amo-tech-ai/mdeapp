# Linear Done column — user approval required

**Policy owner:** S K (sanjiovani)  
**Effective:** 2026-05-27

## Rule

**Only the user may move an issue to Done.**

Agents, import scripts, and bulk sync **must not** set Linear state to Done.

## Workflow

```text
Todo → In Progress → In Review → Done
                              ↑
                    user approval only
```

| Who | Action | Linear state |
|-----|--------|--------------|
| Agent finishes code + evidence | Comment evidence path | **In Review** |
| Agent / script | Never auto-close | ❌ not Done |
| User verifies + approves | Drag to Done or close in UI | **Done** |
| User approves via label | Add `approved-done` then agent may set Done | **Done** |

## For agents (MCP `save_issue`)

- ✅ `In Progress` — work started
- ✅ `In Review` — PR open, or evidence ready for user sign-off
- ❌ `Done` — unless user explicitly said "mark SAN-XXX Done" in this session

## Import scripts

| Script | Done mapping |
|--------|----------------|
| `linear-import-tasks.mjs` | Open tasks only — never Done |
| `linear-import-screens.mjs` | Disk `Done` → **In Review** (not Done) |
| `linear-sync-mvp.mjs` | Never sets Done |

## Reset bulk-imported Done

2026-05-27 screen import closed ~28 issues as Done within seconds of create (no approval).

```bash
cd /home/sk/mdeai
export LINEAR_API_KEY="$(grep '^LINEAR_API_KEY=' .env.local | cut -d= -f2- | tr -d '"')"
node scripts/linear-reset-unapproved-done.mjs
```

Skips issues labeled `approved-done`.

## User approval checklist (before Done)

1. Evidence file exists under `tasks/evidence/`
2. Playwright / floor passed (or N/A doc-only wireframe)
3. Committed on `main` (or merged PR)
4. No open ⚠️ in evidence acceptance table
