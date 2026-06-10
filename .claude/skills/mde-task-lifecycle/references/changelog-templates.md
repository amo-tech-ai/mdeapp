---
title: Changelog and commit templates
impact: LOW
impactDescription: Copy-paste blocks for Phase 5 shipping
tags: mde-task-lifecycle, changelog, git, commits
---

# Changelog & commit templates

Copy-paste templates used during Phase 5 ([shipping.md](../shipping.md)).

---

## CHANGELOG.md daily section

```markdown
## 2026-05-09

### Features
- 16C hermes-signal-explainer — Hover popover on apartment cards reveals signal weights with a11y labels. ([prompt](tasks/prompts/advanced/16C-hermes-signal-explainer-popover.md))

### Fixes
- 18B landlord-price-format — `formatCOP()` now handles `null` without crashing the HostCard. ([prompt](tasks/prompts/advanced/18B-landlord-price-format.md))

### Trio
- 17A paperclip-bridge — Docker service joining all 4 networks; HMAC-authenticated proxy; logs every request to `agent_runs`. ([prompt](tasks/prompts/advanced/17A-paperclip-bridge-docker-service.md))
- 19A hermes-agent-runtime — Local-adapter mode wired; timeout enforced at 30s per edge-function rule. ([prompt](tasks/prompts/advanced/19A-hermes-agent-runtime.md))

### Docs
- 19A research notes — Hermes adapter assumptions and risk register added to prompt body.

### Infra
- 17A docker-compose — `paperclip-bridge` service registered on shared `mdeai-trio` network.
```

Group ordering: Features, Fixes, Trio, Docs, Infra. Skip empty groups.

---

## todo.md row formats

In progress (during Phase 3 / 4):

```markdown
| 17A | paperclip-bridge Docker service | infrastructure | P0 | 60% — wiring complete, smoke pending | 2026-05-08 |
```

Done (after Phase 5):

```markdown
| 17A | paperclip-bridge Docker service | infrastructure | P0 | ✅ DONE 2026-05-09 | — |
```

Risk flag → fixed transition:

```markdown
<!-- Before -->
| 18B | landlord-price-format crash | landlord | P0 | 🚨 CRASH on null COP price | 2026-05-08 |

<!-- After -->
| 18B | landlord-price-format crash | landlord | P0 | ✅ FIXED 2026-05-09 | — |
```

---

## Prompt frontmatter close-out

Before:

```yaml
---
task_id: 17A
title: paperclip-bridge Docker service
phase: CRITICAL
priority: P0
status: In Progress
estimated_effort: 3 days
area: infrastructure
schema_tables: [agent_runs]
depends_on: [05E, 05H]
---
```

After:

```yaml
---
task_id: 17A
title: paperclip-bridge Docker service
phase: CRITICAL
priority: P0
status: Done
shipped_at: 2026-05-09
estimated_effort: 3 days
area: infrastructure
schema_tables: [agent_runs]
depends_on: [05E, 05H]
---
```

In the body, annotate every AC checkbox:

```markdown
- [x] Bridge container starts with `/health` endpoint — VERIFIED 2026-05-09
- [x] HMAC middleware rejects bad signatures — VERIFIED 2026-05-09 (3 negative tests)
- [x] Logs every request to `agent_runs` — VERIFIED 2026-05-09 (3 rows in dev DB)
```

---

## Commit message format

```
<type>(<area>): <id> <title> — <outcome>

<optional body explaining why, not what>
<optional risk notes for high-blast changes>
<blank line>
Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

### Examples

```
feat(trio): 17A paperclip-bridge — Docker service + HMAC proxy on shared network

Adds the paperclip-bridge container to docker-compose, joining mdeai-trio,
mdeai-paperclip, mdeai-hermes, and mdeai-openclaw networks. HMAC middleware
rejects requests with invalid X-PAPERCLIP-SIGNATURE. All requests logged to
agent_runs.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

```
fix(landlord): 18B price-format — formatCOP() handles null without crash

formatCOP(null) was throwing because the optional chain returned undefined
into Intl.NumberFormat. Now returns "—" for null/undefined, COP-formatted
string otherwise. HostCard no longer crashes when a landlord has not set
a price yet.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

```
docs: 19A research notes — Hermes adapter assumptions and risk register

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

---

## Coverage-matrix entry

Append to bottom of [tasks/trio/00-trio-task-coverage-matrix.md](../../../../tasks/trio/00-trio-task-coverage-matrix.md):

```markdown
- 2026-05-09 — E17 paperclip-bridge: row S → C (17A shipped).
```

---

## Release-note section (when grouping multiple tasks for a deploy summary)

```markdown
## Release 2026-05-09

**Trio milestone:** paperclip-bridge live in dev. End-to-end signed proxy from Paperclip to OpenClaw.

**Tasks shipped**
- 17A paperclip-bridge Docker service ([prompt](tasks/prompts/advanced/17A-paperclip-bridge-docker-service.md))
- 19A hermes-agent-runtime ([prompt](tasks/prompts/advanced/19A-hermes-agent-runtime.md))

**Fixes**
- 18B landlord price-format crash on null

**Behind the scenes**
- New shared docker network: `mdeai-trio`
- New table: `agent_runs` (RLS: service-role write, admin read)

**Verification**
- Vercel preview green
- Smoke on https://www.mdeai.co/landlord/dashboard — no regressions
- 3 successful HMAC requests logged to `agent_runs`
```

---

## Push trailer (only if user asks)

After commit lands, only on explicit "push" / "open PR":

```bash
git push -u origin <branch>
gh pr create --title "feat(trio): 17A paperclip-bridge" --body "$(cat <<'EOF'
## Summary
- Adds paperclip-bridge Docker service with HMAC-signed proxy
- Wires `agent_runs` logging on every request

## Test plan
- [x] `docker compose up paperclip-bridge` healthy
- [x] HMAC negative tests reject 3/3 invalid signatures
- [x] `agent_runs` rows present after smoke

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

For the full shipping flow, see [../shipping.md](../shipping.md).
