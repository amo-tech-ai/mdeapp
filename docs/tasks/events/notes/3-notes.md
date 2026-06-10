How task completion is tracked (today)
Layer	What it does	Gap
Linear SAN-*
Source of truth for status (Todo → In Review → Done)
Status alone isn’t proof
tasks/events/notes/1-notes.md
Execution order + blockers
Manual; not auto-synced
tasks/testing/evidence/YYYY-MM-DD/
Proof files (screenshots, RESULTS.md)
Often skipped for small fixes
task-verifier skill
Disk/MCP probes before Done
Not wired into every agent turn
PR CI
floor · Vercel · cubic · CodeRabbit
Post-push only; not pre-claim
Commits
Closes SAN-### in PR body
Doesn’t store test output
Honest answer: I track work in conversation + Linear + evidence paths + PR checks — not a single automated ledger. “Done” is only valid when skills + MCP + tests + evidence all agree.

Verification stack you asked for (correct order)
1. Skills + MCP docs     → spec/API truth before coding
2. Implement             → one SAN-* = one PR
3. Unit/Playwright       → npm test / e2e spec
4. cubic + CodeRabbit    → resolve threads before merge
5. Browser MCP           → persona-visible flow + screenshot
6. Chrome DevTools MCP   → only if Browser/Playwright fails (network/console)
7. Prod (when shipping)  → curl + chat-smoke + Browser on mdeai.co
8. Evidence file         → tasks/testing/evidence/YYYY-MM-DD/<SAN>-RESULTS.md
9. Linear                → In Review with evidence link; Done after your approval
Suggested Cursor rule
Save as .cursor/rules/mdeai-done-gate.mdc (complements mdeai-testing.mdc + mdeai-task-verifier.mdc):

---
description: STRICT — Done gate for mdeai tasks. Skills+MCP first, cubic/CodeRabbit before merge, Browser proof, evidence file, full SAN task names. Never claim Done without proof.
alwaysApply: true
---
# mdeai Done gate — track, verify, prove
## Task naming (mandatory — Events + all SAN work)
Every reference:
```text
SAN-### · SPEC-ID — <full Linear title>
Example: SAN-731 · UI-004 — Event detail loading skeleton + hero alt (a11y)

Never SAN-only, spec-only, or abbreviated titles in execution lists, PRs, or commits.

Before coding
Read task spec (tasks/**) + Linear issue body (MCP get_issue).
Load ≤5 skills from .cursor/rules/mdeai-skills-best-practices.mdc routing table.
MCP before external APIs — verify models, CopilotKit, Supabase schema, Maps field masks (see skills plan).
State assumptions; one issue = one branch = one PR.
Before marking In Review / Done
Gate	Required when	Tool
Targeted tests
Any mdeapp/src change
npm test -- --run <pattern>
Playwright
UI/screen task
npx playwright test e2e/...
Dev restart
Persona-visible UI
npm run dev + curl 200
Browser MCP
Chat, cards, maps, host, landings
navigate → prompt → assert → screenshot
Chrome DevTools MCP
Browser fails or API debug
network + console, no 5xx on touched routes
cubic + CodeRabbit
Before merge
resolve all review threads; floor green
Prod smoke
Ship / persona-visible
chat-smoke.mjs --base https://www.mdeai.co + Browser
Evidence
Always for UI/agent
tasks/testing/evidence/YYYY-MM-DD/SAN-###-RESULTS.md
task-verifier
Before Linear Done
.claude/skills/task-verifier/SKILL.md
Anti-fake-done: Memory and Linear status: are not evidence. Re-probe disk + runtime.

Evidence file template
Path: tasks/testing/evidence/YYYY-MM-DD/SAN-###-<slug>-RESULTS.md

# SAN-### · SPEC-ID — <full Linear title>
| Check | localhost | prod |
|-------|-----------|------|
| curl GET / | | |
| targeted vitest | | |
| Playwright | | |
| Browser prompt | | |
| cubic/CodeRabbit | threads resolved |
| floor | PASS/FAIL |
Commits: <sha> · PR: #NNN
Screenshot: tasks/testing/evidence/YYYY-MM-DD/SAN-###.png
Linear workflow
Ship → In Review + comment with evidence path + PR URL.
Done only after user approval (tasks/linear/04-completion-approval.md).
Update blocker chain when merging (e.g. SAN-730 Done unblocks SAN-729).
PR merge checklist

 Scope = one SAN-* issue

 cubic threads resolved (or fixed + pushed)

 CodeRabbit / floor / Vercel green

 No unrelated files in diff

 Evidence committed or linked in PR comment
---
## What I’ll do on every Events task from here
1. **Name:** `SAN-731 · UI-004 — Event detail loading skeleton + hero alt (a11y)` (full title).
2. **Before code:** `task-verifier` + relevant skill + MCP if touching APIs.
3. **After code:** Vitest → Playwright → Browser screenshot → evidence MD.
4. **Before merge:** cubic/CodeRabbit threads resolved, floor green.
5. **Linear:** In Review with evidence; never Done without your OK.
Want me to write `mdeai-done-gate.mdc` to `.cursor/rules/` and add a short **Events naming** section to `tasks/events/notes/1-notes.md`?
Done — changelog + Cursor rule are in place.

## Created

**[`tasks/events/changelog.md`](tasks/events/changelog.md)**
- Scoring rubric (5 dimensions → weighted **% correct** → **A–F** grade)
- Summary table
- Backfilled entries for **SAN-660** (A · 92%) and **SAN-730** (B+ · 88%)
- Copy-paste template for the next task

**[`.cursor/rules/mdeai-events-changelog.mdc`](.cursor/rules/mdeai-events-changelog.mdc)**
- Fires on Events/host/partner paths
- Requires changelog append **before** Linear In Review/Done
- Must show dimension scores — no hand-wavy grades
- Pairs with `task-verifier`, `mdeai-testing`, cubic/CodeRabbit

Also linked from [`tasks/events/notes/1-notes.md`](tasks/events/notes/1-notes.md).

## Formula (agents must compute)

```text
% correct = round(0.25×spec + 0.25×tests + 0.20×review + 0.20×runtime + 0.10×process)
```

| Grade | Range |
|-------|------:|
| A | 90–100 |
| B | 80–89 |
| C | 70–79 |
| D | 60–69 |
| F | &lt;60 |

## Next task (SAN-731)

When it ships, append under **Entries (newest first)** and add a Summary row — same format as SAN-660/730.