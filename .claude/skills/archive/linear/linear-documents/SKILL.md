---
name: linear-documents
description: DEPRECATED — use the `linear` skill instead. Manage Linear documents. Use for creating and viewing documentation.
allowed-tools: Bash
---

> ⚠️ **DEPRECATED (2026-06-20) — superseded by the canonical `linear` skill.**
> All content from `linear-documents` was merged into `.agents/skills/linear/` (SKILL.md +
> references/). Use the `linear` skill instead. Kept temporarily for review; scheduled for
> removal once the migration is approved. Do not extend this file.

# Documents

```bash
# List documents
linear-cli d list
linear-cli d list --output json

# Get document
linear-cli d get DOC_ID
linear-cli d get DOC_ID --output json

# Create document
linear-cli d create "Design Doc" -p PROJECT_ID
linear-cli d create "RFC" -p PROJECT_ID --id-only

# Update document
linear-cli d update DOC_ID --title "New Title"
linear-cli d update DOC_ID --content "New content"
```

## Flags

| Flag | Purpose |
|------|---------|
| `-p PROJECT` | Project ID |
| `--id-only` | Return ID only |
| `--output json` | JSON output |
