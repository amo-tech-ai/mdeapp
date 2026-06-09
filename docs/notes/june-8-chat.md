# SAN-733 — Concierge restore (June 8, 2026)

**Status:** Shipped — PR #134 merged to `main` (`b5c968c`); prod verified.

## Architecture

| Route | Surface |
|-------|---------|
| `/` | Marketing home — hero search, FAB, discovery rails |
| `/chat` | Concierge — `GeoChatShell` (chat + cards + map) |
| `/?q=` | Server redirect → `/chat?q=` → auto-send → strip to `/chat` |

## Review fixes (pre-merge)

| Finding | Action |
|---------|--------|
| Fast-path errors outside try | Full handler chain wrapped in try/catch (`concierge-send-user-message.ts`) |
| Strip-before-send | `router.replace("/chat")` moved to `.finally()` after send |
| DOM polling for chatReady | Removed; gate on `useCopilotChat().isLoading` only |
| Whitespace-only `?q=` | Canonicalize immediately; no send |

## Verification

| Check | Local | Prod |
|-------|-------|------|
| `GET /` | 200 marketing home | 200 |
| `GET /chat` | 200 GeoChatShell | 200 (was 307 pre-fix) |
| `/?q=` redirect | 307 → `/chat?q=` | ✓ |
| Home → chat handoff | Hero → auto-send → cards → URL `/chat` | ✓ |
| Vitest | 747/747 | — |
| `prod-synthetic-smoke` | — | 4/4 verticals PASS |

**Evidence:** `tasks/testing/evidence/2026-06-08/concierge-restore-RESULTS.md`, `prod-live-RESULTS.md`

## E2E

- `e2e/home-to-chat.spec.ts` — SAN-733 handoff + vertical matrix (incl. nightlife)
- Hero submit uses `fill()` + `form.requestSubmit()` for reliable React controlled input

## Known non-blocking

- Prod empty-body `POST /api/copilotkit` → 401 (smoke expects 400; pre-existing)
- Occasional slow-agent path leaves `?q=` until clarify completes
- Vector map WebGL fallback in Electron/Cursor browser — cosmetic
