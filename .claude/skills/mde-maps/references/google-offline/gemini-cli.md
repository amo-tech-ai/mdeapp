---
doc_type: google_offline_mirror
parent_skill: mde-maps
topic: gemini-cli
description: "Offline Google Maps Platform doc export (gemini-cli). Tertiary: verify against live developers.google.com and curated references/*.md."
---

To configure the Maps Code Assist MCP server with
[Gemini CLI](https://github.com/google-gemini/gemini-cli), do the following:

1. Once you install Gemini CLI, you can use the `add` command to configure
   Maps Code Assist MCP server:

       gemini mcp add -s user -t http maps-code-assist-mcp https://mapscodeassist.googleapis.com/mcp

   A confirmation is shown stating that the MCP server has been added to your
   user settings.
2. To validate that the server is working correctly, run the `/mcp list`
   command:

       > /mcp list

   The response is similar to the following:

       Configured MCP servers:

       maps-code-assist-mcp - Ready (2 tools)
       Tools:
       -   retrieve-google-maps-platform-docs
       -   retrieve-instructions

3. Start asking Maps-related questions with Gemini CLI.

## What's next

- Learn more about [MCP servers with Gemini
  CLI](https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md).