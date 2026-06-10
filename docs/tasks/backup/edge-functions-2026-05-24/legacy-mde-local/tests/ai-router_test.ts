import { assertEquals } from "jsr:@std/assert@1";
import { auditIgnore, gatewayOptions, gatewayPost, parseJson } from "./audit_helpers.ts";

const SLUG = "ai-router";

Deno.test({
  name: `${SLUG} — OPTIONS`,
  ignore: auditIgnore(),
  async fn() {
    const s = await gatewayOptions(SLUG);
    assertEquals([200, 204, 503].includes(s), true);
  },
});

Deno.test({
  name: `${SLUG} — POST invalid JSON → 500 (outer catch)`,
  ignore: auditIgnore(),
  async fn() {
    const { status } = await gatewayPost(SLUG, "not-json");
    assertEquals(status, 500);
  },
});

Deno.test({
  name: `${SLUG} — POST missing message → 400`,
  ignore: auditIgnore(),
  async fn() {
    const { status } = await gatewayPost(SLUG, JSON.stringify({}));
    assertEquals(status, 400);
  },
});

Deno.test({
  name: `${SLUG} — POST quick-match greeting`,
  ignore: auditIgnore(),
  async fn() {
    const { status, text } = await gatewayPost(
      SLUG,
      JSON.stringify({ message: "hi" }),
    );
    assertEquals(status, 200);
    const j = parseJson(text) as {
      success?: boolean;
      data?: { intent?: string };
    };
    assertEquals(j.success, true);
    assertEquals(j.data?.intent, "general_greeting");
  },
});
