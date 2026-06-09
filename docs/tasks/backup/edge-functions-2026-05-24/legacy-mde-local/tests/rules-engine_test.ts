import { assertEquals } from "jsr:@std/assert@1";
import {
  apikeyOnlyHeaders,
  auditIgnore,
  baseUrl,
  gatewayAnonHeaders,
  gatewayOptions,
  gatewayPost,
  parseJson,
  rulesEngineSecret,
} from "./audit_helpers.ts";

const SLUG = "rules-engine";

Deno.test({
  name: `${SLUG} — OPTIONS (before secret gate)`,
  ignore: auditIgnore(),
  async fn() {
    const s = await gatewayOptions(SLUG);
    assertEquals([200, 204, 503].includes(s), true);
  },
});

Deno.test({
  name: `${SLUG} — POST apikey-only (no Bearer) → 401 when RULES_ENGINE_SECRET is set`,
  ignore: auditIgnore(),
  async fn() {
    const secret = rulesEngineSecret();
    if (!secret) {
      console.log(`[${SLUG}] set RULES_ENGINE_SECRET in process + supabase/functions/.env`);
      return;
    }
    const { status, text } = await gatewayPost(SLUG, JSON.stringify({}), apikeyOnlyHeaders());
    assertEquals(status, 401);
    const j = parseJson(text) as { error?: string };
    assertEquals(j.error, "Unauthorized");
  },
});

Deno.test({
  name: `${SLUG} — POST anon JWT Bearer (wrong secret) → 403 when RULES_ENGINE_SECRET is set`,
  ignore: auditIgnore(),
  async fn() {
    const secret = rulesEngineSecret();
    if (!secret) {
      console.log(`[${SLUG}] set RULES_ENGINE_SECRET in process + supabase/functions/.env for serve`);
      return;
    }
    const { status, text } = await gatewayPost(SLUG, JSON.stringify({}), gatewayAnonHeaders());
    assertEquals(
      status,
      403,
      "If 200: Edge runtime is missing RULES_ENGINE_SECRET (must match test env).",
    );
    const j = parseJson(text) as { error?: string };
    assertEquals(j.error, "Forbidden");
  },
});

Deno.test({
  name: `${SLUG} — POST wrong x-rules-engine-secret → 403`,
  ignore: auditIgnore(),
  async fn() {
    const secret = rulesEngineSecret();
    if (!secret) return;
    const h = gatewayAnonHeaders();
    h.set("x-rules-engine-secret", `${secret}-wrong`);
    const { status } = await gatewayPost(SLUG, JSON.stringify({}), h);
    assertEquals(status, 403);
  },
});

Deno.test({
  name: `${SLUG} — POST invalid JSON (Content-Type json) → 400`,
  ignore: auditIgnore(),
  async fn() {
    const secret = rulesEngineSecret();
    if (!secret) return;
    const h = gatewayAnonHeaders();
    h.set("x-rules-engine-secret", secret);
    h.set("Content-Type", "application/json");
    const url = `${baseUrl()}/functions/v1/${SLUG}`;
    const r = await fetch(url, {
      method: "POST",
      headers: h,
      body: "{ not json",
    });
    const bodyText = await r.text();
    assertEquals(r.status, 400);
    const j = parseJson(bodyText) as { error?: string };
    assertEquals(j.error, "Bad Request");
  },
});

Deno.test({
  name: `${SLUG} — POST Authorization Bearer <secret> → 200 or 500`,
  ignore: auditIgnore(),
  async fn() {
    const secret = rulesEngineSecret();
    if (!secret) {
      console.log(`[${SLUG}] no RULES_ENGINE_SECRET — skipping Bearer happy path`);
      return;
    }
    const h = gatewayAnonHeaders();
    h.set("Authorization", `Bearer ${secret}`);
    const { status, text } = await gatewayPost(SLUG, JSON.stringify({}), h);
    assertEquals([200, 500].includes(status), true);
    if (status === 200) {
      const j = parseJson(text) as { success?: boolean };
      assertEquals(j.success, true);
    }
  },
});

Deno.test({
  name: `${SLUG} — POST with x-rules-engine-secret → 200 or 500`,
  ignore: auditIgnore(),
  async fn() {
    const secret = rulesEngineSecret();
    if (!secret) {
      console.log(`[${SLUG}] no RULES_ENGINE_SECRET — skipping happy path`);
      return;
    }
    const h = gatewayAnonHeaders();
    h.set("x-rules-engine-secret", secret);
    const { status, text } = await gatewayPost(SLUG, JSON.stringify({}), h);
    assertEquals([200, 500].includes(status), true);
    if (status === 200) {
      const j = parseJson(text) as unknown;
      assertEquals(Array.isArray(j) || typeof j === "object", true);
    }
  },
});
