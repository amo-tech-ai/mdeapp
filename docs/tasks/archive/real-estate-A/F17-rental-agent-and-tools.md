---
id: F17
title: Port rentalAgent + search-rentals + rental-search-workflow from my-mastra-app
status: Done
completed: 2026-05-24
evidence: ../notes/F17-evidence.md
shipped_note: Full agent + workflow shipped; MAP-004 dep waived for MVP (MAP-001 sufficient)
priority: P0
phase: W5 — Camila rental hero
effort: 2h port + 1h adapt
owner: claude
depends_on: [MAP-004]
skill: [mastra, mde-supabase, mde-real-estate, copilotkit-integrations]
copilotkit_agent_key: rentalAgent
integration_pattern: in-process
copilotkit_docs:
  - https://docs.copilotkit.ai/mastra/generative-ui/tool-rendering
  - https://docs.copilotkit.ai/mastra/shared-state/in-app-agent-read
master_plan: /home/sk/mdeai/plan/05-path-a-mastra-migration.md
source_files:
  - /home/sk/mde/my-mastra-app/src/mastra/agents/rental-agent.ts (133 lines)
  - /home/sk/mde/my-mastra-app/src/mastra/tools/search-rentals.ts
  - /home/sk/mde/my-mastra-app/src/mastra/workflows/rental-search-workflow.ts
target_files:
  - /home/sk/mdeai/mdeapp/src/mastra/agents/rental-agent.ts
  - /home/sk/mdeai/mdeapp/src/mastra/tools/search-rentals.ts
  - /home/sk/mdeai/mdeapp/src/mastra/workflows/rental-search-workflow.ts
---

# F17 — Port `rentalAgent` + `search-rentals` + workflow

## 3. Features (persona value)

**Camila** on `/rentals` + `/chat`: neighborhood-aware rental cards, follow-ups (“show cheaper”), view scheduling links.

## 1. Purpose

Camila's W5 hero: rental discovery agent with **neighborhood intelligence (Laureles, Poblado, Envigado, Belén, Estadio)**, budget classifier (nightly/monthly/total_trip), pre-search clarification gate with confidence scoring, "Best for X" labels, follow-up shortcuts (show cheaper, when can I view, compare 1+3). Per PRD §51 task 14-16 + Camila persona §2.

## 2. Goals

- `rentalAgent` exports + registers in `mastra/index.ts` agents map
- `searchRentalsTool` queries `public.apartments` (44 rows) with neighborhood / minBedrooms / maxPricePerNight filters
- `rentalSearchWorkflow` wraps search + card formatting
- Working memory schema preserves `lastQuery`, `lastResults`, `selectedListingId`
- Smoke chat: "1BR Laureles under $80/night" → 3-5 cards
- `ai_runs` rows via F13 (`agent_type: local_scout`, `agent_name: rental-agent`)
- CopilotKit key `rentalAgent` matches mastra agents map

## 3. Source files — port + adapt

Same pattern as F14/F15 — verbatim copy, adapt model import + verify AG-UI writer.

## 4. Workflow

1. **Pre-flight (Supabase MCP):**
   ```sql
   SELECT column_name FROM information_schema.columns
   WHERE table_schema='public' AND table_name='apartments' ORDER BY ordinal_position;
   ```
   Confirm: `id, title, neighborhood, nightly_price, bedrooms, host_name, source_url, schedule_viewing_url, wifi, amenities, availability, latitude, longitude`. Adjust `rowToCard` if drift.

2. **Pre-flight (Mastra MCP):**
   - Same Agent / Memory / createTool / createWorkflow checks as F14/F15

3. **Copy files:**
   - `cp` 3 files to mdeapp paths

4. **Register in `mastra/index.ts`:**
   - Add `rentalAgent` to agents map
   - Add `rentalSearchWorkflow` to workflows map

5. **Verify `lib/models.ts`** has `PLANNING_MODEL` export (from F14).

## 5. API drift adjustments

| Risk | Check | Mitigation |
|---|---|---|
| `apartments` column drift (e.g. `nightly_price` vs `price_per_night`) | Supabase MCP | Adjust `rowToCard` mapper |
| Same AG-UI writer shape concerns as F15 | AG-UI MCP | Same mitigation |
| `Memory.options.lastMessages` API | Same as F14 | Same |

## 6. Tests

**Vitest unit:**
- `searchRentals` with mock client returns ≥1 apartment
- `rentalAgent.id === 'rental-agent'`
- `rentalSearchWorkflow` runs end-to-end with mock input

**Integration smoke:**
- Send: `"1BR Laureles under $80/night"` → expects 3-5 cards
- Send: `"show cheaper"` (follow-up) → expects refined search, max price ≈ 0.7 × original
- Verify `ai_runs` rows for each call

## 7. Acceptance criteria

- [ ] 3 files in target paths
- [ ] mastra/index.ts updated
- [ ] Build, lint, tsc green
- [ ] 3+ new Vitest tests pass
- [ ] Smoke chat returns ≥1 apartment card
- [ ] Follow-up "show cheaper" triggers re-search (verify in network log + `ai_runs`)

## 8. Rollback

Single `git revert HEAD` reverts 3 files + mastra/index.ts updates.

## 9. Definition of Done

All ACs pass. Commit: `feat(mastra): port rentalAgent + search-rentals + workflow (F17)`.
