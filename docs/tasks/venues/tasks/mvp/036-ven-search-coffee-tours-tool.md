task_id: ven-036
mvp_step: 036
id: VEN-036
title: Concierge tour intent + searchCoffeeTours tool
status: Open
priority: P0
phase: CTI-A
effort: 4h
owner: claude
depends_on: [VEN-033, VEN-034, VEN-035, MAP-002, MAP-018C]
blocks: [VEN-038, VEN-039, VEN-049]
skill: [mastra, copilotkit-integrations, gemini, mde-task-lifecycle, task-verifier, testing]
mcp: [user-mastra, gemini-api-docs-mcp]
mcp_verify_before_code:
  - searchMastraDocs — createTool pattern
  - gemini-api-docs-mcp — model gemini-3.5-flash only
---

# VEN-036 — searchCoffeeTours tool

## In plain English

Teach the **concierge agent** to call a dedicated tour search tool when someone asks for farm tours — and **never** route those questions to restaurant search.

## User story

**As a Tourist on `/chat`,** I want *“coffee farm tour”* to return ranked farm tours from our database, **so that** I do not get café recommendations or hallucinated tour URLs.

## Real-world example

| User says | Must happen | Must not happen |
|-----------|-------------|-----------------|
| *“coffee tour near Poblado”* | `searchCoffeeTours` runs | `search-restaurants` |
| *“best finca cafetera experience”* | Same tool + ranker | Generic grounded café-only query |
| *“coffee tour”* (not “coffee shop”) | Tour cards after VEN-038 | Restaurant cards |

## Goals

1. Mastra tool `searchCoffeeTours` with Zod input/output (VEN-033).
2. `conciergeAgent` instructions: keywords `coffee tour`, `farm tour`, `finca`, `cafetero` → this tool.
3. Working memory field `lastCoffeeTourQuery` (optional).
4. Returns ranked tours + `MapPin[]` via `normalize-tool-output`.
5. Agent prose ≤2 sentences (MAP-018 rule).

## Wiring plan

| Layer | File | Action |
|-------|------|--------|
| Tool | `mdeapp/src/mastra/tools/search-coffee-tours.ts` | Create |
| Agent | `mdeapp/src/mastra/agents/concierge.ts` | Modify |
| Register | `mdeapp/src/mastra/index.ts` | Modify |

## Tool contract

**Input:** `query`, optional `neighborhood`, `intent`, `locationBias`, `limit` (default 5).

**Output:** `{ tours: CoffeeTourCardDTO[], pins: MapPin[], attribution? }`

**Source of truth:** Supabase `coffee_tours` + **`rankCoffeeTours` (VEN-035 must land first)**. Optional ADK merge only in VEN-046 (Phase B).

**Sequencing:** Index critical path runs **VEN-035 before VEN-036** so ranker exists when the tool ships.

## Success criteria

1. Vitest: tool called when message contains "coffee farm tour".
2. **Blocking:** same test suite asserts `search-restaurants` / generic café grounded tool **not** called for tour keywords (`coffee tour`, `farm tour`, `finca`, `cafetero`).
3. Tool does not invent URLs/ratings — only DB + Places enrich path (VEN-037).
4. Results with `finalScore` &lt; 55 **excluded** from tool output; &lt; 70 include `limitedVerification` badge (VEN-035/007).
5. `useCoAgent({ name: "conciergeAgent" })` unchanged; agent key matches Mastra registry.
6. Phase A: **no** embedding/semantic rank — SQL ranker only until VEN-044.
7. localhost: chat triggers tool; cards render after VEN-038.

## Tests

```bash
cd mdeapp && npm test -- search-coffee-tours
npm run dev  # manual: "coffee farm tour medellin"
```

## Do not

- Route tour intent to `search-restaurants`.
- Return ADK-only results without SQL merge in Phase A.
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-036](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-036-verify-YYYY-MM-DD.md` |
| Grade | ⚪ Pending (optional track) |
| Production ready | No |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | See VEN-VERIFY-MATRIX § VEN-036 |
| **MCP** | Supabase / mastra / maps per task |
| **Chrome DevTools** | Tour UI routes when implemented |
| **Playwright** | Tour specs when implemented |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Optional coffee-tour track — verify after implementation

