---
parent: mde-supabase
name: supabase-edge-functions
description: Write, configure, deploy, test, and debug Supabase Edge Functions. Covers the full lifecycle: modern Deno.serve patterns, per-function config.toml, secrets, routing frameworks, auth modes, background tasks, WebSockets, WASM, AI inference, recursive functions, CI/CD, logging, and platform limits. Authoritative against live Supabase docs (verified 2026-05-05).
triggers:
  - edge function
  - supabase function
  - Deno.serve
  - deno function
  - deploy function
  - supabase functions deploy
  - edge fn
  - verify_jwt
  - background task
  - waitUntil
  - EdgeRuntime
---

# Supabase Edge Functions — Complete Reference

> **Runtime**: Deno (V8 isolate per invocation, stateless, ESZip bundle format)
> **Language**: TypeScript / JavaScript (ES modules)
> **Verified against**: Supabase docs 2026-05-05

---

## 1. Modern Function Patterns

### ⚠️ Migration: `serve` → `Deno.serve` (REQUIRED)

The old `serve` from `https://deno.land/std@0.168.0/http/server.ts` is **deprecated**. All new functions use the built-in global:

```ts
// ❌ OLD (deprecated — still works but avoid)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
serve(async (req) => { ... })

// ✅ NEW (current standard — no import needed)
Deno.serve(async (req) => {
  return new Response("Hello World!")
})
```

### Minimal Modern Template

```ts
// supabase/functions/hello-world/index.ts
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) })
  }

  try {
    const { name } = await req.json()
    return Response.json({ message: `Hello ${name ?? "World"}!` })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
})
```

### ES Module Wrapper Pattern (Modern — `@supabase/server` SDK)

```tsx
import { withSupabase } from "npm:@supabase/server"

export default {
  fetch: withSupabase({ allow: "user" }, async (req, ctx) => {
    // ctx.userClaims, ctx.supabase available
    return Response.json({ email: ctx.userClaims?.email })
  }),
}
```

---

## 2. Project Structure

```
supabase/
├── config.toml                     ← per-function settings
└── functions/
    ├── deno.json                   ← shared imports (optional)
    ├── _shared/                    ← shared code (_underscore = not deployed alone)
    │   ├── http.ts                 ← getCorsHeaders, jsonResponse, errorBody
    │   ├── supabase-clients.ts     ← getUserClient, getServiceClient
    │   └── gemini.ts               ← AI helpers
    ├── hello-world/
    │   ├── index.ts
    │   └── deno.json               ← function-specific imports (preferred)
    └── another-function/
        ├── index.ts
        └── deno.json
```

**Conventions:**
- Hyphenated function names (URL-friendly)
- `_shared/` prefix prevents standalone deployment
- Each function has its own `deno.json` for isolation (preferred over shared `import_map.json`)
- Tests in **`supabase/functions/tests/`** using Deno conventions: **`foo_test.ts`** or **`foo.test.ts`** auto-discovered by `deno test ./supabase/functions/tests/`. Plain **`foo-test.ts`** is **not** discovered unless listed explicitly (Supabase doc examples sometimes use that name — pass the file path).
- **Integration tests** (`createClient` + `functions.invoke`, `supabase functions serve`): [Mansueli — Testing Supabase Edge Functions with Deno Test](https://blog.mansueli.com/testing-supabase-edge-functions-with-deno-test). Prefer **`npm:@supabase/supabase-js@2`** + **`jsr:@std/assert`** over blog’s `esm.sh` / `deno.land/std` `serve`. This repo: **`SUPABASE_FUNCTIONS_INTEGRATION=1`** + `functions_invoke_integration_test.ts`.

---

## 3. Configuration (`supabase/config.toml`)

```toml
[functions.my-function]
verify_jwt    = false              # disable for webhooks, public endpoints, custom auth
import_map    = './functions/my-function/import_map.json'  # custom import map
entrypoint    = './functions/my-function/index.js'         # custom entrypoint (.ts/.js/.tsx/.jsx/.mjs)

[functions.wasm-function]
static_files  = ["./functions/wasm-add/pkg/*"]            # WASM assets (requires Docker build)

# WebSocket / background task testing
[edge_runtime]
policy = "per_worker"             # disables hot-reload; required for WS + waitUntil tests
```

### `verify_jwt` Decision Table

| Endpoint type | Setting | Why |
|---|---|---|
| Frontend app calls (user JWT) | `true` (default) | Platform validates JWT before handler |
| Stripe / external webhooks | `false` | Stripe sends no JWT; verify signature in-handler |
| Staff scanner (custom JWT) | `false` | Custom JWT signed by STAFF_LINK_SECRET, not Supabase |
| pg_cron calls | `false` | No JWT; use shared secret in-handler |
| Public endpoints | `false` | No auth at all |

**mdeai.co config.toml must include:**
```toml
[functions.ticket-payment-webhook]
verify_jwt = false

[functions.sponsor-payment-webhook]
verify_jwt = false

[functions.ticket-validate]
verify_jwt = false

[functions.rules-engine]
verify_jwt = false
```

---

## 4. Dependencies (`deno.json`)

Prefer `npm:` prefix imports. Each function should have its own `deno.json`.

```json
{
  "imports": {
    "zod":          "npm:zod@3.23.8",
    "stripe":       "npm:stripe@14.21.0?target=denonext",
    "supabase-js":  "npm:@supabase/supabase-js@2",
    "hono":         "jsr:@hono/hono",
    "@std/assert":  "jsr:@std/assert@1"
  }
}
```

**Import sources (all supported):**
- `npm:package@version` ← preferred for npm packages
- `jsr:@scope/package` ← Deno-native JSR registry
- `node:module` ← Node.js built-in APIs
- `https://esm.sh/...` ← CDN (works, but npm: preferred)
- `https://deno.land/x/...` ← Deno third-party

**Private NPM registries** (CLI 1.207.9+):
```
# .npmrc inside function directory
@myorg:registry=https://npm.registryhost.com
//npm.registryhost.com/:_authToken=VALID_AUTH_TOKEN
```

---

## 5. Secrets & Environment Variables

### Automatic Secrets (always available)

```
SUPABASE_URL               # API gateway endpoint
SUPABASE_DB_URL            # Direct PostgreSQL connection
SUPABASE_ANON_KEY          # Legacy anon key (use SUPABASE_PUBLISHABLE_KEYS for new projects)
SUPABASE_SERVICE_ROLE_KEY  # Legacy service role key (use SUPABASE_SECRET_KEYS for new)
SUPABASE_PUBLISHABLE_KEYS  # JSON dict of publishable keys: JSON.parse(...)['default']
SUPABASE_SECRET_KEYS       # JSON dict of secret keys: JSON.parse(...)['default']
SUPABASE_JWKS              # JSON Web Key Set for JWT verification
```

**Context variables:**
```
SB_REGION          # Invocation region
SB_EXECUTION_ID    # UUID of function instance
DENO_DEPLOYMENT_ID # {project_ref}_{function_id}_{version}
```

### Accessing Secrets

```ts
// Single secret
const apiKey = Deno.env.get("STRIPE_SECRET_KEY")!

// New multi-key pattern (future-proof)
const SUPABASE_SECRET_KEYS = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")!)
const serviceKey = SUPABASE_SECRET_KEYS["default"]
```

### CLI Secrets Management

```bash
# Set individual secret
supabase secrets set STRIPE_SECRET_KEY=sk_live_...

# Set from .env file
supabase secrets set --env-file .env

# List all secret names (values hidden)
supabase secrets list

# Unset a secret
supabase secrets unset STRIPE_SECRET_KEY

# Secrets available IMMEDIATELY — no redeploy needed
```

### Limits

| Item | Limit |
|---|---|
| Secrets per project | 100 max |
| Secret name length | 256 chars |
| Secret value size | 48 KiB |
| Name restriction | Cannot start with `SUPABASE_` |

### Local Development

```bash
# Auto-loaded from supabase/functions/.env
supabase functions serve my-function

# Or specify custom path
supabase functions serve my-function --env-file .env.local
```

---

## 6. Authentication Patterns

### ⚠️ Critical: API Keys Go in `apikey` Header, Not `Authorization`

New API keys (`sb_publishable_*`) are **not JWTs** and will fail if sent as `Authorization: Bearer sb_publishable_...`. Always use:
```
apikey: sb_publishable_...
Authorization: Bearer <user-jwt>
```

### Pattern 1: Authenticated User (verify_jwt = true, default)

```ts
import { createClient } from "npm:@supabase/supabase-js@2"

Deno.serve(async (req) => {
  // Platform has already validated the JWT before this runs
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
  )
  // supabase client now enforces RLS as the authenticated user
  const { data: { user } } = await supabase.auth.getUser()
  return Response.json({ email: user?.email })
})
```

### Pattern 2: Service-to-Service (verify_jwt = false)

```ts
Deno.serve(async (req) => {
  // Validate incoming secret key manually
  if (req.headers.get("apikey") !== Deno.env.get("INTERNAL_AUTOMATIONS_KEY")) {
    return Response.json({ error: "forbidden" }, { status: 401 })
  }
  // Use service client (bypasses RLS)
  const svc = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )
  return Response.json({ ok: true })
})
```

### Pattern 3: External Webhook (verify_jwt = false)

```ts
import Stripe from "npm:stripe@14.21.0?target=denonext"

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!)

Deno.serve(async (req) => {
  const signature = req.headers.get("stripe-signature") ?? ""
  const body = await req.text()         // must read as text BEFORE parsing
  try {
    stripe.webhooks.constructEvent(body, signature, Deno.env.get("STRIPE_WEBHOOK_SECRET")!)
  } catch {
    return new Response("bad signature", { status: 400 })
  }
  return Response.json({ received: true })
})
```

### Pattern 4: Custom JWT (verify_jwt = false) — e.g. staff scanner

```ts
import { create, verify } from "https://deno.land/x/djwt@v3.0.2/mod.ts"

Deno.serve(async (req) => {
  const staffSecret = Deno.env.get("STAFF_LINK_SECRET")!
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") ?? ""

  try {
    const payload = await verify(token, staffSecret)
    // validated — proceed
  } catch {
    return Response.json({ error: "Invalid staff token" }, { status: 401 })
  }
  return Response.json({ ok: true })
})
```

### Pattern 5: Modern `@supabase/server` SDK

```ts
import { withSupabase, createSupabaseContext } from "npm:@supabase/server"

// Simple — throws on auth failure
export default {
  fetch: withSupabase({ allow: "user" }, async (req, ctx) => {
    return Response.json({ email: ctx.userClaims?.email })
  }),
}

// Combined modes
export default {
  fetch: withSupabase({ allow: ["user", "secret:automations"] }, async (req, ctx) => {
    if (ctx.authType === "user") { /* user path */ }
    return Response.json({ ok: true })
  }),
}

// Custom error handling
export default {
  fetch: async (req: Request) => {
    const { data: ctx, error } = await createSupabaseContext(req, { allow: "user" })
    if (error) {
      return Response.json({ message: error.message, code: error.code }, { status: error.status })
    }
    return Response.json({ message: `hello ${ctx.userClaims?.email}` })
  },
}
```

| `allow` value | Accepts |
|---|---|
| `'user'` | Valid user JWT on `Authorization` header |
| `'secret:<name>'` | Named secret key on `apikey` header |
| `'always'` | Any caller, no check |

---

## 7. Standard Request Lifecycle (mdeai.co pattern)

```ts
import { z } from "npm:zod@3.23.8"
import { getCorsHeaders, errorBody, jsonResponse } from "../_shared/http.ts"
import { getServiceClient, getUserId } from "../_shared/supabase-clients.ts"

const requestSchema = z.object({
  name: z.string().min(1),
})

Deno.serve(async (req: Request) => {
  // 1. CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) })
  }

  // 2. Auth
  const authHeader = req.headers.get("Authorization")
  if (!authHeader) {
    return jsonResponse(errorBody("UNAUTHORIZED", "Missing Authorization header"), 401, req)
  }
  const userId = await getUserId(authHeader)
  if (!userId) {
    return jsonResponse(errorBody("UNAUTHORIZED", "Invalid token"), 401, req)
  }

  // 3. Input validation
  let body: z.infer<typeof requestSchema>
  try {
    body = requestSchema.parse(await req.json())
  } catch (e) {
    return jsonResponse(errorBody("BAD_REQUEST", String(e)), 400, req)
  }

  // 4. Business logic
  const svc = getServiceClient()
  const { data, error } = await svc.from("my_table").select("*").eq("user_id", userId)
  if (error) {
    return jsonResponse(errorBody("DB_ERROR", error.message), 500, req)
  }

  // 5. Response
  return jsonResponse({ success: true, data }, 200, req)
})
```

---

## 8. Routing (Multi-Endpoint Functions)

Combine related actions in one function to reduce cold starts.

### Hono (Recommended — TypeScript-first)

```ts
import { Hono } from "jsr:@hono/hono"

const functionName = "api"
const app = new Hono().basePath(`/${functionName}`)

app.get("/users",     async (c) => Response.json({ users: [] }))
app.post("/users",    async (c) => { const body = await c.req.json(); return Response.json(body, { status: 201 }) })
app.get("/users/:id", async (c) => Response.json({ id: c.req.param("id") }))

Deno.serve(app.fetch)
```

### Express

```ts
import express from "npm:express@4.18.2"

const app = express()
app.use(express.json())

app.get("/health", (_req, res) => res.json({ ok: true }))
app.post("/process", async (req, res) => { /* ... */ })

Deno.serve(app)
```

### Oak (Deno-native)

```ts
import { Application } from "jsr:@oak/oak@15/application"
import { Router }      from "jsr:@oak/oak@15/router"

const app = new Application()
const router = new Router()

router.post("/items", async (ctx) => { /* ... */ })
router.get("/items/:id", async (ctx) => { /* ... */ })

app.use(router.routes())
app.use(router.allowedMethods())
Deno.serve(app.fetch)
```

**Path prefix rule**: All routes must start with the function name when invoking from outside, e.g. `/api/users` for a function named `api`.

---

## 9. Error Handling

### Server Side

```ts
Deno.serve(async (req) => {
  try {
    const result = await processRequest(req)
    return Response.json({ success: true, data: result })
  } catch (err) {
    console.error("Function error:", err)
    const message = err instanceof Error ? err.message : String(err)
    return Response.json({ success: false, error: { code: "INTERNAL", message } }, { status: 500 })
  }
})
```

### Client Side (supabase-js)

```ts
import { FunctionsHttpError, FunctionsRelayError, FunctionsFetchError } from "@supabase/supabase-js"

const { data, error } = await supabase.functions.invoke("my-function", { body: { foo: "bar" } })

if (error instanceof FunctionsHttpError) {
  const body = await error.context.json()
  console.error("Function error:", body)       // 4xx/5xx from handler
} else if (error instanceof FunctionsRelayError) {
  console.error("Relay error:", error.message) // Network between client and platform
} else if (error instanceof FunctionsFetchError) {
  console.error("Fetch error:", error.message) // Function unreachable
}
```

### Status Code Conventions

| Code | Use case |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Invalid input / bad request |
| 401 | Missing or invalid auth |
| 403 | Valid auth but insufficient permissions |
| 404 | Resource not found |
| 409 | Conflict (duplicate, idempotency) |
| 422 | Valid request but unprocessable (content policy, etc.) |
| 429 | Rate limited — include `Retry-After` header |
| 500 | Internal server error |
| 504 | Gateway timeout (function exceeded wall-clock limit) |

---

## 10. Background Tasks

Fire-and-forget operations that should not block the HTTP response.

```ts
async function sendAnalytics(data: object) {
  // Long-running background work
  await fetch("https://analytics.example.com/track", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

Deno.serve(async (req) => {
  const data = await req.json()

  // Kick off background task — does NOT block response
  EdgeRuntime.waitUntil(sendAnalytics(data))

  return Response.json({ success: true })
})
```

**Rules:**
- `EdgeRuntime.waitUntil(promise)` — do NOT `await` it (that blocks the response)
- Wrap tasks in `try/catch` — unhandled errors don't surface otherwise
- Background tasks are bounded by the function's wall-clock and memory limits
- Add `unhandledrejection` listener for catch-all safety:

```ts
addEventListener("unhandledrejection", (ev) => {
  console.error("Unhandled rejection:", ev.reason)
  ev.preventDefault()
})

addEventListener("beforeunload", (ev) => {
  console.log("Function shutting down:", ev.detail?.reason)
})
```

**config.toml for local testing:**
```toml
[edge_runtime]
policy = "per_worker"
```

---

## 11. WebSockets

```ts
// supabase/functions/ws-server/index.ts

Deno.serve((req) => {
  const upgrade = req.headers.get("upgrade") ?? ""
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("Upgrade required", { status: 400 })
  }

  const { socket, response } = Deno.upgradeWebSocket(req)

  socket.onopen    = ()  => console.log("WS opened")
  socket.onmessage = (e) => { console.log("received:", e.data); socket.send("pong") }
  socket.onerror   = (e) => console.error("WS error:", e.message)
  socket.onclose   = ()  => console.log("WS closed")

  return response
})
```

**Auth for WebSockets** (browsers can't send custom headers):

```ts
// Option A: JWT in query param
const url = new URL(req.url)
const jwt = url.searchParams.get("jwt") ?? ""

// Option B: Sec-WebSocket-Protocol header
const protocol = req.headers.get("Sec-WebSocket-Protocol") ?? ""
const jwt = protocol.startsWith("jwt-") ? protocol.slice(4) : ""
```

**Deploy with JWT verification disabled:**
```bash
supabase functions deploy ws-server --no-verify-jwt
```

**config.toml:**
```toml
[functions.ws-server]
verify_jwt = false

[edge_runtime]
policy = "per_worker"
```

---

## 12. Storage Integration

### Ephemeral Storage (`/tmp`)

- Resets after every invocation
- Free tier: 256 MB | Paid: 512 MB
- Use for temporary files within a single invocation

```ts
await Deno.writeTextFile("/tmp/work.txt", "data")
const content = await Deno.readTextFile("/tmp/work.txt")
```

### Persistent Storage (S3 / Supabase Storage)

```bash
# Set secrets first
supabase secrets set \
  S3FS_ENDPOINT_URL=https://... \
  S3FS_REGION=us-east-1 \
  S3FS_ACCESS_KEY_ID=... \
  S3FS_SECRET_ACCESS_KEY=...
```

```ts
// Files at /s3/BUCKET-NAME/path
await Deno.writeTextFile("/s3/my-bucket/output.csv", csv)
const data = await Deno.readFile("/s3/my-bucket/results.json")
await Deno.mkdir("/s3/my-bucket/sub-dir")
```

### Supabase Storage Upload from Function

```ts
import { createClient } from "npm:@supabase/supabase-js@2"

const svc = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!)

const { error } = await svc.storage
  .from("listing-photos")
  .upload(`${userId}/${filename}`, fileBuffer, {
    contentType: "image/jpeg",
    cacheControl: "3600",
    upsert: false,
  })
```

---

## 13. AI Models (Built-in Inference)

```ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts"  // type hints

Deno.serve(async (req) => {
  // Embeddings
  const embedModel = new Supabase.ai.Session("gte-small")
  const embeddings = await embedModel.run("Hello world", {
    mean_pool: true,
    normalize: true,
  })

  // Text generation (non-streaming)
  const llm = new Supabase.ai.Session("mistral")
  const result = await llm.run("Write a haiku about Medellín", {
    stream: false,
    timeout: 30,
    mode: "ollama",
  })

  // Streaming
  const stream = await llm.run("Tell me a story", {
    stream: true,
    mode: "ollama",
  })

  return new Response(stream as ReadableStream, {
    headers: { "Content-Type": "text/event-stream" },
  })
})
```

**Model capabilities:**

| Model | Use case | Limit |
|---|---|---|
| `gte-small` | Embeddings | English only, 512 tokens max |
| Ollama/Llamafile models | Text generation | Requires external server |

**Local Ollama setup:**
```bash
ollama pull mistral && ollama serve
echo "AI_INFERENCE_API_HOST=http://host.docker.internal:11434" >> supabase/functions/.env
```

**For external AI APIs (Gemini, OpenAI, Anthropic):** Use `Deno.env.get("GEMINI_API_KEY")` etc. and call their APIs directly — don't use `Supabase.ai.Session` for those.

---

## 14. Recursive / Chained Functions

Rate limit: **~5,000 requests/minute** for outbound edge-to-edge calls (not inbound or external APIs).

### Call Another Function

```ts
import { createClient } from "npm:@supabase/supabase-js@2"

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!
)

Deno.serve(async (req) => {
  try {
    const { data, error } = await supabase.functions.invoke("other-function", {
      body: { payload: "..." },
    })
    if (error) throw error
    return Response.json(data)
  } catch (err) {
    if (err instanceof Deno.errors.RateLimitError) {
      const retryAfter = Math.ceil(err.retryAfterMs / 1000)
      return Response.json(
        { error: "Service temporarily unavailable" },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      )
    }
    throw err
  }
})
```

### Auto-Retry Pattern

```ts
async function invokeWithRetry(functionName: string, body: object, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const { data, error } = await supabase.functions.invoke(functionName, { body })
      if (error) throw error
      return data
    } catch (err) {
      if (err instanceof Deno.errors.RateLimitError && attempt < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, err.retryAfterMs))
        continue
      }
      throw err
    }
  }
}
```

### Best Practices

```ts
// ❌ Anti-pattern: call per item
for (const item of items) {
  await supabase.functions.invoke("process-item", { body: item })
}

// ✅ Better: batch
await supabase.functions.invoke("process-items", { body: { items } })

// ✅ Recursion depth guard
Deno.serve(async (req) => {
  const { depth = 0, data } = await req.json()
  if (depth >= 5) return Response.json({ result: data })
  // ...
  await supabase.functions.invoke("self", { body: { depth: depth + 1, data } })
})
```

| Pattern | Rate use | Recommendation |
|---|---|---|
| Simple chain A→B→C | Low | Safe |
| Fan-out (A→B,C,D) | Moderate | Limit concurrency |
| Deep recursion | High | Set max depth |
| Unbounded loops | Very high | Use Supabase Queues |

---

## 15. Direct Postgres Connection

```ts
import postgres from "npm:postgres@3.4.3"

const connectionString = Deno.env.get("SUPABASE_DB_URL")!

Deno.serve(async (_req) => {
  const sql = postgres(connectionString, {
    prepare: false,  // required for Supabase connection pooler
  })

  const result = await sql`SELECT * FROM apartments LIMIT 10`
  await sql.end()

  return Response.json(result)
})
```

**SSL local dev:**
```bash
# Download cert from Supabase Dashboard → Database → Connection String → SSL certificate
echo "SSL_CERT_FILE=/path/to/cert.crt" >> supabase/functions/.env
echo "DENO_TLS_CA_STORE=mozilla,system" >> supabase/functions/.env
```

---

## 16. Unit Testing

```
supabase/functions/
└── tests/
    ├── hello-world-test.ts
    └── my-function-test.ts
```

```ts
// supabase/functions/tests/my-function-test.ts
import { assertEquals } from "jsr:@std/assert@1"
import { createClient } from "npm:@supabase/supabase-js@2"
import "@std/dotenv/load"

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
)

Deno.test("hello-world returns greeting", async () => {
  const { data, error } = await supabase.functions.invoke("hello-world", {
    body: { name: "Test" },
  })
  assertEquals(error, null)
  assertEquals(data.message, "Hello Test!")
})
```

**Run:**
```bash
supabase start
supabase functions serve

# Run specific test
deno test --allow-all supabase/functions/tests/hello-world-test.ts

# Run all tests
deno test --allow-all supabase/functions/tests/
```

---

## 17. Logging

```ts
Deno.serve(async (req) => {
  console.log("Request received", { method: req.method, url: req.url })

  // Log headers correctly (Headers object isn't enumerable)
  const headersObject = Object.fromEntries(req.headers)
  console.log("Headers:", JSON.stringify(headersObject))

  try {
    const result = await process()
    console.log("Success:", { resultId: result.id })
    return Response.json(result)
  } catch (err) {
    console.error("Error:", err instanceof Error ? err.message : err)
    return Response.json({ error: "Internal error" }, { status: 500 })
  }
})
```

**Access logs:** Supabase Dashboard → Functions → [function name] → Logs or Invocations tabs

**Limits:**
- Max message size: **10,000 characters**
- Rate limit: **100 events / 10 seconds** per function

---

## 18. Debugging (Chrome DevTools)

```bash
# Start with breakpoint at first line
supabase functions serve --inspect-mode brk
```

1. Open Chrome → `chrome://inspect`
2. Add target: `127.0.0.1:8083`
3. Click "Open dedicated DevTools for Node"
4. Trigger a function call — execution pauses at first line
5. Set breakpoints in Sources tab → `file://home/deno/functions/<fn>/index.ts`

Minimum CLI version: **v1.171.0** | Protocol: v8 inspector | Port: **8083**

---

## 19. Deployment

```bash
# Authenticate and link (first time)
supabase login
supabase link --project-ref zkwcbyxiwklihegjhuql

# Deploy specific function
supabase functions deploy my-function

# Deploy all functions
supabase functions deploy

# Deploy without Docker (no WASM/static files)
supabase functions deploy my-function --use-api

# Deploy with JWT disabled
supabase functions deploy my-function --no-verify-jwt
```

### GitHub Actions CI/CD

```yaml
name: Deploy Edge Functions
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
        with:
          version: latest
      - run: supabase functions deploy
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_PROJECT_ID:   ${{ secrets.SUPABASE_PROJECT_ID }}
```

### GitLab / Bitbucket (npx pattern)

```yaml
deploy:
  script:
    - npx supabase@latest login
    - npx supabase@latest link --project-ref $SUPABASE_PROJECT_ID
    - npx supabase@latest functions deploy
```

### Invoke Deployed Function

```bash
# cURL
curl -X POST https://zkwcbyxiwklihegjhuql.supabase.co/functions/v1/my-function \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer USER_JWT" \
  -H "Content-Type: application/json" \
  -d '{"name": "test"}'
```

```ts
// supabase-js
const { data, error } = await supabase.functions.invoke("my-function", {
  body: { name: "test" },
})
```

---

## 20. Platform Limits (Verified 2026-05-05)

| Resource | Free | Pro / Paid |
|---|---|---|
| Memory | 256 MB | 256 MB |
| Wall-clock time | 150 seconds | 400 seconds |
| CPU time per request | 2 seconds | 2 seconds |
| Bundle size | 20 MB | 20 MB |
| Functions per project | 100 | 500 (Pro) / 1000 (Team) |
| Secrets per project | 100 | 100 |
| Secret name length | 256 chars | 256 chars |
| Secret value size | 48 KiB | 48 KiB |
| Log message length | 10,000 chars | 10,000 chars |
| Log rate | 100 events/10s | 100 events/10s |
| Recursive call budget | ~5,000 req/min | ~5,000 req/min |
| Ephemeral /tmp | 256 MB | 512 MB |

**Blocked ports:** SMTP (25, 587)

**HTML responses:** Standard deployments convert `text/html` → `text/plain`. Custom domains required for HTML serving.

**Unsupported:**
- Web Worker and Node `vm` APIs
- Multithreading-dependent libraries (sharp, libvips)
- `--use-api` flag when deploying WASM / static_files

---

## 21. Common Pitfalls & Anti-Patterns

### ❌ Wrong: API key as Bearer token
```ts
// New sb_publishable_* keys are NOT JWTs
headers: { "Authorization": "Bearer sb_publishable_..." }  // FAILS
```
```ts
// ✅ Correct
headers: { "apikey": "sb_publishable_...", "Authorization": "Bearer USER_JWT" }
```

### ❌ Wrong: Public-facing service-role key access
```ts
// Anyone who calls the endpoint can use service-role permissions
Deno.serve(async () => {
  const svc = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!)
  // no auth check!
})
```
```ts
// ✅ Correct: always validate caller before using service client
if (!userId) return Response.json({ error: "unauthorized" }, { status: 401 })
const svc = getServiceClient()
```

### ❌ Wrong: Webhook with verify_jwt not disabled
```toml
# Missing from config.toml → Stripe gets 401 before handler runs
[functions.stripe-webhook]
# verify_jwt = false   ← MUST ADD THIS
```

### ❌ Wrong: sponsor schema routing
```ts
// PostgREST queries public schema — table doesn't exist there
svc.from("sponsor_applications")...
```
```ts
// ✅ Correct
svc.schema("sponsor").from("applications")...
// Also update join aliases: sponsor_placements → placements
```

### ❌ Wrong: Wildcard CORS
```ts
const corsHeaders = { "Access-Control-Allow-Origin": "*" }  // leaks to all origins
```
```ts
// ✅ Use shared helper with explicit allowlist
import { getCorsHeaders } from "../_shared/http.ts"
Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req)  // local variable
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })
  // ...
})
```

### ❌ Wrong: Legacy serve import
```ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
serve(async (req) => { ... })
```
```ts
// ✅ Built-in, no import
Deno.serve(async (req) => { ... })
```

### ❌ Wrong: Blocking response with waitUntil
```ts
await EdgeRuntime.waitUntil(longTask())  // ❌ await blocks response
```
```ts
EdgeRuntime.waitUntil(longTask())        // ✅ fire and forget
```

---

## 22. mdeai.co Edge Function Inventory

**Canonical list (16 in-repo):** [references/edge-functions-inventory.md](references/edge-functions-inventory.md) — `verify_jwt`, schema, auth, Gemini models.

**Drift check:** `.claude/skills/mde-supabase/scripts/verify-edge-inventory.sh` (dirs ↔ `supabase/config.toml`).

**AI-only summary:** [references/ai-edge-functions.md](references/ai-edge-functions.md).

Older inventories mixed **remote-only** deploys (sponsor checkout, vote-cast, whatsapp-webhook, etc.) with this repo. For implementation work, use only functions present under `supabase/functions/`.

---

## 23. Quick Reference

### New Function Checklist

- [ ] Use `Deno.serve` (not old `serve` import)
- [ ] Add `[functions.name]` block to `config.toml` with correct `verify_jwt`
- [ ] Create per-function `deno.json` with imports
- [ ] Import `getCorsHeaders` from `_shared/http.ts` — declare as LOCAL variable inside handler
- [ ] Validate auth before any DB operations
- [ ] Validate input with Zod schema
- [ ] Return structured `{ success: true, data }` or `{ success: false, error: { code, message } }`
- [ ] Log to `ai_runs` table for all AI calls
- [ ] For sponsor schema: always `.schema("sponsor").from("table_name")` never `.from("sponsor_table_name")`
- [ ] For Stripe webhooks: `verify_jwt = false` + verify `Stripe-Signature` in-handler

### CLI Quick Reference

```bash
supabase functions new <name>                     # scaffold
supabase functions serve                          # local dev (all)
supabase functions serve <name> --env-file .env   # local dev (one)
supabase functions serve --inspect-mode brk       # debug mode
supabase functions deploy <name>                  # deploy one
supabase functions deploy                         # deploy all
supabase functions deploy <name> --use-api        # no Docker
supabase secrets set KEY=value                    # set secret
supabase secrets list                             # list secrets
supabase secrets unset KEY                        # delete secret
```
