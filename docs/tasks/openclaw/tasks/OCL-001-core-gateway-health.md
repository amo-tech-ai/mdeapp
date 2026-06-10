---
id: OCL-001-core
tier: core
title: OpenClaw gateway health stub
status: Open
priority: P0
phase: OCL-0
effort: S
owner: claude
depends_on: []
blocks: [OCL-007-core, OCL-005-core, OCL-006-core]
skill: [mde-hostinger, open-claw]
legacy_id: 05M
sources_index: ../docs/sources.md
openclaw_docs:
  - https://docs.openclaw.ai/gateway/health
  - https://docs.openclaw.ai/gateway
  - https://docs.openclaw.ai/cli/health
github:
  - https://github.com/openclaw/openclaw
---

# OCL-001-core — Gateway health

## Acceptance

1. `GET $OPENCLAW_GATEWAY_URL/health` → 200 from ops machine.
2. mdeapp or script can probe (no secret in client bundle).
3. Document URL in Infisical / hostinger runbook.

## Ref

`plan/openclaw/tasks/05M-openclaw-gateway-health-stub.md`
