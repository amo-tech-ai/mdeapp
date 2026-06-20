---
name: linear-roadmaps
description: DEPRECATED — use the `linear` skill instead. View Linear roadmaps. Use when viewing roadmap planning.
allowed-tools: Bash
---

> ⚠️ **DEPRECATED (2026-06-20) — superseded by the canonical `linear` skill.**
> All content from `linear-roadmaps` was merged into `.agents/skills/linear/` (SKILL.md +
> references/). Use the `linear` skill instead. Kept temporarily for review; scheduled for
> removal once the migration is approved. Do not extend this file.

# Roadmaps

```bash
# List roadmaps
linear-cli rm list
linear-cli rm list --output json

# Get roadmap details
linear-cli rm get ROADMAP_ID
linear-cli rm get ROADMAP_ID --output json
```

## Flags

| Flag | Purpose |
|------|---------|
| `--output json` | JSON output |
| `--compact` | No formatting |
