---
id: EVP-010-core
legacy_id: F36
title: /host/event/new wizard shell + 3 frontend actions (PRD §51 #16)
status: Done
priority: P0
phase: W3 — Day 3-4 (Roberto hero flow UI)
effort: 4h (route + provider scope + 3 actions + Vitest + localhost smoke)
owner: claude
depends_on: [F07, F08, F22, EVP-008-core, EVP-009-core]
skill: [copilotkit-develop, copilotkit-integrations, react-best-practices, shadcn]
prd_ref: §51 task 16 · §13 + §17 (Roberto hero) · §20 generative UI
verified_against:
  - CopilotKit/examples/v1/form-filling/ (PRIMARY pattern source per PRD §45)
  - CopilotKit/examples/canvas/mastra-pm/src/app/page.tsx (multi-field PM UI)
  - CopilotKit/examples/canvas/mastra/src/app/page.tsx (4-card grid + useCoAgent)
  - mdeapp/src/app/layout.tsx (current `<CopilotKit agent="pingAgent">` mount)
---

# EVP-010-core — `/host/event/new` wizard

## 1. Purpose

Roberto's W3-W4 hero flow. Single-page wizard at `/host/event/new` that lets Roberto type natural language ("I want to host a salsa night for 200 people in El Poblado on Saturday") and watch the form fields fill in via `useCoAgent<EventDraftState>` shared with EVP-009-core `hostEventAgent`. Three `useCopilotAction({ parameters })` frontend actions let the agent commit `set_event_basics`, `set_venue`, `set_pricing`. HITL approval (EVP-011-core) lands separately.

Pattern source: `examples/v1/form-filling` (form-fill chat shape) + `canvas/mastra-pm` step-3 (multi-field state UI) per PRD §45 component-to-target table.

## 2. Goals

- `mdeapp/src/app/host/event/new/page.tsx` — wizard route, **client component** with `useCoAgent<EventDraftState>({ name: "hostEventAgent" })`
- `mdeapp/src/app/host/event/layout.tsx` — switches the CopilotKit provider to `agent="hostEventAgent"` for this subtree (no double-mount; uses CK 1.55.2 multi-agent pattern)
- 3 frontend actions via `useCopilotAction({ parameters })`:
  - `set_event_basics({ title, neighborhood, dateIso })`
  - `set_venue({ venue, capacity })`
  - `set_pricing({ priceMinCop, description })`
- Wizard UI from F07 primitives: `<Card>`, `<Input>`, `<Label>`, `<Button>` + step indicator
- Auth-gated via F08 middleware (only logged-in users hit `/host/event/new`)
- Hero crop from F22 for the welcome step
- `<EventCard>` (EVP-013-core) renders a live preview of the draft as Roberto types
- ≥ 3 Vitest tests (route renders · actions registered · state hydrates)
- Localhost gate 9: `curl :3001/host/event/new` HTTP 200 (after login) + form visible

## 3. Features (persona value)

| Persona | What they get |
|---|---|
| **Roberto** | Types one sentence in Spanish → 4 fields populate → corrects pricing → previews the event card → ready for HITL approval (EVP-011-core) |
| **Sofía** | One route uses pattern from `v1/form-filling`; future host-side forms reuse the same scaffolding |
| **Lucía** | EVP-006-core Playwright e2e targets this route at 390×844 mobile viewport |

## 4. Workflows

1. **Pre-flight:**
   - `ls mdeapp/src/lib/types/event-draft.ts` (EVP-008-core)
   - `grep hostEventAgent mdeapp/src/mastra/index.ts` (EVP-009-core registered)
   - `ls mdeapp/src/middleware.ts` (F08 auth gate)
   - `ls mdeapp/src/components/ui/{card,input,label,button}.tsx` (F07)
   - Confirm F22 hero photos in `public/hero/`
   - Read `CopilotKit/examples/v1/form-filling/src/app/page.tsx` for the 3-action shape
2. Create `mdeapp/src/app/host/event/layout.tsx`:
   - Wraps subtree with `<CopilotKit runtimeUrl="/api/copilotkit" agent="hostEventAgent">` (different agent key from app-root which is `pingAgent`)
   - Reads CopilotKit v1.55.2 multi-agent docs first to confirm dual-mount is allowed; if not, single-mount + dynamic `agent={...}` prop is the fallback
3. Create `mdeapp/src/app/host/event/new/page.tsx`:
   ```tsx
   "use client";
   import { useCoAgent, useCopilotAction } from "@copilotkit/react-core";
   import { EventDraftState as TEventDraft } from "@/lib/types";
   // ... 3 useCopilotAction blocks + form rendering
   ```
4. Add Vitest at `mdeapp/src/app/host/event/new/__tests__/page.test.tsx`:
   - T-A: route component exports default
   - T-B: 3 actions registered (mock CopilotKit hooks)
   - T-C: form fields hydrate from `useCoAgent` state
5. `npm run floor` exit 0.
6. Gate 9: dev server + curl `:3001/host/event/new` HTTP 200 (after auth cookie set; or HTTP 302 to `/login` if not logged in — also passes). Manual smoke: type one Roberto sentence in the sidebar, watch fields fill.
7. Evidence at `tasks/notes/EVP-010-core-evidence.md`.

## 5. User journeys

- **Roberto** (logged in) lands on `/host/event/new` → sees hero strip + empty form + CopilotSidebar with hostEventAgent → types "I want to host salsa for 200 in El Poblado on Saturday" → agent calls `set_event_basics({ title: "Salsa night", neighborhood: "El Poblado", dateIso: "..." })` + `set_venue({ capacity: 200 })` → form fields fill → Roberto types venue name + price → next step = EVP-011-core ApprovalPanel.
- **Roberto** (not logged in) hits `/host/event/new` → F08 middleware redirects to `/login`.
- **Lucía** e2e (EVP-006-core) opens `/host/event/new` at 390×844, types one sentence, asserts 4 fields filled within 5s.

## 6. Agents

- **`hostEventAgent`** (EVP-009-core) — consumed via `useCoAgent` in this route.

## 7. Integrations

| Integration | Purpose |
|---|---|
| CopilotKit `useCoAgent<EventDraftState>` | Shared state with EVP-009-core |
| CopilotKit `useCopilotAction({ parameters })` | 3 frontend actions |
| F07 shadcn primitives | Form + card UI |
| F08 middleware | Auth gate |
| F22 hero photos | Welcome step background |
| EVP-013-core EventCard | Live draft preview |
| EVP-008-core EventDraftState | Typed shared state |
| Next 16 App Router client/server boundaries | `"use client"` on the page; layout server-side |

## 8. Summary

Build Roberto's hero wizard route. One layout (provider scope), one page (3 actions + form), 3 Vitest tests, localhost smoke. ~4h. The biggest single piece of the Roberto W3-W4 hero flow. Pattern: `v1/form-filling` per PRD §45.

## 9. Definition of Done

- [ ] `mdeapp/src/app/host/event/new/page.tsx` exists with `"use client"` + 3 useCopilotAction blocks
- [ ] `mdeapp/src/app/host/event/layout.tsx` switches CopilotKit agent to `hostEventAgent`
- [ ] `useCoAgent<EventDraftState>` imports the type from EVP-008-core
- [ ] All 3 actions have Zod parameter schemas (no `any`)
- [ ] EVP-013-core `<EventCard>` renders live preview from current state
- [ ] Auth-gated: anonymous request → 302 to `/login`
- [ ] ≥ 3 Vitest tests pass
- [ ] `npm run floor` exit 0
- [ ] Localhost gate 9: `curl :3001/host/event/new` returns 200 (with auth cookie) or 302 (without)
- [ ] Manual smoke: typed Roberto sentence fills ≥ 2 form fields within 5s
- [ ] Evidence at `tasks/notes/EVP-010-core-evidence.md` with screenshot

## 10. Tests

| # | Test | Expected |
|---|---|---|
| T1 | Page route exists | `test -f mdeapp/src/app/host/event/new/page.tsx` |
| T2 | Layout exists | `test -f mdeapp/src/app/host/event/layout.tsx` |
| T3 | Uses `useCoAgent` | grep returns ≥ 1 match |
| T4 | 3 useCopilotAction blocks | `grep -c 'useCopilotAction' page.tsx` ≥ 3 |
| T5 | Vitest ≥ 3 new | `npm test` |
| T6 | Floor green | `npm run floor` exit 0 |
| T7 | Localhost route resp | curl 200 or 302 |
| T8 | EventCard rendered | grep `EventCard` in page.tsx |

### Negative test

| Tn1 | Remove auth middleware match for `/host/*` | `/host/event/new` returns 200 anonymous — fails Roberto-only gate |

## 11. Rollback

```bash
rm -rf mdeapp/src/app/host/
```

## Notes

- **CopilotKit multi-agent provider:** v1.55.2 supports nested providers with different `agent` props; verify against `examples/canvas/mastra/src/app/page.tsx` before assuming. If only single-mount is supported, use a dynamic `agent={pathname.startsWith('/host') ? 'hostEventAgent' : 'pingAgent'}` prop in `src/app/layout.tsx`.
- **`v1/form-filling` is the closest pattern** (PRD §45) — read it before writing the page; it shows the exact 3-action shape we need.
- **HITL approval is NOT in EVP-010-core** — EVP-011-core owns the `<ApprovalPanel>` with `renderAndWaitForResponse`. EVP-010-core ends with "preview" not "publish".
- **Spanish copy deferred to Phase 2** per CLAUDE.md Language scope. Input labels are English; agent responses can be Spanish since they're agent-generated.
