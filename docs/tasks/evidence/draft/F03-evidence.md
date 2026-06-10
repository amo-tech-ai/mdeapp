# F03 evidence — 2026-05-20

## Acceptance test results

| # | Test | Result |
|---|---|---|
| T1 | weather.tsx deleted | ✅ OK |
| T2 | moon.tsx deleted | ✅ OK |
| T3 | proverbs.tsx deleted | ✅ OK |
| T4 | no orphan imports (`WeatherCard\|MoonCard\|ProverbsCard`) | ✅ OK |
| T5 | no orphan component refs (`from @/components/{weather,moon,proverbs}`) | ✅ OK |
| T6 | layout has `lang="en"` (Phase 1 English) | ✅ OK |
| T7 | layout has `agent="pingAgent"` | ✅ OK |
| T8 | layout has mdeai metadata | ✅ OK |
| T9 | page uses `useCoAgent<MdeState>` + `name: "pingAgent"` | ✅ OK |
| T10 | English sidebar labels | ✅ OK |
| T11 | v1 hooks only (no v2 imports in `src/app/`) | ✅ OK |
| T13 | `npm run build` exits 0 | ✅ OK (Generating static pages 5/5 in 1286ms; 3 routes generated: `/`, `/_not-found`, `/api/copilotkit`) |

**Pass rate: 12/12.**

## What changed (5 files affected)

### Deleted (3)

```
mdeapp/src/components/weather.tsx       (cloned-example demo using weatherAgent)
mdeapp/src/components/moon.tsx          (cloned-example HITL demo)
mdeapp/src/components/proverbs.tsx      (cloned-example shared-state demo)
```

### Rewritten (2)

```
mdeapp/src/app/layout.tsx               (agent="weatherAgent" → "pingAgent"; mdeai metadata; lang="en" kept per English-Phase-1 directive)
mdeapp/src/app/page.tsx                 (English shell; useCoAgent<MdeState>; mdeai concierge labels)
```

### Created — amended demos preserved as mdeai-themed reference for W3-W5

After the user requested "can we amend the demos for mdeai", three mdeai-themed adaptations of the original CopilotKit patterns were created under PRD §20 canonical paths. **None are imported by `page.tsx` yet** — they exist as reference primitives for W3-W5.

```
mdeapp/src/components/cards/PlaceInfoCard.tsx       (adapted from weather.tsx)
mdeapp/src/components/cards/SavedItemsCard.tsx      (adapted from proverbs.tsx)
mdeapp/src/components/approvals/ApprovalPanel.tsx   (adapted from moon.tsx)
```

| Original demo | Pattern demonstrated | Adapted as | W3-W5 foundation for |
|---|---|---|---|
| `weather.tsx` (WeatherCard) | Tool-based generative UI — `useCopilotAction({ render, available: "disabled" })` | `PlaceInfoCard` (mdeai teal + 📍 pin + price COP + neighborhood + rating + distance) | `RentalCard`, `VenueCard`, `EventCard`, `GroundedPlaceCard` (PRD §20) |
| `moon.tsx` (MoonCard) | HITL approval — `useCopilotAction({ renderAndWaitForResponse })` | `ApprovalPanel` (PRD §17 strict state machine — Approve / Edit / Reject; English labels) | Roberto's W3 `preview_and_publish` HITL flow |
| `proverbs.tsx` (ProverbsCard) | Shared-state list — bidirectional `useCoAgent<T>` array mutation | `SavedItemsCard` (generic over items: string[] with onRemove handler) | Camila's W5 saved-places list |

## Net DoD verification

- [x] `src/components/{weather,moon,proverbs}.tsx` deleted (T1-T3)
- [x] `src/app/layout.tsx` `agent="pingAgent"` + `<html lang="en">` (kept per English-Phase-1) + mdeai metadata (T6-T8)
- [x] `src/app/page.tsx` rewritten with English labels, `useCoAgent<MdeState>`, no demo imports (T9-T11)
- [x] No remaining imports of `WeatherCard`, `MoonCard`, `ProverbsCard` (T4)
- [x] Evidence captured (this file)
- [x] Build passes (T13)

## Follow-ups

- F04 (next): wire `.env.local` with Supabase + Maps + `GOOGLE_GENERATIVE_AI_API_KEY` from workspace `/home/sk/mdeai/.env.local`
- F05: live boot — type "hi" in sidebar → verify Gemini English reply
- W3 task: import `ApprovalPanel` in `src/app/host/event/new/page.tsx` for Roberto's flow
- W5 task: import `PlaceInfoCard` + `SavedItemsCard` for Camila's surfaces
