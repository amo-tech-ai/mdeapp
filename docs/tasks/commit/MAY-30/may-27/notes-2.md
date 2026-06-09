# What went wrong (plain English)

## The short version

**Rentals on [mdeai.co](https://www.mdeai.co) do not work reliably yet** because the code that makes instant rental cards fast is still sitting in your laptop, not on production. PR #8 only fixed a dev-tool glitch; it did not ship rental search.

---

## Problem 1 — Production has no rental fast-path API

| What you see | User sends a rental query on mdeai.co → no cards / stalls |
| What we tested | `POST https://www.mdeai.co/api/rentals/search` → **404** |
| Why | That route and the fast-path UI were never merged or deployed |
| Fix | Ship **PR3** (rentals fast-path) and deploy to Vercel |

Localhost **does** have the route (when dev server runs with your WIP code).

---

## Problem 2 — PR #8 did not fix rentals

| What shipped in PR #8 | `showDevConsole: false` on CopilotKit (stops dev inspector ChunkLoadError) |
| What did **not** ship | `/api/rentals/search`, rental fast-path panel, Mindtrip-style cards |

So: **PR #8 ≠ rentals working on prod.** It was a small dev stability fix only.

---

## Problem 3 — PR2 (dedup) had broken Vercel builds (fixed before merge)

When we opened PR #9, Vercel failed because the commit referenced files that were **not included** in that PR:

- `@/components/cafe/cafe-detail-panel` (café UI — still WIP locally)
- `@/lib/sanitize-assistant-chat-content` (rental sanitizer — still WIP locally)

**Fix applied:** two follow-up commits removed those imports / inlined minimal logic, then Vercel passed. **PR #9 is merged.**

---

## Problem 4 — Current branch: app won’t build (blocks PR3 + all tests)

| Error | Meaning |
|-------|---------|
| `useEventFastPath must be used within EventFastPathProvider` | Some code calls `useEventFastPath()` but the React provider tree doesn’t wrap the app with `EventFastPathProvider` |
| `GET / failed: 500` in Playwright | Home page crashes during prerender → e2e can’t run |

**Cause:** `chat-center-panel.tsx` imports `EventFastPathPanel`, which needs `EventFastPathProvider`, but `geo-chat-shell.tsx` on current branch only has `RichCardResultsProvider` (from merged PR2), not the event provider.

**Fix:** Either add `EventFastPathProvider` around the tree for this branch, or remove `EventFastPathPanel` from `chat-center-panel` until PR5 (events) lands.

---

## Problem 5 — Lint / floor gate

| Command | Result |
|---------|--------|
| `npm run lint` | Fails on unused-variable warnings in WIP files (`event-local-chat-context`, `rental-display`, etc.) |
| `npm run floor` | Stops at lint (same warnings) |

Not caused by PR2 dedup logic itself; pre-existing WIP noise.

---

## Correct order to fix rentals for real users

1. Fix provider/build on current branch (so `/` loads).
2. Finish **PR3** — rentals API + fast-path only (no café/event spill).
3. Merge PR3, deploy to Vercel.
4. Prod gate:
   - `POST https://www.mdeai.co/api/rentals/search` → **200** + JSON
   - Rental query on mdeai.co → cards + map pins
   - No duplicate “Map results” list when cards show

**Do not mark SAN-242 / SAN-243 Done** until step 4 passes on production.

---

## Scorecard (audit)

| Area | Status |
|------|--------|
| PR2 dedup intent | Good (merged) |
| PR2 deploy build | Fixed before merge |
| PR3 rentals code (local) | Present in WIP, not deployed |
| Prod rental API | **Missing (404)** |
| Prod rental UX | Unreliable (agent path only, slow/flaky) |
| Current branch build | **Broken** (provider mismatch) |
| E2E on `/` | **Blocked** (500) |

**Overall readiness for “rentals work on prod”:** blocked until PR3 deploy + prod verification.

---

## One-line takeaway

> We fixed the wrong thing in PR8 (dev inspector). Rentals need PR3 deployed; right now prod still 404s on `/api/rentals/search`, and the current git branch can’t even build the home page until provider wiring is fixed.
