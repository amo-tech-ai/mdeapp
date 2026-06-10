#!/usr/bin/env bash
# Phase A — legacy AI chat stack (replaced by Mastra /api/copilotkit)
# Backup required: tasks/backup/edge-functions-2026-05-24/
set -euo pipefail
REF=zkwcbyxiwklihegjhuql
KEEP=(chat-lead-capture ticket-checkout ticket-payment-webhook ticket-validate)
DELETE=(
  ai-chat ai-router ai-search ai-embed ai-suggest-collections
  ai-trip-planner ai-optimize-route rentals hermes-ranking openclaw-concierge-webhook
)
echo "Deleting ${#DELETE[@]} AI legacy functions from $REF..."
for fn in "${DELETE[@]}"; do
  echo "  delete $fn"
  supabase functions delete "$fn" --project-ref "$REF" --yes
done
echo "Done Phase A. Kept: ${KEEP[*]}"
