---
id: OCL-004-core
tier: core
title: ClawHub safety policy — no unvetted skills
status: Open
priority: P0
skill: [open-claw, code-review]
legacy_id: 19C
sources_index: ../docs/sources.md
openclaw_docs:
  - https://docs.openclaw.ai/tools/clawhub
  - https://docs.openclaw.ai/clawhub
  - https://docs.openclaw.ai/gateway/security
github:
  - https://github.com/openclaw/clawhub
  - https://github.com/openclaw/agent-skills
---

# OCL-004-core — ClawHub ban

Production VPS uses **custom** `skills/mde-*` only (author via [creating-skills](https://docs.openclaw.ai/tools/creating-skills); patterns from [agent-skills](https://github.com/openclaw/agent-skills) — **not** ClawHub installs).

Run `plan/openclaw/tasks/19C-clawhub-skill-safety-review.md` checklist; block `clawhub install` / `openclaw skills install` from registry in prod compose.

**Do not** use [openclaw/skills](https://github.com/openclaw/skills) archive as vetted.

Acceptance: MANIFEST in `tasks/openclaw/docs/` + `sources.md` policy row.
