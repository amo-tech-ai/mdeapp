#!/usr/bin/env bash
# Cursor / Claude stdio bridge → CopilotKit + AG-UI docs MCP (remote Streamable HTTP).
# Native "url": "https://mcp.copilotkit.ai/mcp" often shows "Not connected" in Cursor; stdio proxy is reliable.
set -euo pipefail
exec npx -y mcp-remote@latest "https://mcp.copilotkit.ai/mcp"
