# Anti-fake-done checklist

> Print this before flipping any task `In Progress → Done`. Every box must be ticked with a probe + result. A box checked without a probe is fraud against future Claude sessions.

## The 9 gates (gate 9 added 2026-05-20 — localhost proof required)

```
[ ] 1. Implementation exists on disk
       PROBE: ls <artifact-path> / git diff --name-only <ref>..HEAD
       RESULT: ____________________________________________

[ ] 2. Tests pass
       PROBE: cd mdeapp && npm test
       RESULT: ____________________________________________

[ ] 3. Build passes
       PROBE: cd mdeapp && npm run build
       RESULT: exit 0 + "Generating static pages" line present

[ ] 4. Lint passes (if task touched lintable code)
       PROBE: cd mdeapp && npm run lint
       RESULT: exit 0

[ ] 5. tasks/INDEX.md row matches task file's frontmatter status
       PROBE: grep "<F-id>" tasks/INDEX.md  AND  head -10 tasks/core/<F-id>-*.md
       RESULT: both say "Done" (or both still "In Progress")

[ ] 6. Evidence file exists OR frontmatter `evidence:` points to a real changelog entry
       PROBE: ls tasks/notes/<F-id>-evidence.md  OR  grep "<F-id>" changelog
       RESULT: ____________________________________________

[ ] 7. No blocker remains open in cross-cutting list
       PROBE: review §B-blockers in tasks/audit/* for this F-id
       RESULT: zero 🔴 dots remain for this task

[ ] 8. External verification (where applicable)
       PROBE (edge fn): mcp__ed3787fc-…__get_edge_function — version + verify_jwt match spec
       PROBE (RLS):     SELECT rowsecurity FROM pg_tables WHERE tablename IN (...) → all true
       PROBE (preview): chrome-devtools navigate → expected text visible
       RESULT: ____________________________________________

[ ] 9. LOCALHOST RUNTIME PROOF (added 2026-05-20 — required for every task)
       PROBE (boot):    cd mdeapp && npm run dev → expect both [ui] + [agent] subprocesses ready
       PROBE (shell):   curl -sI http://localhost:3001/ → HTTP 200, mdeai title in body
       PROBE (runtime): curl -sX POST http://localhost:3001/api/copilotkit -d '{}' → HTTP 400 (alive)
       PROBE (studio):  curl -sI http://localhost:4111/ → HTTP 200 (Mastra dev)
       PROBE (console boot): npm run verify:console:boot → exit 0 (layout-critical = 0; run on EVERY task)
       PROBE (console full): npm run verify:console → exit 0 when Gemini billing OK (rental turn)
       RESULT: ____________________________________________
       EVIDENCE: paste boot log + probe table into evidence file or link a shared smoke artifact
       N/A IF: pure-doc task with zero source/config change AND that fact is recorded explicitly
       NEVER N/A IF: task touches mdeapp/src/**, mdeapp/supabase/**, package.json, .env*, hooks
```

## Failure mode

If any gate fails → status remains **In Progress**. Output:

> "🛑 Not Done. Gate <N> failed: <probe + result>. Required fix: <action>."

## When a "documentation-only" task ships

For F10-style doc tasks where there's no `npm test` to run:

- Gate 2 (tests) is skipped — but **gate 4 (lint on Markdown)** if mdast/remark is wired, else **gate 6 (evidence)** must include the rendered output (e.g., `mermaid validate` for diagrams).
- Gate 8 must verify cross-links: every `[text](path)` resolves to a real file.

## Common "fake done" patterns I have observed

| Pattern | What's missing | Fix |
|---|---|---|
| Status flipped Done before tests written | gate 2 | block flip; require ≥1 test |
| Build green but typecheck red | gate 3 (typecheck not in build) | add `npx tsc --noEmit` to floor |
| INDEX says Done, file says In Progress | gate 5 | reconcile both — file is canonical |
| Evidence file absent | gate 6 | require even a one-line evidence note |
| Edge fn redeployed but verify_jwt drift | gate 8 | always re-`get_edge_function` after deploy |
| "Tests" exist but no actual test runner installed | gate 2 (false positive) | check that `npm test` exit ≠ "Missing script" |
