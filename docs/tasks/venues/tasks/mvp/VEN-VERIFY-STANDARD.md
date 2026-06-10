# Venues MVP — verification standard (VEN-009 … VEN-043)

> **Applies to:** every `tasks/venues/tasks/mvp/NNN-ven-*.md` task.  
> **Scorecard:** [`../evidence/VEN-VERIFY-MATRIX.md`](../evidence/VEN-VERIFY-MATRIX.md)  
> **Skills:** `task-verifier` · `testing` · `playwright-cli` · `mde-supabase` · `mastra` · `copilotkit-debug`  
> **Screen parity:** [`tasks/screens/SCREEN-TESTING-STANDARD.md`](../../../screens/SCREEN-TESTING-STANDARD.md) §1–7

**Anti-fake-done:** No task flips `status: Done` until local proof + evidence file exist and grade ≥ **B (80)** for P0, **C+ (75)** for P1 optional tracks.

---

## 1. Prerequisites

```bash
cd mdeapp && npm run dev   # UI :3000 or :3001 + Mastra :4111
```

| Surface | URL |
|---------|-----|
| Chat (primary) | `http://localhost:3001/` (or `:3000` if free) |
| CopilotKit | `POST http://localhost:3001/api/copilotkit` |
| Mastra Studio | `http://localhost:4111` |
| Auth | `http://localhost:3001/login` |
| Admin (Patricia) | `http://localhost:3001/admin/*` |
| Catalog browse | `http://localhost:3001/restaurants` |

Set Playwright when reusing a running dev server:

```bash
export SMOKE_BASE_URL=http://localhost:3001
export PW_SKIP_WEBSERVER=1
```

---

## 2. Floor bundle (every code-touch task)

```bash
cd mdeapp
npm run floor                                    # lint + test + build gates
npm test -- --run <task-specific-vitest-glob>  # when unit tests exist
npm run verify:console                           # UI tasks — 0 critical console errors
```

---

## 3. MCP probes

| Touch surface | MCP server | Tool | Pass criteria |
|---------------|------------|------|---------------|
| DB schema / RLS | `user-supabase` | `execute_sql` | Table exists, `relrowsecurity=true`, policies match spec |
| RLS advisors | `user-supabase` | `get_advisors` | No critical RLS gaps on touched tables |
| Mastra tools/agents | `user-mastra` | `searchMastraDocs` / `readMastraDocs` | `createTool`, registry key matches CopilotKit |
| CopilotKit actions | `project-0-mdeai-copilotkit` | `search-docs` | `useCopilotAction` name = Mastra `tools` key |
| Gemini models (agents) | `user-gemini-api-docs-mcp` | `search_docs` | Model id not deprecated |
| Places / field mask | `user-google-maps-code-assist` | `retrieve-google-maps-platform-docs` | Every Places call has `X-Goog-FieldMask` |

**Example RLS probe:**

```sql
SELECT relname, relrowsecurity FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND relname = 'venue_booking_requests';

SELECT polname, polcmd, roles FROM pg_policies
WHERE tablename = 'venue_booking_requests';
```

---

## 4. Chrome DevTools MCP / CLI

Use **chrome-devtools MCP** (Cursor) or **chrome-devtools-cli** for scripted proof.

| Step | Action | Pass |
|------|--------|------|
| Boot | `navigate_page` → task route | HTTP 200, no blank shell |
| Structure | `take_snapshot` | Required `data-testid`s from task spec |
| Console | `list_console_messages` | 0 critical (allow Maps billing warn if env known-bad) |
| Network | `list_network_requests` | `/api/copilotkit` not 5xx; Places not unmasked |
| Layout | `resize_page` 1280×900 + 390×844 | No horizontal overflow |
| Interaction | click/fill on testids | Panel/sheet opens; state updates |
| Screenshot | save to `mdeapp/tmp/screenshots/VEN-NNN/` | Linked from evidence md |

**Fail closed:** `Hydration failed`, CopilotKit POST storm, uncaught Mastra stream errors, `RefererNotAllowedMapError` on prod keys.

---

## 5. Playwright

| Task type | Spec pattern | Command |
|-----------|--------------|---------|
| Restaurant UI | `e2e/screens/SCREEN-023-*.spec.ts` | `npx playwright test e2e/screens/SCREEN-023-*.spec.ts --project=chromium` |
| Café UI | `SCREEN-021-*.spec.ts` | same pattern |
| Nightlife UI | `SCREEN-022-*.spec.ts` | same pattern |
| Booking persist | extend 021/023 with auth fixture | signed-in storageState |
| Venue suite | VEN-031 aggregates | `npm run test:e2e -- e2e/screens/SCREEN-02*.spec.ts` |

Evidence must record: pass count, base URL, auth used (anon vs signed-in).

---

## 6. Grading rubric

| Band | Score | Production ready? | Meaning |
|------|-------|-------------------|---------|
| A | 90–100 | Yes | Shipped, tested, no P0 gaps |
| A- | 85–89 | Yes with notes | Minor deferrals documented |
| B+ | 80–84 | Staging OK | Core works; hardening follow-ups |
| B | 75–79 | No | Functional but missing tests or RLS proof |
| C+ | 70–74 | No | Partial / stub |
| F | <70 | No | Spec mismatch or broken on localhost |

**Deductions (typical):**

- No localhost proof −15  
- No vitest/playwright where applicable −10  
- RLS not MCP-verified −10  
- CopilotKit name mismatch −10 (silent 404)  
- Stub UI marked Done −20  
- Console errors on happy path −5  

---

## 7. Evidence file template

Path: `tasks/venues/tasks/evidence/VEN-NNN-verify-YYYY-MM-DD.md`

```yaml
---
task: VEN-NNN
date: YYYY-MM-DD
status: Verified | Partial | Failed
grade: B+
execution_score: 85
mcp: [user-supabase execute_sql, …]
playwright: [spec path, N passed]
chrome_devtools: [snapshot/screenshot paths]
production_ready: false
---
```

Sections: Summary · MCP probes · Local commands · Acceptance matrix · Grade rationale · Improvements needed · Next tasks.

---

## 8. Layer-specific minimum probes

| Layer | Must run |
|-------|----------|
| UI | dev boot + chrome snapshot + vitest + Playwright (or SCREEN spec) |
| TOOL | vitest mock + Mastra registry grep + optional signed-in insert |
| DATA | Supabase MCP schema + RLS policies |
| TEST | Playwright green + linked in matrix |
| ADMIN | auth role fixture + RLS negative + chrome on `/admin/…` |

---

*Created: 2026-06-02 — venues MVP verify pack*
