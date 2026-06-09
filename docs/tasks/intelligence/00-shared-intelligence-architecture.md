---
title: Shared intelligence architecture (mdeai chat)
status: Approved plan
date: 2026-05-28
owner: Sofia
personas: [Camila, Roberto, Tourist]
skills: [mastra, gemini, copilotkit-integrations, mde-supabase, mde-task-lifecycle]
mcp: [mastra, copilotkit, gemini-api-docs-mcp, supabase]
related:
  - ../real-estate/tasks/RE-017-rental-parser-intelligence.md
  - ../real-estate/tasks/RE-018-gemini-rental-clarify-routing.md
  - ../vector/INDEX.md
  - ../testing/prompts/real-estate/03-rental-agent-audit.md
  - ../../mdeapp/src/mastra/agents/router.ts
  - ../../CopilotKit/examples/integrations/mastra/
---

# Shared intelligence architecture

## BLUF

**Yes** — build a reusable **Mastra + Gemini Flash** intelligence layer with **small vertical modules**. Do **not** wait for the full layer before shipping **RE-017 + RE-018** (rental P0). INT-001 defines the shared contract; rentals are the first vertical proof.

The bottleneck is not Supabase/maps/API. It is:

```text
regex / instant clarify → blocks Gemini reasoning on turn 1
```

Target:

```text
CopilotKit (useCoAgent state)
→ Mastra orchestration (router + specialists)
→ Gemini Flash (intent, slots, clarify, explain)
→ deterministic parser extract (optional fast path)
→ memory retrieval (pgvector, after VEC-001)
→ Supabase / Places search
→ ranking + cards + pins
→ conversational follow-up
```

---

## Verified reference links (2026-05-28)

| Topic | Link | Status | mdeai notes |
|-------|------|--------|-------------|
| Supabase semantic search | https://supabase.com/docs/guides/ai/semantic-search | ✅ Valid | Match in SQL + `rpc()`; filter inside function |
| Vector columns | https://supabase.com/docs/guides/ai/vector-columns | ✅ Valid | `extensions.vector(768)` per **VEC-003** |
| pgvector extension | https://supabase.com/docs/guides/database/extensions/pgvector | ✅ Valid | Start **VEC-001** inventory |
| Supabase AI overview | https://supabase.com/docs/guides/ai | ✅ Valid | Hub for RAG + hybrid |
| RAG + RLS | https://supabase.com/docs/guides/ai/rag-with-permissions | ✅ Valid | Required for user prefs memory |
| Vector indexes | https://supabase.com/docs/guides/ai/vector-indexes | ✅ Valid | HNSW after VEC-002 |
| Gemini embeddings | https://ai.google.dev/gemini-api/docs/embeddings | ✅ Valid | **VEC-003:** `gemini-embedding-001` @ 768 for existing data; evaluate `gemini-embedding-2` in Phase 2 |
| Mastra memory | https://mastra.ai/docs/memory/overview | ✅ Valid | Working memory + semantic recall; F13 storage path |
| CopilotKit Mastra example | https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra | ✅ Valid | **Local:** `CopilotKit/examples/integrations/mastra/` |
| CopilotKit `useCoAgent` | https://docs.copilotkit.ai/reference/hooks/useCoAgent | ⚠️ Redirects | URL now documents **v2 `useAgent`**. Phase 1 app uses **`useCoAgent` @ 1.55.2** — use local example + `copilotkit-integrations` skill |
| Reddit hybrid search | https://www.reddit.com/r/Supabase/comments/1qpedhj/ | 📎 Community | Patterns only; not normative |
| Reddit Gemini + pgvector UX | https://www.reddit.com/r/Supabase/comments/1r27ijp/ | 📎 Community | Aligns with “users don’t search well” problem |
| Reddit prod pgvector scale | https://www.reddit.com/r/Supabase/comments/1so3yk3/ | 📎 Community | Ops lessons for edge + cron |

---

## What already exists on disk

| Piece | State | Gap |
|-------|-------|-----|
| `routerAgent` + `classify-intent` | ✅ F18 shipped | UI fast-path **bypasses** router on `/` |
| `conciergeAgent` + Gemini 3.5 Flash | 🔴 **dead on prod** | Returns `RUN_ERROR (EAUTHTIMEOUT)/INCOMPLETE_STREAM` on https://www.mdeai.co (QA F-1). Restore via **UX-001** before routing any clarify/agent traffic here. Locally it also sits behind `shouldInstantRentalClarify`. |
| `rental-query-parser` | ✅ | Too dominant; not shared across verticals |
| `useCoAgent` working memory | ✅ | No cross-thread prefs yet |
| pgvector in product | ❌ | **VEC-001…007** planned |
| Shared slot schema | ❌ | **INT-001** |

---

## Design rules

### Shared layer (all verticals)

One module extracts:

- `intent` (rental_search | event_discovery | cafe_search | restaurant_search | venue_search | chitchat | unknown)
- `slots` (location, dateRange, budget, partySize, vibe, needs[])
- `confidence`
- `action`: `search_now` | `clarify` | `chitchat`

**Gemini** produces clarify text and ranking explanations. **Code** runs SQL, pins, caching, price math.

### Vertical specialists (small prompts + tools)

| Vertical | Specialist adds | Existing tasks |
|----------|-----------------|----------------|
| Rentals | monthly rent, barrios, furnished | **RE-017, RE-018, RE-019** |
| Events | vibe, tickets, weekend | F18 workflows, events fast-path |
| Cafés | WiFi, quiet, remote work | SCREEN-021, VEC-007 |
| Restaurants | cuisine, dietary | F19 concierge tools |
| Venues | capacity, booking | venues MVP |

**Do not** one giant concierge prompt — shared extract + specialist clarify/search.

### Fast path vs agent path

| Confidence | Behavior |
|------------|----------|
| High + complete slots | Deterministic API search (keep PR #10–#12) |
| Medium + partial slots | Gemini clarify (neighborhood-only, not generic) |
| Low | Router → specialist agent |

Remove **instant canned clarify** that skips the LLM (RE-018).

---

## Build order (PR stack)

> ⚠️ **Superseded numbering.** The INT IDs in the table below use the **old root-level** scheme (where INT-003 = events, INT-004 = café, INT-005 = restaurant/venue). The canonical executable order now lives in [`tasks/intelligence/tasks/INDEX.md`](./tasks/INDEX.md) (CORE INT-001→005, MVP INT-006→010, …) — see [`MIGRATION.md`](./tasks/MIGRATION.md). Use the canonical INDEX for sequencing; this table is kept for historical context only.

| PR | Task ID | Scope | Depends |
|----|---------|-------|---------|
| **PR1** | **INT-001** | Shared intent + slot extraction (Zod + tool) | — |
| **PR2** | **RE-017 + RE-018** | Rental monthly/date + Gemini clarify | INT-001 (soft: can start parallel) |
| **PR3** | **INT-003** | Event date/vibe intelligence | INT-001 |
| **PR4** | **INT-004** | Café remote-work intelligence | INT-001, MAP/Places |
| **PR5** | **INT-005** | Restaurant + venue booking slots | INT-001 |
| **PR6** | **INT-006** + **VEC-*** | Shared memory / pgvector prefs | VEC-001…003, RE-019 |

**RE-017/018** remain the **first shippable vertical slice** even if INT-001 lands in the same PR as a thin shared type.

---

## Tech assignment (confirmed)

| Need | Tech |
|------|------|
| Intent + slot extraction | Gemini Flash (`generateText` / agent tool) |
| Conversational clarify | Gemini Flash via `conciergeAgent` or specialist |
| Medellín expertise | Mastra instructions + small heuristics tables |
| Persistent preferences | Supabase + pgvector (**VEC-002**, **INT-006**) |
| UI shared state | CopilotKit `useCoAgent` |
| Tool orchestration | Mastra router + workflows |
| Deterministic search | Supabase + Places APIs |

---

## MCP + skills (when implementing)

| Step | Use |
|------|-----|
| Slot schema / agent API | `mastra` MCP + `mastra` skill |
| CopilotKit wiring | `copilotkit` + local Mastra example |
| Embeddings model | `gemini-api-docs-mcp` + **VEC-003** |
| pgvector / RLS | Supabase MCP + `mde-supabase` |
| Done gate | `mde-task-lifecycle` → `task-verifier` |

---

## Success criteria (architecture)

- [ ] Hero rental query gets Medellín-specific clarify or search (not generic budget/dates re-ask)
- [ ] Same slot extractor used for rental + café example in unit tests
- [ ] Fast-path preserved for `1BR Laureles $80/night`
- [ ] No pgvector until VEC-001 evidence + RLS plan

---

## References

- Audit: [`tasks/testing/prompts/real-estate/03-rental-agent-audit.md`](../testing/prompts/real-estate/03-rental-agent-audit.md)
- Memory links: [`tasks/testing/agent/02-links-memory.md`](../testing/agent/02-links-memory.md)
- Task index: [`INDEX.md`](./INDEX.md)
