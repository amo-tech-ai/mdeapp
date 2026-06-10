---
task: CTEST-012
date: 2026-06-02
status: partial
---

# CTEST-012 evidence — Linear sync

## Spec normalization

- Verified: 13/13 tasks have sections `## 1.` through `## 10.`
- Command: `rg '^## [0-9]+\. ' tasks/contest/tasks/CTEST-*.md` — all pass

## Linear sync

- Project: [Events Platform](https://linear.app/sanjiovani/project/events-platform-46150ec19346)
- Issues updated: **SAN-532** through **SAN-544** (CTEST-000..012)
- States: 12× Todo, 1× In Progress (SAN-544)
- `list_issues(project="Events Platform", label="prefix:CONT")` → **13 issues**, `hasNextPage: false`

## Remaining

- [ ] Mermaid CLI render proof (optional)
- [ ] Full markdown link crawl under `tasks/contest/`
- [ ] User approval before any issue → Done
