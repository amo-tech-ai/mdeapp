---
id: OCL-023-advanced
tier: advanced
title: Events — T-24h reminder WA drafts
status: Open
priority: P3
depends_on: [OCL-017-postmvp, OCL-022-advanced, G1-G5]
skill: [open-claw, mde-paperclip]
plan_ref: ../../../plan/openclaw/events-openclaw/070-openclaw-no-show-recovery.md
sources_index: ../docs/sources.md
openclaw_docs:
  - https://docs.openclaw.ai/automation/cron-jobs
  - https://docs.openclaw.ai/automation/tasks
github:
  - https://github.com/openclaw/openclaw
---

# OCL-023-advanced — Event reminders

Cron → draft WA reminders from `events` + tickets; Patricia approve → send. Reduces no-shows per events-openclaw-prd ROI.
