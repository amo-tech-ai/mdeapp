---
id: OCL-012-mvp
tier: mvp
title: E2E — reject OpenClaw job without approval
status: Open
priority: P0
depends_on: [OCL-003-core]
skill: [open-claw, testing, task-verifier, webapp-testing]
sources_index: ../docs/sources.md
verify_skill: task-verifier
---

# OCL-012-mvp — Safety E2E

Script or Playwright: attempt job insert without `approval_id` → fail; approved path → job queued (mock gateway). Evidence in `tasks/notes/OCL-0-evidence.md`.
