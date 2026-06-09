---
id: OCL-007-core
tier: core
title: Rotate OpenClaw gateway token
status: Open
priority: P0
depends_on: [OCL-001-core]
skill: [mde-hostinger, mde-infisical]
sources_index: ../docs/sources.md
openclaw_docs:
  - https://docs.openclaw.ai/gateway/secrets
  - https://docs.openclaw.ai/auth-credential-semantics
github:
  - https://github.com/openclaw/openclaw
---

# OCL-007-core — Token rotate

Revoke exposed gateway token; store new secret in Infisical only. Acceptance: old token 401; mdeapp/Paperclip use new token via env.
