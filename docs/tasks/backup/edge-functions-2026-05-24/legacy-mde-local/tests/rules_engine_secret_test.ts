import { assertEquals } from "jsr:@std/assert@1";
import { extractRulesEngineSecretCandidate } from "../_shared/rules-engine-secret.ts";

function headers(init: Record<string, string>): Headers {
  const h = new Headers();
  for (const [k, v] of Object.entries(init)) h.set(k, v);
  return h;
}

Deno.test("extractRulesEngineSecretCandidate prefers x-rules-engine-secret over Bearer", () => {
  const h = headers({
    "x-rules-engine-secret": " from-header ",
    authorization: "Bearer from-bearer",
  });
  assertEquals(extractRulesEngineSecretCandidate(h), "from-header");
});

Deno.test("extractRulesEngineSecretCandidate uses Bearer when header absent", () => {
  const h = headers({ authorization: "Bearer cron-token-9" });
  assertEquals(extractRulesEngineSecretCandidate(h), "cron-token-9");
});

Deno.test("extractRulesEngineSecretCandidate normalizes Bearer casing", () => {
  const h = headers({ authorization: "bearer lower" });
  assertEquals(extractRulesEngineSecretCandidate(h), "lower");
});

Deno.test("extractRulesEngineSecretCandidate ignores non-Bearer Authorization", () => {
  const h = headers({ authorization: "Basic x" });
  assertEquals(extractRulesEngineSecretCandidate(h), "");
});

Deno.test("extractRulesEngineSecretCandidate returns empty when missing", () => {
  assertEquals(extractRulesEngineSecretCandidate(new Headers()), "");
});
