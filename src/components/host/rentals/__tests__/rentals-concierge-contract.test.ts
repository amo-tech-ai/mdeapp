import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = join(import.meta.dirname, "..");

// skipcq: JS-0067 - module-local test helper; not browser global scope
function readComponent(name: string): string {
  return readFileSync(join(ROOT, name), "utf8");
}

describe("SAN-1093 concierge shell contract", () => {
  it("exposes kit testids across shell regions", () => {
    const files = [
      "rentals-concierge-shell.tsx",
      "rentals-conversation-history.tsx",
      "rentals-concierge-center.tsx",
      "rentals-dynamic-workspace.tsx",
    ];
    const bundle = files.map(readComponent).join("\n");

    for (const id of [
      "rentals-concierge",
      "rc-left",
      "rc-center",
      "rc-right",
      "rc-empty",
      "ctx-empty",
      "rc-input",
      "rc-send",
    ]) {
      expect(bundle).toContain(`data-testid="${id}"`);
    }
    expect(bundle).toContain("rc-opp-");
    expect(bundle).toContain("rc-starter-");
    expect(bundle).toContain("ctx-analytics");
    expect(bundle).toContain("r1-kpi-0");
  });

  it("labels Phase A as brokerAgent not live", () => {
    const center = readComponent("rentals-concierge-center.tsx");
    expect(center).toContain("brokerAgent not live");
    expect(center).toContain("disabled");
  });
});
