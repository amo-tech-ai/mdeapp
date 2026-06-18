import { lastValueFrom } from "rxjs";
import { tap } from "rxjs/operators";
import { getLocalAgentsWithLogging } from "../src/mastra/copilotkit/logging-mastra-agent.ts";
import { mastra } from "../src/mastra/index.ts";

const main = async () => {
  const agents = getLocalAgentsWithLogging({ mastra });
  const agent = agents.conciergeAgent;
  const input = {
    threadId: "test-thread-ck",
    runId: "test-run-1",
    messages: [
      { id: "1", role: "user", content: "list top rentals in Laureles" },
    ],
    tools: [],
    context: [],
    state: {},
  };
  const events = [];
  try {
    await lastValueFrom(
      agent.run(input).pipe(tap((e) => events.push(e.type))),
    );
    console.log("OK EVENTS", events.join(","));
  } catch (e) {
    console.error("RUN FAILED", e?.message || e);
    console.log("PARTIAL EVENTS", events.join(","));
    process.exit(1);
  }
}

main();
