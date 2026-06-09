#!/usr/bin/env bash
# Cursor stdio bridge → Gemini API docs via mcpdoc + official llms.txt (no gemini-api-docs-mcp.dev 429)
set -euo pipefail
exec uvx --from mcpdoc mcpdoc \
  --urls "GeminiAPI:https://ai.google.dev/gemini-api/docs/llms.txt" \
  --allowed-domains "ai.google.dev" \
  --transport stdio
