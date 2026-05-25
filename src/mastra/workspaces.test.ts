import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { WORKSPACE_TOOLS } from "@mastra/core/workspace";
import { workspace, workspaceBasePath, workspaceToolsConfig } from "./workspaces";

const SKILL_DIRS = [
  "mde-prompt-qa",
  "mde-rental-quality",
  "mde-safe-actions",
  "mde-event-review",
  "mde-followup-logic",
] as const;

describe("Mastra workspace", () => {
  it("exports workspace + workspaceBasePath", () => {
    expect(workspace).toBeDefined();
    expect(workspaceBasePath).toBeTruthy();
  });

  it("workspace directory contains 5 skill folders", () => {
    expect(existsSync(join(workspaceBasePath, "skills"))).toBe(true);
    for (const dir of SKILL_DIRS) {
      expect(existsSync(join(workspaceBasePath, "skills", dir, "SKILL.md"))).toBe(
        true,
      );
    }
  });

  it("mutation tools are disabled", () => {
    const disabled = [
      WORKSPACE_TOOLS.FILESYSTEM.WRITE_FILE,
      WORKSPACE_TOOLS.FILESYSTEM.EDIT_FILE,
      WORKSPACE_TOOLS.FILESYSTEM.DELETE,
      WORKSPACE_TOOLS.FILESYSTEM.MKDIR,
      WORKSPACE_TOOLS.FILESYSTEM.AST_EDIT,
    ];
    for (const tool of disabled) {
      expect(workspaceToolsConfig[tool]?.enabled).toBe(false);
    }
  });
});
