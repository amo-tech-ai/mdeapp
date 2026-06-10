---
id: OCL-005-core
tier: core
title: OPENCLAW_DISABLED kill switch
status: Open
priority: P0
depends_on: [OCL-001-core]
skill: [mastra, mde-hostinger]
sources_index: ../docs/sources.md
openclaw_docs:
  - https://docs.openclaw.ai/gateway/configuration
github:
  - https://github.com/openclaw/openclaw
---

# OCL-005-core — Kill switch

`OPENCLAW_DISABLED=1` blocks Mastra enqueue + documents VPS compose stop. Vitest: enqueue returns error when set.
