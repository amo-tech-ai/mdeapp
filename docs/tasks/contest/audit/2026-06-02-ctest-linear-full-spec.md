---
title: CTEST Linear full-spec sync audit
date: 2026-06-02
---

# CTEST pack — full spec + Linear sync

## Task file verification

| Task | Sections 1–10 | §11 Mermaid | §12 (001 only) | `linear:` |
|------|---------------|-------------|----------------|-----------|
| CTEST-000 | yes | yes (1) | — | SAN-532 |
| CTEST-001 | yes | yes (3) | yes (steps) | SAN-533 |
| CTEST-002..012 | yes | yes (1–2 each) | — | SAN-534..544 |

**Command:** `rg -c '^## [0-9]+\.' tasks/contest/tasks/CTEST-*.md` → 10+ per file (001 has 12).

**Mermaid:** every task has ≥1 ` ```mermaid ` fence in §11; platform pack remains in `docs/01-mermaid-diagrams.md` (7).

## Linear issues updated (latest resync)

```
SAN-532 OK sections=18 mermaid=10 chars=10389
SAN-533 OK sections=12 mermaid=6 chars=9983
SAN-534 OK sections=11 mermaid=2 chars=4627
SAN-535 OK sections=11 mermaid=1 chars=4314
SAN-536 OK sections=11 mermaid=1 chars=4798
SAN-537 OK sections=11 mermaid=1 chars=5687
SAN-538 OK sections=11 mermaid=1 chars=4910
SAN-539 OK sections=11 mermaid=1 chars=4548
SAN-540 OK sections=11 mermaid=1 chars=7081
SAN-541 OK sections=11 mermaid=1 chars=5784
SAN-542 OK sections=11 mermaid=1 chars=5176
SAN-543 OK sections=11 mermaid=1 chars=5500
SAN-544 OK sections=11 mermaid=1 chars=6906
```
