# SAN-890 · CK-V2-004 — Migrate /chat (conciergeAgent) to v2

**Task:** [SAN-890 · CK-V2-004 — Migrate /chat (conciergeAgent) to v2 — last, highest-risk](https://linear.app/sanjiovani/issue/SAN-890/ck-v2-004-migrate-chat-conciergeagent-to-v2-last-highest-risk)

**Branch:** `ai/san-890-ck-v2-004-migrate-chat-conciergeagent-to-v2`  
**Base commit:** `697a8759` · **Working tree:** uncommitted slice 2 (tool renders + map pin + HITL)

## Scope (slice 2 — complete)

| Item | Path |
|---|---|
| v2 tool renders (×12) | `src/components/copilot/search-tool-renders-v2.tsx` |
| v2 concierge bridge | `src/components/chat/concierge-copilot-bridge-v2.tsx` |
| v2 map pin | `src/components/copilot/focus-map-pin-action-v2.tsx` |
| v2 shell mount | `src/components/chat/geo-chat-shell-v2.tsx` |
| v1 untouched | `search-tool-renders.tsx` · `geo-chat-shell.tsx` · `concierge-venue-booking-bridge.tsx` |

**Hooks (flag on):** `useAgent(conciergeAgent)` · `useSearchToolRendersV2()` (12× `useRenderTool`) · `useHumanInTheLoop` ×2 (`requestVenueBooking` + `request-venue-booking`) · `useFocusMapPinActionV2` inside `MapsShell`

## Proof commands

```bash
# Flag on — restart dev with both vars first
COPILOTKIT_V2_CHAT=1 NEXT_PUBLIC_COPILOTKIT_V2_CHAT=1 infisical run --silent --env=dev --path=/ -- npm run dev
SAN890_V2=1 COPILOTKIT_V2_CHAT=1 NEXT_PUBLIC_COPILOTKIT_V2_CHAT=1 infisical run --silent --env=dev --path=/ -- node docs/tasks/testing/evidence/SAN-890/san-890-localhost-proof.mjs

# Flag off — restart dev without v2 vars
infisical run --silent --env=dev --path=/ -- npm run dev
infisical run --silent --env=dev --path=/ -- node docs/tasks/testing/evidence/SAN-890/san-890-localhost-proof.mjs
```

## Results (2026-06-14)

| Gate | Flag on | Flag off |
|---|---|---|
| `/chat` HTTP 200 | ✅ | ✅ |
| `[data-testid="geo-chat-shell-v2"]` | ✅ visible | ✅ absent |
| `[data-testid="chat-canvas"]` | ✅ | ✅ |
| `[data-testid="center-chat-panel"]` | ✅ | ✅ |
| Spike shell absent | ✅ | ✅ |
| Rental tool render (`rental-card` or `rentals-empty`) | ✅ | n/a |
| HITL (`venue-booking-hitl-card`) | ✅ | n/a |
| `consoleErrors` | ✅ `[]` | ✅ `[]` |
| Signed-in email (soft) | ✅ | ⬜ not asserted |
| **Verdict** | **PASS** | **PASS** |

**Prompts (flag on):**

- Rental: `1BR in Laureles under $80/night`
- HITL: `Find me a café in Laureles and help me request a booking.` (+ slot-fill / tool nudge if needed)

**Artifacts:**

- `SAN-890-v2-flag-on-results.json` · `SAN-890-v2-flag-off-results.json`
- `SAN-890-v2-flag-on-localhost.png` · `SAN-890-v2-flag-off-localhost.png`
- Runner: `san-890-localhost-proof.mjs`

**Vitest:** `mastra-tool-action-names` · `copilotkit-v2-chat-flag` — 9 passed

## Fixes during slice 2

1. **`FocusMapPinActionV2`** mounted inside `MapsShell` (requires `MapContextProvider`).
2. **HITL render** — relaxed arg gate to match v1 (`safeParse` was returning `null` before card paint).
3. **Proof script** — no mid-run reload (429 avoidance); `waitForCopilotIdle`; HITL multi-turn nudge; inspector hidden.

## Next

1. Commit slice 2 on branch (v2 files + evidence + upgrade docs).
2. Open **single** SAN-890 PR (`Closes SAN-890`) — **do not merge** until review.
3. **[SAN-891 · CK-V2-005 — Retire @copilotkit/react-ui](https://linear.app/sanjiovani/issue/SAN-891/ck-v2-005-retire-copilotkitreact-ui-consolidate-frontend-to-react)** remains blocked until SAN-890 merges.
