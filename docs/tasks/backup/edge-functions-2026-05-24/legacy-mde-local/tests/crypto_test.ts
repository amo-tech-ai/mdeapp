import { assertEquals } from "jsr:@std/assert@1";
import { timingSafeEqual } from "../_shared/crypto.ts";

Deno.test("timingSafeEqual accepts equal strings", () => {
  assertEquals(timingSafeEqual("abc", "abc"), true);
});

Deno.test("timingSafeEqual rejects length mismatch", () => {
  assertEquals(timingSafeEqual("ab", "abc"), false);
});

Deno.test("timingSafeEqual rejects bit difference", () => {
  assertEquals(timingSafeEqual("abc", "abd"), false);
});

Deno.test("timingSafeEqual rejects empty vs non-empty", () => {
  assertEquals(timingSafeEqual("", "x"), false);
  assertEquals(timingSafeEqual("", ""), true);
});
