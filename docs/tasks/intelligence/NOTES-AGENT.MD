## Program created

Canonical executable tasks live at **`tasks/intelligence/tasks/`** — **INT-001…INT-020** in four phases, plus indexes and audit report.

---

### Implementation order

```text
CORE:     INT-001 → INT-002 → INT-003 → INT-004 → INT-005
MVP:      INT-006 → INT-007 → INT-008 → INT-009 → INT-010
POST-MVP: INT-011 → INT-012 → INT-013 → INT-014 → INT-015
ADVANCED: INT-016 → INT-017 → INT-018 → INT-019 → INT-020
```

**Master index:** [`tasks/intelligence/tasks/INDEX.md`](tasks/intelligence/tasks/INDEX.md)  
**Full report:** [`tasks/intelligence/tasks/00-program-report.md`](tasks/intelligence/tasks/00-program-report.md)

---

### Phase summary

| Phase | Tasks | Focus |
|-------|-------|--------|
| **CORE** | 001–005 | Slots, rental parser, Gemini clarify, no canned bypass, regression tests |
| **MVP** | 006–010 | Date filters, event/café wrappers, CopilotKit readable, working memory |
| **POST-MVP** | 011–015 | `user_preferences`, interactions, retrieve, ranking, evidence |
| **ADVANCED** | 016–020 | pgvector, Gemini embeds, cross-domain, settings UI, observational |

Each task file includes: problem, user story, examples, steps, files, data, RLS, tests, acceptance, failures, deps, Linear title/labels.

---

### Cross-links (not duplicated)

| Existing | Maps to |
|----------|---------|
| **RE-017** | INT-002 |
| **RE-018** | INT-003 + INT-004 |
| **RE-019** | INT-006 |
| **RE-020** | INT-016 (+ INT-017) |
| **VEC-001…003** | Blocks INT-016, INT-017 |

Root `tasks/intelligence/INT-00x-*.md` → **superseded** ([`MIGRATION.md`](tasks/intelligence/tasks/MIGRATION.md)).

---

### Do we need additional tasks?

| Item | Answer |
|------|--------|
| **More INT tasks?** | **No** for this program — 20 tasks cover the approved plan (~97%). |
| **Keep RE-017…020?** | **Yes** — implementation + commit ledger in `mdeapp`. |
| **Keep VEC-001…007?** | **Yes** — platform pgvector; INT-016/017 depend on them. |
| **Optional later** | **INT-021** dedicated restaurant/venue MVP wrapper (examples now in INT-007/008/018). |

---

### Risks / blockers

- **ID migration:** old root INT-003 was “events”; new INT-003 is “Gemini clarify” — use `tasks/` only.
- **Don’t ship memory before CORE** — order is explicit.
- **VEC-001** blocks ADVANCED pgvector.

---

### Next PR

**PR-A (CORE):** INT-001 + INT-002/RE-017 + INT-003/004/RE-018 + INT-005  
Hero: `list rentals in june 1 to 30 $1000 medellin`

---

### Files touched

**Created:** 24 files under `tasks/intelligence/tasks/` (20 INT specs + INDEX + MIGRATION + schema + report)  
**Updated:** `tasks/intelligence/INDEX.md`, `tasks/INDEX.md`, `agent-plan.md`, 6 legacy INT stubs

**Linear:** Copy titles from [`00-program-report.md`](tasks/intelligence/tasks/00-program-report.md) § checklist.

**Yes — your audit is correct.** Verified against disk, skills, and MCP-aligned stack docs. **RE-017–RE-020** are now filed under `tasks/real-estate/tasks/`.

---**Yes — your review is correct.** Verified against the plan and disk (`shouldInstantRentalClarify` @ `confidence 0.5`, agent never runs on turn 1). Integrated into **`agent-plan.md` v1.1** and cross-linked **RE-017**.

---

## What was added to the plan

| Your point | Where in plan |
|------------|----------------|
| Platform definition (concierge + memory + multi-domain) | BLUF § Platform definition |
| `shared reasoning → specialist → deterministic search` | BLUF § Core pattern |
| Bottleneck = bypass, not weak Gemini | BLUF + External review |
| Don’t build memory before reasoning | BLUF + Architecture risks |
| Gemini vs deterministic split + ranking rule | BLUF tables |
| **Confidence bands** ≥0.85 / 0.50–0.84 / &lt;0.50 | New § + mermaid flowchart |
| Tier 1/2/3 analogies | Memory architecture |
| **Ranking feedback loop** (dwell, ignore, abandon) | Phase 4 |
| **Memory expiration** (`expires_at`, decay) | Phase 3 + INT-006 |
| **Geo intelligence** (Phase 8 future) | New Phase 8 |
| Anti super-agent | § Architecture risks |
| Implementation readiness table | § External architecture review |

**RE-017** now references the 0.85 / 0.50–0.84 bands and dropping instant canned clarify for partial signals.

---

## One nuance

Your **0.85 / 0.50** thresholds are **target policy** — production today still uses **`0.6`** and canned clarify. That’s intentional spec for RE-017, not a claim it’s already shipped.

---

**Bottom line:** Your verdict stands — strong production-grade blueprint; ~95% on design, brain phases still to implement. **P0 remains RE-017 + RE-018** before vectors.

## Verdict on your architecture thesis

| Claim | Verified? | Evidence |
|-------|-----------|----------|
| Flow is parser → fast-path → API → Supabase, not Gemini-first for rentals | **Yes** | `use-rental-search-fast-path.ts` → `shouldInstantRentalClarify` / `canFastPathRentalSearch` before agent |
| `shouldInstantRentalClarify()` fires **before** `conciergeAgent` | **Yes** | `concierge-chat-input.tsx` → `handleRentalMessage` calls clarify path first |
| Hero query parses budget but still canned clarify | **Yes** | `$1000` → monthly ~$33/night; `confidence 0.5` → generic clarify |
| Dates / `medellin` not in parser schema | **Yes** | No `hasDates`; city ≠ barrio regex |
| Gemini **is** wired for concierge when agent runs | **Yes** | `concierge.ts` → `FLASH_MODEL` = `google("gemini-3.5-flash")` in `mastra/lib/models.ts` |
| Gemini **not** used on instant-clarify turn | **Yes** | `RENTAL_CLARIFY_MESSAGE` — no LLM |
| `rentalAgent` exists but `/` uses `conciergeAgent` | **Yes** | Layout + fast-path hook |
| pgvector not in product code yet | **Yes** | No matches under `mdeapp/src` |
| Supabase has availability cols, API doesn’t filter dates | **Yes** | `search-rentals` / API params |

**Nuance:** Gemini isn’t “unused” globally — it’s **bypassed on the rental clarify fast-path** and on **high-confidence fast-path search** (by design). The gap is **intelligence on rich/ambiguous rental turns**, not missing Mastra/Gemini wiring.

Your score table stands:

| Area | ~Score |
|------|--------|
| Infra / maps / API / nightly fast-path | 95–100% |
| Rental intelligence (monthly/date/city) | ~55% |
| Medellín conversational expertise | ~40% |
| Future stack direction | Correct |

---

## Tech roles (corrected)

| Tech | Current role | Needed |
|------|--------------|--------|
| **CopilotKit** | UI, `useCoAgent`, sidebar | Keep |
| **Mastra** | Agents, tools, memory schemas | Smarter routing; don’t block agent on clarify |
| **Gemini 3.5 Flash** | Concierge when agent path runs | **Clarify + monthly reasoning** (RE-018) |
| **rental-query-parser** | Dominant gate | Extract only; lower false generic (RE-017) |
| **Supabase** | Listings | Date overlap filters (RE-019) |
| **pgvector** | Not shipped | RE-020 after **VEC-001** |

---

## Tasks — where they live (created)

Previously: **RE-001–016** = cards, pins, browse, leads — **no** parser/Gemini intelligence tasks.

**Added:**

| ID | File | Priority | Ledger |
|----|------|----------|--------|
| **RE-017** | [`tasks/real-estate/tasks/RE-017-rental-parser-intelligence.md`](tasks/real-estate/tasks/RE-017-rental-parser-intelligence.md) | P0 | C-013 |
| **RE-018** | [`tasks/real-estate/tasks/RE-018-gemini-rental-clarify-routing.md`](tasks/real-estate/tasks/RE-018-gemini-rental-clarify-routing.md) | P0 | C-014 |
| **RE-019** | [`tasks/real-estate/tasks/RE-019-rental-availability-search.md`](tasks/real-estate/tasks/RE-019-rental-availability-search.md) | P1 | C-015 |
| **RE-020** | [`tasks/real-estate/tasks/RE-020-rental-preference-memory.md`](tasks/real-estate/tasks/RE-020-rental-preference-memory.md) | P2 | — |

Updated: [`tasks/real-estate/tasks/INDEX.md`](tasks/real-estate/tasks/INDEX.md), [`tasks/INDEX.md`](tasks/INDEX.md), [`03-rental-agent-audit.md`](tasks/testing/prompts/real-estate/03-rental-agent-audit.md), RE-004 cross-link.

**Ship order:** RE-017 → RE-018 (then RE-019; RE-020 after VEC-001).

**Linear:** No SAN-* yet — create when you start RE-017 (per `tasks/linear/01-linear.md`).

---

## Target flow (matches your diagram)

```text
CopilotKit
→ parser extracts signals (RE-017)
→ IF confident → /api/rentals/search (keep)
→ ELSE → conciergeAgent + Gemini Flash (RE-018)
→ RE-019 date filters in SQL
→ RE-020 memory when VEC-001 lands
```

**Not:** `regex → canned clarify → STOP`

---

**Bottom line:** Infrastructure is production-ready; rental intelligence needs **RE-017 + RE-018** before calling Camila’s monthly/date experience “done.” Want me to implement RE-017 on a branch next, or open Linear issues for 017–018?

**Yes — build shared intelligence.** Your architecture is right; official docs check out; tasks and a plan doc are in place.

---

## Link verification (MCP / fetch, 2026-05-28)

| Resource | Verdict |
|----------|---------|
| [Supabase semantic search](https://supabase.com/docs/guides/ai/semantic-search) | ✅ Current — `match_documents`, filter **inside** SQL fn |
| [Vector columns](https://supabase.com/docs/guides/ai/vector-columns) | ✅ |
| [pgvector extension](https://supabase.com/docs/guides/database/extensions/pgvector) | ✅ |
| [Supabase AI overview](https://supabase.com/docs/guides/ai) | ✅ |
| [RAG with permissions](https://supabase.com/docs/guides/ai/rag-with-permissions) | ✅ — required before user prefs |
| [Vector indexes](https://supabase.com/docs/guides/ai/vector-indexes) | ✅ |
| [Gemini embeddings](https://ai.google.dev/gemini-api/docs/embeddings) | ✅ — `gemini-embedding-001` + newer `gemini-embedding-2`; **VEC-003** locks 768d on live data |
| [Mastra memory](https://mastra.ai/docs/memory/overview) | ✅ — working memory + semantic recall |
| [CopilotKit Mastra example](https://github.com/CopilotKit/CopilotKit/tree/main/examples/integrations/mastra) | ✅ — also `CopilotKit/examples/integrations/mastra/` locally |
| [useCoAgent docs](https://docs.copilotkit.ai/reference/hooks/useCoAgent) | ⚠️ **Redirects to v2 `useAgent`** — mdeapp stays on **1.55.2 `useCoAgent`**; use local example + `copilotkit-integrations` skill |
| Reddit links | 📎 Community only — useful patterns, not spec |

---

## Should you make shared intelligence?

**Yes**, as **shared extract + vertical specialists** — not one mega-prompt.

What you already have:

- `routerAgent` + `classify-intent` (F18) — backend routing exists
- `/` UI still does **parser → instant clarify → STOP** before Gemini
- **VEC-001…007** — pgvector platform (not wired in app yet)
- **RE-017/018** — rental P0 slice

**Recommendation:** Don’t block rentals on the full INT program. Ship **RE-017 + RE-018** first (Camila impact), while **INT-001** defines the shared Zod/slot contract you fold parsers into.

---

## What was created

| Artifact | Path |
|----------|------|
| **Plan doc** | [`tasks/intelligence/00-shared-intelligence-architecture.md`](tasks/intelligence/00-shared-intelligence-architecture.md) |
| **Task index** | [`tasks/intelligence/INDEX.md`](tasks/intelligence/INDEX.md) |
| **INT-001** | Shared intent + slots (PR1) |
| **INT-002** | Rental vertical wrapper → RE-017/018/019 (PR2) |
| **INT-003–005** | Events, cafés, restaurant/venue (PR3–5) |
| **INT-006** | Shared pgvector prefs (PR6) + VEC-* |

Updated: [`tasks/INDEX.md`](tasks/INDEX.md), RE-018 deps, audit cross-links.

---

## PR stack (your table, repo-aligned)

| PR | Task | Scope |
|----|------|--------|
| PR1 | **INT-001** | Shared intent + slot extraction |
| PR2 | **INT-002** = **RE-017 + RE-018** | Rental monthly/date + Gemini clarify |
| PR3 | **INT-003** | Events |
| PR4 | **INT-004** | Cafés |
| PR5 | **INT-005** | Restaurants / venues |
| PR6 | **INT-006** + **VEC-001…003** | Memory + embeddings |

**Deterministic:** SQL, pins, caching, price math, availability filters  
**Gemini Flash:** dates, monthly reasoning, Medellín clarify, ranking explanations, parser fallback, memory summaries

---

## Final answer

Your diagnosis and target stack are correct:

```text
Gemini Flash + Mastra + CopilotKit state + Supabase (+ pgvector after VEC)
```

Shared intelligence **will** improve rentals, events, cafés, restaurants, and venues **if** you enforce:

```text
shared reasoning → vertical specialist → deterministic search
```

**Next implementation move:** INT-001 thin schema (can pair with RE-017 in one branch) → RE-018 removes canned clarify bypass.

Want Linear issues (SAN-*) filed for INT-001 / INT-002, or start coding INT-001 + RE-017 on a branch?