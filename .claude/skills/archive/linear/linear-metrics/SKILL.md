---
name: linear-metrics
description: DEPRECATED — use the `linear` skill instead. View Linear metrics. Use for velocity, burndown, and progress tracking.
allowed-tools: Bash
---

> ⚠️ **DEPRECATED (2026-06-20) — superseded by the canonical `linear` skill.**
> All content from `linear-metrics` was merged into `.agents/skills/linear/` (SKILL.md +
> references/). Use the `linear` skill instead. Kept temporarily for review; scheduled for
> removal once the migration is approved. Do not extend this file.

# Metrics

```bash
# Cycle metrics (velocity, burndown)
linear-cli mt cycle CYCLE_ID
linear-cli mt cycle CYCLE_ID --output json

# Project progress
linear-cli mt project PROJECT_ID
linear-cli mt project PROJECT_ID --output json

# Team velocity over time
linear-cli mt velocity TEAM_KEY
linear-cli mt velocity ENG --cycles 5    # Last 5 cycles
```

## Flags

| Flag | Purpose |
|------|---------|
| `--cycles N` | Number of cycles |
| `--output json` | JSON output |
