---
title: Events task ID migration — EVT/F → EVP
date: 2026-05-27
scheme: EVP-{NNN}-{tier}-{slug}.md
tiers: core | mvp | advanced
---

# Legacy ID map

| New ID | Tier | Old ID | Filename |
|--------|------|--------|----------|
| EVP-001-core | core | EVT-MVP-01 | production-proof-gates |
| EVP-002-core | core | EVT-01 | ticket-checkout-webhook-port |
| EVP-003-core | core | F11 | stripe-webhook-secret-audit |
| EVP-004-core | core | F14 | event-agent-port |
| EVP-005-core | core | F15 | event-tool-and-workflow |
| EVP-006-core | core | F39 | event-clarify-gate-and-chips |
| EVP-007-core | core | F40 | event-agent-prompt-and-sources |
| EVP-008-core | core | F33 | event-draft-state-types |
| EVP-009-core | core | F34 | host-event-agent |
| EVP-010-core | core | F36 | host-event-new-wizard |
| EVP-011-core | core | F37 | approval-panel-hitl |
| EVP-012-core | core | F38 | approval-commit-edge-fn |
| EVP-013-core | core | F25 | event-card-component |
| EVP-014-core | core | F35 | host-events-list-page |
| EVP-015-mvp | mvp | EVT-MVP-02 | grounded-event-discovery |
| EVP-016-mvp | mvp | EVT-MVP-03 | event-maps-venue-integration |
| EVP-017-mvp | mvp | F41 | event-grounding-architecture |
| EVP-018-mvp | mvp | F42 | event-web-discovery-task-pack |
| EVP-019-mvp | mvp | EVT-D01 | research-official-docs |
| EVP-020-mvp | mvp | EVT-D02 | discovered-events-data-model |
| EVP-021-mvp | mvp | EVT-D05 | google-search-grounding |
| EVP-022-mvp | mvp | EVT-D03 | event-discovery-workflow |
| EVP-023-mvp | mvp | EVT-D04 | adk-search-maps-agents |
| EVP-024-mvp | mvp | EVT-D06 | places-enrichment |
| EVP-025-mvp | mvp | EVT-D07 | copilotkit-discovery-ui |
| EVP-026-mvp | mvp | EVT-D09 | human-approval-save-flow |
| EVP-027-mvp | mvp | EVT-D10 | discovery-test-plan |
| EVP-028-mvp | mvp | EVT-D11 | production-readiness |
| EVP-029-advanced | advanced | EVT-MVP-04 | sponsor-crm-lite |
| EVP-030-advanced | advanced | EVT-MVP-05 | openclaw-postiz-approval-sandbox |
| EVP-031-advanced | advanced | EVT-D08 | openclaw-automation-plan |

**PRD week IDs (F33, F14, …)** remain valid in `plan/prd` cross-refs; execution index uses **EVP-*** only.
