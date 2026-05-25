import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

function walk(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === "node_modules" || name === ".next") continue;
      walk(p, acc);
    } else if (/\.(tsx?|jsx?)$/.test(name) && !/\.test\./.test(name)) {
      acc.push(p);
    }
  }
  return acc;
}

describe("maps security", () => {
  it("does not expose GOOGLE_PLACES_API_KEY in client src", () => {
    const root = join(process.cwd(), "src");
    const files = walk(root);
    const hits: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      if (
        /GOOGLE_PLACES_API_KEY|NEXT_PUBLIC_GOOGLE_PLACES/.test(text) &&
        !file.includes("mastra/")
      ) {
        hits.push(file);
      }
    }
    expect(hits).toEqual([]);
  });
});
