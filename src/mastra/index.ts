import { Mastra } from "@mastra/core/mastra";
import { ConsoleLogger, LogLevel } from "@mastra/core/logger";
import { getMastraStorage } from "./lib/storage";
import {
  pingAgent,
  routerAgent,
  rentalAgent,
  conciergeAgent,
  eventAgent,
  evaluationAgent,
  hostEventAgent,
  hostOpsAgent,
} from "./agents";
import {
  rentalSearchWorkflow,
  eventDiscoveryWorkflow,
  eventVenueBookingWorkflow,
  salesInsightWorkflow,
} from "./workflows";
import { workspace } from "./workspaces";
import { scorers } from "./scorers";

const LOG_LEVEL = (process.env.LOG_LEVEL as LogLevel) || "info";

export const mastra = new Mastra({
  agents: {
    pingAgent,
    routerAgent,
    rentalAgent,
    conciergeAgent,
    eventAgent,
    evaluationAgent,
    hostEventAgent,
    hostOpsAgent,
  },
  workflows: {
    rentalSearchWorkflow,
    eventDiscoveryWorkflow,
    eventVenueBookingWorkflow,
    salesInsightWorkflow,
  },
  workspace,
  scorers,
  storage: getMastraStorage(),
  logger: new ConsoleLogger({
    level: LOG_LEVEL,
  }),
});
