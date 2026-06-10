import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "coverage/**",
      ".mastra/**",
      "dist/**",
      "github/**",
      "CopilotKit/**",
      "commerce/**",
      "docs/**",
      "graphify-out/**",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
];

export default config;
