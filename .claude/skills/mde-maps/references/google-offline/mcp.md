---
doc_type: google_offline_mirror
parent_skill: mde-maps
topic: mcp
description: "Offline Google Maps Platform doc export (mcp). Tertiary: verify against live developers.google.com and curated references/*.md."
---

# MCP Reference: mapscodeassist.googleapis.com

A [Model Context Protocol (MCP) server](https://modelcontextprotocol.io/docs/learn/server-concepts) acts as a proxy between an external service that provides context, data, or capabilities to a Large Language Model (LLM) or AI application. MCP servers connect AI applications to external systems such as databases and web services, translating their responses into a format that the AI application can understand.

An MCP server that provides tools for grounding LLM responses in official Google Maps Platform documentation and code samples.

### Server Endpoints

An MCP service endpoint is the network address and communication interface (usually a URL) of the MCP server that an AI application (the Host for the MCP client) uses to establish a secure, standardized connection. It is the point of contact for the LLM to request context, call a tool, or access a resource. Google MCP endpoints can be global or regional.

The mapscodeassist.googleapis.com MCP server has the following MCP endpoint:

- https://mapscodeassist.googleapis.com/mcp

## MCP Tools

An [MCP tool](https://modelcontextprotocol.io/legacy/concepts/tools) is a function or executable capability that an MCP server exposes to a LLM or AI application to perform an action in the real world.

The mapscodeassist.googleapis.com MCP server has the following tools:

| MCP Tools ||
|---|---|
| [retrieve-instructions](https://developers.google.com/maps/ai/code-assist/reference/mcp/tools_list/retrieve-instructions) | CRITICAL: Call this tool first for any queries related to location, mapping, addresses, routing, points of interest, location analytics, or geospatial data (e.g., Google Earth). It provides the foundational context on Google Maps Platform (APIs for maps, routes, and places) and best practices that are essential for the other tools to function correctly. This tool MUST be called before any other tool. |
| [retrieve-google-maps-platform-docs](https://developers.google.com/maps/ai/code-assist/reference/mcp/tools_list/retrieve-google-maps-platform-docs) | Searches Google Maps Platform documentation, code samples, architecture center, trust center, GitHub repositories (including sample code and client libraries for react-google-maps, flutter, compose, utilities, swiftui, and more), and terms of service to answer user questions. CRITICAL: You MUST call the `retrieve-instructions` tool or load the `instructions` resource BEFORE using this tool. This provides essential context required for this tool to function correctly. |

### Get MCP tool specifications


To get the MCP tool specifications for all tools in an MCP server, use the `tools/list` method. The following example demonstrates how to use `curl` to list all tools and their specifications currently available within the MCP server.

| Curl Request |
|---|
| ```bash curl --location 'https://mapscodeassist.googleapis.com/mcp' \ --header 'content-type: application/json' \ --header 'accept: application/json, text/event-stream' \ --data '{ "method": "tools/list", "jsonrpc": "2.0", "id": 1 }' ``` |