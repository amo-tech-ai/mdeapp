---
name: linear-workflow
description: DEPRECATED — use the `linear` skill instead. Start/stop work on Linear issues. Use when beginning work, creating branches, or getting current issue context.
allowed-tools: Bash
---

> ⚠️ **DEPRECATED (2026-06-20) — superseded by the canonical `linear` skill.**
> All content from `linear-workflow` was merged into `.agents/skills/linear/` (SKILL.md +
> references/). Use the `linear` skill instead. Kept temporarily for review; scheduled for
> removal once the migration is approved. Do not extend this file.

# Workflow Commands

## Start Work

```bash
# Start working (assigns to you, sets In Progress)
linear-cli i start LIN-123

# Start + create git branch
linear-cli i start LIN-123 --checkout
```

## Stop Work

```bash
# Stop working (unassigns, resets status)
linear-cli i stop LIN-123
```

## Get Current Issue

```bash
# Get issue from current git branch
linear-cli context
linear-cli context --output json
```

## Full Workflow

```bash
# 1. Start
linear-cli i start LIN-123 --checkout

# 2. Code...

# 3. Create PR
linear-cli g pr LIN-123

# 4. Done
linear-cli i update LIN-123 -s Done
```
