#!/usr/bin/env bash
# import-env-to-infisical.sh
# One-time migration: push KEY=VALUE pairs from a .env file into Infisical.
# SAFETY: never prints secret values — only key names. Malformed lines are
# skipped by line NUMBER (their content is never echoed).
#
# Prereqs: `infisical login --domain http://localhost:80` (authed to the
# localhost instance) AND `.infisical.json` present (repo is linked).
#
# Usage:
#   ./scripts/import-env-to-infisical.sh <env-file> <env-slug>
# Example:
#   ./scripts/import-env-to-infisical.sh ./.env.local dev
#   ./scripts/import-env-to-infisical.sh ./mdeapp/.env.local dev
set -euo pipefail

ENV_FILE="${1:?usage: $0 <env-file> <env-slug>}"
ENV_SLUG="${2:?usage: $0 <env-file> <env-slug>}"
[ -f "$ENV_FILE" ] || { echo "no such file: $ENV_FILE" >&2; exit 1; }

# Optional: target a specific project (needed for Cloud / machine-identity auth)
PROJ_FLAG=""
[ -n "${INFISICAL_PROJECT_ID:-}" ] && PROJ_FLAG="--projectId=${INFISICAL_PROJECT_ID}"

set_count=0; skip_count=0; fail_count=0; lineno=0
while IFS= read -r line || [ -n "$line" ]; do
  lineno=$((lineno + 1))
  line="${line%$'\r'}"                        # strip CR
  case "$line" in ''|'#'*) continue;; esac    # blanks + comments
  case "$line" in
    *=*) ;;
    *) echo "SKIP line $lineno (no '=')" >&2; skip_count=$((skip_count + 1)); continue;;
  esac
  key="${line%%=*}"; val="${line#*=}"
  key="$(printf '%s' "$key" | tr -d '[:space:]')"   # trim whitespace in key
  case "$val" in \"*\") val="${val#\"}"; val="${val%\"}";; esac  # unquote "..."
  case "$val" in \'*\') val="${val#\'}"; val="${val%\'}";; esac  # unquote '...'
  case "$key" in
    ''|*[!A-Za-z0-9_]*) echo "SKIP line $lineno (invalid key)" >&2; skip_count=$((skip_count + 1)); continue;;
  esac
  # Optional exclude list (space-separated) so a 2nd file can't clobber existing values
  case " ${EXCLUDE_KEYS:-} " in
    *" $key "*) echo "EXCLUDE: $key (preserving existing value)" >&2; skip_count=$((skip_count + 1)); continue;;
  esac
  if infisical secrets set "$key=$val" --env="$ENV_SLUG" --path=/ $PROJ_FLAG >/dev/null 2>&1; then
    echo "set: $key"; set_count=$((set_count + 1))
  else
    echo "FAIL: $key" >&2; fail_count=$((fail_count + 1))
  fi
done < "$ENV_FILE"

echo "---"
echo "done: $set_count set, $skip_count skipped, $fail_count failed (env=$ENV_SLUG)"
