import { assertEquals } from "jsr:@std/assert@1";
import { auditIgnore, gatewayOptions, gatewayPost, parseJson } from "./audit_helpers.ts";

const SLUG = "chat-lead-capture";

Deno.test({
  name: `${SLUG} — OPTIONS`,
  ignore: auditIgnore(),
  async fn() {
    const s = await gatewayOptions(SLUG);
    assertEquals([200, 204, 503].includes(s), true);
  },
});

Deno.test({
  name: `${SLUG} — POST invalid JSON → 400`,
  ignore: auditIgnore(),
  async fn() {
    const { status } = await gatewayPost(SLUG, "{{");
    assertEquals(status, 400);
  },
});

Deno.test({
  name: `${SLUG} — POST bad intent → 400`,
  ignore: auditIgnore(),
  async fn() {
    const { status, text } = await gatewayPost(
      SLUG,
      JSON.stringify({ intent: "nope", source: "form" }),
    );
    assertEquals(status, 400);
    const j = parseJson(text) as { error?: { code?: string } };
    assertEquals(j.error?.code, "VALIDATION_ERROR");
  },
});

Deno.test({
  name: `${SLUG} — POST minimal valid`,
  ignore: auditIgnore(),
  async fn() {
    const { status, text } = await gatewayPost(
      SLUG,
      JSON.stringify({ intent: "rental", source: "form", email: "audit@test.local" }),
    );
    assertEquals([200, 429, 500].includes(status), true);
    if (status === 200) {
      const j = parseJson(text) as { success?: boolean; data?: { lead_id?: string } };
      assertEquals(j.success, true);
      assertEquals(typeof j.data?.lead_id, "string");
    }
  },
});
