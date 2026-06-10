You are a senior software specialist, QA engineer, DevOps engineer, and forensic auditor.

Goal:
Run a FULL localhost verification and troubleshooting sweep for mdeai.

You are responsible for:
- finding blockers
- identifying hidden failures
- reproducing bugs
- verifying Grounding Lite MCP
- validating cards/pins/maps
- checking console/runtime errors
- validating ADK + Mastra integration
- producing a troubleshooting checklist

Project stack:
- Next.js 16
- CopilotKit
- Mastra
- ADK sidecar
- Google Maps Grounding Lite MCP
- Gemini
- Places API New
- vis.gl maps
- Supabase

Expected architecture:
CopilotKit
→ Mastra orchestration
→ ADK grounding sidecar
→ Grounding Lite MCP / Gemini / Places
→ strict JSON
→ cards + pins + attribution

CRITICAL:
Do NOT start a second npm run dev if port 3001 already exists.
Check services before starting anything.

========================================
PHASE 1 — SERVICE HEALTH
========================================

Run:

curl -s -o /dev/null -w "UI: %{http_code}\n" http://localhost:3001/
curl -s -o /dev/null -w "Mastra: %{http_code}\n" http://localhost:4111/
curl -s http://localhost:8000/health || true

If UI not 200:
cd /home/sk/mdeai/mdeapp
npm run dev

If sidecar not healthy:
bash /home/sk/mdeai/services/adk-grounding/run-dev.sh

========================================
PHASE 2 — CORE TESTS
========================================

cd /home/sk/mdeai/mdeapp

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

========================================
PHASE 3 — MCP / GROUNDING VALIDATION
========================================

Verify:
- source is grounding-lite
- NOT gemini-maps-grounding
- MCP is actually running
- server key is being used
- browser key is NOT used server-side
- attribution renders
- grounded pins render

Run:

curl -s -X POST http://localhost:8000/v1/grounding/invoke \
  -H "Content-Type: application/json" \
  -d '{"tool":"search_grounded_places","query":"quiet cafés near Laureles","locationBias":{"lat":6.2442,"lng":-75.5812},"pageSize":3}' | jq .

========================================
PHASE 4 — PLAYWRIGHT / CHROME MCP QA
========================================

Use Playwright or Chrome DevTools MCP.

Open:
http://localhost:3001

Verify:
- map loads
- no RefererNotAllowedMapError
- no Maximum update depth exceeded
- no hydration failures
- no blank map
- no duplicate pins
- no React infinite loops
- no MCP fetch failures
- no 403 grounding failures
- no leaked server keys in client bundle

Test prompts:
1. Find rentals in Laureles under $1200
2. Quiet cafés near Laureles
3. Quiet cafés near Parque Lleras
4. Best cowork cafés in Medellín

Expected:
- rental cards
- grounded place cards
- grounded map pins
- attribution visible
- console clean
- MCP source grounding-lite

========================================
PHASE 5 — CODE AUDIT
========================================

Search for architecture violations:

grep -R "HttpAgent" -n mdeapp services tasks plan || true
grep -R "getLocalAgents" -n mdeapp/src/app/api/copilotkit || true
grep -R "NEXT_PUBLIC_GOOGLE_PLACES" -n . || true
grep -R "GOOGLE_MAPS_SERVER_API_KEY" -n . || true
grep -R "GOOGLE_MAPS_API_KEY" -n services/adk-grounding || true
grep -R "gemini-maps-grounding" -n services/adk-grounding || true
grep -R "GoogleMapsGroundingTool\|McpToolset\|LlmAgent" -n services/adk-grounding || true
grep -R "mapstools.googleapis.com/mcp" -n services mdeapp || true

Verify:
- Mastra route uses getLocalAgents
- no HttpAgent in product route
- no browser keys server-side
- no server keys client-side
- no fallback silently masking MCP failures

========================================
PHASE 6 — TROUBLESHOOTING
========================================

If any failure occurs:
- identify root cause
- reproduce consistently
- list exact files involved
- suggest exact fix
- rerun verification after fix

Create troubleshooting checklist:
- symptoms
- causes
- fixes
- commands
- verification method

========================================
FINAL REPORT FORMAT
========================================

Return:
✅ Passed
🟡 Warnings
🔴 Blockers

Include:
- exact command outputs
- localhost health
- MCP health
- grounding source
- cards/pins verification
- console verification
- architecture verification
- env verification
- missing best practices
- failure points
- hidden risks
- readiness score /100

Create:
1. Current architecture diagram
2. Best-practice target diagram
3. Failure-point diagram if needed

Important:
Do not mark MAP-002 done unless:
- grounding-lite source verified
- grounded pins render
- attribution visible
- console clean
- MCP path verified
- no Gemini fallback masking failure