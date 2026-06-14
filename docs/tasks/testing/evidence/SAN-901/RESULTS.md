# SAN-901 · CK-V2-004A — Chat vertical slice spike

**Task:** [SAN-901 · CK-V2-004A — Chat vertical slice spike (useAgent + 1 tool + 1 HITL)](https://linear.app/sanjiovani/issue/SAN-901/ck-v2-004a-chat-vertical-slice-spike-useagent-1-tool-1-hitl)

**Branch:** `ai/san-901-ck-v2-004a-chat-vertical-slice-spike`  
**Proof SHA:** `34d6831` (branch base + spike files uncommitted)

## Scope shipped

| Item | Path |
|---|---|
| Flag | `src/lib/copilotkit-v2-chat-flag.ts` · `COPILOTKIT_V2_CHAT=1` + `NEXT_PUBLIC_COPILOTKIT_V2_CHAT=1` |
| Root skip | `src/components/copilot/copilot-kit-provider.tsx` — no v1 concierge on `/chat` when client flag on |
| Layout gate | `src/app/chat/layout.tsx` → `ChatProviderV2` |
| v2 provider | `src/components/chat/chat-provider-v2.tsx` |
| v2 bridge | `src/components/chat/concierge-copilot-bridge-v2.tsx` |
| Spike shell | `src/components/chat/chat-spike-shell-v2.tsx` |
| Page gate | `src/app/chat/page.tsx` · v1 `chat-page-client.tsx` unchanged |

**Hooks wired (flag on):** `useAgent(conciergeAgent)` · `useRenderTool` (`searchRentalsTool` + `search-rentals`) · `useHumanInTheLoop` (`requestVenueBooking` + `request-venue-booking`)

## Proof commands

```bash
npm test -- --run copilotkit-v2-chat-flag

# Flag off (default)
infisical run --silent --env=dev --path=/ -- node docs/tasks/testing/evidence/SAN-901/san-901-localhost-proof.mjs

# Flag on — both env vars; restart dev first
COPILOTKIT_V2_CHAT=1 NEXT_PUBLIC_COPILOTKIT_V2_CHAT=1 infisical run --silent --env=dev --path=/ -- npm run dev
SAN901_V2=1 COPILOTKIT_V2_CHAT=1 infisical run --silent --env=dev --path=/ -- node docs/tasks/testing/evidence/SAN-901/san-901-localhost-proof.mjs
```

## Results (2026-06-14)

| Gate | Flag off | Flag on |
|---|---|---|
| `/chat` HTTP 200 | ✅ | ✅ |
| Shell | `center-chat-panel` (v1) | `chat-spike-shell-v2` ✅ |
| Rental tool render | n/a | ✅ `spike-rental-results` |
| Venue HITL card | n/a | ⬜ soft (not triggered by rental prompt) |
| Console errors | ✅ `[]` | ✅ `[]` |
| Verdict | **PASS** | **PASS** |

**Artifacts:** `SAN-901-v2-flag-off-results.json` · `SAN-901-v2-flag-on-results.json` · screenshots in this folder.

**Note:** HITL is wired (`useHumanInTheLoop` ×2 names); automated proof only exercises rental tool. Manual café-booking prompt can verify HITL before [SAN-890 · CK-V2-004 — Migrate /chat (conciergeAgent) to v2 — last, highest-risk](https://linear.app/sanjiovani/issue/SAN-890/ck-v2-004-migrate-chat-conciergeagent-to-v2-last-highest-risk).
