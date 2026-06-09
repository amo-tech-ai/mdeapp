import { assertEquals } from "jsr:@std/assert@1";
import {
  anonSessionHeaders,
  auditIgnore,
  defaultHeaders,
  gatewayOptions,
  gatewayPost,
  parseJson,
} from "./audit_helpers.ts";

const SLUG = "ai-chat";

Deno.test({
  name: `${SLUG} — OPTIONS (CORS preflight)`,
  ignore: auditIgnore(),
  async fn() {
    const status = await gatewayOptions(SLUG);
    assertEquals([200, 204, 503].includes(status), true, `OPTIONS ${status}`);
  },
});

Deno.test({
  name: `${SLUG} — POST without X-Anon-Session-Id → 401`,
  ignore: auditIgnore(),
  async fn() {
    const { status, text } = await gatewayPost(
      SLUG,
      JSON.stringify({ messages: [{ role: "user", content: "hi" }] }),
      defaultHeaders(),
    );
    assertEquals(status, 401);
    const j = parseJson(text) as { error?: { code?: string } };
    assertEquals(j.error?.code, "UNAUTHORIZED");
  },
});

Deno.test({
  name: `${SLUG} — POST invalid JSON → 400`,
  ignore: auditIgnore(),
  async fn() {
    const h = anonSessionHeaders();
    const { status } = await gatewayPost(SLUG, "{", h);
    assertEquals(status, 400);
  },
});

Deno.test({
  name: `${SLUG} — POST validation (empty messages) → 400`,
  ignore: auditIgnore(),
  async fn() {
    const { status } = await gatewayPost(
      SLUG,
      JSON.stringify({ messages: [] }),
      anonSessionHeaders(),
    );
    assertEquals(status, 400);
  },
});

Deno.test({
  name: `${SLUG} — POST minimal valid body (GEMINI / rate limits)`,
  ignore: auditIgnore(),
  async fn() {
    const { status, text } = await gatewayPost(
      SLUG,
      JSON.stringify({
        messages: [{ role: "user", content: "Say hi in one word." }],
        tab: "concierge",
      }),
      anonSessionHeaders(),
    );
    assertEquals([200, 402, 429, 500].includes(status), true);
    if (status === 500) {
      const j = parseJson(text) as { error?: { code?: string } };
      assertEquals(j.error?.code, "SERVER_CONFIG");
    }
  },
});
