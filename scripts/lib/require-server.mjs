// Shared guard for verify/smoke scripts that need the local dev server.
// Import and await at the top of any script that hits localhost:3001.
//
//   import { requireServer } from "./lib/require-server.mjs";
//   await requireServer();
//
// Exits non-zero with a clear message if the server is not up, so a missing
// server reads as "start the server" instead of a confusing fetch failure.
export async function requireServer(port = 3001) {
  const url = `http://localhost:${port}/`;
  let status;
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(3000) });
    status = r.status;
  } catch {
    status = 0;
  }
  if (status !== 200) {
    console.error(`\n⚠️  localhost:${port} is not responding (got: ${status || "ECONNREFUSED"}).`);
    console.error("Start the server: npm run dev:ui\n");
    process.exit(1);
  }
}
