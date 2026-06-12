# CK-V2 · CopilotKit v1→v2 migration — Changelog

Reverse-chronological log of verified program events.  
Tracker: [`todo.md`](./todo.md) · Audit: [`02-upgrade-tasks-linear.md`](./02-upgrade-tasks-linear.md)

---

## 2026-06-12 — SAN-888 merged + proof + SAN-889 scaffold started

| Change | Task | Proof |
|---|---|---|
| PR #208 merged to `main` @ `b9a4f70` | SAN-888 | Admin squash merge after resolving CodeRabbit threads |
| Localhost proof PASS flag off + flag on | SAN-888 | `san-888-localhost-proof.mjs` · "How are my sales?" → `Sales loaded ✓` |
| Evidence on `main` | SAN-888 | [`docs/tasks/testing/evidence/SAN-888/`](../tasks/testing/evidence/SAN-888/) |
| SAN-888 marked **Done** in Linear | SAN-888 | D8 complete |
| SAN-889 scaffold: flag + providers + layout gate + shell-v2 | SAN-889 | Branch `ai/san-889-ck-v2-003-migrate-hostevent-hosteventagent-to-v2` |
| Tracker: parent complete **48%** · shipped **28%** | Program | [`todo.md`](./todo.md) |

**Program % after this entry:** planning **93%** · shipped **28%** · in-flight **18%** · composite **48%**

---

## 2026-06-12 — Execution pass: floor fix + SAN-892 + SAN-890A spike

| Change | Task | Proof |
|---|---|---|
| `audit:floor` critical-only · pushed `83b8f26` | SAN-888 / CI | [Floor CI run](https://github.com/amo-tech-ai/mdeapp/actions/runs/27445847022) **pass** |
| SAN-892 tagging **12/12** `build-on-v2` | SAN-892 | Linear Done |
| SAN-890A spike doc written | SAN-890 prep | [`CK-V2-004-chat-subspike.md`](../tasks/copilotkit/CK-V2-004-chat-subspike.md) |

---

## 2026-06-12 — Tracker source-of-truth pass (prompt-verified)

| Change | Task | Proof |
|---|---|---|
| [`todo.md`](./todo.md) promoted to source-of-truth | Program | Verification Summary 6/6 PASS |
| SAN-886 scorecard: planning 93% · composite 38% | SAN-886 | Was single 95% epic % |

---

## Earlier entries

See git history for SAN-887 spike merge (PR #207), Linear step lists, and SAN-888 branch proof (`2026-06-12`).
