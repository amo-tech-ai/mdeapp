#!/usr/bin/env python3
"""Generate core.md, mvp.md, ADV.md from Linear CSV exports."""

import csv
import os
from datetime import datetime
from collections import defaultdict

BASE = "/home/sk/mdeai/mdeapp/docs/linear"
OUT  = f"{BASE}/markdown"
TODAY = "2026-06-08"

# ── helpers ───────────────────────────────────────────────────────────────────

def dot(status):
    s = status.lower()
    if s == "done":                     return "🟢"
    if s in ("in progress","in review"): return "🟡"
    if s in ("canceled","duplicate"):   return "🔴"
    return "⚪"

def score(status):
    return {"done":100,"in review":85,"in progress":65,"todo":20,"backlog":10,
            "canceled":0,"duplicate":0}.get(status.lower(), 5)

def grade(n):
    if n >= 95: return "A+"
    if n >= 90: return "A"
    if n >= 80: return "B"
    if n >= 70: return "C"
    if n >= 60: return "D"
    return "F"

PRIORITY_ORDER = {"urgent":0,"high":1,"medium":2,"low":3,"no priority":4,"":4}
STATUS_ORDER   = {"done":0,"in review":1,"in progress":2,"todo":3,"backlog":4,
                  "canceled":5,"duplicate":5}

def sort_key(r):
    return (
        STATUS_ORDER.get(r["Status"].lower(), 9),
        PRIORITY_ORDER.get(r["Priority"].lower(), 9),
        r["ID"]
    )

def read_csv(path):
    rows = []
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    return rows

def tech(row):
    t = (row.get("Title","") + " " + row.get("Labels","")).lower()
    if any(x in t for x in ["auth","jwt","oauth","login","signup"]): return "Supabase Auth"
    if any(x in t for x in ["rls","policy","row level"]): return "Supabase RLS"
    if any(x in t for x in ["schema","migration","table","postgres","sql","data-"]): return "PostgreSQL"
    if any(x in t for x in ["map","places","marker","pin","geojson","neighborhood"]): return "Google Maps JS"
    if any(x in t for x in ["grounding","adk","cloud run","grounding-lite"]): return "ADK + Cloud Run"
    if any(x in t for x in ["copilotkit","copilot","usecoagent","usecop"]): return "CopilotKit 1.55.2"
    if any(x in t for x in ["mastra","workflow","wf-","createworkflow"]): return "Mastra + LibSQL"
    if any(x in t for x in ["gemini","agent","concierge","intent","routing","llm"]): return "Gemini 3.5 Flash"
    if any(x in t for x in ["stripe","checkout","payment","ticket","webhook"]): return "Stripe + Next.js"
    if any(x in t for x in ["vitest","playwright","e2e","test","floor","soak"]): return "Vitest + Playwright"
    if any(x in t for x in ["vercel","deploy","prod","production","ci","github"]): return "Vercel + Next.js"
    if any(x in t for x in ["embed","vector","pgvector","semantic","hybrid"]): return "pgvector + Supabase"
    if any(x in t for x in ["crm","partner","lead","onboard"]): return "Next.js 16 + Supabase"
    return "Next.js 16 + Tailwind v4"

def purpose(row):
    title = row.get("Title","")
    labels = row.get("Labels","").lower()
    # strip prefix codes like "AUTH-011 — " or "CRM-001 — "
    import re
    clean = re.sub(r'^[A-Z0-9\-]+ [—–-]+ ', '', title).strip()
    # truncate at 50 chars
    return clean[:50] + ("…" if len(clean) > 50 else "")

def notes(row):
    parts = []
    blocked = row.get("Blocked by","").strip()
    if blocked:
        parts.append(f"Blocked: {blocked}")
    completed = row.get("Completed","").strip()
    if completed and row.get("Status","").lower() == "done":
        try:
            d = datetime.fromisoformat(completed.replace("Z",""))
            parts.append(f"✓ {d.strftime('%b %d')}")
        except Exception:
            pass
    dup = row.get("Duplicate of","").strip()
    if dup:
        parts.append(f"Dup: {dup}")
    milestone = row.get("Project Milestone","").strip()
    if milestone:
        # shorten milestone names
        ms = milestone.replace("Phase 1 — mdeai MVP launch","M-Launch").replace("M1 — Acquire","M1").replace("M2 — Deliver","M2").replace("M3 — Monetize","M3").replace("M4 — Augment","M4").replace("M5 — Expand","M5")
        parts.append(ms)
    return " · ".join(parts) if parts else "—"

def section_row(r):
    s = score(r["Status"])
    return (
        f"| {dot(r['Status'])} "
        f"| [{r['ID']}](https://linear.app/sanjiovani/issue/{r['ID']}) "
        f"| {purpose(r)} "
        f"| {tech(r)} "
        f"| {r.get('Priority','—')} "
        f"| {s} "
        f"| {grade(s)} "
        f"| {notes(r)} |"
    )

def table_header():
    return (
        "| Status | ID | Title / Purpose | Tech | Priority | Score | Grade | Notes |\n"
        "|--------|----|--------------------|------|----------|-------|-------|-------|"
    )

def section_stats(rows):
    done = sum(1 for r in rows if r["Status"].lower()=="done")
    wip  = sum(1 for r in rows if r["Status"].lower() in ("in progress","in review"))
    ns   = sum(1 for r in rows if r["Status"].lower() in ("todo","backlog"))
    fail = sum(1 for r in rows if r["Status"].lower() in ("canceled","duplicate"))
    total = len(rows)
    avg  = round(sum(score(r["Status"]) for r in rows)/total) if total else 0
    return done, wip, ns, fail, total, avg

def summary_table(sections_data, title="Summary"):
    lines = [
        f"\n## 📊 {title}\n",
        "| Section | Issues | 🟢 Done | 🟡 WIP | ⚪ Not Started | 🔴 Failed | Avg Score | Grade |",
        "|---------|--------|---------|--------|--------------|-----------|-----------|-------|"
    ]
    all_rows = []
    for (name, rows) in sections_data:
        if not rows: continue
        done, wip, ns, fail, total, avg = section_stats(rows)
        lines.append(f"| {name} | {total} | {done} | {wip} | {ns} | {fail} | {avg} | {grade(avg)} |")
        all_rows.extend(rows)
    if all_rows:
        done, wip, ns, fail, total, avg = section_stats(all_rows)
        lines.append(f"| **TOTAL** | **{total}** | **{done}** | **{wip}** | **{ns}** | **{fail}** | **{avg}** | **{grade(avg)}** |")
        pct = round(done/total*100) if total else 0
        lines.append(f"\n**Overall Score: {avg}/100 — Grade: {grade(avg)} | Completion: {pct}%**\n")
    return "\n".join(lines)

# ── CORE ──────────────────────────────────────────────────────────────────────

def build_core():
    rows = read_csv(f"{BASE}/Core Foundation › Issues.csv")

    def assign_section(r):
        t = (r["Title"] + " " + r.get("Labels","")).lower()
        if any(x in t for x in ["auth","jwt","oauth","login","password","signup","security definer","rls","row level","hardening","search_path","permission"]): return "auth"
        if any(x in t for x in ["data-","schema","migration","table","embed","vector","pgvector","edge function","places backfill","backfill"]): return "data"
        if any(x in t for x in ["map","places","marker","pin","grounding","adk","cloud run","neighborhood"]): return "maps"
        if any(x in t for x in ["agent","mastra","copilotkit","concierge","gemini","workflow","intelligence","routing","int-","agt-","ck-","wf-"]): return "agent"
        if any(x in t for x in ["test","vitest","playwright","floor","soak","pr-","ops-","journey","synthetic","ci","branch protect","sha-pin","lint"]): return "testing"
        if any(x in t for x in ["vercel","deploy","prod","launch","gate","proof"]): return "deploy"
        return "deploy"

    buckets = defaultdict(list)
    for r in rows:
        buckets[assign_section(r)].append(r)

    sections = [
        ("auth",    "🔐 Auth, Security & RLS"),
        ("data",    "🗄️ Database, Schema & Data"),
        ("maps",    "🗺️ Maps & Grounding"),
        ("agent",   "🤖 Agent Infrastructure"),
        ("testing", "🧪 Testing & CI"),
        ("deploy",  "🚀 Production & Launch"),
    ]

    lines = [
        "# 🏗️ CORE Foundation — Implementation Tracker",
        f"> Phase 1 Critical Path | Updated: {TODAY} | Cycle 1: Jun 8–22 2026\n",
        "**Legend:** 🟢 Complete · 🟡 In Progress · ⚪ Not Started · 🔴 Failed/Canceled\n",
        "> **Correct implementation order:** Auth → DB/Schema → Maps → Agents → Testing → Production\n",
        "---\n",
    ]

    sections_data = []
    for (key, label) in sections:
        section_rows = sorted(buckets.get(key, []), key=sort_key)
        sections_data.append((label, section_rows))
        if not section_rows: continue
        done, wip, ns, fail, total, avg = section_stats(section_rows)
        lines.append(f"## {label}")
        lines.append(f"> {total} issues · 🟢 {done} done · 🟡 {wip} WIP · ⚪ {ns} not started · Score: **{avg}/100 {grade(avg)}**\n")
        lines.append(table_header())
        for r in section_rows:
            lines.append(section_row(r))
        lines.append("")

    lines.append(summary_table(sections_data, "Core Foundation Summary"))

    # top blockers
    blockers = [r for r in rows if r["Status"].lower() in ("todo","backlog","in progress","in review")
                and r.get("Priority","").lower() in ("urgent","high")]
    blockers.sort(key=lambda r: (PRIORITY_ORDER.get(r["Priority"].lower(),9), r["ID"]))
    if blockers:
        lines.append("\n### 🔴 Top Blockers (not Done, Urgent/High)")
        for i, r in enumerate(blockers[:10], 1):
            lines.append(f"{i}. {dot(r['Status'])} **{r['ID']}** — {purpose(r)} `{r['Status']}` `{r['Priority']}`")

    return "\n".join(lines)

# ── MVP ───────────────────────────────────────────────────────────────────────

def build_mvp():
    rows = read_csv(f"{BASE}/MVP issues.csv")

    def assign_section(r):
        t = (r["Title"] + " " + r.get("Labels","") + " " + r.get("Project","")).lower()
        if any(x in t for x in ["infra-","ops-","audit log","data quality","error tracking","background jobs","activity feed","missing data","launch command"]): return "admin"
        if any(x in t for x in ["auth","rls","schema","data-","migration","security","hardening","search_path"]): return "foundation"
        if any(x in t for x in ["map","places","grounding","adk","embed","vector","pgvector","hybrid search","search"]): return "maps"
        if any(x in t for x in ["ai-exp","int-","agt-","ck-","wf-","copilotkit","mastra","workflow","concierge-","agent","intelligence","routing","coagent","copilot"]): return "ai"
        if any(x in t for x in ["evt-","aie-","event","host event","host publish","ticket","hosteventa","waitlist"]): return "events"
        if any(x in t for x in ["rental","real estate","real-estate","ux-003","re-"]): return "rentals"
        if any(x in t for x in ["venue","ven-","readiness score"]): return "venues"
        if any(x in t for x in ["pay-","stripe","checkout","payment","commerce","ecom"]): return "payments"
        if any(x in t for x in ["crm-","partner","lead","onboard","booking pipeline","revenue","notification"]): return "partners"
        if any(x in t for x in ["ret-","recently viewed","saved search","ux-","d-","screen-","ui","card","chat","concierge","design","mobile"]): return "ux"
        if any(x in t for x in ["test","vitest","playwright","floor","soak","pr-","sys-","ci","branch"]): return "testing"
        if any(x in t for x in ["launch","gate","journey","prod","production","vercel","deploy"]): return "launch"
        return "ux"

    buckets = defaultdict(list)
    for r in rows:
        buckets[assign_section(r)].append(r)

    sections = [
        ("foundation", "🔐 Foundation"),
        ("maps",       "🗺️ Maps & Search"),
        ("ai",         "🤖 AI & Intelligence"),
        ("events",     "📅 Events Platform"),
        ("rentals",    "🏠 Rentals"),
        ("venues",     "🏢 Venues"),
        ("payments",   "🛒 Payments"),
        ("partners",   "🤝 Partner CRM"),
        ("ux",         "🧭 UX / Concierge"),
        ("testing",    "🧪 Testing & Quality"),
        ("admin",      "🏛️ Admin & Ops"),
        ("launch",     "🚀 Launch"),
    ]

    lines = [
        "# 🚀 MVP — Full Feature Tracker",
        f"> Phase 1 MVP Launch | Updated: {TODAY} | Cycle 1: Jun 8–22 2026\n",
        "**Legend:** 🟢 Complete · 🟡 In Progress · ⚪ Not Started · 🔴 Failed/Canceled\n",
        "> **Correct build order:** Foundation → Maps/Search → AI/Agents → Products → UX → Testing → Launch\n",
        "---\n",
    ]

    sections_data = []
    for (key, label) in sections:
        section_rows = sorted(buckets.get(key, []), key=sort_key)
        sections_data.append((label, section_rows))
        if not section_rows: continue
        done, wip, ns, fail, total, avg = section_stats(section_rows)
        lines.append(f"## {label}")
        lines.append(f"> {total} issues · 🟢 {done} done · 🟡 {wip} WIP · ⚪ {ns} not started · Score: **{avg}/100 {grade(avg)}**\n")
        lines.append(table_header())
        for r in section_rows:
            lines.append(section_row(r))
        lines.append("")

    lines.append(summary_table(sections_data, "MVP Summary"))

    # Top 5 blockers
    blockers = [r for r in rows if r["Status"].lower() in ("todo","backlog")
                and r.get("Priority","").lower() in ("urgent","high")]
    blockers.sort(key=lambda r: (PRIORITY_ORDER.get(r["Priority"].lower(),9), r["ID"]))
    lines.append("\n### 🔴 Top 10 MVP Blockers (not Done, Urgent/High)")
    for i, r in enumerate(blockers[:10], 1):
        lines.append(f"{i}. {dot(r['Status'])} **{r['ID']}** — {purpose(r)} `{r['Priority']}`")

    # Top 5 ready to start
    ready = [r for r in rows if r["Status"].lower() in ("todo","backlog")
             and not r.get("Blocked by","").strip()]
    ready.sort(key=lambda r: (PRIORITY_ORDER.get(r["Priority"].lower(),9), r["ID"]))
    lines.append("\n### ✅ Top 10 Ready to Start (unblocked, not started)")
    for i, r in enumerate(ready[:10], 1):
        lines.append(f"{i}. {dot(r['Status'])} **{r['ID']}** — {purpose(r)} `{r['Priority']}`")

    return "\n".join(lines)

# ── ADV ───────────────────────────────────────────────────────────────────────

def build_adv():
    rows = read_csv(f"{BASE}/All issues.csv")

    # Filter post-mvp / phase2 / advanced
    def is_adv(r):
        labels = r.get("Labels","").lower()
        milestone = r.get("Project Milestone","").lower()
        return (
            "phase:post-mvp" in labels
            or "phase:phase2" in labels
            or "phase:advanced" in labels
            or "m4" in milestone or "augment" in milestone
            or "m5" in milestone or "expand" in milestone
            or "phase 2" in milestone
            or "phase 3" in milestone
            or "post-mvp" in milestone
            or "advanced" in milestone
        )

    adv_rows = [r for r in rows if is_adv(r)]

    def assign_section(r):
        t = (r["Title"] + " " + r.get("Labels","") + " " + r.get("Project","")).lower()
        if any(x in t for x in ["ai-rec","ai-fup","ai-ins","agt-","int post","int adv","vec","pgvector","semantic","embedding","grounding","adk","a2a","acp","recommendation engine","follow-up"]): return "ai"
        if any(x in t for x in ["part-rpt","partner ai","ptr-ai","san-80","crm ai","lead copilot","revenue copilot","proposal","fit score","weekly report"]): return "partner_ai"
        if any(x in t for x in ["infra-ff","feature flag","sys-","auto-review","evaluation","evaluationagent","vercel deploy","infra"]): return "infra"
        if any(x in t for x in ["spanish","i18n","lingui","internation","localiz"]): return "i18n"
        if any(x in t for x in ["chat-00","chat-01","chat-0","chatwoot","whatsapp","crm-chat","integration","webhook","zapier","chatw"]): return "integrations"
        if any(x in t for x in ["hitl","coagentsprovider","multi-agent","canvas","v2","copilotkit v2","atomic"]): return "ux_adv"
        if any(x in t for x in ["trip","trip-","trp-"]): return "trips"
        return "infra"

    buckets = defaultdict(list)
    for r in adv_rows:
        buckets[assign_section(r)].append(r)

    sections = [
        ("ai",          "🧠 AI & Intelligence (Post-MVP)"),
        ("partner_ai",  "🤝 Partner AI Layer (Phase 2)"),
        ("trips",       "🗺️ Trips Module"),
        ("infra",       "🏗️ Platform & Infrastructure"),
        ("integrations","🔗 Integrations (Chatwoot · WhatsApp · A2A)"),
        ("i18n",        "🌐 Internationalisation"),
        ("ux_adv",      "🧭 Advanced UX (CopilotKit v2 · Multi-Agent)"),
    ]

    lines = [
        "# 🔮 ADVANCED — Post-MVP Roadmap",
        f"> Phase 2 / Post-Launch Features | Updated: {TODAY}\n",
        "**Legend:** 🟢 Complete · 🟡 In Progress · ⚪ Not Started · 🔴 Failed/Canceled\n",
        "> ⚠️ **All issues in this file require CopilotKit v2 migration OR are explicitly post-launch scope.**\n",
        "---\n",
    ]

    sections_data = []
    for (key, label) in sections:
        section_rows = sorted(buckets.get(key, []), key=sort_key)
        sections_data.append((label, section_rows))
        if not section_rows: continue
        done, wip, ns, fail, total, avg = section_stats(section_rows)
        lines.append(f"## {label}")
        lines.append(f"> {total} issues · 🟢 {done} done · 🟡 {wip} WIP · ⚪ {ns} not started · Score: **{avg}/100 {grade(avg)}**\n")
        lines.append(table_header())
        for r in section_rows:
            lines.append(section_row(r))
        lines.append("")

    lines.append(summary_table(sections_data, "Advanced Roadmap Summary"))
    lines.append("\n> 📌 Partner AI Layer (SAN-800–810): Build after CopilotKit v2 migration using Atomic CRM as reference architecture.")
    lines.append("> 📌 Trips Module: Full implementation begins post-MVP launch.")
    lines.append("> 📌 Chatwoot/WhatsApp: Wire after Partner CRM Phase 1 (CRM-001–012) is complete.")

    return "\n".join(lines)

# ── MAIN ──────────────────────────────────────────────────────────────────────

os.makedirs(OUT, exist_ok=True)

print("Building core.md...")
core_content = build_core()
with open(f"{OUT}/core.md", "w", encoding="utf-8") as f:
    f.write(core_content)
lines = core_content.count("\n")
print(f"  ✅ core.md written ({lines} lines)")

print("Building mvp.md...")
mvp_content = build_mvp()
with open(f"{OUT}/mvp.md", "w", encoding="utf-8") as f:
    f.write(mvp_content)
lines = mvp_content.count("\n")
print(f"  ✅ mvp.md written ({lines} lines)")

print("Building ADV.md...")
adv_content = build_adv()
with open(f"{OUT}/ADV.md", "w", encoding="utf-8") as f:
    f.write(adv_content)
lines = adv_content.count("\n")
print(f"  ✅ ADV.md written ({lines} lines)")

print("\nDone.")
