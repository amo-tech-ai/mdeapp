---
name: linear-triage
description: DEPRECATED — use the `linear` skill instead. Manage Linear triage inbox. Use for unassigned issues needing attention.
allowed-tools: Bash
---

> ⚠️ **DEPRECATED (2026-06-20) — superseded by the canonical `linear` skill.**
> All content from `linear-triage` was merged into `.agents/skills/linear/` (SKILL.md +
> references/). Use the `linear` skill instead. Kept temporarily for review; scheduled for
> removal once the migration is approved. Do not extend this file.

# Triage

```bash
# List triage issues (unassigned, no project)
linear-cli tr list
linear-cli tr list -t ENG            # Filter by team
linear-cli tr list --output json

# Claim issue (assign to self, move to backlog)
linear-cli tr claim LIN-123

# Snooze issue
linear-cli tr snooze LIN-123 --duration 1d   # Snooze 1 day
linear-cli tr snooze LIN-123 --duration 1w   # Snooze 1 week
```

## Duration Shortcuts

`1d`, `2d`, `1w`, `2w`, `1m`

## Flags

| Flag | Purpose |
|------|---------|
| `--output json` | JSON output |
