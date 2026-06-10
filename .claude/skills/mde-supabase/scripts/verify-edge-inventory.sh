#!/usr/bin/env bash
# Exit 1 if supabase/functions/ and supabase/config.toml [functions.*] blocks drift.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
FUNCS_DIR="$ROOT/supabase/functions"
CONFIG="$ROOT/supabase/config.toml"

if [[ ! -f "$CONFIG" ]]; then
  echo "verify-edge-inventory: missing $CONFIG" >&2
  exit 1
fi

mapfile -t FROM_DIR < <(
  find "$FUNCS_DIR" -mindepth 1 -maxdepth 1 -type d \
    ! -name '_shared' ! -name 'tests' ! -name 'node_modules' \
    -printf '%f\n' | sort
)

mapfile -t FROM_CONFIG < <(
  grep -E '^\[functions\.' "$CONFIG" | sed 's/^\[functions\.//;s/\]$//' | sort
)

missing_config=()
missing_dir=()

for name in "${FROM_DIR[@]}"; do
  if ! printf '%s\n' "${FROM_CONFIG[@]}" | grep -qx "$name"; then
    missing_config+=("$name")
  fi
done

for name in "${FROM_CONFIG[@]}"; do
  if [[ ! -d "$FUNCS_DIR/$name" ]]; then
    missing_dir+=("$name")
  fi
done

if ((${#missing_config[@]})) || ((${#missing_dir[@]})); then
  echo "verify-edge-inventory: drift detected" >&2
  if ((${#missing_config[@]})); then
    echo "  directories without [functions.*] in config.toml: ${missing_config[*]}" >&2
  fi
  if ((${#missing_dir[@]})); then
    echo "  config.toml entries without directory: ${missing_dir[*]}" >&2
  fi
  exit 1
fi

echo "verify-edge-inventory: OK (${#FROM_DIR[@]} functions match config.toml)"
