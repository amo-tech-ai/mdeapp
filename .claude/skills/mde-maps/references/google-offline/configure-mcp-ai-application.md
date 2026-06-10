---
doc_type: google_offline_mirror
parent_skill: mde-maps
topic: configure-mcp-ai-application
description: "Offline Google Maps Platform doc export (configure-mcp-ai-application). Tertiary: verify against live developers.google.com and curated references/*.md."
---

You can configure most AI applications to use remote MCP servers. This guide
provides general information on MCP configuration as well as detailed
configuration instructions for several common MCP AI applications.

## Before you begin

<br />

### Required roles


To get the permission that
you need to make tool calls to Google and Google Cloud MCP tools,

ask your administrator to grant you the
[MCP Tool User](https://docs.cloud.google.com/iam/docs/roles-permissions/mcp#mcp.toolUser) (`roles/mcp.toolUser`) IAM role on the Google Cloud project.


For more information about granting roles, see [Manage access to projects, folders, and organizations](https://docs.cloud.google.com/iam/docs/granting-changing-revoking-access).


This predefined role contains the
`mcp.tools.call`
permission,
which is required to
make tool calls to Google and Google Cloud MCP tools.


You might also be able to get
this permission
with [custom roles](https://docs.cloud.google.com/iam/docs/creating-custom-roles) or
other [predefined roles](https://docs.cloud.google.com/iam/docs/roles-overview#predefined).

## Enable the product or service

You can use MCP to connect to [supported products](https://docs.cloud.google.com/mcp/supported-products) when the
product API is enabled in your Google Cloud project.

To connect to a supported product through MCP, enable the product API:

#### Roles required to enable APIs

To enable APIs, you need the Service Usage Admin IAM role
(`roles/serviceusage.serviceUsageAdmin`), which contains the
`serviceusage.services.enable` permission.
[Learn how to grant roles](https://docs.cloud.google.com/iam/docs/granting-changing-revoking-access).

    gcloud services enable SERVICE_NAME

Replace <var translate="no">SERVICE_NAME</var> with the service name of the product you want to
use through MCP. For example The BigQuery service name is
`bigquery.googleapis.com`.

## Configure an MCP client to use the remote MCP server

AI applications and agents, such as Claude or Gemini CLI, can
instantiate an MCP client that connects to a single MCP server. An AI
application can have multiple clients that connect to different MCP servers. To
connect to a remote MCP server, the MCP client must know at a minimum the URL of
the remote MCP server.

### Use toolsets

Agents can be overloaded by too many tools. To decrease the number of tools
available to your agent, you can use *toolsets*. Toolsets contain a subset of
tools from an MCP server, and have their own unique endpoint. Your agent treats
a toolset as an MCP server.

For example, a single MCP server might have 60 or more tools. If you use a
toolset for the same MCP server with 15 tools, then you can use the MCP server
without overloading your agent.

To configure a toolset, use the toolset endpoint in your MCP configuration
instead of the MCP server endpoint.

### General guidance for all MCP clients

In your AI application, look for a way to connect to a remote MCP server. You
are prompted to enter details about the server, such as its name and URL.

For the Google Cloud MCP servers MCP server, enter the following as
required:

- **Server name**: the name of the remote MCP server or toolset---for example, "BigQuery MCP server".
- **Server or toolset URL** or **Endpoint** : the MCP endpoint of the server or toolset you want to use---for example, `https://bigquery.googleapis.com/mcp` or `https://aiplatform.googleapis.com/mcp/models`.
- **Transport**: HTTP
- **Authentication details** : Depending on how you want to authenticate, you can enter your Google Cloud credentials, your OAuth client ID and secret, or an agent identity and credentials. For more information on authentication, see [Authenticate to MCP servers](https://docs.cloud.google.com/mcp/authenticate-mcp).
- **OAuth scope** : the [OAuth 2.0 scope](https://developers.google.com/identity/protocols/oauth2/scopes) that you want to use when connecting to the MCP server---for example, `https://www.googleapis.com/auth/bigquery`. Different scopes are required for different levels of access. To determine the required scope for the MCP server, refer to the server's documentation.

### Client-specific guidance

For application-specific instructions consult the following sections.

### Antigravity

To add a Google or Google Cloud remote MCP server to Antigravity, follow the instructions in
[Antigravity Editor: MCP Integration](https://antigravity.google/docs/mcp).

### Gemini CLI

To add a Google or Google Cloud remote MCP server to your Gemini CLI,
configure it as an extension and
[authenticate](https://geminicli.com/docs/tools/mcp-server/#authentication-provider-type)
using Google Application Default Credentials (ADC).

1. Use your gcloud CLI credentials to configure your [Application Default Credentials (ADC)](https://docs.cloud.google.com/docs/authentication/application-default-credentials):

   ```bash
   gcloud auth application-default login
   ```

   If the MCP server you're using requires OAuth scopes beyond the default
   `https://www.googleapis.com/auth/cloud-platform` scope, then
   use the
   [`--scopes` flag](https://docs.cloud.google.com/sdk/gcloud/reference/auth/application-default/login#--scopes)
   to include those scopes.
2. Create an extension file in the following location:
   `~/.gemini/extensions/EXT_NAME/gemini-extension.json` where
   `~/` is your home directory and <var translate="no">EXT_NAME</var> is the name you want to
   give the extension.

3. Save the following content in your extension file:

   ```json
   {
     "name": "EXT_NAME",
     "version": "1.0.0",
     "mcpServers": {
       "MCP_SERVER_NAME": {
         "httpUrl": "MCP_ENDPOINT",
         "authProviderType": "google_credentials",
         "oauth": {
           "scopes": ["SCOPE"]
         },
         "timeout": 30000,
         "headers": {
           "x-goog-user-project": "PROJECT_ID"
         }
       }
     }
   }
   ```

   Replace the following:
   - <var translate="no">EXT_NAME</var>: the name of the extension.
   - <var translate="no">MCP_SERVER_NAME</var>: the name of the MCP server. MCP server names must start with a letter or an underscore, and must only contain alphanumeric characters (a-z, A-Z, 0-9), underscores (_), dots (.), colons (:), or dashes (-), with a maximum length of 64.
   - <var translate="no">MCP_ENDPOINT</var>: the endpoint of the MCP server---for example, `https://bigquery.googleapis.com/mcp`.
   - <var translate="no">SCOPE</var>: the [OAuth scope](https://developers.google.com/identity/protocols/oauth2/scopes) for the MCP server.
   - <var translate="no">PROJECT_ID</var>: your Google Cloud project ID.

   For services that don't require OAuth scopes, you can omit the
   `"oauth"` section.

   For services like [Antigravity](https://antigravity.google/docs/get-started)
   that support bearer tokens, add the `"Authorization"` parameter to the
   `"headers"` section of the JSON file:

   ```json
   {
     ...
         "headers": {
           "Authorization": "Bearer YOUR_TOKEN",
           "x-goog-user-project": "PROJECT_ID"
   }
   ```

   Replace <var translate="no">YOUR_TOKEN</var> with your bearer token. You can generate a
   token by running the
   [`gcloud auth application-default print-access-token` command](https://docs.cloud.google.com/sdk/gcloud/reference/auth/application-default/print-access-token).
4. Start Gemini CLI:

   ```bash
   gemini
   ```
5. Run `/mcp` to view your configured MCP server and its tools.

   The response is similar to the following:

   ```
   Configured MCP servers:
   🟢 BigQuery (from bigquery-mcp) - Ready (5 tools)
     Tools:
     - execute_sql
     - get_dataset_info
     - get_table_info
     - list_dataset_ids
     - list_table_ids
   ```

The remote MCP server is ready to use in Gemini CLI.

### Claude.ai

You must have the Claude Enterprise, Pro, Max, or Team plan to configure Google
and Google Cloud MCP servers in Claude.ai. For pricing information, see
[Claude Pricing](https://claude.com/pricing).

To add a Google or Google Cloud remote MCP server to Claude.ai, configure a
custom connector with a OAuth client ID and OAuth client secret:

#### Create an Oauth 2.0 client ID and secret

1. In the Google Cloud console, go to
   **Google Auth Platform \> Clients \> Create client**.

   [Go to Create client](https://console.cloud.google.com/auth/clients/create)

   You are prompted to create a project if you don't have one selected.
2. In the **Application type** list, select **Web application**.

3. In the **Name** field, enter a name for your application.

4. In the **Authorized redirect URIs** section, click **+ Add URI** , and then
   add `https://claude.ai/api/mcp/auth_callback` in the **URIs** field.

5. Click **Create** . The client is created. To access the client ID,
   in the Google Cloud console, go to **Google Auth Platform \> Clients**.

6. In the **OAuth 2.0 client IDs** list, select the client name.

7. In the **Client secrets** section, copy the **Client secret** and save it
   in a secure place. You can only copy it once. If you lose it, delete the
   secret and create a new one.

   > [!CAUTION]
   > **Caution:** treat client secrets like passwords and store them in a secure place.

#### Create a custom connector in Claude.ai

Follow the instructions for the Claude plan that you're using:

### Enterprise and Team

1. In Claude.ai, navigate to **Admin settings \> Connectors**.

2. Click **Add custom connector**.

3. In the **Add custom connector** dialog, enter the following:

   - **Server name**: a human readable name for the server.
   - **Remote MCP server URL** : the MCP endpoint for the Google or Google Cloud MCP server. For a list of available servers and their endpoints, see [Supported products](https://docs.cloud.google.com/mcp/supported-products).
4. Expand the **Advanced settings** menu and then enter the following:

   - **OAuth client ID**: the OAuth 2.0 client ID you created.
   - **OAuth client secret** : the secret for your OAuth 2.0 client. To retrieve the secret, go to **Google Auth Platform \> Clients** and then select the OAuth client ID you created. In the **Client secrets** section, click to copy the **Client secret**.
5. Click **Add**.

   The custom connector is created.
6. Open the **Tools** menu and enable the connector.

   Claude.ai can use the MCP server.

### Pro and Max

1. In Claude.ai, navigate to **Settings \> Connectors**.

2. Click **Add custom connector**.

3. In the **Add custom connector** dialog, enter the following:

   - **Server name**: a human readable name for the server.
   - **Remote MCP server URL** : the MCP endpoint for the Google or Google Cloud MCP server. For a list of available servers and their endpoints, see [Supported products](https://docs.cloud.google.com/mcp/supported-products).
4. Expand the **Advanced settings** menu and then enter the following:

   - **OAuth client ID**: the OAuth 2.0 client ID you created.
   - **OAuth client secret** : the secret for your OAuth 2.0 client. To retrieve the secret, go to **Google Auth Platform \> Clients** and then select the OAuth client ID you created. In the **Client secrets** section, click to copy the **Client secret**.
5. Click **Add**.

   The custom connector is created.
6. Open the **Tools** menu and enable the connector.

   Claude.ai can use the MCP server.

### ChatGPT

You must have a [ChatGPT Business subscription](https://chatgpt.com/business/)
to use Google and Google Cloud MCP servers with ChatGPT.

To add a Google or Google Cloud remote MCP server to ChatGPT, create a
Google OAuth 2.0 client ID and secret, and then add the MCP server as an
App in ChatGPT.

#### Create an Oauth 2.0 client ID and secret

1. In the Google Cloud console, go to
   **Google Auth Platform \> Clients \> Create client**.

   [Go to Create client](https://console.cloud.google.com/auth/clients/create)

   You are prompted to create a project if you don't have one selected.
2. In the **Application type** list, select **Web application**.

3. In the **Name** field, enter a name for your application.

4. In the **Authorized JavaScript origins** section, click **+ Add URI** , and then
   enter `https://chatgpt.com` in the **URIs** field.

5. In the **Authorized redirect URIs** section, click **+ Add URI** , and then
   enter `https://chatgpt.com/connector_platform_oauth_redirect` in the **URIs** field.

6. Click **Create**. The client is created.

   The **OAuth 2.0 client created** dialog opens.
7. In the **Client secrets** section, copy the **Client secret** and save it
   in a secure place. You can only copy it once. If you lose it, delete the
   secret and create a new one.

   > [!CAUTION]
   > **Caution:** treat client secrets like passwords and store them in a secure place.

#### Add the MCP server as an app in ChatGPT

1. Sign in to ChatGPT.
2. Turn on Developer mode:
   1. In ChatGPT, click your username to open the **Profile menu** , and then select **Settings**.
   2. In the Settings menu, select **Apps** , and then click **Advanced settings**.
   3. In the **Advanced settings** , click the **Developer mode** toggle to the on position.
3. In **Settings** \> **Apps** , click the **Create app** button.
4. In the **New app** dialog, enter the following information:
   - **Name**: the name of the MCP server.
   - **Description**: an optional description of the MCP server.
   - **MCP server URL** : the MCP endpoint for the server you want to use---for example, `https://compute.googleapis.com/mcp`.
   - **Authentication** :
     - In the **Authentication** menu, select **OAuth**.
     - In the **OAuth client ID** field, enter your Google OAuth client ID.
     - In the **OAuth secret** field, enter your Google OAuth client secret.
   - Confirm that you understand the risk associated with MCP server use, and then click **Create**.

The MCP server is displayed in the **Apps** menu, and is ready for
use through chat prompts.

### Visual Studio Code

To configure an MCP server in Visual Studio Code (VS Code), do the following:

1. Install [VS Code](https://code.visualstudio.com/).
2. Open VS Code and then open the **Command palette** by pressing `Ctrl`+`Shift`+`P` (Windows or Linux) or `Cmd`+`Shift`+`P` (macOS).
3. In the Command palette, select **MCP: Add Server...**.
4. Select **HTTP (HTTP or server-sent events)**.
5. Enter the MCP endpoint of the server that you want to connect to and then press `Enter`. For example, `https://run.googleapis.com/mcp`
6. Enter a name for the server and then press `Enter`.
7. If you want to make the MCP server available to all workspaces, select **Global** .
   If you want to make the MCP server available to only the current workspace, select
   **Workspace**.

   Your `mcp.json` file is updated with the server information.

#### Authenticate to the MCP server

You can use an Oauth client ID and secret or
[Application Default Credentials](https://docs.cloud.google.com/docs/authentication#adc)
(ADC) to authenticate to the MCP server.

**Note**: If you use ADC for authentication, then you need to regenerate your access token
every hour.

#### OAuth Client ID

1. In VS Code, open the Chat pane by pressing `Ctrl`+`Alt`+`I` (on Windows or linux) or `Shift`+`Command`+`I` (macOS).
2. In the Chat pane, select **Set agent** , and then select **Agent**.

3. The first time you use the MCP server, you'll be prompted to set up authentication. To use the MCP server, enter a prompt in chat that uses one of the available tools. If you're not sure which tool to use, then you can ask the agent to list the tools for the server.<br />

   For example, you can enter the following prompt to list the available tools:
   "List the tools available for <var translate="no">SERVER_NAME</var>", where <var translate="no">SERVER_NAME</var>
   is the name you gave the MCP server.

   The **Dynamic client registration not supported** dialog opens.
4. Click **copy URIs and proceed**.
5. You won't need the copied URLs, so there's no need to record them.

<!-- -->

1. In the Google Cloud console, go to
   **Google Auth Platform \> Clients \> Create client**.

   [Go to Create client](https://console.cloud.google.com/auth/clients/create)

   You are prompted to create a project if you don't have one selected.
2. In the **Application type** list, select **Desktop app**.

3. In the **Name** field, enter a name for your application.

4. Click **Create**. The client is created.

   The **OAuth 2.0 client created** dialog opens.
5. In the **Client secrets** section, copy the **Client secret** and save it
   in a secure place. You can only copy it once. If you lose it, delete the
   secret and create a new one.

   > [!CAUTION]
   > **Caution:** treat client secrets like passwords and store them in a secure place.

##### Configure VS Code to use your OAuth client ID and secret

1. In VS Code, enter your OAuth client ID and then press `Enter`.
2. When prompted, enter your OAuth client secret and then press `Enter`.
3. In the **VS Code** dialog that opens, click **Allow**.

   The agent completes the MCP tool call and responds in chat.

#### Clear cached credentials

VS Code caches dynamic authentication providers to streamline your login experience. If you
previously entered credentials, and want to enter new credentials, you must clear the cached
credentials.

To clear cached credentials, do the following:

1. In VS Code, open the **Command palette** by pressing `Ctrl`+`Shift`+`P` (on Windows or linux) or `Command`+`Shift`+`P` (macOS).
2. In the **Command palette** , select
   **Authentication: Remove dynamic authentication providers**, and then select the client ID
   that you want to remove your cached credentials for.

3. Reload VS Code and connect to a remote MCP server again.

   You are prompted to enter
   your OAuth Client ID and secret.

#### ADC

1. Set up [Application default credentials (ADC)](https://docs.cloud.google.com/docs/authentication/provide-credentials-adc) for your environment.
2. If you're using a local shell, then create local authentication credentials for your
   user account:

   ```
   gcloud auth application-default login
   ```
3. Generate an application default token by running the following command:

   ```
   gcloud auth application-default print-access-token
   ```
4. In your `mcp.json` file, add the following to your MCP server entry:

   ```
   "headers": {
         "Authorization": "Bearer TOKEN"
         "x-goog-user-project": "PROJECT_ID"
       }
   ```

   Replace the following:


   - <var class="edit" scope="TOKEN" translate="no">TOKEN</var>: the application default token.

   - <var class="edit" scope="PROJECT_ID" translate="no">PROJECT_ID</var>: your project ID.

   The following example shows an MCP server entry that uses ADC for authentication:

   ```
   {
     "servers": [
       {
         "name": "My Cloud Run MCP Server",
         "uri": "https://run.googleapis.com/mcp",
         "headers": {
           "Authorization": "Bearer nYkwroEYjN4Fw1TTNhe69F4rR6o9bvrR1P4U1l0DVq9p81sN0",
           "x-goog-user-project": "my-project"
         }
       }
     ]
   }
   ```
5. In VS Code, open the Chat pane by pressing `Ctrl`+`Alt`+`I` (on Windows or linux) or `Shift`+`Command`+`I` (macOS).
6. In the Chat pane, select **Set agent** , and then select **Agent**.

7. Send a prompt to the agent that uses one of the available MCP tools. If you're not sure which tool to use, then you can ask the agent to list the tools for the MCP server.

## What's next

- [Learn about AI security and safety](https://docs.cloud.google.com/mcp/ai-security-safety).
- Explore different methods to [authenticate to Google and Google Cloud remote MCP servers](https://docs.cloud.google.com/mcp/authenticate-mcp).