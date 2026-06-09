---
task_id: ven-031b
mvp_step: 031b
title: SCREEN-021 ask-prompt — fast path vs CopilotKit DOM
layer: TEST
priority: P2
status: Done
estimated_effort: 0.5 day
depends_on: [ven-010, ven-031]
unblocks: []
skills: [playwright-cli, copilotkit-debug, copilotkit]
description: Fix e2e for café detail ask-prompt when grounded fast path uses local chat exchange instead of CopilotKit user messages.
---

# VEN-031b — SCREEN-021 ask-prompt e2e fix

## Problem

`SCREEN-021-cafe-listings.spec.ts` → **"ask prompt keeps detail panel open and injects chat"** fails:

- Test expects `.copilotKitUserMessage` to contain café ask-prompt text after click.
- Grounded **fast path** uses `showExchange()` (local chat) — last CopilotKit user message stays the initial query or `waitForCafeGroundedCards` retry nudge.
- `CafeDetailPanel` `appendMessage()` may not surface in the same DOM selector under fast path.

## Not a VEN-012/013 regression

Nightlife PR #48 did not change ask-prompt wiring. Core SCREEN-021 paths (cards, detail, booking stub, mobile) pass.

## Acceptance criteria

1. `npx playwright test e2e/screens/SCREEN-021-cafe-listings.spec.ts --project=chromium` → **6/6** pass.
2. Either:
   - Assert on fast-path local message region (`data-testid` for event-local-chat), **or**
   - Force agent path for this test only (disable fast path for query), **or**
   - Wire ask-prompt to append visible user bubble in both fast path + CopilotKit modes.

## Verify

```bash
cd mdeapp
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-021-cafe-listings.spec.ts:92 --project=chromium
```

## Related

- VEN-031 Playwright venue screens pack
- PR #48 evidence: SCREEN-021 4/5 (this test only)
