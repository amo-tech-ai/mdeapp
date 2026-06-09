# MAP-002B Evidence — ADK Grounding on Production

> **Summary:** Vercel env wired. Cloud Run sidecar **down** (503). Server Maps key lacks Grounding Lite permission locally. Prod café cards likely **venue_anchors fallback**, not ADK.

**Date:** 2026-06-03  
**Linear:** [SAN-368](https://linear.app/sanjiovani/issue/SAN-368)  
**Spec:** `tasks/maps/MAP-002B-prod-adk-deploy.md`

---

## Status

| Gate | Result | Notes |
|------|--------|-------|
| SAN-369 Map ID Done | ✅ | Prerequisite met |
| Vercel `ADK_GROUNDING_URL` | ✅ | Production + Preview |
| Vercel `ADK_INTERNAL_TOKEN` | ✅ | Production + Preview |
| No `NEXT_PUBLIC_*` ADK token | ✅ | `rg NEXT_PUBLIC.*ADK` → empty |
| Cloud Run `/health` | ❌ **503** | `mdeai-adk-grounding-4huwyjbclq-ue.a.run.app` |
| `verify:cloud-run-grounding` | ❌ | Fails at health |
| `verify:grounding` (remote) | ❌ | Blocked by health |
| `verify:task MAP-002B` registry | ✅ | PR [#58](https://github.com/amo-tech-ai/mdeapp/pull/58) merged @ `1764227` |
| `npm run floor` | ✅ | 482/482 Vitest · lint · tsc · build · audit (2026-06-03) |
| `adk-grounding-client` vitest | ✅ | 6/6 |
| Local sidecar `/health` | ✅ | `http://127.0.0.1:8000` → 200 |
| Local `verify:grounding` | ❌ | HTTP 200 but `pins: 0` · `adk_error: The caller does not have permission` |
| Local ADK pytest | ✅ | 22/22 |
| Cloud Run `/health` (both URLs) | ❌ **503** | `.env` URL + legacy `4huwyjbclq-ue` URL |
| `verify:cloud-run-grounding` | ❌ | Fails at health 503 |
| `verify:task MAP-002B` (full) | ❌ | Passes floor + vitest; fails cloud-run step |
| Prod real ADK (not fallback) | ❌ | See audit §Fallback |

**Grade:** **35% / F** — app verify hooks green; **GCP Grounding Lite permission + Cloud Run 503** block Done.

---

## Cloud Run recovery (operator)

`gcloud` session expired — redeploy requires interactive login:

```bash
gcloud auth login
gcloud config set project dev-inscriber-445714-k0

cd /home/sk/mdeai/services/adk-grounding
export PROJECT_ID=dev-inscriber-445714-k0
export REGION=us-east1
./scripts/deploy-cloud-run.sh
```

After deploy:

```bash
URL=$(gcloud run services describe mdeai-adk-grounding --region=us-east1 --format='value(status.url)')
curl -sS -o /dev/null -w "health %{http_code}\n" "$URL/health"   # expect 200

# Align Vercel if URL changed
vercel env rm ADK_GROUNDING_URL production preview  # if needed
vercel env add ADK_GROUNDING_URL production  # paste $URL
```

**Secret Manager alignment:** `ADK_INTERNAL_TOKEN` in Secret Manager must match Vercel `ADK_INTERNAL_TOKEN` (same bearer on invoke).

---

## Grounding Lite API + server key

Local sidecar (health 200) invoke failed:

```text
metadata.reason: adk_error
message: The caller does not have permission
```

**Fix in GCP Console:**

1. Enable [Maps Grounding Lite API](https://console.cloud.google.com/apis/library/mapstools.googleapis.com) on project `dev-inscriber-445714-k0`
2. Confirm billing enabled
3. `GOOGLE_MAPS_SERVER_API_KEY` in Secret Manager — **IP/unrestricted** (Cloud Run egress), **not** HTTP referrer restriction
4. Key must **not** be the browser `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

Re-smoke after fix:

```bash
cd mdeapp
ADK_GROUNDING_URL=http://127.0.0.1:8099 node --env-file=../.env.local scripts/verify-grounding-invoke.mjs
# expect metadata.source=grounding-lite, pins≥1
```

---

## Fallback vs real ADK (audit)

**Real ADK path** (`search-grounded-places.ts` success branch):

- Sidecar returns pins with `metadata.source: grounding-lite`
- Tool output includes `attribution[]` (Google Maps URIs)
- Tool metadata **does not** include `fallback: "curated"`

**Fallback path** (when ADK down / quota / permission):

- `metadata.reason`: `adk_unavailable` | `adk_error` | quota reason
- `metadata.fallback: "curated"`
- `attribution: []`
- Results from `venue_anchors` (café/nightlife) or `searchRestaurants` (DATA-004)

**Prod café query (2026-06-03):** 5 cards (Rituales, Pergamino, etc.) match **DATA-035 venue_anchors** names — consistent with fallback while Cloud Run 503.

**How to prove real ADK on prod chat:**

1. Cloud Run healthy + Grounding Lite permission fixed
2. Query on mdeai.co: `quiet cafés Laureles`
3. In network/Mastra trace or logged metadata: `source: grounding-lite`, no `fallback: curated`, non-empty `attribution`

---

## Browser Maps key (separate track)

Prod map sheet showed “For development purposes only” — **not MAP-008B / not ADK**.

Track as GCP browser-key fix:

- Billing enabled
- Maps JavaScript API enabled
- Referrers: `https://www.mdeai.co/*`, `https://mdeai.co/*`
- Browser key only (not IP-restricted server key)

---

## Local verification (2026-06-03)

| Check | Result |
|-------|--------|
| `services/adk-grounding` pytest | 22/22 pass |
| Local uvicorn `:8099` `/health` | 200 |
| Local invoke Grounding Lite | ❌ permission error |
| `rg NEXT_PUBLIC.*ADK` in `mdeapp/src` | clean |

---

## Done gate (not met)

- [ ] Cloud Run `/health` 200
- [ ] `verify:cloud-run-grounding` exit 0 (remote URL)
- [ ] `verify:grounding` exit 0 · `metadata.source=grounding-lite`
- [ ] `verify:task MAP-002B` + floor green
- [ ] Prod chat café query — real ADK proof (screenshot + metadata)
- [ ] SAN-368 → Done
