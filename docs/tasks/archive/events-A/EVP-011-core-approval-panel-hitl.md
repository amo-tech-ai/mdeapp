---
id: EVP-011-core
legacy_id: F37
title: ApprovalPanel + renderAndWaitForResponse HITL (PRD §51 #17)
status: Done
priority: P0
phase: W4 — Day 1 (Roberto event-publish HITL)
effort: 2h (panel + HITL wiring + Vitest + localhost smoke)
owner: claude
depends_on: [F07, EVP-010-core]
skill: [copilotkit-develop, shadcn]
prd_ref: §51 task 17 · §17 RUNTIME-008 strict state machine
verified_against:
  - CopilotKit/examples/integrations/mastra/src/app/page.tsx:102 (renderAndWaitForResponse pattern)
  - CopilotKit/examples/showcases/banking (approval workflow pattern per PRD §45)
  - mdeapp existing /home/sk/mdeai/mdeapp/src/components/approvals/ApprovalPanel.tsx (W1 stub)
  - PRD §17: PENDING → APPROVED | REJECTED | EDIT strict state machine
---

# EVP-011-core — `<ApprovalPanel>` with `renderAndWaitForResponse`

## 1. Purpose

After EVP-010-core fills Roberto's draft, the agent must propose "publish this event?" and pause until Roberto picks **Aprobar / Editar / Rechazar** (Approve / Edit / Reject). This is CopilotKit's HITL pattern: `useCopilotAction({ ..., renderAndWaitForResponse: ({ args, respond }) => <ApprovalPanel ... /> })`. The panel calls `respond("approved" | "edit" | "rejected")` to unblock the agent. EVP-012-core then commits the decision via `/api/approval-commit` → `decide_approval()` RPC.

Pattern: `examples/integrations/mastra/src/app/page.tsx:102` (mdeapp's foundation) + `examples/showcases/banking` (approval workflow). Existing `mdeapp/src/components/approvals/ApprovalPanel.tsx` W1 stub gets upgraded.

PRD §17 RUNTIME-008 strict state machine: `PENDING → (APPROVED | REJECTED | EDIT)` only — no other transitions. Panel must enforce.

## 2. Goals

- Upgrade `mdeapp/src/components/approvals/ApprovalPanel.tsx`:
  - 3 `<Button>` (Approve / Edit / Reject) from F07
  - Reads `args` (event draft summary)
  - Calls `respond(decision)` with `"approved" | "edit" | "rejected"` string
  - Disables buttons after first click (prevent double-respond)
  - Displays a live `<EventCard>` (EVP-013-core) preview of the draft inside the panel
- Wire into EVP-010-core wizard:
  - `useCopilotAction({ name: "preview_and_publish", parameters: z.object({ draft: EventDraftState }), available: "remote", renderAndWaitForResponse: ({ args, respond }) => <ApprovalPanel draft={args.draft} respond={respond} /> })`
- Agent prompt (EVP-009-core) updated to call `preview_and_publish` once all required fields are filled
- ≥ 2 Vitest tests (renders 3 buttons · respond callback fires on click)
- Gate 9 localhost: full Roberto flow — type sentence → fill draft → agent calls `preview_and_publish` → panel appears → click "Aprobar" → respond fires

## 3. Features (persona value)

| Persona | What they get |
|---|---|
| **Roberto** | Sees a clean "review and publish" panel before anything goes live — the trust step that turns conversation into commitment |
| **Patricia** | Every Approve/Edit/Reject is auditable via EVP-012-core `/api/approval-commit` → `decide_approval()` RPC |
| **Camila / Tourist** | Indirect — events only appear in their search after Roberto approves (EVP-012-core) |

## 4. Workflows

1. **Pre-flight:**
   - `cat mdeapp/src/components/approvals/ApprovalPanel.tsx` — read W1 stub (current state)
   - `cat CopilotKit/examples/integrations/mastra/src/app/page.tsx | grep -A 10 renderAndWaitForResponse` — verify pattern
2. Rewrite `mdeapp/src/components/approvals/ApprovalPanel.tsx`:
   ```tsx
   "use client";
   import { useState } from "react";
   import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
   import { Button } from "@/components/ui/button";
   import { EventCard } from "@/components/events/EventCard"; // EVP-013-core
   import type { EventDraftState } from "@/lib/types";

   export function ApprovalPanel({
     draft, respond
   }: { draft: EventDraftState; respond: (decision: "approved" | "edit" | "rejected") => void }) {
     const [decided, setDecided] = useState(false);
     const onClick = (d: "approved" | "edit" | "rejected") => {
       if (decided) return;
       setDecided(true);
       respond(d);
     };
     return (
       <Card>
         <CardHeader>Review event before publishing</CardHeader>
         <CardContent><EventCard event={draftToEventListing(draft)} /></CardContent>
         <CardFooter className="flex gap-2">
           <Button onClick={() => onClick("approved")} disabled={decided}>Aprobar</Button>
           <Button variant="outline" onClick={() => onClick("edit")} disabled={decided}>Editar</Button>
           <Button variant="destructive" onClick={() => onClick("rejected")} disabled={decided}>Rechazar</Button>
         </CardFooter>
       </Card>
     );
   }
   ```
3. Add `draftToEventListing` adapter in `mdeapp/src/components/approvals/_adapter.ts` (small util).
4. Wire `useCopilotAction({ ..., renderAndWaitForResponse: ... })` into EVP-010-core wizard.
5. Update EVP-009-core `host-event-prompt.ts` to call `preview_and_publish` once `EventDraftState.title + neighborhood + dateIso + venue + priceMinCop` all set.
6. Vitest at `mdeapp/src/components/approvals/__tests__/ApprovalPanel.test.tsx`:
   - T-A: renders 3 buttons (Aprobar / Editar / Rechazar)
   - T-B: `respond("approved")` fires on Aprobar click
7. `npm run floor` exit 0.
8. Gate 9: dev boot, manual smoke — type Roberto sentence → fill all fields → "Aprobar" click → console log shows `respond("approved")`.
9. Evidence at `tasks/notes/EVP-011-core-evidence.md`.

## 5. User journeys

- **Roberto** finishes draft → agent: "Lista para publicar?" → ApprovalPanel appears → reviews EventCard preview → clicks Aprobar → respond fires → EVP-012-core commits → agent: "¡Listo! Publicado." Camila/Tourist can now find it.
- **Roberto chooses Editar** → respond("edit") → agent continues conversation: "What would you like to change?"
- **Roberto chooses Rechazar** → respond("rejected") → draft discarded; back to start.

## 6. Agents

- **`hostEventAgent`** (EVP-009-core) — prompt updated to call `preview_and_publish` action when draft is complete.

## 7. Integrations

| Integration | Purpose |
|---|---|
| CopilotKit `useCopilotAction({ renderAndWaitForResponse })` | HITL primitive |
| F07 `<Card>` + `<Button>` | Panel UI |
| EVP-013-core `<EventCard>` | Live preview |
| EVP-008-core `EventDraftState` | Draft shape |
| EVP-012-core `/api/approval-commit` (next) | Server-side commit |

## 8. Summary

Replace W1 ApprovalPanel stub with full HITL implementation. Wire `renderAndWaitForResponse` into EVP-010-core wizard. Update EVP-009-core prompt to call `preview_and_publish`. 2 Vitest tests + localhost manual smoke. ~2h.

## 9. Definition of Done

- [ ] `mdeapp/src/components/approvals/ApprovalPanel.tsx` rewritten with 3-button HITL
- [ ] Buttons disabled after first click (anti double-respond)
- [ ] Live `<EventCard>` preview inside panel
- [ ] EVP-010-core wizard wires `useCopilotAction({ name: "preview_and_publish", renderAndWaitForResponse })`
- [ ] EVP-009-core prompt updated to call `preview_and_publish` on draft completion
- [ ] ≥ 2 Vitest tests pass
- [ ] `npm run floor` exit 0
- [ ] Manual smoke: full Roberto flow → ApprovalPanel appears → click fires respond callback
- [ ] Evidence at `tasks/notes/EVP-011-core-evidence.md`

## 10. Tests

| # | Test | Expected |
|---|---|---|
| T1 | Panel file rewritten | grep 3 buttons in ApprovalPanel.tsx |
| T2 | Calls respond | grep `respond(` in file |
| T3 | Wired in EVP-010-core | `grep renderAndWaitForResponse mdeapp/src/app/host/event/new/page.tsx` |
| T4 | Vitest ≥ 2 new | `npm test` |
| T5 | Floor green | `npm run floor` |
| T6 | Manual smoke | screenshot in evidence |

### Negative test

| Tn1 | Remove `disabled={decided}` from buttons | Double-click reproduces double-respond (manual repro in evidence) — confirms guard |

## 11. Rollback

Revert `mdeapp/src/components/approvals/ApprovalPanel.tsx` to W1 stub via git; remove `useCopilotAction({ renderAndWaitForResponse })` block from EVP-010-core page.

## Notes

- **CopilotKit `renderAndWaitForResponse` is the v1.55.2 pattern** — verified in `examples/integrations/mastra/src/app/page.tsx:102` (our foundation). v2 has a different shape; do not mix imports.
- **Strict state machine** (PRD §17 RUNTIME-008): only 3 transitions from PENDING. Panel must not invent a fourth.
- **Spanish button labels** are intentional — Roberto speaks Spanish. CLAUDE.md Language scope exception: agent-rendered UI text follows the agent's persona language; static app chrome stays English Phase 1.
- **EVP-012-core (next) is the server commit.** EVP-011-core ends with the respond callback; EVP-012-core's edge fn writes the decision row.
