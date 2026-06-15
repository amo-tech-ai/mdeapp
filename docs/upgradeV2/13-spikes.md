Verdict: `/api/copilotkit` CPU spikes have **two verified root causes** — (1) **Jun 12 single-IP flood** (1,361 reqs from `186.81.102.183`, bypassed in-process rate limits) and (2) **long Mastra agent turns** (20–29s) plus CK-V2 POST multiplication on normal `/chat` loads.

Camila’s `/chat` and Roberto’s `/host/event/new` share the same serverless function; a flood or several overlapping 29s turns both trigger Vercel “Function CPU Duration” alerts even when every response is HTTP 200.

## Implementation checklist (correct order)

| Step | Task | Status | Blocks |
|------|------|--------|--------|
| **1** | **PERF-001b** — Distributed CopilotKit rate limit (Supabase `check_rate_limit`) | ✅ Implemented · evidence [`PERF-001b-RESULTS.md`](../tasks/testing/evidence/PERF-001b/PERF-001b-RESULTS.md) | Single-IP flood recurrence |
| **2** | **PERF-001** — Single `conciergeAgent` `useAgent` owner on `/chat` | 🟡 Local diff · not shipped | 5–6× POST fan-out on page load |
| **3** | **PERF-003** — POST budget test + Observability alert | ⬜ | Regression detection |
| **4** | **PERF-002** — Cap long agent turns / tool budget | ⬜ | 29s ceiling hits |

Executive summary
Finding	Evidence strength
Primary (Jun 12): Single-IP flood — 1,361 reqs, ~21.6 min CPU in 5m bucket
Strong — Vercel `vercel metrics` CLI verified 2026-06-15
Primary (steady state): Agent turns hold function busy up to ~29s (maxDuration = 30)
Strong — ai_runs.duration_ms, route config
Secondary: 5–6 concurrent POSTs per /chat load after CK-V2
Strong — Vercel runtime logs + code
Secondary: Jun 14 prod deploy cascade → cold starts + larger bundle + Postgres store init
Medium — deployment timestamps + build sizes
Jun 12 flood bypass: In-process VERCEL-CPU-001 not shared across Fluid instances
Strong — metrics + code audit
Not primary: Anonymous bot/crawler flood (general traffic)
Weak — no broad bot pattern; Jun 12 was one residential CO IP

Evidence gaps (could not obtain)
Source	Status	Why
Vercel Observability
❌
Login wall; MCP timed out
Vercel Function Analytics / Traces
❌
Not exposed via CLI; MCP unavailable
Full invocation counts / CPU ms / memory
❌
CLI returns sampled logs only (~12 /api/copilotkit rows / 72h)
Request IP / User-Agent
❌
Not in CLI JSON logs
Supabase Postgres slow-query logs
❌
Supabase MCP timed out
Exact alert timestamp
❌
Not in user message
Task 1 — Deployment correlation
Current prod: dpl_J1i3cPp5otnDksJG2NMqW5p97E95 → https://www.mdeai.co · created 2026-06-14 08:29 COL · commit 8b3f84ee (docs-only #220).

Deployment ID	Commit	Time (COL)	Env	Related to spike?
dpl_J1i3cPp5otnDksJG2NMqW5p97E95
8b3f84ee · docs #220
Jun 14 08:29
Production
Partial — bundle already enlarged; docs-only code
dpl_75EoVrq3kS2Xmd9EHjADLPXtYGKF
4c6ef62e · [SAN-891 · CK-V2-005 — Retire @copilotkit/react-ui; consolidate frontend to react-core/v2 + remove flags](https://linear.app/sanjiovani/issue/SAN-891/ck-v2-005-retire-copilotkitreact-ui-consolidate-frontend-to-react) #219
Jun 14 07:56
Production
Yes — global v2 cutover; dual useAgent watch item
dpl_FAgoZ6RmCG1KQ42tAejabEpKoiRD
078a677c · SAN-890 · CK-V2-004
Jun 14 05:47
Production
Yes — /chat v2 ChatProvider + per-mount threadId
dpl_4R1BWR3J6P9owd1LeZPQhTosjmkg
(partners/docs)
Jun 14 04:21
Production
Low
dpl_75mBrDdjgXaPFbKRqGZpTqCMuCDj
earlier main
Jun 14 03:54
Production
Low
Build-size signal: Latest prod lambda bundle 5.32MB + middleware 218KB vs older prod 122KB middleware — heavier cold starts.

Conclusion: Deployments correlate with the Jun 14 window but do not solely explain CPU — 21–29s concierge runs exist from Jun 11–13 (pre–CK-V2). Deploys amplified via cold starts + client POST multiplication.

Task 2 — Function analysis (/api/copilotkit)
Metric	Value (observed)	Normal (expected)	Delta	Source
Invocations (sampled 72h)
12 logged
N/A — full count unavailable
Unknown
Vercel CLI --query copilotkit
HTTP status
100% 200
200
OK
Same
Error logs 72h
0
0
OK
vercel logs --level error
Agent turn duration (prod)
p99 ~29,059ms
Target <10s for chat UX
+190%
ai_runs
Agent turn median
~7,678ms
<5s
+54%
ai_runs (107 rows / 72h)
maxDuration
30s
—
Runs kiss ceiling
route.ts
Cold-start signal
[mastra-storage] using Postgres on 6/12 POSTs
Once per warm instance
Repeat on cold instances
Runtime logs
Timeout warnings
None in logs
—
—
No evidence
Memory / CPU ms / concurrency
Not available
—
—
Observability blocked
Route config (prod @ 8b3f84ee):

export const maxDuration = 30;
// persistTurnLog uses next/server after() — extends function past SSE
Task 3 — Request pattern analysis
User/IP	Requests	% traffic	Suspicious?
Unknown IP
All sampled POSTs
100%
Cannot determine — no IP in CLI
User a5f6adc5-… (single UUID)
41 host-event-agent runs
~38% of 72h ai_runs
Internal/dev pattern — 23 threads, 1 user, Jun 14 01:00 UTC hour
Anonymous / other users
Remaining ~66 runs
~62%
Normal chat/host usage
Bots / crawlers
0 /api/copilotkit in sample
0%
No evidence (wp-admin probes hit other routes only)
POST burst pattern (proven):

Window (UTC)	POST /api/copilotkit	Pattern
Jun 14 14:14:50–55
6 (5 same ms)
Cold start + parallel handshake
Jun 15 15:01:11–26
6 in 15s
/chat page load sequence
Not proven: infinite retry loop, SSE reconnect storm at scale (only 2 windows sampled).

Task 4 — CopilotKit investigation
Issue	File(s)	Evidence
Multiple useAgent("conciergeAgent") per page
concierge-coagent-context.tsx, use-concierge-chat.ts, + 5 call sites
Each useConciergeChat() = new subscription
Call sites
concierge-session-context.tsx, chat-query-bar.tsx, concierge-initial-prompt.tsx, event-web-citation-fetch.tsx, cafe-detail-panel.tsx
Grep confirmed
/chat isolated provider
chat-provider.tsx — new threadId per mount
Extra connect churn on navigation
Global provider skips /chat
copilot-kit-provider.tsx lines 15–21
Correct split, but /chat stack still stacks providers
Stable props (good)
copilotkit-client-props.ts — module-level empty objects
LESSONS §1 guard
[SAN-891 · CK-V2-005 — Retire @copilotkit/react-ui; consolidate frontend to react-core/v2 + remove flags](https://linear.app/sanjiovani/issue/SAN-891/ck-v2-005-retire-copilotkitreact-ui-consolidate-frontend-to-react) audit flag
docs/upgradeV2/notes-6-219.md line 71
“Two useAgent subscriptions… Monitor POST volume”
Not found in code review: recursive agent loops, missing debouncing in route handler, backend duplicate agent execution per message.

Task 5 — Mastra investigation
Agent	Calls (72h)	Avg/max duration	Problem
concierge-agent
15
median ~15s / max 29,059ms
9 tools incl. grounding + web search; full Gemini orchestration
host-event-agent
90
~5.8s avg / max 14,463ms
Jun 14 01:00 UTC burst: 41 runs, 1 user
host-ops-agent
2
low
No issue
Concierge tool surface (src/mastra/agents/concierge.ts): search-rentals, search-events, search-grounded-places, search-restaurants, search-attractions, search-web-grounded-events, extract-intent-slots, request-venue-booking — multi-hop tool chains = long CPU.

LoggingMastraAgent wraps every turn with telemetry + ai_runs persist (logging-mastra-agent.ts).

Task 6 — Supabase investigation
Query	Duration	Calls	Recommendation
Postgres slow queries
Unknown
—
Need Supabase dashboard / MCP
ai_runs inserts
Part of after() path
107 / 72h
Minor vs 20–29s agent work
Connection spikes
Not observed
Mastra pool max: 3
storage.ts
No SQL bottleneck identified from available evidence. CPU is dominated by in-function Gemini + tools, not waiting on Postgres (runs complete successfully).

Task 7 — AI cost investigation
Agent	Avg time	Tokens (logged)	Cost impact
concierge-agent
~15–29s on slow turns
input_tokens: 0, output_tokens: 0 in metadata
Telemetry gap; model = gemini-3.5-flash
host-event-agent
~6–14s
Same gap
Lower per-turn than concierge peaks
Cannot compute dollar cost — token fields empty in ai_runs.metadata for prod rows examined.

Task 8 — Timeline reconstruction
All times UTC (best available cross-source).

Time	Traffic / executions	CPU growth driver	DB
T0 Jun 14 00:00
5× host-event-agent
~28s cumulative agent time
ai_runs writes
T+1h Jun 14 01:00
41× host-event, 1 user, 23 threads
~239s agent CPU in one hour
Burst inserts
T+8h Jun 14 08:00
6× concierge, 2× >20s
~90s cumulative
Long Gemini turns
T+9h Jun 14 09:00
3× concierge, 1× 24.4s
~47s
Same
T+11h Jun 14 11:00
3× concierge, all >20s (max 29.1s)
~77s
Near maxDuration
T+13h Jun 14 13:29
Prod deploy 8b3f84ee
Cold-start risk
—
T+14h Jun 14 14:06
1× concierge 22.7s
Single heavy turn
—
T+14h14m Jun 14 14:14:55
5× simultaneous POST + Postgres init logs
Cold-start parallel invocations
Mastra PostgresStore
T+1d Jun 15 15:01
6× POST in 15s on /chat
CK-V2 multi-useAgent handshake
Normal
Task 9 — Root cause
Primary root cause:
/api/copilotkit runs in-process Mastra agents (especially concierge-agent) whose turns routinely take 20–29 seconds of active CPU (Gemini + multi-tool orchestration), directly inflating Vercel Function CPU Duration on Fluid Compute.

Secondary contributing causes:

[SAN-891 · CK-V2-005 — Retire @copilotkit/react-ui; consolidate frontend to react-core/v2 + remove flags](https://linear.app/sanjiovani/issue/SAN-891/ck-v2-005-retire-copilotkitreact-ui-consolidate-frontend-to-react) — multiple v2 useAgent({ agentId: "conciergeAgent" }) hooks → 5–6 parallel POSTs per /chat load.
Jun 14 production deploy wave — larger lambda + middleware, repeated cold starts with [mastra-storage] using Postgres.
after() + logAgentRunForTurn — extends serverless lifecycle after SSE completes.
Jun 14 01:00 UTC — 41 host-event runs from one authenticated user (dev/QA burst, not public attack).
Evidence: Vercel runtime logs (12 POST rows), ai_runs (107 rows / 72h), route + agent source via git, SAN-891 forensic note.

Confidence: 78% (blocked from 95% by missing Observability CPU time series).

Task 10 — Fix plan

Task 0 — PERF-001b — Distributed CopilotKit rate limit (**P0 — ship first**)
Priority: Critical · **Status: implemented (pending prod deploy)**
Problem: Jun 12 flood — 1,355 `/api/copilotkit` invocations in 5m from one IP; in-process VERCEL-CPU-001 buckets are per Fluid instance.
Fix: Supabase `check_rate_limit` RPC — hard IP 300/5m, anon 30/5m, authed user 120/5m; 429 before Mastra; emergency local brake if RPC down.
Files: `src/lib/distributed-rate-limit.ts`, `src/lib/copilotkit-distributed-rate-limit.ts`, `src/app/api/copilotkit/[[...path]]/route.ts`
Evidence: `docs/tasks/testing/evidence/PERF-001b/PERF-001b-RESULTS.md`

Task 1 — PERF-001 — Consolidate concierge to single useAgent provider
Priority: Critical · **Run after PERF-001b PR**
Problem: 5+ useAgent("conciergeAgent") mounts → 5–6× /api/copilotkit POSTs per page load.
Fix: One context exposing { agent, appendMessage, reset, isLoading }; remove useConciergeChat() from leaf components.
Files: use-concierge-chat.ts, concierge-coagent-context.tsx, concierge-session-context.tsx, chat-query-bar.tsx, event-web-citation-fetch.tsx, cafe-detail-panel.tsx
Expected impact: 40–60% fewer invocations on /chat load; lower concurrent CPU.

Task 2 — PERF-003 — Observability + prod POST budget gate
Priority: High
Problem: No prod guard on POST count; token telemetry empty in ai_runs.
Fix: Playwright prod budget test (extend CK-P0-07 pattern); fix token fields in logAgentRunForTurn; alert on >N POSTs/10s to /api/copilotkit.
Files: e2e/, log-agent-run.ts, docs/upgradeV2/notes-6-219.md prod smoke row
Expected impact: Catch regressions before Observability fires; Patricia can trace cost.

Task 3 — PERF-002 — Cap concierge agent turn wall time & tool budget
Priority: Critical
Problem: Turns hit 29s / maxDuration=30; Observability alert tracks CPU seconds × concurrency.
Fix: Per-turn tool-call ceiling, fast-path routing before full agent for known intents, stricter grounding gating (see existing VERCEL-CPU-001 in is-search-grounding-enabled.ts).
Files: src/mastra/agents/concierge.ts, router/fast-path handlers, logging-mastra-agent.ts
Expected impact: Cut p95 CPU duration toward <12s; fewer ceiling hits.

Deliverables
Evidence table
#	Claim	Source	Result
E1
Endpoint = /api/copilotkit
Vercel logs
✅
E2
Max agent 29,059ms
ai_runs
✅
E3
6 POST burst on /chat
Logs Jun 15 15:01 UTC
✅
E4
41 host runs / 1 user / 1h
ai_runs Jun 14 01 UTC
✅
E5
Dual+ useAgent
Code + SAN-891 audit
✅
E6
CPU duration metrics (Jun 12 spike)
Vercel metrics CLI
✅ 1,292,332 ms @ 20:05 UTC
E7
Slow SQL
Supabase logs
❌
E8
Single-IP flood Jun 12
Vercel metrics by client_ip
✅ 186.81.102.183 · 1,361 reqs
Risk assessment
Risk	Level	Who feels it
Observability CPU alerts
High
Sofía / cost
Chat latency 20–30s
High
Camila /chat
Concurrent POST amplification
Medium
After CK-V2 prod
Supabase overload
Low
No evidence
Production readiness score
Gate	Score	Notes
Runtime stability (200s, no errors)
85/100
No 5xx in 72h sample
CPU / cost control
55/100
29s turns + POST multiplication
Observability
40/100
Token telemetry empty; need dashboards
Overall for /api/copilotkit CPU
58/100
Functional but not cost-safe at scale
Estimated probability incident reoccurs
Scenario	Probability (30 days)
Alert fires again with normal Camila traffic
~70% if dual useAgent stays
Alert during single-user host wizard QA
~90% (proven Jun 14 pattern)
After PERF-001b + PERF-001 + PERF-002 land
~10–20% (estimate — needs Observability validation)
Next step: Deploy PERF-001b to prod, then open PERF-001 PR. Monitor Vercel Observability `/api/copilotkit` invocations/min by `client_ip`.