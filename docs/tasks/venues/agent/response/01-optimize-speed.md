Your diagnosis is **correct for the pre-fix system**. Several P0/P1 items are **already shipped** in `mdeapp/` — the table reads like a *before* snapshot, not *today*.

## Verdict on the error table

| Priority | Your claim | Correct? | Today (disk) |
|----------|------------|----------|----------------|
| **P0** | Two full Gemini turns for clarify + list | ✅ Was the root cause | **Fixed** for generic + chip/text fast path: `ConciergeChatInput` + `followUp: false` |
| **P0** | Web grounding too often | ✅ Was dangerous | **Mostly fixed**: prompt no longer says “always”; `needsSearchGrounding` skips when SQL ≥ 3 (unless verify/latest) |
| **P0** | Chips still full agent loop | ✅ Was true | **Fixed**: `handleEventChip` → `POST /api/events/search`, not `runAgent` |
| **P1** | Duplicate `event-web` fetch | ✅ Valid | **Fixed**: `shouldChainWebGrounding(_, sqlEventCount)` + requires `lastEventQuery` |
| **P1** | Huge duplicated prompts | ✅ Valid | **Partially fixed**: shorter Events instructions; `concierge.ts` still large |
| **P2** | Memory recall every turn | ✅ Valid on **agent** path | **Not changed** — still Postgres + `lastMessages: 20` |
| **P2** | `PromptInjectionDetector` | ✅ Valid in prod | **Not changed** — off in dev, on in prod unless env says otherwise |
| **P2** | Extra assistant prose | ✅ Valid on **agent** path | **Partially fixed**: 1-sentence rule in prompt; fast path uses `fastPathAssistantSummary` only |

**“Supabase fast, Gemini slow”** — still the right mental model. `search-events` ~554ms is accurate; orchestration was the problem.

---

## Flow diagrams — before vs now

**Before (your “current flow”)** — accurate historically.

**After (shipped)** — for Events on `/chat`:

```text
list events medellin → canned clarify (TS, no copilotkit)
Music chip / music   → /api/events/search → panel + pins → 1-line assistant (no copilotkit)
```

**Still slow** when:

- User skips fast path (rentals, restaurants, vague concierge, Copilot suggestions that hit agent).
- Agent path with freshness + thin SQL: e.g. `concerts tonight` with 0–2 rows → web **may** still run (by design).
- Model ignores prompt and calls web anyway (guard in tool helps, not perfect).

---

## Your “correct architecture” — alignment

| Principle | Audit / your note | Implementation |
|-----------|-------------------|----------------|
| LLM only when reasoning needed | ✅ Best practice | Fast path = SQL + UI; agent for everything else |
| SQL first, web second | ✅ | Fast path is SQL-only; web only on agent + router |
| `isGenericEventQuery` wired to UI | ✅ You said it wasn’t | **Now wired** via `shouldInstantEventClarify` |
| Chip → direct search | ✅ | **Same** `searchEvents()` as Mastra tool, via `/api/events/search` (not AG-UI tool event, but same data path) |

Minor nuance: fast path does **not** invoke the Mastra `search-events` *tool* in CopilotKit; it calls the **shared function** server-side. That’s fine and matches “tool-first orchestration” in spirit.

---

## Grounding table — mostly right, one tweak

| Query | Your web? | Router today |
|-------|-----------|----------------|
| music events medellín | ❌ | ❌ fast path; ❌ web if SQL ≥ 3 on agent |
| concerts tonight | Maybe | ✅ **Yes** if SQL &lt; 3; **No** if SQL ≥ 3 |
| breaking / verify / tickets | ✅ | ✅ verify keywords force web |
| weekend techno + full SQL | Maybe → often ❌ | ❌ if ≥ 3 SQL rows and no verify |

So “weekend techno parties” with a full catalog is **not** web-first anymore — good.

---

## Priority fix list vs EVP-029

Your recommended order is right. **EVP-029 items 1–3 + duplicate fetch are already in tree** (2026-05-27). What’s left:

| Item | Status |
|------|--------|
| Instant clarify UI | ✅ Shipped (needs Gate 9 localhost proof) |
| Chip fast path | ✅ Shipped |
| Reduce grounding | ✅ Shipped (prompt + router) |
| Remove duplicate web fetch | ✅ Shipped |
| Shorter prompts | 🟡 Partial |
| Stream cards before prose | 🟡 Fast path: cards after one HTTP round-trip; **agent path** still model-bound |
| P2 memory / injection guard | ⬜ Open |
| **Your new ideas** (cache, semantic normalize, progressive web in UI) | ⬜ Not built — good Phase 2+ |

---

## Additional suggestions — honest review

| Suggestion | Worth it? | Notes |
|------------|-----------|--------|
| Stream cards before prose | ✅ High for **agent** turns | Fast path already renders after SQL; CopilotKit tool UI on agent path is the gap |
| Progressive grounding (SQL now, web later) | ✅ High | Aligns with Mindtrip pattern; `EventWebCitationFetch` is a stub of this but only post-agent, not on fast path |
| Response caching | ✅ Medium | 5–15 min TTL for hot queries; watch stale tickets |
| Semantic normalization | ✅ Medium | Extend `scoreEventQuery`, don’t add LLM |
| Background enrichment | ✅ High | Don’t block first paint on photos/citations |

These were **not** in the audit and are **not** wrong — they’re the next layer after P0.

---

## Maturity scores

Directionally fair **before** fixes. Post-fix I’d bump **event latency** and **perceived UX** into the ~**75–80** range *once* Gate 9 is measured — not 58/55 while unverified.

**Tool-first orchestration** is ~**85** for the Events happy path now; still ~**70** overall because rentals/chat still AI-first.

---

## Bottom line

- Your **root-cause analysis is correct**.
- Your **fix priorities are correct**.
- Several rows describe **pre-ship** behavior; **P0 + most P1 are already implemented** — don’t re-implement EVP-029 from scratch; **verify on localhost** and do Phase 3 (E2E budgets, progressive web, agent-path streaming).
- **EVP-029** should be reframed as: *verify + harden + agent-path streaming/caching*, not greenfield instant clarify/chips.

**Next concrete step:** Run Gate 9 in [`tasks/agent/response/33-ai-response-time-audit.md`](tasks/agent/response/33-ai-response-time-audit.md) — confirm T1 has **no** `copilotkit` POST and Music has **`events/search` only**. That proves the table’s P0 fixes in production UX terms.



# Event search speed — implementation summary

**Date:** 2026-05-27  
**Full verification checklist:** [`33-ai-response-time-audit.md`](./33-ai-response-time-audit.md)  
**Forensic audit:** [`../../audit/33-ai-response-time-audit.md`](../../audit/33-ai-response-time-audit.md)

## What shipped

| Change | Effect |
|--------|--------|
| Instant clarify (`EVENT_CLARIFY_MESSAGE` + `followUp: false`) | `list events medellin` → no Gemini turn |
| `POST /api/events/search` + `useEventSearchFastPath` | Chips / `music` → ~0.5s Supabase, no copilotkit |
| `ConciergeChatInput` intercept | Only non-fast-path messages hit agent |
| MAP-002D prompt + `needsSearchGrounding` SQL≥3 skip | Fewer ADK chains on agent path |
| `EventWebCitationFetch` uses `shouldChainWebGrounding(_, sqlCount)` | No bogus weekend web POST when catalog full |

## Key files

- `mdeapp/src/app/api/events/search/route.ts`
- `mdeapp/src/hooks/use-event-search-fast-path.ts`
- `mdeapp/src/components/chat/concierge-chat-input.tsx`
- `mdeapp/src/lib/event-search-fast-path.ts`

## Tests

```bash
cd mdeapp && npm test -- --run   # 263 passed (2026-05-27)
```

## Verification (2026-05-27)

| Check | Result |
|-------|--------|
| Unit tests | 263 passed |
| `POST /api/events/search` (music, limit 3) | HTTP 200, **~1.19s** |
| `/` after Input fix | HTTP 200 (was 500 — `Input` not exported in CK 1.55.2) |
| **Playwright perf** `node scripts/perf-events-chat-latency.mjs` | **PASS** — see below |
| SCREEN-006 clarify e2e | **PASS** (8.9s wall; includes 8s settle) |

### Chat flow timings (`list events medellin` → Music chip)

| Step | Time | Network | SLO |
|------|------|---------|-----|
| T1 clarify text visible | **103ms** | **0** copilotkit POSTs | &lt;300ms ✅ |
| Cards after clarify | 0 | — | ✅ |
| T2 Music chip → first card | **1421ms** | **1** `events/search` **1134ms** | &lt;4s ✅ |
| Copilotkit during T2 | 0 new POSTs | — | ✅ |
| Event cards shown | 10 | — | ✅ |

Boot-only copilotkit handshakes (~16–56ms each) on page load — not used for clarify/list turns.

## Still open

- Gate 9 browser proof (Network tab: no copilotkit on clarify/Music chip)
- Playwright perf budgets (Phase 3)
- `npm run build` + lint before push
- Progressive web / agent-path streaming (Phase 2+)
