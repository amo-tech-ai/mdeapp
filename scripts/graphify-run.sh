#!/usr/bin/env bash
# Canonical mdeai Graphify builder (AI-SB-001). Runs the graphify CLI from repo
# root using the project venv (or a GRAPHIFY_BIN override). This wrapper — NOT a
# Python script — is the documented entrypoint; older docs referencing
# scripts/graphify-phase2-build.py are stale (that file never existed).
#
# Common commands (all AST-only, $0, no LLM):
#   bash scripts/graphify-run.sh update .      # refresh the graph after code/doc changes
#   bash scripts/graphify-run.sh tree          # regenerate the HTML viz (GRAPH_TREE.html)
#   bash scripts/graphify-run.sh query "..."   # BFS lookup over graph.json
#   bash scripts/graphify-run.sh explain "X"   # plain-language node + neighbors
# Exclusions live in .graphifyignore. Output (graphify-out/) is gitignored.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
GRAPHIFY="${GRAPHIFY_BIN:-$HOME/.venvs/graphify/bin/graphify}"

# Fall back to a graphify on PATH (e.g. from `uv tool install graphifyy`, which
# installs to ~/.local/bin — not the venv path checked above).
if [[ ! -x "$GRAPHIFY" ]] && command -v graphify >/dev/null 2>&1; then
  GRAPHIFY="$(command -v graphify)"
fi

if [[ ! -x "$GRAPHIFY" ]]; then
  echo "graphify not found at $GRAPHIFY (and none on PATH)" >&2
  echo "Install: uv tool install graphifyy  OR  python3 -m venv ~/.venvs/graphify && ~/.venvs/graphify/bin/pip install graphifyy" >&2
  exit 1
fi

cd "$ROOT"
exec "$GRAPHIFY" "$@"
