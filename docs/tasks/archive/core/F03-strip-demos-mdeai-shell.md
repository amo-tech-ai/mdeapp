---
id: F03
title: Strip weather/moon/proverbs demo + rewrite page.tsx + layout.tsx as mdeai shell
status: Done
completed_at: 2026-05-20
priority: P0
effort: 45 min
owner: claude
depends_on: [F01, F02]
skill: [copilotkit-develop, copilotkit-integrations]
evidence: /home/sk/mdeai/tasks/notes/F03-evidence.md
test_pass_rate: 12/12
amendment_note: "Original 3 demos deleted; mdeai-themed adaptations preserved under src/components/cards/ + src/components/approvals/ as W3-W5 reference primitives. Not imported by page.tsx."
verified_against:
  - /home/sk/mdeai/.claude/skills/copilotkit-develop/SKILL.md (v2 — adapt to v1 patterns)
  - /home/sk/mdeai/CopilotKit/examples/integrations/mastra/src/app/page.tsx (verbatim demo source)
---

# F03 — Strip demos + rewrite `page.tsx` + `layout.tsx` as mdeai shell

## 1. Purpose

The example ships with three demo components (`weather.tsx`, `moon.tsx`, `proverbs.tsx`) and a `page.tsx` that exercises them via `useCopilotAction({ render })`, `renderAndWaitForResponse`, and `useCoAgent`. Useful as reference, not for mdeai. Replace the demos with a minimal **English-labeled** `<CopilotSidebar>` + a tiny landing card. The replaced page becomes the "hello" surface used in F05 verification, then is overwritten in week 6 by Camila's real chat.

> **Language scope (per CLAUDE.md):** Phase 1 ships in English. Lingui + Spanish are Phase 2 (W7+). No `<html lang="es">`, no Spanish placeholders.

## 2. Goals

- `src/components/weather.tsx`, `moon.tsx`, `proverbs.tsx` deleted (3 files removed)
- `src/app/page.tsx` rewritten as a ~50-line mdeai shell — sidebar + landing card showing agent state
- `src/app/layout.tsx` updated:
  - `<html lang="en">` — keep (Phase 1 = English; Phase 2 introduces Spanish via Lingui)
  - `metadata.title` and `metadata.description` set to mdeai values
  - `<CopilotKit agent="weatherAgent">` → `<CopilotKit agent="pingAgent">`
- `src/app/globals.css` left as-is for now (Paisa brand tokens come in F07)

## 3. Features (what the user gets)

- **Sofía (dev):** opens `http://localhost:3000` (or 3001 fallback) and sees a clean English-labeled sidebar plus a small "day 1" card. No weather widgets, no moon button.
- **Camila / Roberto:** still nothing — but the shell is now mdeai-shaped, ready for week 3–6.

## 4. Workflows

1. `rm /home/sk/mdeai/mdeapp/src/components/weather.tsx /home/sk/mdeai/mdeapp/src/components/moon.tsx /home/sk/mdeai/mdeapp/src/components/proverbs.tsx`
2. Edit `src/app/layout.tsx`:
   - Keep `<html lang="en">` (Phase 1 = English; Lingui + Spanish in Phase 2)
   - Set `metadata = { title: "mdeai — concierge for Medellín", description: "AI-first discovery for Medellín: rentals, events, nightlife." }`
   - Change `agent="weatherAgent"` → `agent="pingAgent"` on `<CopilotKit>`
3. Rewrite `src/app/page.tsx`:
   ```tsx
   "use client";

   import { CopilotKitCSSProperties, CopilotSidebar } from "@copilotkit/react-ui";
   import { useCoAgent } from "@copilotkit/react-core";
   import type { MdeState } from "@/lib/types";

   export default function HomePage() {
     return (
       <main style={{ "--copilot-kit-primary-color": "#0f766e" } as CopilotKitCSSProperties}>
         <CopilotSidebar
           defaultOpen
           clickOutsideToClose={false}
           labels={{
             title: "mdeai concierge",
             initial:
               "👋 Hi — I'm the mdeai assistant. Day-1 echo mode. Type anything to test the connection.",
           }}
         >
           <Shell />
         </CopilotSidebar>
       </main>
     );
   }

   function Shell() {
     const { state } = useCoAgent<MdeState>({
       name: "pingAgent",
       initialState: { lastQuery: "", hint: "" },
     });
     return (
       <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50 text-slate-900">
         <div className="max-w-xl w-full">
           <h1 className="text-3xl font-semibold mb-2">mdeai-app — day 1</h1>
           <p className="text-sm text-slate-600 mb-6">CopilotKit 1.55.2 + Mastra + Gemini 3.5 Flash.</p>
           <pre className="text-xs bg-white border border-slate-200 rounded p-3 overflow-x-auto">
             {JSON.stringify(state, null, 2)}
           </pre>
         </div>
       </div>
     );
   }
   ```

## 5. User journeys

- **Sofía:** removes 3 files, rewrites 2 files (`layout.tsx`, `page.tsx`). After F05 boot, sees the mdeai sidebar.
- **Lucía (QA):** confirms no remaining import of the deleted demo components anywhere in `src/` via grep.

## 6. Agents

No new agents. References the `pingAgent` registered in F02.

## 7. Integrations

| Integration | Purpose |
|---|---|
| `@copilotkit/react-ui` | `<CopilotSidebar>` + `CopilotKitCSSProperties` |
| `@copilotkit/react-core` | `useCoAgent` typed hook |

## 8. Summary

Strip the example's weather demo and replace the landing page with an English-labeled mdeai sidebar that reads `pingAgent` state. It helps Sofía verify the runtime works for mdeai's data shape, not the demo's. We'll know it worked when the sidebar opens with English labels and the state pre-renders as `{ lastQuery: "", hint: "" }`.

## 9. Definition of Done

- [ ] `src/components/{weather,moon,proverbs}.tsx` deleted (verify with `ls src/components/`)
- [ ] `src/app/layout.tsx` `agent="pingAgent"` + `<html lang="en">` (keep) + mdeai metadata
- [ ] `src/app/page.tsx` matches the rewrite above (English labels, `useCoAgent<MdeState>`, no demo imports)
- [ ] No remaining imports of `weather`, `moon`, or `proverbs` in any file
- [ ] Evidence: `grep -r "WeatherCard\|MoonCard\|ProverbsCard" src/` returns nothing
- [ ] Evidence: diff vs the example shows clean changes only in 2 edited + 3 deleted files

## 10. Tests

Run from `mdeapp/`. All must pass before marking Done.

### Acceptance tests (automated)

| # | Maps to DoD | Command | Expected |
|---|---|---|---|
| T1 | weather.tsx deleted | `test ! -f src/components/weather.tsx && echo OK` | `OK` |
| T2 | moon.tsx deleted | `test ! -f src/components/moon.tsx && echo OK` | `OK` |
| T3 | proverbs.tsx deleted | `test ! -f src/components/proverbs.tsx && echo OK` | `OK` |
| T4 | no orphan imports | `! grep -rn "WeatherCard\|MoonCard\|ProverbsCard" src/ && echo OK` | `OK` |
| T5 | no orphan component refs | `! grep -rn "from.*['\"]\(@/components/weather\|@/components/moon\|@/components/proverbs\)['\"]" src/ && echo OK` | `OK` |
| T6 | layout has `lang="en"` | `grep -q 'lang="en"' src/app/layout.tsx && echo OK` | `OK` |
| T7 | layout has `agent="pingAgent"` | `grep -q 'agent="pingAgent"' src/app/layout.tsx && echo OK` | `OK` |
| T8 | layout has mdeai metadata | `grep -q "mdeai" src/app/layout.tsx && echo OK` | `OK` |
| T9 | page uses pingAgent + MdeState | `grep -q 'useCoAgent<MdeState>' src/app/page.tsx && grep -q 'name: "pingAgent"' src/app/page.tsx && echo OK` | `OK` |
| T10 | English sidebar labels | `grep -q "mdeai concierge" src/app/page.tsx && grep -q "I'm the mdeai assistant" src/app/page.tsx && echo OK` | `OK` |
| T11 | v1 hooks only | `! grep -rn "useFrontendTool\|useRenderTool\|useHumanInTheLoop\|@copilotkit/react-core/v2" src/app/ && echo OK` | `OK` (Phase 1 W1 = v1) |
| T12 | hook pass — copilotkit-version-pin | feed `src/app/page.tsx` + `layout.tsx` content via stdin to hook | `exit=0` |
| T13 | build green | `npm run build 2>&1 \| tail -5` | exit 0 |

### Manual tests (visual — runs after F05 boot)

| # | Test | How | Expected |
|---|---|---|---|
| Tm1 | sidebar opens automatically | open localhost:3000 | sidebar visible on right edge, default-open |
| Tm2 | Title visible | inspect sidebar header | "mdeai concierge" |
| Tm3 | landing card shows state JSON | look at center of page | `<pre>{ "lastQuery": "", "hint": "" }</pre>` |

### Negative tests

| # | Inject | Expected |
|---|---|---|
| Tn1 | leave `agent="weatherAgent"` in layout.tsx | T7 fails + page errors at runtime ("agent not found") |
| Tn2 | restore one demo import | T4 fails — orphan detected |
| Tn3 | add `useFrontendTool` v2 import | T11 fails AND `copilotkit-version-pin.mjs` hook blocks the edit |

### Evidence to capture in `tasks/notes/F03-evidence.md`

- `ls src/components/` (shows demos gone)
- Diff of `src/app/page.tsx` and `src/app/layout.tsx`
- Build output

## Notes / verification

- The `copilotkit-develop` skill describes the v2 API (`useFrontendTool`, `<CopilotKitProvider>`). We use the v1.55.2 equivalents (`useCopilotAction`, `<CopilotKit>`). Cross-check imports against the example's `page.tsx` and `layout.tsx` — both use v1.
- **P2-2 note:** `CopilotKitCSSProperties` is imported from `@copilotkit/react-ui` (same as `CopilotSidebar`), not `react-core`.
- **P2-1 deferred:** `disableSystemMessage={true}` in the example is not added here because Mastra's agent instructions own the system prompt. Add if the dev sidebar leaks a default system message.
