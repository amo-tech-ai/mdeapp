> **Doc role:** Operator QA script (copy-paste commands). Task gates live in [`VERIFICATION-CHECKLIST.md`](./VERIFICATION-CHECKLIST.md). Layout reference: [`screenshots/01-mindtrip.png`](../../screenshots/01-mindtrip.png) vs **F48** (sidebar chat, not center column).

You are responsible for local verification and QA.

Act as a senior software specialist, forensic auditor, and QA engineer.

Goal:
Verify localhost mdeai works end-to-end after the Google Maps server key fix.

Current expected state:
- App runs on http://localhost:3001
- Mastra runs on http://localhost:4111
- ADK grounding sidecar runs on http://localhost:8000
- Grounding must use source: grounding-lite, not gemini-maps-grounding
- Rental cards and map pins must render
- Console must have 0 critical errors

Do not start a second npm run dev if port 3001 is already running.

Testing strategy:
1. Check running services
2. Start only missing services
3. Run automated tests
4. Run grounding verification
5. Run rental/map pin smoke
6. Use Playwright or Chrome DevTools MCP to inspect browser console
7. Verify cards, pins, attribution, and no runtime errors
8. Produce a concise QA report

Commands:

cd /home/sk/mdeai/mdeapp

curl -s -o /dev/null -w "UI: %{http_code}\n" http://localhost:3001/
curl -s -o /dev/null -w "Mastra: %{http_code}\n" http://localhost:4111/
curl -s http://localhost:8000/health || true

If UI is not 200:
npm run dev

If sidecar is not ok:
bash /home/sk/mdeai/services/adk-grounding/run-dev.sh

Run:

npm test
npm run lint
npm run typecheck
npm run build
npm run verify:maps-env
npm run verify:grounding
npm run verify:rental-pins
npm run smoke:map-pins
npm run verify:console
npm run verify:supabase

Browser QA:
Use Playwright or Chrome DevTools MCP.

Open:
http://localhost:3001

Verify:
- page loads
- map renders
- no RefererNotAllowedMapError
- no Maximum update depth exceeded
- no critical console errors
- rental query shows cards
- map shows pins
- grounded query returns Grounding Lite results
- attribution appears for grounded places
- pin count matches expected smoke output
- sidecar remains healthy

Test prompts:
1. Find rentals in Laureles under $1200
2. Quiet cafés near Laureles
3. Quiet cafés near Parque Lleras

Expected:
- rental query: cards + rental pins
- grounding query: source grounding-lite + grounded pins
- no Gemini fallback unless MCP fails
- no blank map
- no duplicate pin loop

Create report with:
✅ Passed
🟡 Warnings
🔴 Blockers
Exact command results
Screenshots if Playwright/Chrome MCP available
Final readiness score /100

Important:
Do not mark MAP-002 done unless:
- verify:grounding shows source: grounding-lite
- grounded pins render
- GroundingAttribution is visible
- console is clean

Do not expose server keys.
Do not use NEXT_PUBLIC keys for MCP/Places.
Do not restart services unnecessarily.