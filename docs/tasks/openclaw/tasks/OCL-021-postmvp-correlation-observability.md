---
id: OCL-021-postmvp
tier: post-mvp
title: Correlation IDs Mastra ↔ OpenClaw
status: Open
priority: P2
depends_on: [OCL-011-mvp]
skill: [mastra, mde-hostinger]
legacy_id: 08G
sources_index: ../docs/sources.md
openclaw_docs:
  - https://docs.openclaw.ai/logging
  - https://docs.openclaw.ai/gateway/diagnostics
github:
  - https://github.com/openclaw/openclaw
---

# OCL-021-postmvp — Correlation

Single `trace_id` on approval, job, Mastra span, OpenClaw task ledger. Patricia can grep logs across VPS + mdeapp.
