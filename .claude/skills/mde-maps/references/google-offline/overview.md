---
doc_type: google_offline_mirror
parent_skill: mde-maps
topic: overview
description: "Offline Google Maps Platform doc export (overview). Tertiary: verify against live developers.google.com and curated references/*.md."
---

Google and Google Cloud services can be used in your AI applications with
enterprise-ready governance, security, and access control through our
remote [Model Context Protocol (MCP)](https://cloud.google.com/discover/what-is-model-context-protocol) servers.

MCP is an open source protocol developed by [Anthropic](https://www.anthropic.com/) that
standardizes how AI applications connect to data sources.

In addition to offering remote MCP servers, Google Cloud
offers several solutions for publishing your own MCP servers. Users connect to
published MCP servers over HTTP and can authenticate and interact with them
according to the MCP specification. For more information, see
[MCP server publishing](https://docs.cloud.google.com/mcp/overview#mcp-publishing).

## How MCP works

MCP lets an AI application communicate with external services through a
standardized set of components:

MCP server
:   A program that exposes capabilities of a service, like an API or database, to
    AI applications through standardized MCP interfaces.

MCP host
:   The main AI application that you're using or building---for example,
    Claude, VS Code, Gemini CLI, or Cursor IDE.

MCP client
:   A software component within the MCP host that handles communication between
    your AI application and the MCP server.

### Local versus remote MCP servers

*Local* MCP servers typically run on your local machine and use the standard
input and output streams (stdio) for communication between services on the same
device.

*Remote* MCP servers run on the service's infrastructure and offer an HTTP
endpoint to AI applications for communication between the AI MCP client and the
MCP server.

For more information, see [MCP architecture](https://modelcontextprotocol.io/docs/learn/architecture).

## Google and Google Cloud remote MCP servers

Google and Google Cloud remote MCP servers have the following features and
benefits:

- **MCP discovery** : Once a server is configured for use in your project, AI applications can discover the server's capabilities, like tools, prompts, and resources, by using MCP discovery methods like [`tools/list`](https://modelcontextprotocol.io/specification/2025-06-18/server/tools#listing-tools), [`prompts/list`](https://modelcontextprotocol.io/specification/2025-06-18/server/prompts#listing-prompts), and [`resources/list`](https://modelcontextprotocol.io/specification/2025-06-18/server/resources#listing-resources). You can manage MCP servers in [Agent Registry](https://docs.cloud.google.com/agent-registry/overview).
- **Toolsets**: Select a specific toolset from an MCP server to prevent overloading your agent's context with too many tools.
- **Administrative controls**: Control MCP use with Identity and Access Management (IAM) policies.
- **Authentication and Authorization** : Google and Google Cloud remote MCP servers are compliant with the [MCP authorization specification](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization). Only agents, MCP clients, and end-users with established identities can authenticate and use MCP tools, prompts, and resources.
- **Fine-grained authorization policies**: Use IAM to control who can do what on which Google Cloud resources with MCP tools, prompts, and resources.
- **Model Armor**: Scan MCP calls and responses to help protect against security risks and enforce your AI security policies.

For a list of Google and Google Cloud remote MCP servers, see
[Supported products](https://docs.cloud.google.com/mcp/supported-products).

## MCP server features

MCP servers support the following features:

- **Tools**: Let AI take actions like calling APIs.
- **Prompts**: Predefined inputs provided by MCP servers that can help users interact with tools more effectively---you can use prompts provided by a server, but you can't define your own.
- **Resources**: Allow servers to share data that provides context to language models, such as files, database schemas, or application-specific information.

For more information, see [Manage MCP servers](https://docs.cloud.google.com/mcp/manage-mcp-servers).

## Authentication

To authenticate to Google and Google Cloud MCP servers that require
authentication, use your Google credentials or create an identity for your AI
application. For more information, see
[Authenticate to MCP servers](https://docs.cloud.google.com/mcp/authenticate-mcp).

## Control access with Identity and Access Management

Identity and Access Management (IAM) deny policies help you secure Google Cloud MCP
servers. For more information, see
[Control MCP use with IAM](https://docs.cloud.google.com/mcp/control-mcp-use-iam).

## Toolsets

Agents can become slow, confused, and expensive to run when you load too many
tools into context. To help you limit the tools available to your agent,
some Google and Google Cloud MCP servers offer logical groups of MCP tools
called *toolsets* . Each toolset has its own HTTP endpoint and functions as a
virtual MCP server. You can configure a toolset the same way that you configure
an MCP server. For more information about configuring MCP servers, see
[Configure MCP in an AI application](https://docs.cloud.google.com/mcp/configure-mcp-ai-application).

To determine if an MCP server offers toolsets, review the server's MCP reference
documentation linked from our [Supported products](https://docs.cloud.google.com/mcp/supported-products) page.

## Model Armor protection

Model Armor helps secure your agentic AI applications by
sanitizing MCP tool calls and responses. This process mitigates risks such as
prompt injection, sensitive data disclosure, and tool poisoning.

To view a list of MCP servers that support Model Armor, see
[Model Armor supported products](https://docs.cloud.google.com/mcp/model-armor-supported-products). To enable
Model Armor for MCP endpoints, see
[Configure Model Armor protection for Google Cloud MCP servers](https://docs.cloud.google.com/model-armor/model-armor-mcp-google-cloud-integration).

## MCP Publishing

If you want to create and publish your own MCP server for other people to use,
then you can use the following MCP publishing options, depending on your
needs:

- [Apigee](https://docs.cloud.google.com/apigee/docs/api-platform/get-started/what-apigee) users with an existing API can publish their API as an MCP server.
- Developers who want to create their own MCP server can [host it on Cloud Run](https://docs.cloud.google.com/run/docs/host-mcp-servers).

## What's next

- [Explore supported products](https://docs.cloud.google.com/mcp/supported-products).
- [Enable or disable MCP servers](https://docs.cloud.google.com/mcp/enable-disable-mcp-servers).