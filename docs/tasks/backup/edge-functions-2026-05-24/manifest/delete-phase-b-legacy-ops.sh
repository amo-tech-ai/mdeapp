#!/usr/bin/env bash
# Phase B — legacy ops/sponsors/contests (ONLY if old app + Stripe sponsor flows retired)
# Restore from: tasks/backup/edge-functions-2026-05-24/deployed-live/
set -euo pipefail
REF=zkwcbyxiwklihegjhuql
DELETE=(
  whatsapp-webhook rules-engine p1-crm listing-create listing-moderate
  lead-from-form lead-reminder-tick event-staff-link-generator vote-cast
  contestant-social-enrich moderate-asset fraud-scan
  sponsor-checkout sponsor-payment-webhook sponsor-cancel sponsor-click
  sponsor-impression sponsor-application-create sponsor-contract-generate
  sponsor-contract-sign sponsor-creative-gen sponsor-moderate sponsor-optimize
  sponsor-roi-explain sponsor-audience-match event-photo-moderate
  notify-entity-approved openclaw-delivery-webhook openclaw-outreach
  postiz-approval-webhook postiz-schedule-posts failed-deliveries-digest
  outbox-dispatch google-directions
)
echo "⚠ Phase B deletes ${#DELETE[@]} functions. Confirm old app + sponsors retired."
read -r -p "Type DELETE-LEGACY to continue: " confirm
[[ "$confirm" == "DELETE-LEGACY" ]] || exit 1
for fn in "${DELETE[@]}"; do
  echo "  delete $fn"
  supabase functions delete "$fn" --project-ref "$REF" --yes
done
echo "Done Phase B."
