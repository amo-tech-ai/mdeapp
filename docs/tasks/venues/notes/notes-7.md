## VEN-021 implemented on `feat/ven-021-booking-sheet-persist`

Booking sheets now persist to Supabase instead of showing stub copy.

### Data path

`CafeBookingSheet` / `NightlifeBookingSheet` → `VenueBookingForm` → `POST /api/venue-booking/request` → `insertVenueBookingRequest()` → `venue_booking_requests` (`status: pending`, `source: web`, `user_id` from session) → `VenueBookingConfirmationBanner` with honest WhatsApp-pending copy.

- **Auth:** 401 + sign-in gate when logged out (no guest insert; matches RLS).
- **Nightlife:** UI kind `nightlife` → DB `venue_kind = 'nightclub'`.
- **Idempotency:** `vb-{sha256}` from venue + place + requested time; duplicate → 409.

### Files changed

| Area | Files |
|------|--------|
| API | `src/app/api/venue-booking/request/route.ts` (+ tests) |
| Lib | `venue-booking-form-schema.ts`, `venue-booking-core.ts`, `submit-venue-booking.ts` (+ tests) |
| UI | `venue-booking-form.tsx`, `cafe-booking-sheet.tsx`, `nightlife-booking-sheet.tsx`, `venue-booking-confirmation-banner.tsx` |
| Context | `rental-ui-context.tsx`, `geo-chat-shell.tsx` |
| E2E | `SCREEN-021-cafe-listings.spec.ts`, `SCREEN-022-nightlife-listings.spec.ts` |
| Evidence | `tasks/venues/tasks/evidence/VEN-021-verify-2026-06-02.md` |

**Out of scope (unchanged):** restaurant sheet (no component on disk), WhatsApp, GCP/MAP-005/DATA-008, SAN-489, schema.

### Insert proof

| Layer | Result |
|-------|--------|
| Unit/core | Insert + pending message + 409 idempotency — **pass** |
| API route | 401 logged-out, 200 success mock — **pass** |
| Live DB | MCP `SELECT … LIMIT 3` → **0 rows** (no signed-in submit yet) |

To close the live proof gap: sign in on `/chat`, open café booking, submit → paste row `id` into the evidence doc SQL block.

### Tests run

```text
npm run lint          ✅
npm run typecheck     ✅
npm run test -- venue-booking   ✅ 13 tests (4 files)
```

E2E specs updated for form/sign-in gate (not run in this session).

### VEN-021 status: **In Review** (not Done)

Ready for PR after you want a commit. Still missing:

1. One **signed-in** real insert (row id in evidence).
2. Restaurant booking sheet (separate slice).
3. Optional Playwright auth fixture for automated insert proof.

VEN-012/013 sign-off and SAN-489 stay parked per your list. Say if you want this committed with a ledger row (`C-###`).

**`main` @ `ade0623`** — VEN-014b retry guard + PR #49 café e2e are in. GCP miss→hit still parked.

### Recommended order

**1. VEN-021 — booking sheet → Supabase (highest product value)**  
- [SAN-300](https://linear.app/sanjiovani/issue/SAN-300) / `021-ven-booking-sheet-persist.md`  
- Wire “Request visit” to real `venue_booking_requests` (schema **VEN-015** already In Review).  
- Unblocks real leads for café/nightlife; idempotency ties to **VEN-026** if you touch that.

**2. Close venue In Review items (quick wins)**  
- **VEN-012 / VEN-013** — prod sign-off or flip Done (shipped in #48; Linear SAN-295/296).  
- **VEN-014** — leave In Review until you care about GCP proof; code is on `main`.  
- Run full **SCREEN-021** (not just `:92`) after `git pull` + `npm run dev:ui`.

**3. PR #51 — SAN-489 mobile shell (only when you want mobile)**  
- Rebase `ai/san-489-screen-018-mobile-shell` onto `ade0623` (includes #49 `ConciergeUserMessage` fix).  
- Don’t mix with VEN-021 in the same branch.

**4. Parallel tracks (pick one)**  
- **`tasks/copilotkit/prompt-audit.md`** — POST storms, fast-path vs agent routing (quality).  
- **VEN-031 / SAN-314** — full SCREEN-021/022/023 Playwright suite.  
- **Restaurant column** — VEN-009/010 still Todo/In Review (Carlos path).

### Defer unless blocked
- VEN-014 Done + Places miss→hit  
- MAP-005 edge proxy  
- PR #38 / #39 (search/memory — separate tracks)

**Default next move:** start **VEN-021** on a fresh branch from `main`; merge **PR #51** only when mobile is the active focus.

## PR #49 — fixed, merged

**Merged:** https://github.com/amo-tech-ai/mdeapp/pull/49 → `main` @ **`ade0623`**

### CodeRabbit fix (e2e)

```116:120:mdeapp/e2e/screens/SCREEN-021-cafe-listings.spec.ts
    const chatUserBubble = page
      .locator('[data-testid="copilot-chat-region"]')
      .locator('[data-testid="concierge-user-message"]')
      .filter({ hasText: promptText });
    await expect(chatUserBubble.first()).toBeVisible({ timeout: 30_000 });
```

- Removed `promptText.slice(0, 24)`
- Removed `.copilotKitUserMessage` fallback

### Root cause (why e2e failed with only the e2e change)

`CopilotChat` passes **`DefaultUserMessage`** into custom `Messages`, which overrode `ConciergeChatMessages`’s default `ConciergeUserMessage`. Ask-prompt bubbles had `.copilotKitUserMessage` but **no** `data-testid="concierge-user-message"`.

**Fix:** always use `ConciergeUserMessage` inside `ConciergeChatMessages` (ignore CopilotKit’s `UserMessage` prop).

### Files changed (2 commits squashed)

| File | Change |
|------|--------|
| `e2e/screens/SCREEN-021-cafe-listings.spec.ts` | Stable testid + full `promptText` |
| `src/components/chat/concierge-chat-messages.tsx` | `ConciergeUserMessage` forced; exported |

### Verification

| Check | Result |
|--------|--------|
| `npm run lint` | Pass |
| `SCREEN-021:92` (PW_SKIP_WEBSERVER=1) | **Pass** (~12s) |

### Merge readiness

| Item | Verdict |
|------|--------|
| Safe to squash-merge | **Done** |
| Production risk | Low (e2e + testid wrapper only) |
| Blocks VEN-021 | No |

**Local `main`** is at `ade0623`. CodeRabbit thread resolved before merge.