/** @type {import('dependency-cruiser').IConfiguration} */
const fs = require("node:fs");
const path = require("node:path");

const allowlistPath = path.join(__dirname, "scripts/copilotkit-v2-allowlist.json");
const allowlist = JSON.parse(fs.readFileSync(allowlistPath, "utf8")).files;

/** Escape path segments for dependency-cruiser pathNot regexes. */
function pathToRegexPattern(filePath) {
  return filePath
    .split("/")
    .map((segment) => segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("[/\\\\]");
}

const allowlistPatterns = [
  ...allowlist.map(pathToRegexPattern),
  "[/\\\\]__tests__[/\\\\]",
  "\\.test\\.[jt]sx?$",
  "\\.spec\\.[jt]sx?$",
  "-v1\\.tsx$",
];

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-new-copilotkit-react-ui",
      severity: "error",
      comment:
        "CK-V2-012 (SAN-910): @copilotkit/react-ui is v1-only — use @copilotkit/react-core/v2",
      from: {
        pathNot: allowlistPatterns,
      },
      to: {
        path: "@copilotkit/react-ui",
      },
    },
    {
      name: "no-new-copilotkit-react-core-v1",
      severity: "error",
      comment:
        "CK-V2-012 (SAN-910): import @copilotkit/react-core/v2 instead of v1 react-core",
      from: {
        pathNot: allowlistPatterns,
      },
      to: {
        path: "^@copilotkit/react-core$",
      },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default", "typescript"],
    },
  },
};
