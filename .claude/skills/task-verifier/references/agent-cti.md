---
title: task-verifier — Coffee Tour Intelligence (CTI)
---

# CTI task verification

**Specs:** `tasks/agent/tasks/CTI-*.md` — each file must have: *In plain English*, *User story*, *Real-world example*, *Goals*, *Success criteria*.

**Index:** `tasks/agent/tasks/INDEX.md` · **Roadmap:** `tasks/agent/10-cafeintelligence-plan.md`

## Skills (load before audit or Done)

| Skill | When |
|-------|------|
| **task-verifier** | Always |
| **mde-supabase** | CTI-001A/B, 003, 014 |
| **mastra** + **copilotkit-integrations** | CTI-004, 006, 011–013 |
| **mde-maps** | CTI-003 (place_id), 005, 008 |
| **gemini** | Model `gemini-3.5-flash` in mdeapp per CLAUDE.md |
| **pgvector** | CTI-011 only |
| **open-claw** | **Not Phase A** — canonical crawler = `OCL-013-mvp`; CTI-019 cancelled |

## MCP cadence (before code)

| Task | MCP |
|------|-----|
| CTI-001A/B | `user-supabase` list_tables, apply_migration, get_advisors |
| CTI-003 | `user-supabase` + `google-maps-code-assist` for place_id verify |
| CTI-004 | `user-mastra`, `gemini-api-docs-mcp` |
| CTI-005, 008 | `google-maps-code-assist` field masks |

## Blocking gates (Phase A)

1. **CTI-001A** before **001B** or **011**.
2. **≥3 verified `place_id`** in seed before CTI-007+.
3. **CTI-006** before **CTI-004**.
4. Tour query → `searchCoffeeTours` only (Vitest + smoke).
5. Score &lt; 55 not shown; &lt; 70 → limited badge.
6. Map pins: `meta.listingType = coffee_tour`.
7. **CTI-011 not Done** during Phase A evidence (no semantic search claim).
8. **CTI-019 cancelled** — track OpenClaw in `OCL-013-mvp` only.

## Evidence file

`tasks/notes/CTI-A-evidence.md` — localhost gate 9 per anti-fake-done checklist.
