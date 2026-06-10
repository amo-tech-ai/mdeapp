import { assertEquals, assertRejects } from "jsr:@std/assert@1";
import { withRetry } from "../_shared/gemini.ts";

Deno.test({
  name: "withRetry — propagates last error after retries exhausted",
  async fn() {
    let calls = 0;
    await assertRejects(
      () =>
        withRetry(
          () => {
            calls++;
            throw new Error("transient-gemini");
          },
          { retries: 2, baseDelayMs: 1 },
        ),
      Error,
      "transient-gemini",
    );
    assertEquals(calls, 2);
  },
});
