/** @type {import('dependency-cruiser').IConfiguration} */
const allowlist = require("./scripts/copilotkit-v2-allowlist.json").files;

const allowlistPatterns = [
  ...allowlist.map((f) => f.replace(/\//g, "[/\\\\]")),
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
