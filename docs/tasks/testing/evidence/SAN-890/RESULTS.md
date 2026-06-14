# SAN-890 · CK-V2-004 — GeoChatShellV2 scaffold (slice 1)

**Task:** [SAN-890 · CK-V2-004 — Migrate /chat (conciergeAgent) to v2 — last, highest-risk](https://linear.app/sanjiovani/issue/SAN-890/ck-v2-004-migrate-chat-conciergeagent-to-v2-last-highest-risk)

**Slice:** GeoChatShellV2 scaffold + route swap (not full tool migration)

**Branch:** `ai/san-890-ck-v2-004-migrate-chat-conciergeagent-to-v2`

## Scope (this slice)

| Item | Path |
|---|---|
| v2 geo shell | `src/components/chat/geo-chat-shell-v2.tsx` |
| v2 canvas / center | `chat-canvas-v2.tsx`, `chat-center-panel-v2.tsx` |
| Page swap | `src/app/chat/page.tsx`, `chat-page-v2-client.tsx` |
| Provider / layout | `chat-provider-v2.tsx`, `layout.tsx`, `concierge-copilot-bridge-v2.tsx` (spike bridge unchanged) |
| Coagent fix | `ConciergeCoAgentProvider` + `ConciergeSessionProvider` inside v2 shell (root skips v1 coagent on `/chat`) |

**Not in this slice:** full `search-tool-renders` → `useRenderTool`, map pin `useFrontendTool`, HITL proof, react-ui removal.

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
| `consoleErrors` | ✅ `[]` | ✅ `[]` |
| Signed-in email (soft) | ⬜ not asserted | ⬜ not asserted |
| **Verdict** | **PASS** | **PASS** |

**Artifacts:** `SAN-890-v2-flag-on-results.json` · `SAN-890-v2-flag-off-results.json` · PNG screenshots in this folder.

**Head SHA at proof:** see JSON `headSha` (update after provider-fix commit).

## Next (slice 2+)

1. Port remaining tool renders (`search-tool-renders.tsx` → `useRenderTool`)
2. Port `FocusMapPinAction` → `useFrontendTool`
3. HITL proof: café booking prompt → `venue-booking-hitl-card`
4. Open single SAN-890 PR when all gates above PASS
