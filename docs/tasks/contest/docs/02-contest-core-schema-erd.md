---
title: Contest core schema ERD and RLS
status: Draft
date: 2026-06-02
skills:
  - mde-supabase
  - mermaid-diagrams
related_task: CTEST-001
---

# Contest core schema (CTEST-001)

Source of truth for **MVP-A** tables before `vote_ledger` (CTEST-002) and Stripe objects (CTEST-003). Follow [`mde-supabase`](../../../.agents/skills/mde-supabase/SKILL.md) migration + RLS rules.

## Entity relationship (core pack)

```mermaid
erDiagram
  contest_orgs ||--o{ contest_memberships : has
  contest_orgs ||--o{ contests : owns
  contests ||--o{ contest_rounds : has
  contests ||--o{ contestants : has
  contestants ||--o{ contestant_assets : has
  contestants ||--o{ contestant_social_links : has
  contestants ||--o{ contestant_profile_extractions : drafts
  contestants ||--o{ contestant_profile_reviews : reviews
  contests ||--o{ contest_events : schedules
  contest_orgs ||--o{ contestant_discovery_runs : runs
  contestant_discovery_runs ||--o{ contestant_discovery_leads : leads
  contestant_discovery_leads ||--o{ contestant_invite_drafts : drafts
  contest_orgs ||--o{ contest_audit_events : audits

  contest_orgs {
    uuid id PK
    text name
    jsonb settings
  }
  contests {
    uuid id PK
    uuid org_id FK
    text status
    text slug
  }
  contestants {
    uuid id PK
    uuid contest_id FK
    uuid user_id FK
    text status
  }
```

## RLS decision flow (read path)

```mermaid
flowchart TD
  Q[Client query on contest_* table] --> RLS{RLS enabled?}
  RLS -->|no| DENY[Reject — fix migration]
  RLS -->|yes| ROLE{Role?}
  ROLE -->|anon| PUB{published + approved?}
  PUB -->|yes| READ[SELECT allowed columns]
  PUB -->|no| DENY2[No row]
  ROLE -->|contestant| OWN[own contestant_id only]
  ROLE -->|organizer| ORG[org membership match]
  ROLE -->|admin| ADMIN[assigned orgs]
  ROLE -->|service| SRV[server route only — not browser]
```

## Migration workflow (mde-supabase)

```mermaid
flowchart LR
  A[iterate execute_sql MCP] --> B[supabase db advisors]
  B --> C[db pull migration file]
  C --> D[db reset local]
  D --> E[RLS SQL proof scripts]
  E --> F[remote catalog proof]
  F --> G[types regenerate]
```

## Storage buckets

| Bucket | Visibility | RLS on storage.objects |
|--------|------------|-------------------------|
| `contestant-photos` | public read when asset approved | contestant write own; org approve |
| `contestant-docs` | private | contestant + staff only |

Use `(SELECT auth.uid())` in policies; index `org_id`, `contest_id`, `user_id`, `status` on every policy predicate column.
