#!/usr/bin/env node
/**
 * Probe conciergeAgent for search-web-grounded-events tool invocation.
 * Usage: node --env-file=.env.local scripts/probe-concierge-web-search.mjs
 */
import { lastValueFrom } from "rxjs";
import { tap } from "rxjs/operators";
import { getLocalAgentsWithLogging } from "../src/mastra/copilotkit/logging-mastra-agent.ts";
import { mastra } from "../src/mastra/index.ts";

const QUERY =
  process.env.PROBE_SEARCH_QUERY ??
  "Nightlife events in Poblado this Friday — search events then verify on the web.";

function fail(msg) {
  console.error("✗", msg);
  process.exit(1);
}

async function main() {
  const agents = getLocalAgentsWithLogging({ mastra });
  const agent = agents.conciergeAgent;
  const toolNames = [];
  const eventTypes = [];

  const input = {
    threadId: "probe-web-search",
    runId: `probe-${Date.now()}`,
    messages: [{ id: "1", role: "user", content: QUERY }],
    tools: [],
    context: [],
    state: {},
  };

  try {
    await lastValueFrom(
      agent.run(input).pipe(
        tap((e) => {
          eventTypes.push(e.type);
          const raw = JSON.stringify(e);
          if (/search-web-grounded|searchWebGrounded/i.test(raw)) {
            toolNames.push(raw.slice(0, 500));
          }
          if (e.type === "TOOL_CALL_START" || e.type === "tool-call-start") {
            console.log("TOOL", e.toolName ?? e.name ?? JSON.stringify(e).slice(0, 200));
          }
        }),
      ),
    );
  } catch (e) {
    console.error("RUN FAILED", e?.message || e);
  }

  console.log("events:", [...new Set(eventTypes)].join(", "));
  if (toolNames.length) {
    console.log("✅ web search signals:", toolNames.length);
  } else {
    fail("no search-web-grounded-events signal in AG-UI stream");
  }
}

main();
