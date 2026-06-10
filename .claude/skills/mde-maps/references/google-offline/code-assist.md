---
doc_type: google_offline_mirror
parent_skill: mde-maps
topic: code-assist
description: "Offline Google Maps Platform doc export (code-assist). Tertiary: verify against live developers.google.com and curated references/*.md."
---

> [!WARNING]
> **Experimental:** Maps Code Assist is in the Experimental (pre-GA) stage. Pre-GA products and features might have limited support, and changes to pre-GA products and features might not be compatible with other pre-GA versions. Pre-GA Offerings are covered by the [Google Maps Platform Service Specific
> Terms](https://cloud.google.com/maps-platform/terms/maps-service-terms). For more information, see the [launch stage
> descriptions](https://developers.google.com/maps/launch-stages). There is no charge for using Maps Code Assist while it is in the Experimental stage.

The Google Maps Platform Code Assist toolkit is a Model Context Protocol (MCP)
server that enhances the responses from large language models (LLMs) used for
developing applications with the Google Maps Platform. It works by grounding the
responses in the official, up-to-date documentation and code samples.

Since the MCP server accesses the content when the model is prompted, the
LLM's context regarding Google Maps Platform does not have to be limited to
the available data at the model's training date.

Google Maps Platform resources that the MCP server can access include:

- Google Maps Platform Documentation
- Google Maps Platform Terms of Service
- Google Maps Platform Trust Center
- Code repositories in Google Maps Platform official GitHub organizations

## Tools

Maps Code Assist provides tools that allow LLMs to access the following
capabilities:

- **[`retrieve-instructions`](https://developers.google.com/maps/ai/code-assist/reference/mcp/tools_list/retrieve-instructions)** : A helper tool used by the client to get crucial system instructions on how to best reason about user intent and formulate effective calls to the `retrieve-google-maps-platform-docs` tool.
- **[`retrieve-google-maps-platform-docs`](https://developers.google.com/maps/ai/code-assist/reference/mcp/tools_list/retrieve-google-maps-platform-docs)**: The primary tool. It takes a natural language query and submits it to a hosted Retrieval Augmented Generation (RAG) engine. The RAG engine searches fresh versions of official Google Maps Platform documentation, tutorials, and code samples, returning relevant context to the LLM so that it generates an accurate response.

## Billing

There is no charge for using Maps Code Assist while it is in the Experimental
stage.

## Policies and terms of service

Maps Code Assist is subject to the [Google Maps Platform Terms of
Service](https://cloud.google.com/maps-platform/terms), including the
[service-specific
terms](https://cloud.google.com/maps-platform/terms/maps-service-terms) for this
service. This section describes additional service usage requirements for
Maps Code Assist, including compatible LLMs and source attribution requirements.

### Requirements for Compatible LLMs

**You may only use Maps Code Assist with an LLM that is compliant with the
Google Maps Platform Terms of Service.**

For example, you are responsible for ensuring that Google Maps Content is not
cached by, stored by, or used to improve the LLM that you choose to use. Before
using Maps Code Assist, you will need to review the Terms of Service for any
model you intend to use with Maps Code Assist. You must not use Maps Code Assist
with any models that use the data input into the model for any model training or
improvement. **You are responsible for ensuring that your use of the model fully
complies with the restrictions on Google Maps Content in the Google Maps
Platform Terms of Service, including the service specific terms.**

### Attribution requirements for Google Maps sources

When presenting results that use tools provided by Maps Code Assist, you must
include the associated Google Maps sources.

## Configure LLMs to access the Maps Code Assist MCP server

You can configure LLMs to access the MCP server by following the corresponding
MCP configuration documentation and using the Code Assist MCP server endpoint:
`https://mapscodeassist.googleapis.com/mcp`.

Maps Code Assist MCP server uses Streamable HTTP transport.
For more information, see
[Configure MCP in an AI application](https://docs.cloud.google.com/mcp/configure-mcp-ai-application).

### Example use cases

Once configured, you can ask your LLM questions about the Google Maps Platform.
Here are some example prompts:

- "How do I add a map to my Android application?"
- "What is the best way to get the user's current location on a map in iOS?"
- "Provide an example of using the directions service in the Maps JavaScript API."

> [!NOTE]
> **Note:** For instructions on how to configure the Maps Code Assist MCP server using [Gemini CLI](https://github.com/google-gemini/gemini-cli), see [Configure Maps Code Assist with Gemini CLI](https://developers.google.com/maps/ai/code-assist/gemini-cli).

## Available tools

To view details of available MCP tools and their descriptions for the
Maps Code Assist MCP server, see the
[Maps Code Assist MCP reference](https://developers.google.com/maps/ai/code-assist/reference/mcp).

### List tools with an HTTP request

To verify the server is working and see a list of available tools, you can send
a `tools/list` HTTP request directly to the Maps Code Assist remote MCP server.
The `tools/list` method doesn't require authentication.

    curl -X POST \
      -H "Content-Type: application/json" \
      -H "Accept: application/json, text/event-stream" \
      -d '{
        "jsonrpc": "2.0",
        "method": "tools/list",
        "id": "1"
      }' \
      https://mapscodeassist.googleapis.com/mcp

## Share feedback

To share feedback about Maps Code Assist, use the following forms:

- [Report a bug](https://issuetracker.google.com/issues/new?component=1939139&template=2210898)
- [Submit a feature request](https://issuetracker.google.com/issues/new?component=1939139&template=2210768)
- [Provide feedback](https://docs.google.com/forms/d/e/1FAIpQLSe72eobSaaE2UGgvC7edpeRWRjD3AZvDDYrRQDbhyoNVGWcTw/viewform)