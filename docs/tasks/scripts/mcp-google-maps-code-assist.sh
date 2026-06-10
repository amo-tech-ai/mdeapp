#!/usr/bin/env bash
# Cursor stdio bridge → Maps Code Assist MCP (docs RAG; no API key)
set -euo pipefail
exec npx -y mcp-remote@latest "https://mapscodeassist.googleapis.com/mcp"
