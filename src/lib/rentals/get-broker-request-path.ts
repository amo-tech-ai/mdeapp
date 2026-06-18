import { headers } from "next/headers";
import { BROKER_HOME_PATH } from "@/lib/rentals/broker-route-gate";

/** Current rentals pathname for login `next` (set by middleware `x-pathname`). */
// skipcq: JS-0067
export async function getBrokerRequestPathname(): Promise<string> {
  const pathname = (await headers()).get("x-pathname");
  if (pathname?.startsWith("/host/rentals")) return pathname;
  return BROKER_HOME_PATH;
}
