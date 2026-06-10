Audit report
1. Already correct
Check	Result
All 6 shipped files exist
✅
Registry has all 12 IDs
✅ SAN-462, OPS-JOURNEY, SEARCH-003, DATA-041, VEN-012/020/021/031, MAP-008B, AUTH-011, SCREEN-023, SCREEN-005
npm run verify:task + test:e2e:prod-venues-journey in package.json
✅
sync-tasks-queue-hints.mjs
✅ read-only (stdout only, no writeFile on tasks.md)
Docs wired
✅ tasks.md, plan.md, 09-prod-live-journey-matrix, mdeai-live-prod-check, improve.md
J05–J08 prod command documented
✅ PROD_SMOKE_BASE_URL=https://www.mdeai.co npm run test:e2e:prod-venues-journey
PR template had task ID + verify:task but was light on scoped proof, floor, evidence scope, unrelated files, and post-merge steps.

2. What changed
Item	Change
A
Added mdeapp/scripts/verify-task.md — when/how, examples, registry guide, --skip-floor vs full floor
B
verify-task.mjs — banner, planned steps, prod-e2e skip warning, pass/fail summary block
C
No new registry entries (all 12 already present)
D
No package.json changes (scripts already there)
E
PR template — explicit test/floor/evidence/unrelated-files checks + post-merge section
Link
improve.md §11 → verify-task.md
3. Files changed
mdeapp/scripts/verify-task.md (new)
mdeapp/scripts/verify-task.mjs (output only + prod warning)
mdeapp/.github/pull_request_template.md
tasks/notes/improve.md (one link)
4. Commands + results
npm run lint          # exit 0
npm run typecheck     # exit 0
npm run verify:task -- VEN-020 --skip-floor   # exit 0 — 3/3 vitest
npm run verify:task -- OPS-JOURNEY --skip-floor  # exit 0 — warns prod e2e skipped; 3 steps pass
npm run floor         # exit 0 (~46s)
5. Risks / follow-ups
Risk	Mitigation
OPS-JOURNEY passes locally without running prod Playwright (tests skip without PROD_SMOKE_BASE_URL)
Script now prints ⚠ + correct command; PR template requires prod for persona-visible
verify:task with --skip-floor on Done flip
Full floor still required per verify-task.md for first ship
Registry drift
Add entries only when tests exist; run sync-tasks-queue-hints.mjs post-merge
Optional later (not done): fail OPS-JOURNEY if prod e2e all skipped — would change behavior; skipped per “keep behavior unchanged” except warning.

6. PR vs local-only
Small PR recommended — process/tooling only, no product code:

mdeapp/scripts/verify-task.md
mdeapp/scripts/verify-task.mjs
mdeapp/.github/pull_request_template.md
tasks/notes/improve.md
Suggested subject: chore(process): verify-task docs, summary output, PR checklist

Want me to commit this as one slice?


Updated [`tasks.md`](tasks.md): every active task table now has a **Use case (real world)** column.

**Pattern:** `**Persona:** concrete prompt or action → expected outcome`

Examples:
- **SAN-462** — Sofía: 3 nightly prod passes for Laureles + salsa queries  
- **DATA-041** — Carlos: *"quiet rooftop Provenza"* → Relato ranks high  
- **VEN-012** (done) — Carlos: cocktails → nightlife panel, not café tabs  
- **SCREEN-005** — Camila: `/rentals` browse (still 🟥 redirect today)  
- **D1 PAY-001** — Andrés: paid ticket → QR in wallet  
- **TRIP-007** — Camila: Add rental to *Move to Laureles* trip  

**Also updated:** Done sections (venues, trips data, platform screens), deferred VEB track, header note explaining the column.

**Removed:** redundant **Purpose** column (merged into use case). **Feature** stays technical; **Use case** is persona + Medellín example. Spec links shortened where rows were wide (`009` vs full filename).