---
id: ADK-CR-00
title: GCP prerequisites for ADK Cloud Run
status: Ready
priority: P0
effort: 1h
owner: ops
depends_on: []
blocks: [ADK-CR-01, ADK-CR-03]
skill: [google-agents-cli-deploy]
---

# ADK-CR-00 — GCP prerequisites

## Goal

Enable APIs and confirm project for **`mdeai-adk-grounding`** on Cloud Run.

## Assumed project

`dev-inscriber-445714-k0` (confirm with billing owner).

## Steps

```bash
gcloud config set project dev-inscriber-445714-k0
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  generativelanguage.googleapis.com
```

## Verify

- `gcloud config get-value project` → correct ID
- Cloud Run API enabled

## Done when

- [ ] Project confirmed
- [ ] APIs enabled
- [ ] Region chosen (default `us-east1`)
