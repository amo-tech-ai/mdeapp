---
name: linear-labels
description: DEPRECATED — use the `linear` skill instead. Manage Linear labels. Use when creating, listing, or deleting labels.
allowed-tools: Bash
---

> ⚠️ **DEPRECATED (2026-06-20) — superseded by the canonical `linear` skill.**
> All content from `linear-labels` was merged into `.agents/skills/linear/` (SKILL.md +
> references/). Use the `linear` skill instead. Kept temporarily for review; scheduled for
> removal once the migration is approved. Do not extend this file.

# Labels

```bash
# List labels
linear-cli l list                    # Project labels
linear-cli l list --type issue       # Issue labels

# Create label
linear-cli l create "Feature" --color "#10B981"
linear-cli l create "Bug" --color "#EF4444" --id-only

# Delete label
linear-cli l delete LABEL_ID
linear-cli l delete LABEL_ID --force

# Agent-optimized
linear-cli l list --output json --compact
```

## Flags

| Flag | Purpose |
|------|---------|
| `--id-only` | Return ID only |
| `--output json` | JSON output |
| `--force` | Skip confirmation |
