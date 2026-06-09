# ADK — active folder

> **Done Cloud Run pack (CR-00–CR-06)** → [`../archive/ADK-A/`](../archive/ADK-A/README.md)  
> **This folder** = planning docs, ops notes, optional CR-07/CR-08.

| Doc | Role |
|-----|------|
| [`../archive/ADK-A/`](../archive/ADK-A/README.md) | Done CR-00–CR-06 specs + evidence index |
| [`docs/12-cloud-run-production-plan.md`](docs/12-cloud-run-production-plan.md) | Full deploy plan (reference) |
| [`docs/sidecar-api-contract.md`](docs/sidecar-api-contract.md) | Invoke JSON contract |
| [`docs/maps-adk-prd.md`](docs/maps-adk-prd.md) | Unified Maps + ADK architecture |
| [`adk-notes.md`](adk-notes.md) | Plain-English ops notes |
| [`docs/14-cloud-run-reference.md`](docs/14-cloud-run-reference.md) | Cloud Run reference |

**Maps execution:** [`../maps/INDEX.md`](../maps/INDEX.md) · **Sidecar code:** `services/adk-grounding/`

---

## Optional backlog (not archived)

| ID | Task | Status |
|----|------|--------|
| ADK-CR-07 | Custom domain `adk.mdeai.co` | Ready — not started |
| ADK-CR-08 | Cloud Monitoring alerts | Ready — not started |

**Phase 2:** MAP-002A full ADK LlmAgent package — [`../maps/MAP-002A-ADK-agent-package.md`](../maps/MAP-002A-ADK-agent-package.md)

---

## Verify sidecar client

```bash
cd mdeapp && npm test -- adk-grounding
curl -s "$ADK_GROUNDING_URL/health"
```

Evidence: [`../evidence/ADK-CR-evidence.md`](../evidence/ADK-CR-evidence.md)
