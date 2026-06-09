import { assertEquals } from "jsr:@std/assert@1";
import { safeJsonParse } from "../_shared/json.ts";

Deno.test("safeJsonParse parses valid JSON object", () => {
  const out = safeJsonParse('{"a":1}');
  assertEquals(out, { a: 1 });
});

Deno.test("safeJsonParse returns null on invalid JSON", () => {
  assertEquals(safeJsonParse("{"), null);
});

Deno.test("safeJsonParse returns null on empty string", () => {
  assertEquals(safeJsonParse(""), null);
});
