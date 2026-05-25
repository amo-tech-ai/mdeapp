#!/usr/bin/env node
/**
 * G2 smoke — POST /api/leads/schedule-viewing (proxies chat-lead-capture edge).
 * Requires dev on :3001.
 */
const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3001";

async function main() {
  const payload = {
    listingId: `smoke-${Date.now()}`,
    listingTitle: "Smoke test listing",
    neighborhood: "Laureles",
    name: "Camila Smoke",
    email: `camila.smoke+${Date.now()}@mdeai.co`,
    phone: "+573001234567",
    preferredAt: "2026-06-15T14:00",
  };

  const res = await fetch(`${BASE}/api/leads/schedule-viewing`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok || !json.success || !json.leadId) {
    console.error("✗ lead capture failed", res.status, json);
    process.exit(1);
  }

  console.log(`✅ lead capture OK leadId=${json.leadId}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
