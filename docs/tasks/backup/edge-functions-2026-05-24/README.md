# Edge functions backup — 2026-05-24

**Project:** `zkwcbyxiwklihegjhuql`  
**Purpose:** Full snapshot before deleting legacy edge functions (mdeapp-only focus).

## Contents

| Path | What |
|------|------|
| `deployed-live/supabase/functions/` | **48 functions** downloaded from live Supabase (`supabase functions download --use-api`) |
| `legacy-mde-local/` | Partial copy from `/home/sk/mde/supabase/functions/` (16 slugs) |
| `mdeai-local/` | Current mdeai repo (`chat-lead-capture` + `_shared`) |
| `manifest/deployed-list.json` | CLI JSON list with versions + `verify_jwt` |
| `../edge-functions-2026-05-24.tar.gz` | Compressed archive of this folder |

## Restore one function

```bash
cd /path/to/supabase/project
supabase functions deploy <slug> --project-ref zkwcbyxiwklihegjhuql
# Source: tasks/backup/edge-functions-2026-05-24/deployed-live/supabase/functions/<slug>/
```

## Restore all (emergency)

```bash
BACKUP=/home/sk/mdeai/tasks/backup/edge-functions-2026-05-24/deployed-live/supabase/functions
for d in "$BACKUP"/*/; do
  slug=$(basename "$d")
  [ "$slug" = "_shared" ] && continue
  supabase functions deploy "$slug" --project-ref zkwcbyxiwklihegjhuql
done
```

---

## mdeapp KEEP (do not delete)

| Slug | When needed |
|------|-------------|
| `chat-lead-capture` | Leads from chat (F12) |
| `ticket-checkout` | W9 ticketing (EVT-01 port) |
| `ticket-payment-webhook` | W9 Stripe webhook |
| `ticket-validate` | W9 door scan |
| `approval-commit` | F38 Roberto publish — **not deployed yet** |

**Optional later:** `google-directions`, `places-proxy`

---

## SAFE TO DELETE (mdeapp uses Mastra/Vercel instead)

Legacy AI chat stack — **43 functions**:

```
ai-chat
ai-router
ai-search
ai-embed
ai-suggest-collections
ai-trip-planner
ai-optimize-route
rentals
hermes-ranking
openclaw-concierge-webhook
whatsapp-webhook
rules-engine
p1-crm
listing-create
listing-moderate
lead-from-form
lead-reminder-tick
event-staff-link-generator
vote-cast
contestant-social-enrich
moderate-asset
fraud-scan
sponsor-checkout
sponsor-payment-webhook
sponsor-cancel
sponsor-click
sponsor-impression
sponsor-application-create
sponsor-contract-generate
sponsor-contract-sign
sponsor-creative-gen
sponsor-moderate
sponsor-optimize
sponsor-roi-explain
sponsor-audience-match
event-photo-moderate
notify-entity-approved
openclaw-delivery-webhook
openclaw-outreach
postiz-approval-webhook
postiz-schedule-posts
failed-deliveries-digest
outbox-dispatch
google-directions
```

⚠️ **Before deleting ticket-* :** port EVT-01 or Stripe ticket sales break.  
⚠️ **Before deleting sponsor-* :** only if sponsor product is retired.

---

## Delete script (run manually after review)

```bash
# Phase A — legacy AI only (safest first cut)
for fn in ai-chat ai-router ai-search ai-embed ai-suggest-collections \
  ai-trip-planner ai-optimize-route rentals hermes-ranking openclaw-concierge-webhook; do
  supabase functions delete "$fn" --project-ref zkwcbyxiwklihegjhuql --yes
done
```

Full delete list: see `manifest/delete-phase-b.sh` (generated below).
