---
id: EVP-030-advanced
linear: SAN-133
legacy_id: EVT-MVP-05
title: OpenClaw/Postiz approval sandbox
status: Not Started
priority: P3
persona: Patricia, Roberto
depends_on:
  - EVP-029-advanced
---

# EVP-030-advanced — OpenClaw/Postiz approval sandbox

## Objective

Prepare OpenClaw and Postiz for controlled post-MVP automation without allowing autonomous scraping, outreach, or publishing.

## Architecture

```mermaid
flowchart LR
  A["Approved job request"] --> B["OpenClaw sandbox"]
  B --> C["Evidence: URL, screenshot, extracted fields"]
  C --> D["Supabase audit log"]
  D --> E["Gemini draft or summary"]
  E --> F["Approval queue"]
  F --> G{"Human approves?"}
  G -- "No" --> H["Archive"]
  G -- "Yes" --> I["Postiz draft/schedule or manual outreach handoff"]
```

## Required controls

- Source allowlist.
- Per-job approval.
- Daily and per-domain caps.
- Screenshot/evidence capture.
- Full audit logs.
- Robots/TOS/legal review before production scraping.
- No autonomous DMs.
- No autonomous contracts.
- No autonomous campaign launch.

## Acceptance criteria

- OpenClaw jobs cannot run without an approval record.
- Every job records input, output, screenshot/evidence pointer, and actor.
- Postiz receives drafts only unless an approved scheduling workflow exists.
- Failed jobs are visible in admin.
- Rate limits are configurable.
