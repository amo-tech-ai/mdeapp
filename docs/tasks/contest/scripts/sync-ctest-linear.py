#!/usr/bin/env python3
"""Push full CTEST task specs (frontmatter + sections 1–12 + Mermaid) to Linear."""
from __future__ import annotations

import json
import os
import re
import urllib.request
from pathlib import Path

import yaml

REPO = Path(__file__).resolve().parents[1]
ROOT = REPO.parents[1]
TASKS = REPO / "tasks"
DOCS = REPO / "docs"
LINEAR_NOTES = REPO / "notes" / "linear-descriptions"
GITHUB = "https://github.com/amo-tech-ai/mdeai/blob/main"

ISSUE_MAP = {
    "SAN-532": "CTEST-000-diagrams-repo-decisions.md",
    "SAN-533": "CTEST-001-supabase-contest-core-schema.md",
    "SAN-534": "CTEST-002-voting-scoring-ledgers.md",
    "SAN-535": "CTEST-003-ticket-paid-vote-schema.md",
    "SAN-536": "CTEST-004-copilotkit-contest-workspace.md",
    "SAN-537": "CTEST-005-mastra-gemini-workflows.md",
    "SAN-538": "CTEST-006-screens-wireframes.md",
    "SAN-539": "CTEST-007-playwright-proof-gates.md",
    "SAN-540": "CTEST-008-contestant-signup-url-intake.md",
    "SAN-541": "CTEST-009-contestant-profile-editor-coach.md",
    "SAN-542": "CTEST-010-public-profile-vote-share-growth.md",
    "SAN-543": "CTEST-011-openclaw-discovery-invite-sandbox.md",
    "SAN-544": "CTEST-012-spec-normalization-linear-sync.md",
}

EXTRA_DIAGRAMS: dict[str, list[Path]] = {
    "CTEST-000": [DOCS / "01-mermaid-diagrams.md"],
    "CTEST-001": [DOCS / "02-contest-core-schema-erd.md"],
}


def linear_key() -> str:
    key = os.environ.get("LINEAR_API_KEY") or os.environ.get("LINEAR_API_TOKEN")
    if key:
        return key
    env = ROOT / ".env.local"
    if env.exists():
        for line in env.read_text().splitlines():
            if line.startswith("LINEAR_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"')
    raise SystemExit("LINEAR_API_KEY not set")


def gql(key: str, query: str, variables: dict | None = None) -> dict:
    req = urllib.request.Request(
        "https://api.linear.app/graphql",
        data=json.dumps({"query": query, "variables": variables or {}}).encode(),
        headers={"Authorization": key, "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req) as resp:
        out = json.loads(resp.read())
    if "errors" in out:
        raise SystemExit(f"GraphQL errors: {out['errors']}")
    return out


def parse_frontmatter(text: str) -> tuple[dict, str]:
    if not text.startswith("---"):
        return {}, text
    end = text.find("\n---", 3)
    if end == -1:
        return {}, text
    fm = yaml.safe_load(text[3:end]) or {}
    body = text[end + 4 :].lstrip("\n")
    return fm, body


def extract_section(body: str, num: int) -> str:
    pat = rf"^## {num}\. .+$"
    matches = list(re.finditer(pat, body, re.MULTILINE))
    if not matches:
        return ""
    start = matches[0].end()
    nxt = re.search(r"^## \d+\. ", body[start:], re.MULTILINE)
    end = start + nxt.start() if nxt else len(body)
    return body[start:end].strip()


def section_header(body: str, num: int) -> str:
    m = re.search(rf"^## {num}\. (.+)$", body, re.MULTILINE)
    return m.group(1) if m else f"Section {num}"


def fmt_list(items) -> str:
    if not items:
        return "—"
    if isinstance(items, list):
        return ", ".join(str(x) for x in items)
    return str(items)


def fmt_md_list(items) -> str:
    if not items:
        return "—"
    if isinstance(items, list):
        return "\n".join(f"- `{x}`" if not str(x).startswith("http") else f"- {x}" for x in items)
    return str(items)


def extract_mermaid_sections(md_path: Path) -> str:
    """Append ## headings + mermaid blocks from a docs file (skip frontmatter)."""
    if not md_path.exists():
        return ""
    text = md_path.read_text()
    if text.startswith("---"):
        end = text.find("\n---", 3)
        text = text[end + 4 :].lstrip("\n") if end != -1 else text
    parts: list[str] = []
    chunks = re.split(r"(^## .+$)", text, flags=re.MULTILINE)
    i = 1
    while i < len(chunks):
        heading = chunks[i].strip()
        body = chunks[i + 1] if i + 1 < len(chunks) else ""
        if "```mermaid" in body:
            parts.append(heading)
            parts.append(body.strip())
            parts.append("")
        i += 2
    if not parts:
        return ""
    return "\n".join(["---", "", "## Supplemental diagrams (repo doc)", ""] + parts)


def build_metadata(fm: dict, task_file: Path) -> list[str]:
    tid = fm.get("id", task_file.stem.split("-")[0] + "-" + task_file.stem.split("-")[1])
    rel = f"tasks/contest/tasks/{task_file.name}"
    lines = [
        "## Task metadata",
        "",
        f"| Field | Value |",
        f"|-------|-------|",
        f"| **ID** | `{tid}` |",
        f"| **Status** | {fm.get('status', '—')} |",
        f"| **Priority** | {fm.get('priority', '—')} |",
        f"| **Phase** | {fm.get('phase', '—')} |",
        f"| **Effort** | {fm.get('effort', '—')} |",
        f"| **Owner** | {fm.get('owner', '—')} |",
        f"| **MVP track** | {fm.get('mvp_track', '—')} |",
        f"| **Depends on** | {fmt_list(fm.get('depends_on'))} |",
        f"| **Linear** | {fm.get('linear', '—')} |",
        f"| **Evidence** | `{fm.get('evidence', '—')}` |",
        f"| **Repo file** | [{rel}]({GITHUB}/{rel}) |",
        "",
        "### Skills",
        "",
        fmt_md_list(fm.get("skill")),
        "",
    ]
    if fm.get("docs"):
        lines.extend(["### Docs", "", fmt_md_list(fm.get("docs")), ""])
    if fm.get("verified_against"):
        lines.extend(["### Verified against", "", fmt_md_list(fm.get("verified_against")), ""])
    if fm.get("repo_refs"):
        lines.extend(["### Repo refs", "", fmt_md_list(fm.get("repo_refs")), ""])
    if fm.get("labels"):
        lines.extend(["### Labels", "", fmt_md_list(fm.get("labels")), ""])
    return lines


def build_description(task_file: Path, fm: dict) -> str:
    text = task_file.read_text()
    _, body = parse_frontmatter(text)
    title = fm.get("title", task_file.stem)

    parts = [
        f"# {fm.get('id', '')} — {title}",
        "",
        f"> Full spec synced from repo. Re-run: `python3 tasks/contest/scripts/sync-ctest-linear.py`",
        "",
    ]
    parts.extend(build_metadata(fm, task_file))
    parts.extend(["---", ""])

    for n in range(1, 13):
        sec = extract_section(body, n)
        if sec:
            h = section_header(body, n)
            parts.append(f"## {n}. {h}")
            parts.append("")
            parts.append(sec)
            parts.append("")

    tid = fm.get("id", "")
    for key, paths in EXTRA_DIAGRAMS.items():
        if tid == key:
            for p in paths:
                extra = extract_mermaid_sections(p)
                if extra:
                    parts.append(extra)

    return "\n".join(parts).strip() + "\n"


def resolve_issue_uuid(key: str, identifier: str) -> str:
    num = int(identifier.split("-")[1])
    q = """
    query($num: Float!) {
      issues(filter: { number: { eq: $num }, team: { key: { eq: "SAN" } } }) {
        nodes { id identifier }
      }
    }
    """
    data = gql(key, q, {"num": float(num)})
    nodes = data["data"]["issues"]["nodes"]
    if not nodes:
        raise SystemExit(f"Issue not found: {identifier}")
    return nodes[0]["id"]



def post_comment(key: str, issue_id: str, body: str) -> None:
    mutation = """
    mutation($id: String!, $body: String!) {
      commentCreate(input: { issueId: $id, body: $body }) { success }
    }
    """
    gql(key, mutation, {"id": issue_id, "body": body})


    secs = len(re.findall(r"^## \d+\.", desc, re.MULTILINE))
    line = f"{ident} {'OK' if ok else 'FAIL'} sections={secs} mermaid={mermaid_n} chars={len(desc)}"
    print(line)
    summary.append(line)
    if ok:
        post_comment(
            key,
            issue_id,
            f"**Full spec resync** — `{fname}`\n\n- Sections 1–12 + metadata\n- Mermaid blocks: **{mermaid_n}**\n- Chars: **{len(desc)}**\n\nRe-sync: `python3 tasks/contest/scripts/sync-ctest-linear.py`",
        )

audit = REPO / "audit" / "2026-06-02-ctest-linear-full-spec.md"
if audit.exists():
    audit.write_text(
        audit.read_text().split("## Linear issues updated")[0].rstrip()
        + "\n\n## Linear issues updated (latest resync)\n\n"
    )

if __name__ == "__main__":
    main()
