# SAN-495 · EVT-036 — Event offerings detail panel + proposal CTA shell

**Date:** 2026-06-10  
**Branch:** `ai/san-495-evt-036-event-offerings-detail-panel`  
**Class:** U  
**Persona:** Tourist on `/chat` — Mamacita-style venue offerings sheet  
**Linear:** [SAN-495 · EVT-036 — Event offerings detail panel](https://linear.app/sanjiovani/issue/SAN-495)

---

## Final verdict (updated 2026-06-10 post-fix)

| Gate | Result |
|------|--------|
| **Grade** | **B+** |
| **Percent complete (spec)** | **98%** |
| **Ready for merge?** | **Yes** — floor ✅ on PR #164 @ `15ca283` |
| **Ready for Done?** | **After** manual browser screenshot (`SAN-495-browser.png`) |
| **Production risk** | **Low** — SELECT-only fetch, disabled submit, no writes |

### PR #164 CI (2026-06-10 @ `15ca283`)

| Check | Result |
|-------|--------|
| floor | ✅ pass ([run 27276258784](https://github.com/amo-tech-ai/mdeapp/actions/runs/27276258784)) |
| Vercel preview | ✅ pass |
| CodeRabbit | ⏳ in progress |
| Build fix | ✅ `venue-booking-direct-hitl-context.tsx` committed (`15ca283`) — reviewer module-not-found **resolved** |

---

## Task 1 — Verification runs

### Vitest (deterministic)

```bash
npm test -- --run event-venue-offerings fetch-event-venue restaurant-card
# 2026-06-10 → 3 files, 14/14 passed
```

| Check | Result |
|-------|--------|
| `partnerId` in fetch DTO | 🟢 |
| `minimumSpend` on offering cards | 🟢 |
| `request-proposal-btn` testid | 🟢 |
| No "later release" copy | 🟢 |

### Playwright (live LLM + DB)

```bash
PW_SKIP_WEBSERVER=1 npx playwright test e2e/san-494-event-venue-cta.spec.ts --project=chromium
```

| Run | Result | Notes |
|-----|--------|-------|
| 2026-06-10 07:09 | ❌ FAIL | Chat input timeout (dev server down) |
| 2026-06-10 07:09 | ❌ FAIL | `restaurant-card` count 0 after 150s — message never produced cards |

**Screenshot:** [`SAN-495-playwright-fail-2026-06-10.png`](./SAN-495-playwright-fail-2026-06-10.png) — page stuck on welcome message; no restaurant cards.

**Not verified this session (blocked by e2e):**

- Event Venue CTA → offerings sheet (live)
- `minimumSpend` visible (live)
- Proposal shell open/close (live)
- Console error sweep (live)

**Prior art:** [SAN-494 evidence](./SAN-494-evt-035-RESULTS.md) — same spec passed 2026-06-10 with proposal flow extension in `assertSheetFlow`.

---

## Task 2 — Linear / wire audit

### [SAN-495 · EVT-036](https://linear.app/sanjiovani/issue/SAN-495) success criteria

| Criterion | Impl | Notes |
|-----------|------|-------|
| Min spend on **offering** cards | ✅ | `event-venue-offering-minimum-spend` testid |
| `partnerId` in fetch DTO | ✅ | `partner_locations.partner_id` |
| `partnerLocationId` retained | ✅ | unchanged |
| `request-proposal-btn` → SAN-496 shell, no insert | ✅ | `EventProposalShell`, submit disabled |
| Remove "later release" copy | ✅ | |
| Vitest + sheet from SAN-494 CTA | ✅ | 14/14 |
| Blocked by SAN-492 ✅ · SAN-494 ✅ | ✅ | |

### links-plan.md § SAN-495

| Requirement | Status |
|-------------|--------|
| Extend sheet, no fork | ✅ |
| `minimum_spend` on offerings not packages | ✅ |
| CTA opens shell only | ✅ |
| No DB write / no agent call | ✅ |

### VEB-W01 (MVP sheet)

| Item | Status |
|------|--------|
| `request-proposal-btn` testid | ✅ |
| Min spend on offering row | ✅ |
| Sticky footer CTA | ✅ (SheetFooter) |
| Loading skeleton / empty / error states | ⬜ deferred (post-MVP per W01) |
| CTA label "Request **event** proposal" | 🟡 impl says "Request proposal" (cosmetic) |

### EVT remediation plan Task 1

All **Build** and **Do NOT** items satisfied. **Acceptance** path code-complete; live journey not evidenced this run.

### Scope creep check

**None.** No Mastra tool, no workflow, no migrations, no admin queue.

### Missing (non-blocking)

1. Live Playwright / browser screenshot for class **U** Done gate  
2. Optional: align button copy to wire ("Request event proposal")  
3. W01 loading/empty/error states — explicitly post-MVP

**Audit score:** 95% (5% = live U proof + cosmetic label)

---

## Task 3 — Code review

### `event-proposal-shell.tsx`

| Finding | Severity | Action |
|---------|----------|--------|
| Submit `disabled` — no click handler | — | Correct for SAN-495 |
| `partnerId` / `partnerLocationId` in target unused in UI | Info | Reserved for SAN-496 |
| Dialog over open Sheet — both visible | Low | OK for placeholder; SAN-496 may close sheet first |
| No `aria-describedby` on disabled submit | Low | Add hint in SAN-496 |

**Bugs:** none  
**TypeScript:** clean

### `event-venue-offerings-sheet.tsx`

| Finding | Severity | Action |
|---------|----------|--------|
| `minimumSpend` takes priority over `pricePerPersonFrom` | — | Correct per schema |
| `amenities` in DTO not rendered | Info | Pre-existing; out of scope |
| `useRentalUi` required — sheet only mounted under provider | — | OK |
| No loading state while offerings fetch | Low | Hook loads before sheet opens (SAN-494) |

**Bugs:** none

### `fetch-event-venue-offerings.ts`

| Finding | Severity | Action |
|---------|----------|--------|
| `!location.partner_id` → null payload | Low | Correct — SAN-496 insert needs partner |
| SELECT only — no writes | — | ✅ |
| Schema-unavailable → null (prod-safe) | — | ✅ |

**Bugs:** none

### `rental-ui-context.tsx` / `geo-chat-shell.tsx`

| Finding | Severity | Action |
|---------|----------|--------|
| Proposal shell state mirrors booking pattern | — | ✅ |
| `closeEventProposalShell` on new chat | — | ✅ |

**Bugs:** none

---

## Task 4 — Production readiness (read-only)

| Check | Result |
|-------|--------|
| No `bookings` INSERT | ✅ grep clean on changed files |
| No `venue_booking_requests` INSERT | ✅ |
| No `createEventProposal` / `create-event-proposal` | ✅ |
| No workflow execution | ✅ |
| Fetch is SELECT-only | ✅ |
| Submit proposal disabled | ✅ |

**SAN-495 remains read-only.**

---

## Task 5 — Real-world journey

```text
Tourist → Restaurant Card → Event Venue → Offerings Sheet → Request Proposal → Proposal Shell
```

| Step | Code | Live e2e this session |
|------|------|------------------------|
| Restaurant card | ✅ SAN-494 | ❌ cards not rendered |
| Event Venue CTA | ✅ | — |
| Offerings sheet + min spend | ✅ Vitest | — |
| Request proposal btn | ✅ Vitest | — |
| Proposal shell (no submit) | ✅ Vitest + spec code | — |

**End-to-end live:** **Not proven this session.** Unit path **proven**.

---

## Merge recommendation

**Merge the PR** after CodeRabbit/cubic on ≤15 files — implementation matches Linear, low prod risk.

**Do not flip Linear Done** until one of:

1. Green `e2e/san-494-event-venue-cta.spec.ts` with `infisical run` + dev server, or  
2. Manual browser matrix screenshot → `tasks/testing/evidence/2026-06-10/SAN-495-browser.png`

**Do not start SAN-501 / SAN-502.**

### Next critical path

1. SAN-299 / SAN-302 — HITL 4/4 Playwright evidence  
2. SAN-865 — `partner_id` lookup in core  
3. SAN-496 — proposal HITL + migration  
4. SAN-501 — workflow  
5. SAN-502 — Patricia queue  

---

## Files in scope

- `src/lib/venues/event-venue-offerings-types.ts`
- `src/lib/venues/fetch-event-venue-offerings.ts`
- `src/components/sheets/event-venue-offerings-sheet.tsx`
- `src/components/sheets/event-proposal-shell.tsx`
- `src/components/chat/rental-ui-context.tsx`
- `src/components/chat/geo-chat-shell.tsx`
- `src/components/chat/concierge-session-context.tsx`
- Tests + `e2e/san-494-event-venue-cta.spec.ts` (extended)

Suggested commit: `feat(events): add event offerings proposal CTA shell`
