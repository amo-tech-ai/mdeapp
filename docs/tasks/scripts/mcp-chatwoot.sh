#!/usr/bin/env bash
# Claude / Cursor stdio bridge → chatwoot-mcp (Chatwoot REST API as MCP tools).
# Requires CHATWOOT_URL and CHATWOOT_API_TOKEN in the environment.
# Install notes: https://www.npmjs.com/package/chatwoot-mcp
set -euo pipefail
exec npx -y chatwoot-mcp@latest
