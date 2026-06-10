---
title: Mastra + Supabase auth
description: Load when wiring Supabase auth to Mastra HTTP server.
parent: mastra
impact: MEDIUM
impactDescription: @mastra/auth-supabase server integration
tags: mastra, supabase, auth
---

# Supabase

The `@mastra/auth-supabase` package provides authentication for Mastra using Supabase Auth. It verifies incoming requests using Supabase's authentication system and integrates with the Mastra server using the `auth` option.

## Prerequisites

This example uses Supabase Auth. Make sure to add your Supabase credentials to your `.env` file and ensure your Supabase project is properly configured.

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

> **Note:** Review your Supabase Row Level Security (RLS) settings to ensure proper data access controls.

## Installation

Before you can use the `MastraAuthSupabase` class you have to install the `@mastra/auth-supabase` package.

**npm**:

```bash
npm install @mastra/auth-supabase@latest
```

**pnpm**:

```bash
pnpm add @mastra/auth-supabase@latest
```

**Yarn**:

```bash
yarn add @mastra/auth-supabase@latest
```

**Bun**:

```bash
bun add @mastra/auth-supabase@latest
```

## Usage example

```typescript
import { Mastra } from '@mastra/core'
import { MastraAuthSupabase } from '@mastra/auth-supabase'

export const mastra = new Mastra({
  server: {
    auth: new MastraAuthSupabase({
      url: process.env.SUPABASE_URL,
      anonKey: process.env.SUPABASE_ANON_KEY,
    }),
  },
})
```

> **Info:** The default `authorizeUser` method checks the `isAdmin` column in the `users` table in the `public` schema. To customize user authorization, provide a custom `authorizeUser` function when constructing the provider.
>
> Visit [MastraAuthSupabase](https://mastra.ai/reference/auth/supabase) for all available configuration options.

## Client-side setup

When using Supabase auth, you'll need to retrieve the access token from Supabase on the client side and pass it to your Mastra requests.

### Retrieving the access token

Use the Supabase client to authenticate users and retrieve their access token:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('<supabase-url>', '<supabase-key>')

const authTokenResponse = await supabase.auth.signInWithPassword({
  email: "<user's email>",
  password: "<user's password>",
})

const accessToken = authTokenResponse.data?.session?.access_token
```

> **Note:** Refer to the [Supabase documentation](https://supabase.com/docs/guides/auth) for other authentication methods like OAuth, magic links, and more.

## Configuring `MastraClient`

When `auth` is enabled, all requests made with `MastraClient` must include a valid Supabase access token in the `Authorization` header:

```typescript
import { MastraClient } from '@mastra/client-js'

export const mastraClient = new MastraClient({
  baseUrl: 'https://<mastra-api-url>',
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
})
```

> **Info:** The access token must be prefixed with `Bearer` in the Authorization header.
>
> Visit [Mastra Client SDK](https://mastra.ai/docs/server/mastra-client) for more configuration options.

### Making authenticated requests

Once `MastraClient` is configured with the Supabase access token, you can send authenticated requests:

**React**:

```tsx
import { mastraClient } from '../../lib/mastra-client'

export const TestAgent = () => {
  async function handleClick() {
    const agent = mastraClient.getAgent('weatherAgent')

    const response = await agent.generate("What's the weather like in New York")

    console.log(response)
  }

  return <button onClick={handleClick}>Test Agent</button>
}
```

**cURL**:

```bash
curl -X POST http://localhost:4111/api/agents/weatherAgent/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-supabase-access-token>" \
  -d '{
    "messages": "Weather in London"
  }'
```# MastraAuthSupabase class

The `MastraAuthSupabase` class provides authentication for Mastra using Supabase Auth. It verifies incoming requests using Supabase's authentication system and integrates with the Mastra server using the `auth` option.

## Usage example

```typescript
import { Mastra } from '@mastra/core'
import { MastraAuthSupabase } from '@mastra/auth-supabase'

export const mastra = new Mastra({
  server: {
    auth: new MastraAuthSupabase({
      url: process.env.SUPABASE_URL,
      anonKey: process.env.SUPABASE_ANON_KEY,
    }),
  },
})
```

## Constructor parameters

**url** (`string`): The URL of your Supabase project. Can be found in your Supabase project settings. (Default: `process.env.SUPABASE_URL`)

**anonKey** (`string`): The anonymous/public key for your Supabase project. Used for client-side authentication. (Default: `process.env.SUPABASE_ANON_KEY`)

**name** (`string`): Custom name for the auth provider instance.

**authorizeUser** (`(user: User, request: HoneRequest) => Promise<boolean> | boolean`): Custom authorization function to determine if a user should be granted access. Called after token verification. By default, checks the 'isAdmin' column in the 'users' table.

## Related

[MastraAuthSupabase](https://mastra.ai/docs/server/auth/supabase)