# SAN-496 · EVT-037 — Request proposal modal (HITL) — Part 2: modal form UI

**Date:** 2026-06-10
**Branch:** `ai/san-496-evt-037-proposal-modal-form`
**Layer:** UI (the modal form; posts to the Part 1 route)

## What

Turns the inert `EventProposalShell` placeholder into a real request-proposal
modal: an event-details form (event type, date, guests, name, email, optional
phone/notes) that validates and POSTs to `POST /api/events/proposal` (Part 1,
PR #169), then shows a success or error state.

| File | Note |
| --- | --- |
| `src/components/sheets/event-proposal-shell.tsx` | real form + submit/result states; exports presentational `EventProposalForm` |
| `src/components/sheets/event-proposal-shell-core.ts` | testable form→request mapping + `validateEventProposal` (shared `eventProposalSchema`) |
| `src/components/sheets/__tests__/event-proposal-shell-core.test.ts` | 5 unit tests (mapping, trim, party-size/event-type validation) |
| `src/components/sheets/__tests__/event-proposal-shell.test.tsx` | 3 static-render tests (fields, enabled/disabled submit, error) |

## Design notes
- **Testable core, untestable portal:** the dialog content renders through a
  portal (empty under `renderToStaticMarkup`), so the form body is extracted as
  a context-free `EventProposalForm` and the dialog chrome (title/description)
  stays in the shell — mirrors the `EventVenueOfferingsContent` pattern.
- **Client validation** reuses the same `eventProposalSchema` the server route
  uses, so the form and the API agree on the contract.
- Preserves the e2e test-ids (`event-proposal-shell`, `-hitl-panel`, `-cancel-btn`,
  `-submit-btn`) so `e2e/san-494-event-venue-cta.spec.ts` still matches.

## Verification

| Gate | Result |
| --- | --- |
| `npm run floor` (lint → typecheck → build → test → audit) | ✅ **PASS** (exit 0) |
| Vitest — proposal modal | ✅ 8/8 (core 5 + form render 3) |
| Full suite | ✅ 805 passed / 11 skipped |

### Not run here (no browser / empty Infisical env in container)
- Live click-through (open modal → fill → submit → success) — needs a browser +
  real Supabase, neither available in this container. Vercel preview covers the
  deploy; the interactive Playwright path is the follow-up once Part 1 + Part 2
  are on `main`.

## Dependency
The form POSTs to `/api/events/proposal` (Part 1, **PR #169**). Merge Part 1
first (or together) so the endpoint exists; until then the submit returns 404 at
runtime but both PRs compile independently.
