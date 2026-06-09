---
id: OCL-010-mvp
tier: mvp
title: mde-tour-enrich (+ mde-enrichment) SKILL.md pack
status: Open
priority: P1
depends_on: [OCL-004-core, OCL-006-core]
skill: [open-claw, mde-hostinger]
legacy_id: 08I
plan_ref: ../../../plan/openclaw/tasks/08I-openclaw-mde-skills.md
sources_index: ../docs/sources.md
openclaw_docs:
  - https://docs.openclaw.ai/tools/skills
  - https://docs.openclaw.ai/tools/creating-skills
github:
  - https://github.com/openclaw/agent-skills
  - https://github.com/openclaw/openclaw
---

# OCL-010-mvp — mde skills

VPS `skills/mde-tour-enrich/` (required) and optionally `skills/mde-enrichment/` — each with `SKILL.md`: browser steps, JSON output schema, Supabase write via callback URL (not direct service role in skill). Acceptance: dry-run job → `openclaw_job_results` row.
