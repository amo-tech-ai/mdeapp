#!/usr/bin/env bash
# task-verifier — disk probe for mdeapp claims
# Usage:
#   bash .claude/skills/task-verifier/scripts/probe-disk.sh           # all probes
#   bash .claude/skills/task-verifier/scripts/probe-disk.sh F09       # filter to F09 probes
#
# All probes are READ-ONLY. Names of env vars are logged; values never are.
# Exit code = number of 🔴 blockers (0 = green).

set -uo pipefail

REPO="${REPO:-/home/sk/mdeai}"
APP="$REPO/mdeapp"
FILTER="${1:-}"

red=0; yellow=0; green=0

ok()    { printf "🟢 %s\n" "$*"; green=$((green+1)); }
warn()  { printf "🟡 %s\n" "$*"; yellow=$((yellow+1)); }
fail()  { printf "🔴 %s\n" "$*"; red=$((red+1)); }
info()  { printf "ℹ️  %s\n" "$*"; }

# match $1 against $FILTER (empty filter = match all)
in_filter() { [ -z "$FILTER" ] || echo "$1" | grep -qi "$FILTER"; }

echo "=== task-verifier disk probe — $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="
echo "REPO=$REPO"
[ -n "$FILTER" ] && echo "filter=$FILTER"
echo

# ---------- Project structure ----------
if in_filter struct; then
  echo "## Project structure"
  [ -d "$APP" ] && ok "mdeapp/ present" || fail "mdeapp/ missing"
  [ -d "$APP/.git" ] && ok "mdeapp/.git present" || fail "mdeapp/.git missing"
  [ -f "$REPO/CLAUDE.md" ] && ok "CLAUDE.md present" || fail "CLAUDE.md missing"
  [ -f "$REPO/tasks/INDEX.md" ] && ok "tasks/INDEX.md present" || fail "tasks/INDEX.md missing"
  echo
fi

# ---------- Package scripts ----------
if in_filter scripts; then
  echo "## package.json scripts"
  for s in build dev start audit test floor lint typecheck; do
    val=$(node -p "require('$APP/package.json').scripts['$s'] || ''" 2>/dev/null)
    if [ -n "$val" ]; then ok "scripts.$s = $val"
    else fail "scripts.$s MISSING"
    fi
  done
  echo
fi

# ---------- Key dependencies ----------
if in_filter deps; then
  echo "## Dependencies"
  for p in \
    "@copilotkit/react-core" "@copilotkit/runtime" \
    "@mastra/core" "@ag-ui/mastra" \
    "@ai-sdk/google" "@ai-sdk/openai" \
    "@supabase/supabase-js" "@supabase/ssr" \
    "vitest" "@vitest/coverage-v8" \
    "tailwindcss" "next" \
    "@mastra/observability" "@mastra/evals"; do
    val=$(node -p "var p=require('$APP/package.json'); (p.dependencies||{})['$p']||(p.devDependencies||{})['$p']||''" 2>/dev/null)
    onDisk=""
    [ -d "$APP/node_modules/$p" ] && onDisk="(node_modules ✓)"
    if [ -n "$val" ]; then ok "$p @ $val $onDisk"
    else warn "$p NOT in package.json"
    fi
  done
  echo
fi

# ---------- Pinned versions ----------
if in_filter pins; then
  echo "## Pinned versions (regression check)"
  ck_ver=$(node -p "require('$APP/package.json').dependencies['@copilotkit/react-core'] || ''")
  case "$ck_ver" in
    "1.55.2") ok "CopilotKit pin held at 1.55.2";;
    "") fail "CopilotKit react-core missing";;
    *) fail "CopilotKit pin drift: $ck_ver (expected 1.55.2)";;
  esac

  next_ver=$(node -p "require('$APP/package.json').dependencies['next'] || ''")
  case "$next_ver" in
    16.*) ok "Next.js v16 ($next_ver)";;
    "") fail "Next missing";;
    *) warn "Next not v16: $next_ver";;
  esac
  echo
fi

# ---------- Critical files ----------
if in_filter files; then
  echo "## Critical files"
  for f in \
    "src/mastra/index.ts" \
    "src/mastra/agents/index.ts" \
    "src/app/api/copilotkit/route.ts" \
    "src/app/layout.tsx" \
    "src/app/page.tsx" \
    "src/lib/types.ts" \
    ".env.local" \
    ".env.example" \
    "next.config.ts"; do
    [ -f "$APP/$f" ] && ok "$f" || fail "$f missing"
  done

  # Optional but commonly referenced
  for f in \
    "components.json" \
    "vitest.config.ts" \
    "tailwind.config.ts" \
    "src/lib/utils.ts" \
    "src/app/host/event/new/page.tsx"; do
    [ -f "$APP/$f" ] && ok "$f present" || warn "$f absent (often expected absent on Tailwind v4 / pre-F07 / pre-F09 / pre-W3)"
  done
  echo
fi

# ---------- Task index sanity ----------
if in_filter tasks; then
  echo "## tasks/core sanity"
  for f in $(ls "$REPO/tasks/core/"F*.md 2>/dev/null); do
    base=$(basename "$f" .md)
    status=$(awk '/^status:/{print $2; exit}' "$f")
    # Strip the leading "depends_on:" key AND any trailing "# comment"
    deps=$(awk '/^depends_on:/{sub(/^depends_on:[ \t]*/,""); sub(/[ \t]*#.*$/,""); print; exit}' "$f")
    case "$status" in
      Done) tag="🟢";;
      "In") tag="🟡";;          # "In Progress" — awk grabs first token
      Not)  tag="⚪";;          # "Not Started"
      *)    tag="⚠️";;
    esac
    printf "%s %s status=%s deps=%s\n" "$tag" "$base" "$status" "$deps"

    # Validate depends_on entries map to real files
    for d in $(echo "$deps" | tr -d '[],' | xargs); do
      [ -z "$d" ] && continue
      # F09 matches F09-*.md; F09-supp matches F09-supp*.md (specific) before F09-*.md
      hit=$(ls "$REPO/tasks/core/${d}-"*.md 2>/dev/null | head -1)
      if [ -z "$hit" ]; then
        # try exact F<id>.md fallback
        [ -f "$REPO/tasks/core/${d}.md" ] && hit="$REPO/tasks/core/${d}.md"
      fi
      if [ -z "$hit" ]; then
        fail "  $base depends_on $d → no matching file in tasks/core/"
      fi
    done
  done
  echo
fi

# ---------- Git / remote ----------
if in_filter git; then
  echo "## Git state"
  if git -C "$APP" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    branch=$(git -C "$APP" branch --show-current)
    local_sha=$(git -C "$APP" rev-parse HEAD)
    ok "branch=$branch local=$local_sha"
    remote_url=$(git -C "$APP" remote get-url origin 2>/dev/null || echo "")
    if [ -n "$remote_url" ]; then
      info "origin=$remote_url"
      remote_sha=$(git -C "$APP" ls-remote origin "$branch" 2>/dev/null | awk '{print $1}' | head -1)
      if [ "$local_sha" = "$remote_sha" ]; then ok "local SHA = remote SHA"
      else warn "local≠remote (local=$local_sha remote=$remote_sha)"
      fi
    else
      warn "no origin remote"
    fi
    dirty=$(git -C "$APP" status --porcelain | wc -l | tr -d ' ')
    [ "$dirty" = "0" ] && ok "working tree clean" || warn "$dirty uncommitted files"
  else
    fail "mdeapp not a git repo"
  fi
  echo
fi

# ---------- Env name check (names only — values never printed) ----------
if in_filter env; then
  echo "## Env var presence (names only — values are NEVER logged)"
  for v in \
    NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY \
    GOOGLE_GENERATIVE_AI_API_KEY \
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY \
    NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID \
    LOG_LEVEL \
    SUPABASE_SERVICE_ROLE_KEY; do
    if [ -f "$APP/.env.local" ] && grep -qE "^${v}=" "$APP/.env.local"; then
      if [ "$v" = "SUPABASE_SERVICE_ROLE_KEY" ]; then
        fail "$v PRESENT in mdeapp/.env.local — must live only in edge functions"
      else
        ok "$v present in mdeapp/.env.local"
      fi
    else
      [ "$v" = "SUPABASE_SERVICE_ROLE_KEY" ] && ok "$v correctly absent from mdeapp/.env.local" \
        || warn "$v missing from mdeapp/.env.local"
    fi
  done

  # Stripe webhook secret distinctness — workspace .env.local
  if [ -f "$REPO/.env.local" ]; then
    t=$(grep -E '^STRIPE_WEBHOOK_SECRET=' "$REPO/.env.local" | cut -d= -f2- | tr -d '\r')
    s=$(grep -E '^STRIPE_SPONSOR_WEBHOOK_SECRET=' "$REPO/.env.local" | cut -d= -f2- | tr -d '\r')
    if [ -n "$t" ] && [ -n "$s" ]; then
      tlen=${#t}; slen=${#s}
      info "STRIPE_WEBHOOK_SECRET length=$tlen · STRIPE_SPONSOR_WEBHOOK_SECRET length=$slen (values not logged)"
      if [ "$t" = "$s" ]; then
        fail "STRIPE_WEBHOOK_SECRET and STRIPE_SPONSOR_WEBHOOK_SECRET have IDENTICAL values in $REPO/.env.local — F11 P0"
      else
        ok "Stripe webhook secrets are DISTINCT in $REPO/.env.local"
      fi
      unset t s tlen slen
    fi
  fi
  echo
fi

# ---------- Mastra beta API surface (cheap presence-only checks) ----------
if in_filter beta; then
  echo "## Mastra beta API surface"
  CORE="$APP/node_modules/@mastra/core/dist"
  if [ -d "$CORE" ]; then
    [ -d "$CORE/workspace" ]    && ok "@mastra/core/workspace present"    || warn "@mastra/core/workspace missing"
    [ -d "$CORE/processors" ]   && ok "@mastra/core/processors present"   || warn "@mastra/core/processors missing"
    [ -f "$CORE/processors/processors/token-limiter.d.ts" ] && ok "TokenLimiterProcessor available" || warn "TokenLimiterProcessor missing on beta"
    [ -f "$CORE/processors/processors/moderation.d.ts" ] && ok "ModerationProcessor available" || warn "ModerationProcessor missing on beta"
    [ -f "$CORE/processors/processors/system-prompt-scrubber.d.ts" ] && ok "SystemPromptScrubber available" || warn "SystemPromptScrubber missing on beta"

    if grep -q "scope" "$CORE/memory/types.d.ts" 2>/dev/null; then
      ok "memory scope literal present"
    else
      warn "memory scope type not found"
    fi

    if grep -q "constructor" "$CORE/agent/agent.d.ts" 2>/dev/null; then
      if grep -q "workflows" "$CORE/agent/agent.d.ts"; then
        warn "Agent constructor has 'workflows' keyword — verify if it's the config option or just a method"
      else
        ok "Agent constructor has no 'workflows' field (F18 must use fallback wiring)"
      fi
    fi
  else
    warn "@mastra/core not installed under mdeapp/node_modules"
  fi
  echo
fi

# ---------- Summary ----------
echo "=== summary ==="
echo "🟢 ok=$green  🟡 warn=$yellow  🔴 fail=$red"
exit $red
