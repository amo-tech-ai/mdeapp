# notes-11 — next steps queue (2026-06-06)

**Context:** Post SAN-587 merge (`main` @ `2cca205`). Browse stack complete (events re-skin + nav, restaurants, nightlife, cafés). Mastra roadmap validated **95/100**.

**Sources:** [notes-10](notes-10-next.md) · [index-mastra.md](../mastra/plan/index-mastra.md) · [june-5-mastra-tasks.md](../mastra/audit/june-5-mastra-tasks.md)

**Legend:** 🟢 ≥90% · 🟡 75–89% · ⚪ 50–74% · 🔴 &lt;50% · ✅ Done

---

## Shipped this session

| Task | Merge | Prod smoke |
|------|-------|------------|
| **SAN-587** D-09b events browse re-skin | PR #88 → `2cca205` | `GET /events` → **200** |
| **Cafés nav** (SAN-584 pattern) | PR #89 → `7db2282` | `GET /cafes` → **200** · nav link live (no `aria-disabled`) |

---

## Recommended order (all tracks)

```text
NOW     DATA-041 → INT-021           (intelligence — Patricia/Camila)
NEXT    SAN-589 → 590 → 605 → 591     (Mastra Phase 0 — Patricia/Sofía)
THEN    592 → 606 → 593 → 594 …       (Mastra Phase 1)
LATER   607 → 601 → 602 → 597 …       (Mastra Phase 2+)
```

---

## Master table — next steps

| # | Task | Full name | Track | Purpose (why now) | Feature / surface | Grade | Score |
|---|------|-----------|-------|-------------------|-------------------|-------|------:|
| 1 | **VEN-035 fix** | Cafés browse placeholder test stale | e2e | Full release gate still expects placeholder; `/cafes` is live | `VEN-035-venue-release.spec.ts` | 🟢 | 95% |
| 2 | **DATA-041** | venue_signals human QA sign-off | Data | Human gate before intelligence wrapper; Patricia editorial | `venue_signals` table · chat grounding quality | 🟡 | 85% |
| 3 | **SEARCH-003** | Hybrid restaurant search + venue_signals | Data | First hybrid search after DATA-041 + DATA-047/VEC-001 | Restaurant chat · Supabase + signals | 🟡 | 82% |
| 4 | **SAN-589** | AGT-00C — Mastra telemetry & AI tracing | Mastra P0 | Turn on the lights — can't tune latency/cost without spans | `Mastra({ telemetry })` · Patricia ops | 🟢 | 94% |
| 5 | **SAN-590** | AGT-00A — Hallucination / faithfulness scorer | Mastra P0 | Catch invented listings/venues before user sees them | `createScorer` · `/api/scorers` | 🟢 | 92% |
| 6 | **SAN-605** | AGT-00B — Grounding-coverage scorer | Mastra P0 | Every claim backed by tool results; pairs with 590 | Shared judge + schema with 590 | 🟢 | 93% |
| 7 | **SAN-591** | AGT-00D — Runtime agent allowlist | Mastra P0 | Expose 2 agents in prod, not 7; 15-min defense-in-depth | `logging-mastra-agent.ts` filter | 🟢 | 95% |
| 8 | **SAN-592** | AGT-03 — Structured output (scorer judge) | Mastra P1 | Typed reranker + scorer judge; shared Zod schema | `evaluationAgent` · `structuredOutput` | 🟢 | 91% |
| 9 | **SAN-606** | AGT-04A — Grounding-assertion output processor | Mastra P1 | Enforce "tool results = truth" at runtime on **all card kinds** | Rental · Event · Restaurant · Venue cards | 🟢 | 90% |
| 10 | **SAN-593** | AGT-05 — Input-processor coverage | Mastra P1 | `hostEventAgent` unprotected vs concierge — close gap | `getDefaultInputProcessors` on host | 🟢 | 96% |
| 11 | **SAN-594** | AGT-06 — ResponseCache + CostGuard | Mastra P1 | Repeat-query latency + runaway spend circuit breaker | Camila `/` repeat searches | 🟢 | 90% |
| 12 | **SAN-595** | AGT-01 — Native tool-approval | Mastra P1 | Server-side pause for publish/checkout (CK HITL + Mastra gate) | Roberto publish · Andrés checkout | 🟡 | 86% |
| 13 | **SAN-596** | AGT-04B — SystemPromptScrubber | Mastra P1 | Don't leak concierge prompt via injection/echo | Output processor ~1 line | 🟢 | 94% |
| 14 | **SAN-598** | AGT-04C — PII protection | Mastra P1 | Redact emails/phones; low MVP exposure, deferrable | `PIIDetector` output | 🟢 | 90% |
| 15 | **INT-021** | Restaurant & venue intelligence wrapper | Intel | Better restaurant/venue chat — **blocked on DATA-041** | Concierge grounded places | 🟡 | 80% |
| 16 | **SAN-607** | AGT-15 — Workflow error handling + compensation | Mastra P2 | **Mandatory** — Stripe OK / DB fail needs rollback | `retries` + `bail` + compensation | 🟢 | 93% |
| 17 | **SAN-601** | AGT-11 — Checkout workflow | Mastra P2 | Deterministic money path; blocked on PAY-001 (SAN-178) | Andrés ticket buy | 🟡 | 80% |
| 18 | **SAN-602** | AGT-12 — Host publish workflow | Mastra P2 | Deterministic validate→preview→publish vs prompt-only | Roberto `/host/event/new` | 🟡 | 81% |
| 19 | **SAN-597** | AGT-02 — Resource-scoped working memory | Mastra P2 | Durable prefs across threads; unlocks 610/603 | Camila Laureles/budget memory | 🟢 | 92% |
| 20 | **SAN-608** | AGT-14 — Suspend & resume (host event) | Mastra P2 | Roberto resumes at failed step, not restart | Workflow snapshots · host wizard | 🟢 | 90% |
| 21 | **SAN-609** | AGT-16 — Progressive tool streaming | Mastra P2 | Kill 10s spinner — "searching… ranking…" | `context.writer` / WM state on v1 | 🟢 | 90% |
| 22 | **SAN-600** | AGT-09 — Background tasks | Mastra P2 | Fast first paint; slow grounding continues async | Tourist heavy venue search | 🟡 | 83% |
| 23 | **SAN-599** | AGT-07 — Tool output shaping + activeTools | Mastra P2 | Trim tokens; scope tools per intent | Sofía cost · Camila latency | 🟢 | 89% |
| 24 | **SAN-610** | AGT-13 — Memory processors | Mastra P3 | Extract neighborhood/budget/style deterministically | Cheap personalization | 🟢 | 91% |
| 25 | **SAN-603** | AGT-08 — Semantic recall (pgvector) | Mastra P3 | "Apartment I liked last week" — post-launch delight | Mastra memory vector (not `@mastra/rag`) | 🟡 | 87% |
| 26 | **SAN-604** | AGT-10 — Interop spike (doc) | Mastra P3 | Scope WhatsApp Channels + A2A/ACP; no runtime | Phase 2 platform doc | 🟢 | 95% |
| 27 | **AGT-17** | Golden query evaluation suite *(proposed)* | Mastra QA | Trust scorers — 70 fixed queries in CI | After 590/605; file SAN-611 | 🟢 | 95% |

---

## Already done (don't reopen)

| Task | Name | Status |
|------|------|--------|
| SAN-587 | D-09b events browse re-skin | ✅ Done — PR #88 |
| SAN-586 | Public events API | ✅ Done |
| SAN-518 | `/events` browse | ✅ Done |
| SAN-584 | Events + Cafés nav enable | ✅ Done — PR #87 events · PR #89 cafés |

---

## Persona → next win

| Persona | Next task | Visible effect |
|---------|-----------|----------------|
| **Andrés / Tourist** | Cafés nav PR | ✅ merged PR #89 |
| **Camila** | DATA-041 → INT-021 | Better restaurant answers in chat |
| **Roberto** | SAN-366 ✅ | Optional evidence refresh only |
| **Patricia** | DATA-041 + SAN-589 | QA sign-off + AI traces |
| **Sofía** | SAN-589 → SAN-591 | Observability + runtime hygiene |

---

## Open actions

- [x] Merge **PR #91** (VEN-035) · **PR #85** (VEN-025) — prod smoke PASS
- [ ] File **AGT-17** as SAN-611 in Linear (after 590/605)
- [ ] Patch Linear bodies: SAN-597 · SAN-606 · SAN-608 (review acceptance criteria)
- [ ] Promote Phase 0 to `phase:launch`? (owner decision)

**Next doc:** `notes-12.md` after cafés nav merge or DATA-041 sign-off.
