# SCREEN-005 rental UI + ChunkLoadError — localhost (2026-05-27)

## Dev restart (mandatory)

```bash
pkill -f "next dev"; pkill -f "mastra dev"; sleep 2
rm -rf mdeapp/.next
cd mdeapp && npm run dev
```

- UI: **http://localhost:3001** — Ready
- Mastra: **:4111**

## ChunkLoadError fix

**Symptom:** `ChunkLoadError` loading `copilotkit_web-inspector` chunk after dev restart.

**Cause:** CopilotKit defaults `showDevConsole` to **on** on localhost → dynamic import of web-inspector; stale `.next` serves 404 for old chunk hashes.

**Code:** `showDevConsole: false` in `getCopilotKitClientProps()` — inspector not loaded in dev.

**Ops:** `rm -rf .next` + hard-refresh if error persists.

## Localhost checks

| Check | Result |
|-------|--------|
| GET / | **200** |
| `chat-smoke.mjs` | **All passed** |
| POST `/api/rentals/search` | **200** (5 Laureles rows, 2026-05-26 verify) |
| Playwright `SCREEN-005-rental-card.spec.ts` | **3/3 pass** (2026-05-26 re-run after `.next` wipe) |
| Vitest sanitize + rental-display | **10/10 pass** |
| Rental UI | No `rental-results-header`; horizontal cards; map 7fr/5fr |

## M01 prompt — browser verified (2026-05-26)

Prompt: `1BR apartment in Laureles under 80 dollars per night` on http://localhost:3001/ after fresh `npm run dev` + `.next` cleared.

| Assertion | Result |
|-----------|--------|
| `[data-testid="rental-card"]` count | **5** |
| `[data-testid="rental-results-header"]` | **0** (component deleted) |
| Body text `What I searched for` | **0** |
| Body text `solid short-term rental` | **0** |
| Body text `Best option` (narrative) | **0** |
| Chat shows | User bubble + inline cards only (no duplicate assistant essay) |

**Verdict localhost:** **PASS** — duplicate Mindtrip prose removed; fast-path renders cards without empty assistant bubble.

## Prod

Not re-tested this run — `/api/rentals/search` still 404 on https://www.mdeai.co/ until deploy.
