---
task_id: RE-018
title: Gemini rental clarify routing (stop canned bypass)
layer: APP
priority: P0
phase: core
status: Not Started
persona: Camila
depends_on: [RE-017, INT-001]
unblocks: [RE-016, INT-002]
skills: [copilotkit, copilotkit-integrations, mastra, gemini, mde-task-lifecycle, testing]
commit_ledger: C-014
evidence:
  - ../../testing/evidence/2026-05-28/03-rental-agent-audit.md
paths:
  - mdeapp/src/hooks/use-rental-search-fast-path.ts
  - mdeapp/src/lib/rental-clarify-copy.ts
  - mdeapp/src/components/chat/concierge-chat-input.tsx
  - mdeapp/src/mastra/agents/concierge.ts
description: Let Gemini Flash reason on clarify turns; parser extracts signals first.
---

# RE-018 — Gemini rental clarify routing (P0)

> ⛓️ **Sequencing guard — do NOT deploy before UX-001 + UX-002 are live on prod.** This task's recommended Option A ("remove instant clarify") and its acceptance criteria (*"Response mentions ~$1k/month and/or asks neighborhood"*, *"Second turn … runs search"*) all assume `conciergeAgent` answers on prod. **It does not today** — it returns `RUN_ERROR (EAUTHTIMEOUT)/INCOMPLETE_STREAM` (QA finding F-1). Shipping the clarify→agent reroute before [UX-001](../../ux/UX-001-restore-concierge-agent-prod.md) restores the concierge (and [UX-002](../../ux/UX-002-render-user-facing-error-on-run-error.md) makes a failed run visible) would turn the working canned clarify into a silent dead-end for Camila. Validate this task's prod acceptance **only after** UX-001's smoke is green.

## Problem

`concierge-chat-input.tsx` intercepts **before** `conciergeAgent`:

```text
handleRentalMessage → shouldInstantRentalClarify → RENTAL_CLARIFY_MESSAGE → STOP
```

`concierge.ts` already has Medellín neighborhood + budget intelligence — **never runs on turn 1** for ambiguous rentals.

## Target architecture

```text
User message
→ parser extracts signals (RE-017)
→ IF high confidence → fast-path search (keep)
→ IF needs clarify → conciergeAgent (Gemini 3.5 Flash) OR thin generateText clarify
→ search on next turn
```

**NOT:** `regex → canned clarify → STOP`

## Options (pick one in implementation)

| Option | Pros | Cons |
|--------|------|------|
| **A. Remove instant clarify** | Simplest; full concierge prompt | +1–2s latency; CopilotKit round-trip |
| **B. `generateText` clarify only** | Fast; uses `FLASH_MODEL` | Duplicate prompt slice vs concierge |
| **C. Hybrid** | Instant only for truly empty ("show rentals") | Two code paths |

**Recommend A** for Phase 1 — align parser + agent gates; delete `shouldInstantRentalClarify` path or narrow to `confidence < 0.25` with zero signals.

## Implementation

1. Remove or gut `shouldInstantRentalClarify` + `showClarify` fast-path for rentals when RE-017 signals exist
2. Pass extracted signals into working memory before agent turn (`lastRentalQuery` partial)
3. Update `RENTAL_CLARIFY_MESSAGE` fallback OR delete if agent-only
4. Ensure `conciergeAgent` instructions reference parsed `budgetType` / dates in memory
5. Prod test: hero query gets **neighborhood-style** clarify, not "what dates, budget"

## Acceptance criteria

- [ ] `list rentals in june 1 to 30 $1000 medellin` on prod/preview: **no** canned "What dates, budget, and setup…"
- [ ] Response mentions ~$1k/month and/or asks **neighborhood** (Laureles / Poblado / Envigado)
- [ ] Second turn with "Laureles" runs search + cards
- [ ] Regression: `1BR in Laureles under $80/night` still fast-path (no agent) — `01-rentals-prompt` pass
- [ ] Evidence: `tasks/testing/evidence/2026-05-28/RE-018-gemini-clarify-prod.md`

## Tech stack (verified)

| Layer | Role |
|-------|------|
| CopilotKit | UI + `useCoAgent({ name: "conciergeAgent" })` |
| Mastra | `conciergeAgent` + tools |
| Gemini | `google("gemini-3.5-flash")` via `@ai-sdk/google` in `mastra/lib/models.ts` |
| Parser | Deterministic extract only (RE-017) |

## Do not do

- Do not wire `rentalAgent` yet (RE-020 optional)
- Do not add pgvector (RE-020)

## Verify

```bash
cd mdeapp && npm run dev
# + Playwright or Chrome DevTools on hero query
SMOKE_BASE_URL=https://www.mdeai.co PW_SKIP_WEBSERVER=1 \
  npx playwright test e2e/prod/pr12-pin-clear-prod-gate.spec.ts
```
