---
id: EVP-008-core
legacy_id: F33
title: platform/contracts EventDraftState Zod (PR-3 — was packages/types)
status: Done
priority: P0
phase: W3 — Day 1 (foundation for EVP-009-core/EVP-010-core/EVP-011-core/EVP-012-core)
effort: 1h (workspace setup + Zod schema + type export + smoke)
owner: claude
depends_on: [F09]
skill: [mastra, mde-task-lifecycle]
prd_ref: §51 task 13 · §17 RUNTIME-008 · §20 generative UI
verified_against:
  - CopilotKit/examples/canvas/mastra/src/lib/canvas/state.ts (pattern reference)
  - CopilotKit/examples/canvas/mastra-pm/src/lib/{state,types}.ts (multi-field PM pattern)
  - mdeapp/src/lib/types.ts (existing MdeState placeholder)
---

# EVP-008-core — `platform/contracts` + `EventDraftState` Zod

## 1. Purpose

Roberto's W3-W4 host event wizard (EVP-010-core) needs a shared state shape across THREE consumers: the Mastra agent's `Memory.workingMemory.schema` (EVP-009-core hostEventAgent), the React UI's `useCoAgent<EventDraftState>` hook (EVP-010-core wizard), and the approval edge fn (EVP-012-core). Per [`plan/prd/07-contracts-schemas.md`](../../plan/prd/07-contracts-schemas.md), ship under **`mdeapp/src/platform/contracts/`** (extend MAP-001 if already landed). **Do not** create `packages/types/` monorepo in Phase 1.

**Depends on MAP-001** if MAP-001 creates the contracts folder first; otherwise EVP-008-core creates `event-draft.ts` there.

## 2. Goals

- `mdeapp/src/platform/contracts/event-draft.ts` (canonical — re-export from `src/lib/types/index.ts` if needed)
- `EventDraftState` Zod schema with fields: `title`, `neighborhood`, `dateIso`, `venue`, `priceMinCop`, `capacity`, `description`, `coverPhotoPath`, `status` (`draft` | `pending_approval` | `approved` | `rejected` | `published`)
- TypeScript type derived via `z.infer<typeof EventDraftState>`
- Export from `src/lib/types/event-draft.ts`; re-export from `src/lib/types/index.ts`
- Imported by EVP-009-core agent (Zod), EVP-010-core wizard (`useCoAgent<EventDraftState>`), EVP-012-core edge fn (server-side validation)
- ≥ 2 Vitest tests (canonical shape parses · rejects unknown enum value)
- Existing `MdeState` (in `src/lib/types.ts`) stays — it's the W1 ping state; `EventDraftState` is the W3 wizard state

## 3. Features (persona value)

| Persona | What they get |
|---|---|
| **Roberto** | His draft survives a turn reload because Zod + `useCoAgent` give the agent + UI the same shape |
| **Sofía** | One file to edit when adding a field; downstream consumers fail loudly on schema mismatch |
| **Lucía** | E2E (EVP-006-core) tests against a real schema, not a free-form object |

## 4. Workflows

1. **Pre-flight:** read `CopilotKit/examples/canvas/mastra/src/lib/canvas/state.ts` (single state) + `canvas/mastra-pm/src/lib/state.ts` (multi-field with Zod).
2. Create `mdeapp/src/lib/types/event-draft.ts`:
   ```ts
   import { z } from "zod";
   export const EventDraftStatus = z.enum([
     "draft", "pending_approval", "approved", "rejected", "published",
   ]);
   export const EventDraftState = z.object({
     title: z.string().min(1).max(120).default(""),
     neighborhood: z.string().default(""),
     dateIso: z.string().datetime().optional(),
     venue: z.string().default(""),
     priceMinCop: z.number().int().nonnegative().default(0),
     capacity: z.number().int().nonnegative().default(0),
     description: z.string().default(""),
     coverPhotoPath: z.string().optional(),
     status: EventDraftStatus.default("draft"),
   });
   export type EventDraftState = z.infer<typeof EventDraftState>;
   ```
3. Create `mdeapp/src/lib/types/index.ts` re-exporting `EventDraftState` + `EventDraftStatus`.
4. Add Vitest tests to `src/__tests__/event-draft.test.ts`:
   - T-A: parses canonical shape with all defaults
   - T-B: rejects `status: "nonsense"` (enum guard)
5. `npm run floor` exit 0.
6. Evidence at `tasks/notes/EVP-008-core-evidence.md`.

## 5. User journeys

- **Sofía** adds `discountCop` to `EventDraftState` → tsc immediately flags EVP-010-core wizard + EVP-009-core agent + EVP-012-core edge fn → she updates all three in one PR.
- **Roberto** types "I want to host a salsa night for 200 people" → EVP-009-core agent populates `{title, capacity}` → EVP-010-core wizard hydrates from the same schema → no drift.

## 6. Agents

None directly. **EVP-009-core hostEventAgent imports this** as `Memory.workingMemory.schema`.

## 7. Integrations

| Integration | Purpose |
|---|---|
| Zod | Schema validation |
| `@mastra/memory` | Working-memory schema (in EVP-009-core) |
| CopilotKit `useCoAgent<T>` | Typed shared state (in EVP-010-core) |
| Supabase edge fn (EVP-012-core) | Server-side validation |

## 8. Summary

Create the Zod schema + TS type for Roberto's event draft. One file, one re-export, two tests. Single source of truth for EVP-009-core/EVP-010-core/EVP-011-core/EVP-012-core. ~1h.

## 9. Definition of Done

- [ ] `mdeapp/src/lib/types/event-draft.ts` exports `EventDraftState` (Zod) + `EventDraftStatus` + inferred TS type
- [ ] `mdeapp/src/lib/types/index.ts` re-exports both
- [ ] `src/__tests__/event-draft.test.ts` with ≥ 2 passing tests
- [ ] `npm run floor` exit 0
- [ ] Existing `src/lib/types.ts` (`MdeState`) untouched
- [ ] Evidence at `tasks/notes/EVP-008-core-evidence.md`

## 10. Tests

| # | Test | Expected |
|---|---|---|
| T1 | Schema file exists | `test -f mdeapp/src/lib/types/event-draft.ts` |
| T2 | Re-export exists | `grep -q 'export.*EventDraftState' mdeapp/src/lib/types/index.ts` |
| T3 | Vitest ≥ 2 new | `npm test` |
| T4 | Default shape parses | tested by T-A |
| T5 | Enum guards reject bad input | tested by T-B |
| T6 | Floor green | `npm run floor` |

## 11. Rollback

```bash
rm -rf mdeapp/src/lib/types/  # restores pre-EVP-008-core single-file state
```

## Notes

- **No CopilotKit interference:** types live in `src/lib/`, never imported into the CopilotKit provider directly.
- **`packages/types/` workspace deferred:** Next 16 in mdeapp/ is single-package; introducing a workspace is scope creep. Use `src/lib/types/` until a real second consumer (e.g. CLI tool) needs the shared package boundary.
- **Status enum values match the legacy `events.status` Postgres enum** — verify via Supabase MCP `SELECT DISTINCT status FROM events` before EVP-012-core lands.
