import { defineConfig } from "vitest/config";
import path from "node:path";

const alias = { "@": path.resolve(__dirname, "./src") };

// Test files that load the heavy stack (Mastra agents/tools, Supabase, Next API
// routes). Everything else ("pure": lib, hooks, components, platform) starts fast.
// Split is exclude-based so EVERY test file is covered — including future dirs.
const HEAVY_DIRS = ["src/mastra", "src/app", "src/__tests__"];
const ALL_TESTS = ["src/**/*.{test,spec}.ts", "src/**/*.{test,spec}.tsx"];
const DEFAULT_EXCLUDE = ["**/node_modules/**", "**/dist/**", "**/.next/**"];

export default defineConfig({
  resolve: { alias },
  test: {
    globals: true,
    projects: [
      {
        resolve: { alias },
        test: {
          name: "pure",
          environment: "node",
          globals: true,
          include: ALL_TESTS,
          exclude: [...DEFAULT_EXCLUDE, ...HEAVY_DIRS.map((d) => `${d}/**`)],
        },
      },
      {
        resolve: { alias },
        test: {
          name: "integration",
          environment: "node",
          globals: true,
          include: HEAVY_DIRS.map((d) => `${d}/**/*.{test,spec}.{ts,tsx}`),
          exclude: DEFAULT_EXCLUDE,
        },
      },
    ],
  },
});
